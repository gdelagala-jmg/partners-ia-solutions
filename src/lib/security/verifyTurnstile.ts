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
}

export type SecurityPolicy = 'strict' | 'fail-open'

/**
 * Verifies a Cloudflare Turnstile challenge token.
 *
 * @param token  - The cf-turnstile-response token from the client form.
 * @param ip     - Optional: visitor IP for Cloudflare's stricter validation.
 * @param policy - Policy to apply if verification fails. 'strict' (default) blocks, 'fail-open' logs but allows.
 */
export async function verifyTurnstileToken(
    token: string | null | undefined,
    ip?: string | null,
    policy: SecurityPolicy = 'strict'
): Promise<TurnstileResult> {
    const secretKey = process.env.TURNSTILE_SECRET_KEY
    const hasPublicKey = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    const isDev = process.env.NODE_ENV !== 'production'
    const isSecurityEnabled = process.env.ENABLE_FORM_SECURITY === 'true' && hasPublicKey && !!secretKey

    // ── Log configuration issues in production ───────────────────────────────
    if (process.env.ENABLE_FORM_SECURITY === 'true' && (!hasPublicKey || !secretKey) && !isDev) {
        console.error('[Turnstile] 🚫 Security enabled but keys are missing! Bypassing to avoid blocking traffic.')
    }

    // ── Development bypass ──────────────────────────────────────────────────
    if (isDev) {
        return { success: true }
    }

    // ── Progressive/Rollback bypass ──────────────────────────────────────────
    if (!isSecurityEnabled) {
        return { success: true }
    }

    // Helper to handle failure based on policy
    const handleFailure = (reason: string, errorMsg: string): TurnstileResult => {
        logFailedAttempt(reason, ip, policy)
        
        if (policy === 'fail-open') {
            return { success: true }
        }

        return {
            success: false,
            error: errorMsg,
        }
    }

    // ── Token missing ────────────────────────────────────────────────────────
    if (!token) {
        // If policy is fail-open, we allow missing tokens to prioritize conversion
        // (e.g. if the widget didn't render on the client).
        if (policy === 'fail-open') {
            console.warn(`[Turnstile] ⚠️ Token missing, but policy is fail-open. Allowing lead for conversion priority. ip=${ip ?? 'unknown'}`)
            return { success: true }
        }
        return handleFailure('TOKEN_MISSING', 'Se requiere completar la verificación de seguridad.')
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
            return handleFailure('CF_API_ERROR', 'Error al verificar la seguridad. Inténtalo de nuevo.')
        }

        const data: {
            success: boolean
            'error-codes'?: string[]
            challenge_ts?: string
            hostname?: string
        } = await cfResponse.json()

        if (!data.success) {
            const codes = data['error-codes']?.join(', ') || 'unknown'
            return handleFailure(`CF_VERIFY_FAIL:${codes}`, 'Verificación de seguridad fallida. Por favor, recarga la página e inténtalo de nuevo.')
        }

        return { success: true }
    } catch (err) {
        console.error('[Turnstile] Unexpected error during verification:', err)
        return handleFailure('EXCEPTION', 'Error inesperado en la verificación de seguridad.')
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

function logFailedAttempt(reason: string, ip: string | null | undefined, policy: SecurityPolicy): void {
    console.warn(
        `[Turnstile] 🚫 CAPTCHA FAILED | policy=${policy} | reason=${reason} | ip=${ip ?? 'unknown'} | ts=${new Date().toISOString()}`
    )
}
