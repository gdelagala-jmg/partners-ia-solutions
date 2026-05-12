'use client'

import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import Script from 'next/script'

/**
 * TurnstileCaptcha - Client-side component for Cloudflare Turnstile.
 * 
 * Progressive Mode: 
 * Fetches configuration from /api/security/config to determine if it should render.
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
        const [isSecurityEnabled, setIsSecurityEnabled] = useState<boolean | null>(null)

        useImperativeHandle(ref, () => ({
            reset() {
                if (widgetId && (window as any).turnstile) {
                    (window as any).turnstile.reset(widgetId)
                }
            }
        }))

        // Fetch security configuration from server
        useEffect(() => {
            fetch('/api/security/config')
                .then(res => res.json())
                .then(data => setIsSecurityEnabled(data.formSecurityEnabled))
                .catch(() => setIsSecurityEnabled(false)) // Fail-safe: disable if error
        }, [])

        // Render widget effect
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
                        appearance: 'interaction-only'
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
        }, [isLoaded, widgetId, onVerify, isSecurityEnabled])

        // Si aún no sabemos si está activado o si está desactivado, no renderizamos nada
        if (isSecurityEnabled === null || isSecurityEnabled === false) {
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
