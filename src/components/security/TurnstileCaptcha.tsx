'use client'

/**
 * components/security/TurnstileCaptcha.tsx
 *
 * Reusable Cloudflare Turnstile widget.
 *
 * Features:
 *  - Auto-loads the Turnstile script once per page visit.
 *  - Fires onVerify(token) when the challenge succeeds.
 *  - Fires onExpire / onError so parent forms can react.
 *  - Exposes a reset() method via ref.
 *  - Renders nothing (graceful no-op) when NEXT_PUBLIC_TURNSTILE_SITE_KEY is absent in dev.
 *  - Compact "appearance=interaction" mode keeps the widget invisible until needed.
 *
 * Usage:
 *   const captchaRef = useRef<TurnstileHandle>(null)
 *   <TurnstileCaptcha ref={captchaRef} onVerify={(t) => setToken(t)} />
 *   captchaRef.current?.reset()   // after failed submission
 */

import {
    forwardRef,
    useEffect,
    useId,
    useImperativeHandle,
    useRef,
    useState,
} from 'react'

// ── Types ──────────────────────────────────────────────────────────────────

export interface TurnstileHandle {
    /** Resets the widget (use after a failed form submission). */
    reset: () => void
}

interface TurnstileCaptchaProps {
    /** Called with the one-time token once the challenge passes. */
    onVerify: (token: string) => void
    /** Called when the token expires before submission. */
    onExpire?: () => void
    /** Called on widget error (network issues, etc.). */
    onError?: () => void
    /**
     * Visual theme. 'auto' follows the OS / page theme.
     * Defaults to 'light' to match the premium light design system.
     */
    theme?: 'light' | 'dark' | 'auto'
    /**
     * Turnstile appearance mode.
     * 'interaction-only' — invisible unless the user must solve a challenge.
     * 'always'           — always visible badge.
     */
    appearance?: 'interaction-only' | 'always'
}

// ── Global Turnstile script singleton ─────────────────────────────────────

let scriptLoaded = false

function loadTurnstileScript(): void {
    if (scriptLoaded || typeof document === 'undefined') return
    const existing = document.querySelector('script[src*="turnstile"]')
    if (existing) { scriptLoaded = true; return }

    const script = document.createElement('script')
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
    scriptLoaded = true
}

// ── Component ──────────────────────────────────────────────────────────────

const TurnstileCaptcha = forwardRef<TurnstileHandle, TurnstileCaptchaProps>(
    function TurnstileCaptcha(
        {
            onVerify,
            onExpire,
            onError,
            theme = 'light',
            appearance = 'interaction-only',
        },
        ref
    ) {
        const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
        const containerRef = useRef<HTMLDivElement>(null)
        const widgetIdRef = useRef<string | null>(null)
        const instanceId = useId()  // unique per component mount
        const [ready, setReady] = useState(false)

        // ── Dev bypass ───────────────────────────────────────────────────────
        useEffect(() => {
            if (!siteKey) {
                console.warn(
                    '[Turnstile] ⚠️  NEXT_PUBLIC_TURNSTILE_SITE_KEY is not set. ' +
                    'Turnstile widget is disabled. Set the key for production.'
                )
                // Signal parent that verification is "passed" in dev mode
                onVerify('__DEV_BYPASS__')
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        // ── Load & render ────────────────────────────────────────────────────
        useEffect(() => {
            if (!siteKey) return

            loadTurnstileScript()

            const tryRender = () => {
                const w = (window as any).turnstile
                if (!w || !containerRef.current) return

                // Avoid double-rendering
                if (widgetIdRef.current !== null) return

                widgetIdRef.current = w.render(containerRef.current, {
                    sitekey: siteKey,
                    theme,
                    appearance,
                    callback: (token: string) => {
                        onVerify(token)
                    },
                    'expired-callback': () => {
                        onExpire?.()
                    },
                    'error-callback': () => {
                        onError?.()
                    },
                })

                setReady(true)
            }

            // Turnstile may not be loaded yet — poll until available
            const interval = setInterval(() => {
                if ((window as any).turnstile) {
                    clearInterval(interval)
                    tryRender()
                }
            }, 100)

            return () => {
                clearInterval(interval)
                // Cleanup widget on unmount
                const w = (window as any).turnstile
                if (w && widgetIdRef.current !== null) {
                    try { w.remove(widgetIdRef.current) } catch {}
                    widgetIdRef.current = null
                }
            }
        // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [siteKey])

        // ── Expose reset() via ref ───────────────────────────────────────────
        useImperativeHandle(ref, () => ({
            reset() {
                const w = (window as any).turnstile
                if (w && widgetIdRef.current !== null) {
                    w.reset(widgetIdRef.current)
                }
            },
        }))

        // ── Dev mode: render nothing ─────────────────────────────────────────
        if (!siteKey) return null

        return (
            <div
                ref={containerRef}
                id={`turnstile-widget-${instanceId}`}
                aria-label="Verificación de seguridad Cloudflare Turnstile"
                // Keep a minimal footprint; in interaction-only mode it's nearly invisible
                className="my-2 min-h-[65px] flex items-center"
                style={{ colorScheme: theme === 'dark' ? 'dark' : 'light' }}
            />
        )
    }
)

TurnstileCaptcha.displayName = 'TurnstileCaptcha'

export default TurnstileCaptcha
