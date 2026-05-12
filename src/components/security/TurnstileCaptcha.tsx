'use client'

import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react'
import Script from 'next/script'
import { useSecurity } from '@/context/SecurityContext'

/**
 * TurnstileCaptcha - Client-side component for Cloudflare Turnstile.
 * 
 * Progressive Mode: 
 * Uses SecurityContext to determine if it should render.
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
        const { formSecurityEnabled } = useSecurity()

        useEffect(() => {
            console.log('[Turnstile] Component mounted. Security enabled:', formSecurityEnabled)
        }, [formSecurityEnabled])

        useImperativeHandle(ref, () => ({
            reset() {
                console.log('[Turnstile] Resetting widget:', widgetId)
                if (widgetId && (window as any).turnstile) {
                    (window as any).turnstile.reset(widgetId)
                }
            }
        }))

        // Render widget effect
        useEffect(() => {
            if (!formSecurityEnabled) {
                console.log('[Turnstile] Security disabled, skipping render.')
                return
            }

            console.log('[Turnstile] Effect triggered:', { isLoaded, hasContainer: !!containerRef.current, hasWidgetId: !!widgetId, hasTurnstile: !!(window as any).turnstile })

            if (isLoaded && containerRef.current && !widgetId && (window as any).turnstile) {
                try {
                    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
                    console.log('[Turnstile] Attempting render with key:', siteKey ? 'Found' : 'MISSING')
                    
                    if (!siteKey) {
                        console.error('[Turnstile] NEXT_PUBLIC_TURNSTILE_SITE_KEY is not defined!')
                        return
                    }

                    const id = (window as any).turnstile.render(containerRef.current, {
                        sitekey: siteKey,
                        callback: (token: string) => {
                            console.log('[Turnstile] ✅ Token received')
                            onVerify(token)
                        },
                        'error-callback': (err: any) => {
                            console.error('[Turnstile] ❌ Widget error:', err)
                        },
                        'expired-callback': () => {
                            console.warn('[Turnstile] ⚠️ Token expired')
                            onVerify('')
                        },
                        theme: 'light',
                        appearance: 'always' // Make it visible for debugging
                    })
                    
                    console.log('[Turnstile] 🎨 Render success, ID:', id)
                    setWidgetId(id)
                } catch (err) {
                    console.error('[Turnstile] ❌ Render failed exception:', err)
                }
            }

            return () => {
                if (widgetId && (window as any).turnstile) {
                    try { 
                        console.log('[Turnstile] Cleanup: removing widget', widgetId)
                        (window as any).turnstile.remove(widgetId) 
                    } catch (e) {}
                }
            }
        }, [isLoaded, widgetId, onVerify, formSecurityEnabled])

        return (
            <div className="flex flex-col items-center justify-center my-4 min-h-[65px] border-2 border-red-500 p-4 rounded-xl bg-red-50">
                {/* BRUTAL DEBUG MARK v2 */}
                <div className="bg-red-600 text-white p-3 font-bold text-center w-full mb-4 rounded shadow-lg animate-pulse">
                    🚨 TURNSTILE DEBUG BUILD v2 (LIVE) 🚨
                </div>
                
                <div className="text-[12px] text-red-600 font-mono mb-2 bg-white px-2 py-1 rounded border border-red-200">
                    Context Security: {formSecurityEnabled ? 'ENABLED' : 'DISABLED'} | Script: {isLoaded ? 'LOADED' : 'NOT LOADED'}
                </div>

                {!formSecurityEnabled ? (
                    <div className="text-[10px] text-gray-500 italic">Security is globally disabled in context</div>
                ) : (
                    <>
                        <Script
                            src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
                            onLoad={() => {
                                console.log('[Turnstile] 📜 Script loaded successfully')
                                console.log('[Turnstile] Public Key:', process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? 'Present' : 'UNDEFINED')
                                setIsLoaded(true)
                            }}
                            onError={(e) => {
                                console.error('[Turnstile] ❌ Script failed to load', e)
                            }}
                            strategy="afterInteractive"
                        />
                        <div ref={containerRef} id="turnstile-container" className="w-full flex justify-center" />
                    </>
                )}
            </div>
        )
    }
)

TurnstileCaptcha.displayName = 'TurnstileCaptcha'

export default TurnstileCaptcha
