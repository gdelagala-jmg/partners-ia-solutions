'use client'

import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import Script from 'next/script'

/**
 * TurnstileCaptcha - Client-side component for Cloudflare Turnstile.
 * 
 * Progressive Mode: 
 * If NEXT_PUBLIC_ENABLE_FORM_SECURITY is false, this component is a no-op.
 */

export interface TurnstileHandle {
    reset: () => void
}

interface TurnstileProps {
    onVerify: (token: string) => void
}

const TurnstileCaptcha = forwardRef<TurnstileHandle, TurnstileProps>(
    function TurnstileCaptcha({ onVerify }, ref) {
        const containerRef = useRef<HTMLDivElement>(null)
        const [widgetId, setWidgetId] = useState<string | null>(null)
        const [isLoaded, setIsLoaded] = useState(false)

        // Variable de control
        const isSecurityEnabled = process.env.NEXT_PUBLIC_ENABLE_FORM_SECURITY === 'true'

        useImperativeHandle(ref, () => ({
            reset() {
                if (widgetId && (window as any).turnstile) {
                    (window as any).turnstile.reset(widgetId)
                }
            }
        }))

        // Efecto para renderizar el widget una vez cargado el script
        useEffect(() => {
            if (!isSecurityEnabled) return

            if (isLoaded && containerRef.current && !widgetId && (window as any).turnstile) {
                try {
                    const id = (window as any).turnstile.render(containerRef.current, {
                        sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
                        callback: (token: string) => {
                            onVerify(token)
                        },
                        'error-callback': (err: any) => {
                            console.error('[Turnstile] Widget error:', err)
                        },
                        theme: 'light',
                        appearance: 'interaction-only' // Only show when interaction is needed
                    })
                    setWidgetId(id)
                } catch (err) {
                    console.error('[Turnstile] Render failed:', err)
                }
            }

            return () => {
                if (widgetId && (window as any).turnstile) {
                    // Cleanup can sometimes be flaky if script is already gone
                    try { (window as any).turnstile.remove(widgetId) } catch (e) {}
                }
            }
        }, [isLoaded, widgetId, onVerify, isSecurityEnabled])

        // Si la seguridad está desactivada, no renderizamos nada
        if (!isSecurityEnabled) {
            return null
        }

        return (
            <div className="flex flex-col items-center justify-center my-4 min-h-[65px]">
                <Script
                    src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                    onLoad={() => setIsLoaded(true)}
                    strategy="afterInteractive"
                />
                <div ref={containerRef} id="turnstile-container" />
            </div>
        )
    }
)

TurnstileCaptcha.displayName = 'TurnstileCaptcha'

export default TurnstileCaptcha
