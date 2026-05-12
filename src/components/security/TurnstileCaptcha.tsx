'use client'

import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import Script from 'next/script'
import { useSecurity } from '@/context/SecurityContext'

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
        const [widgetId, setWidgetId] = useState<string | null>(null)
        const [isLoaded, setIsLoaded] = useState(false)
        const { formSecurityEnabled } = useSecurity()

        useImperativeHandle(ref, () => ({
            reset() {
                if (widgetId && (window as any).turnstile) {
                    (window as any).turnstile.reset(widgetId)
                }
            }
        }))

        useEffect(() => {
            if (!isLoaded || !containerRef.current || widgetId || !formSecurityEnabled) return

            const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
            if (!siteKey) return

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
                } catch (err) {
                    console.error('[Turnstile] Render failed:', err)
                }
            }

            return () => {
                if (widgetId && (window as any).turnstile) {
                    try { (window as any).turnstile.remove(widgetId) } catch (e) {}
                }
            }
        }, [isLoaded, widgetId, onVerify, onError, onExpire, appearance, formSecurityEnabled])

        if (!formSecurityEnabled) return null

        return (
            <div className="flex flex-col items-center justify-center my-4 min-h-[65px]">
                <Script
                    src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                    onLoad={() => setIsLoaded(true)}
                    strategy="afterInteractive"
                />
                <div ref={containerRef} className="w-full flex justify-center" />
            </div>
        )
    }
)

TurnstileCaptcha.displayName = 'TurnstileCaptcha'

export default TurnstileCaptcha
