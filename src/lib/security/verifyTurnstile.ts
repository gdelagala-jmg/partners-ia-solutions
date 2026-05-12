/**
 * lib/security/verifyTurnstile.ts
 *
 * Server-side Cloudflare Turnstile token verification.
 * Centralised utility used by ALL public form API endpoints.
 *
 * Behaviour:
 *  - Production:  Verifies token against Cloudflare API.  Returns 403 on failure.
 *  - Development: If TURNSTILE_SECRET_KEY is absent, logs a warning and allows
 *                 the request through (dev mode bypass) so local work is unblocked.
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
    const isDev = process.env.NODE_ENV !== 'production'

    // ── Development bypass ──────────────────────────────────────────────────
    if (!secretKey) {
        if (isDev) {
            console.warn(
                '[Turnstile] ⚠️  TURNSTILE_SECRET_KEY is not set. ' +
                'Running in DEV bypass mode — all submissions are allowed. ' +
                'Set the key before deploying to production.'
            )
            return { success: true }
        }

        // Production: key missing → hard block
        console.error(
            '[Turnstile] 🚫 TURNSTILE_SECRET_KEY is missing in production! ' +
            'Blocking form submission.'
        )
        return {
            success: false,
            error: 'Security configuration error. Please try again later.',
        }
    }

    // ── Token missing ────────────────────────────────────────────────────────
    if (!token) {
        logFailedAttempt('TOKEN_MISSING', ip)
        return {
            success: false,
            error: 'Se requiere completar la verificación de seguridad.',
        }
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
            logFailedAttempt('CF_API_ERROR', ip)
            return {
                success: false,
                error: 'Error al verificar la seguridad. Inténtalo de nuevo.',
            }
        }

        const data: {
            success: boolean
            'error-codes'?: string[]
            challenge_ts?: string
            hostname?: string
        } = await cfResponse.json()

        if (!data.success) {
            const codes = data['error-codes']?.join(', ') || 'unknown'
            logFailedAttempt(`CF_VERIFY_FAIL:${codes}`, ip)
            return {
                success: false,
                error: 'Verificación de seguridad fallida. Por favor, recarga la página e inténtalo de nuevo.',
            }
        }

        return { success: true }
    } catch (err) {
        console.error('[Turnstile] Unexpected error during verification:', err)
        logFailedAttempt('EXCEPTION', ip)
        return {
            success: false,
            error: 'Error inesperado en la verificación de seguridad.',
        }
    }
}

/**
 * Simple in-process rate limiter per IP.
 * For production consider a Redis-backed solution instead.
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

// ── Internal audit logger ────────────────────────────────────────────────────

function logFailedAttempt(reason: string, ip?: string | null): void {
    console.warn(
        `[Turnstile] 🚫 CAPTCHA FAILED | reason=${reason} | ip=${ip ?? 'unknown'} | ts=${new Date().toISOString()}`
    )
}
