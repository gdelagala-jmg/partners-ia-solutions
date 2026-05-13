'use client'

import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import Script from 'next/script'
import { useSecurity } from '@/context/SecurityContext'

export interface TurnstileHandle {
    reset: () => void
}

interface TurnstileProps {
    onVerify: (token: string) => void
    onLoaded?: () => void
    onError?: () => void
    onExpire?: () => void
    appearance?: 'always' | 'execute' | 'interaction-only'
}

const TurnstileCaptcha = forwardRef<TurnstileHandle, TurnstileProps>(
    function TurnstileCaptcha({ onVerify, onLoaded, onError, onExpire, appearance = 'always' }, ref) {
        const containerRef = useRef<HTMLDivElement>(null)
        const [widgetId, setWidgetId] = useState<string | null>(null)
        const [isLoaded, setIsLoaded] = useState(false)
        // mounted prevents ANY client-only rendering during SSR → fixes hydration error #418
        const [mounted, setMounted] = useState(false)
        const { formSecurityEnabled } = useSecurity()

        useEffect(() => {
            setMounted(true)
        }, [])

        useImperativeHandle(ref, () => ({
            reset() {
                if (widgetId && (window as any).turnstile) {
                    (window as any).turnstile.reset(widgetId)
                }
            }
        }))

        useEffect(() => {
            // All guards: only run on client, only when security is enabled, only once per widget
            if (!mounted || !formSecurityEnabled || !isLoaded || !containerRef.current || widgetId) return

            const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
            if (!siteKey) {
                console.warn('[Turnstile] NEXT_PUBLIC_TURNSTILE_SITE_KEY is not defined')
                return
            }

            if ((window as any).turnstile) {
                try {
                    const id = (window as any).turnstile.render(containerRef.current, {
                        sitekey: siteKey,
                        callback: (token: string) => onVerify(token),
                        'error-callback': () => onError?.(),
                        'expired-callback': () => onExpire?.(),
                        appearance: appearance,
                        theme: 'light'
                    })
                    setWidgetId(id)
                    onLoaded?.()
                } catch (err) {
                    console.error('[Turnstile] Render failed:', err)
                }
            }

            return () => {
                if (widgetId && (window as any).turnstile) {
                    try { (window as any).turnstile.remove(widgetId) } catch (e) {}
                }
            }
        }, [mounted, isLoaded, widgetId, formSecurityEnabled, onVerify, onError, onExpire, appearance])

        // Stable SSR output: always render this wrapper so HTML matches on hydration.
        return (
            <div suppressHydrationWarning>
                {mounted && formSecurityEnabled && (
                    <>
                        <Script
                            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                            onLoad={() => setIsLoaded(true)}
                            strategy="afterInteractive"
                        />
                        <div
                            ref={containerRef}
                            className="flex justify-center my-4 min-h-[65px]"
                            data-turnstile-status={!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? 'missing-key' : widgetId ? 'rendered' : isLoaded ? 'script-ready' : 'loading-script'}
                        />
                    </>
                )}
            </div>
        )
    }
)

TurnstileCaptcha.displayName = 'TurnstileCaptcha'

export default TurnstileCaptcha
