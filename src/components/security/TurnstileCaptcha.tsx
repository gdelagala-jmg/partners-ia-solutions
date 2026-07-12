'use client'

import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import Script from 'next/script'
import { useSecurity } from '@/context/SecurityContext'

declare global {
    interface Window {
        turnstile?: {
            render: (element: string | HTMLElement, options: Record<string, unknown>) => string;
            reset: (widgetId: string) => void;
            remove: (widgetId: string) => void;
        }
    }
}

export interface TurnstileHandle {
    reset: () => void
}

interface TurnstileProps {
    onVerify: (token: string) => void
    onError?: () => void
    onExpire?: () => void
    appearance?: 'always' | 'execute' | 'interaction-only'
}

const TurnstileCaptcha = forwardRef<TurnstileHandle, TurnstileProps>(
    function TurnstileCaptcha({ onVerify, onError, onExpire, appearance = 'interaction-only' }, ref) {
        const containerRef = useRef<HTMLDivElement>(null)
        const widgetIdRef = useRef<string | null>(null)
        const [isLoaded, setIsLoaded] = useState(false)
        const [mounted, setMounted] = useState(false)
        const { formSecurityEnabled } = useSecurity()

        // Keep refs of callbacks to avoid re-rendering on function identity changes
        const callbacksRef = useRef({ onVerify, onError, onExpire })
        useEffect(() => {
            callbacksRef.current = { onVerify, onError, onExpire }
        }, [onVerify, onError, onExpire])

        useEffect(() => {
            setMounted(true)
            if (typeof window !== 'undefined' && window.turnstile) {
                setIsLoaded(true)
            }
        }, [])

        useImperativeHandle(ref, () => ({
            reset() {
                if (widgetIdRef.current && window.turnstile) {
                    window.turnstile.reset(widgetIdRef.current)
                }
            }
        }))

        useEffect(() => {
            if (!mounted || !formSecurityEnabled || !isLoaded || !containerRef.current || widgetIdRef.current) return

            const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
            if (!siteKey) {
                console.warn('[Turnstile] NEXT_PUBLIC_TURNSTILE_SITE_KEY is not defined')
                return
            }

            if (window.turnstile) {
                try {
                    const id = window.turnstile.render(containerRef.current, {
                        sitekey: siteKey,
                        callback: (token: string) => callbacksRef.current.onVerify(token),
                        'error-callback': () => callbacksRef.current.onError?.(),
                        'expired-callback': () => callbacksRef.current.onExpire?.(),
                        appearance: appearance,
                        theme: 'light'
                    })
                    widgetIdRef.current = id
                } catch (err) {
                    console.error('[Turnstile] Render failed:', err)
                }
            }

            return () => {
                if (widgetIdRef.current && window.turnstile) {
                    try { window.turnstile.remove(widgetIdRef.current) } catch {}
                    widgetIdRef.current = null
                }
            }
        }, [mounted, isLoaded, formSecurityEnabled, appearance])

        const siteKey = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY : null

        // Stable SSR output: always render this wrapper so HTML matches on hydration.
        // Inner content is only shown after mount + security enabled + siteKey present.
        return (
            <div suppressHydrationWarning>
                {mounted && formSecurityEnabled && siteKey && (
                    <>
                        <Script
                            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                            onLoad={() => setIsLoaded(true)}
                            strategy="afterInteractive"
                        />
                        <div
                            ref={containerRef}
                            className="flex justify-center"
                        />
                    </>
                )}
            </div>
        )
    }
)

TurnstileCaptcha.displayName = 'TurnstileCaptcha'

export default TurnstileCaptcha
