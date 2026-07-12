/**
 * lib/security/verifyTurnstile.ts
 *
 * Server-side Cloudflare Turnstile token verification.
 * Centralised utility used by ALL public form API endpoints.
 *
 * Behaviour:
 *  - Development: Bypasses verification (always returns success: true).
 *  - Production: 
 *      - If ENABLE_FORM_SECURITY=true: Verifies token against Cloudflare.
 *      - If ENABLE_FORM_SECURITY=false: Bypasses verification (rollback/progressive mode).
 *
 * Usage:
 *   const check = await verifyTurnstileToken(token, ip)
 *   if (!check.success) return NextResponse.json({ error: check.error }, { status: 403 })
 */

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export interface TurnstileResult {
    success: boolean
    error?: string
    status?: number
}

/**
 * Verifies a Cloudflare Turnstile challenge token.
 *
 * @param token  - The cf-turnstile-response token from the client form.
 * @param ip     - Optional: visitor IP for Cloudflare's stricter validation.
 */
export async function verifyTurnstileToken(
    token: string | null | undefined,
    ip?: string | null
): Promise<TurnstileResult> {
    const secretKey = process.env.TURNSTILE_SECRET_KEY
    const isSecurityEnabled = process.env.ENABLE_FORM_SECURITY === 'true'

    // ── Progressive/Rollback bypass ──────────────────────────────────────────
    if (!isSecurityEnabled) {
        return { success: true }
    }

    // Helper to handle failure
    const handleFailure = (reason: string, errorMsg: string, status: number = 403): TurnstileResult => {
        logFailedAttempt(reason, ip)
        
        return {
            success: false,
            error: errorMsg,
            status
        }
    }

    // ── Production checks ────────────────────────────────────────────────────
    if (!secretKey) {
        console.error(
            '[Turnstile] 🚫 TURNSTILE_SECRET_KEY is missing in production but ENABLE_FORM_SECURITY is true!'
        )
        return handleFailure('MISSING_SECRET_KEY', 'Security configuration error. Please try again later.', 503)
    }

    // ── Token missing ────────────────────────────────────────────────────────
    if (!token) {
        return handleFailure('TOKEN_MISSING', 'Se requiere completar la verificación de seguridad.', 403)
    }

    // ── Cloudflare verification ──────────────────────────────────────────────
    try {
        const formData = new FormData()
        formData.append('secret', secretKey)
        formData.append('response', token)
        if (ip) formData.append('remoteip', ip)

        const cfResponse = await fetch(TURNSTILE_VERIFY_URL, {
            method: 'POST',
            body: formData,
        })

        if (!cfResponse.ok) {
            console.error('[Turnstile] Cloudflare API returned non-OK status:', cfResponse.status)
            return handleFailure('CF_API_ERROR', 'Error al verificar la seguridad. Inténtalo de nuevo.', 403)
        }

        const data: {
            success: boolean
            'error-codes'?: string[]
            challenge_ts?: string
            hostname?: string
        } = await cfResponse.json()

        if (!data.success) {
            const codes = data['error-codes']?.join(', ') || 'unknown'
            return handleFailure(`CF_VERIFY_FAIL:${codes}`, 'Verificación de seguridad fallida. Por favor, recarga la página e inténtalo de nuevo.', 403)
        }

        return { success: true }
    } catch (err) {
        console.error('[Turnstile] Unexpected error during verification:', err)
        return handleFailure('EXCEPTION', 'Error inesperado en la verificación de seguridad.', 403)
    }
}

/**
 * Simple in-process rate limiter per IP.
 */
const ipAttemptMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 10        // max failed attempts
const RATE_WINDOW_MS = 15 * 60 * 1000  // 15 minutes

export function isRateLimited(ip: string): boolean {
    const now = Date.now()
    const entry = ipAttemptMap.get(ip)

    if (!entry || now > entry.resetAt) {
        return false
    }

    return entry.count >= RATE_LIMIT
}

export function incrementRateLimit(ip: string): void {
    const now = Date.now()
    const entry = ipAttemptMap.get(ip)

    if (!entry || now > entry.resetAt) {
        ipAttemptMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS })
    } else {
        entry.count += 1
    }
}

function logFailedAttempt(reason: string, ip: string | null | undefined): void {
    console.warn(
        `[Turnstile] 🚫 CAPTCHA FAILED | reason=${reason} | ip=${ip ?? 'unknown'} | ts=${new Date().toISOString()}`
    )
}
