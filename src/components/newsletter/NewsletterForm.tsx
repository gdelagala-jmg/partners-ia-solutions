'use client'

import { useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import TurnstileCaptcha, { type TurnstileHandle } from '@/components/security/TurnstileCaptcha'
import { useSecurity } from '@/context/SecurityContext'

interface NewsletterFormProps {
    variant?: 'footer' | 'inline' | 'home'
}

export default function NewsletterForm({ variant = 'inline' }: NewsletterFormProps) {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
    const captchaRef = useRef<TurnstileHandle>(null)
    const { formSecurityEnabled } = useSecurity()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        // Newsletter Policy: Fail-open
        // We proceed even if turnstileToken is missing. The backend will log 
        // the missing token but allow the submission in fail-open mode.

        setStatus('loading')
        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email,
                    sourceUrl: window.location.href,
                    sourceLocation: variant.toUpperCase(),
                    turnstileToken,
                }),
            })

            const data = await res.json()
            if (res.ok) {
                setStatus('success')
                setEmail('')
                setTurnstileToken(null)
                // Reset status after a few seconds
                setTimeout(() => setStatus('idle'), 5000)
            } else {
                setStatus('error')
                setMessage(data.error || 'Algo salió mal. Inténtalo de nuevo.')
                // Reset captcha so user can try again
                captchaRef.current?.reset()
                setTurnstileToken(null)
            }
        } catch (error) {
            setStatus('error')
            setMessage('Error de conexión. Inténtalo de nuevo.')
            captchaRef.current?.reset()
            setTurnstileToken(null)
        }
    }

    if (variant === 'footer') {
        return (
            <div className="space-y-4">
                <p className="text-gray-600 text-sm leading-relaxed">
                    Insights, publicaciones y nuevas soluciones IA directamente en tu bandeja.
                </p>
                <form onSubmit={handleSubmit} className="relative group">
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@email.com"
                        required
                        disabled={status === 'loading' || status === 'success'}
                        className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all disabled:opacity-50"
                    />
                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className="absolute right-1.5 top-1.5 p-2 bg-black hover:bg-gray-800 text-white rounded-lg transition-all disabled:opacity-50 flex items-center justify-center min-w-[36px]"
                    >
                        {status === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    </button>
                </form>
                <div className="flex flex-col gap-2 mt-2">
                    {/* Turnstile - visible challenge if needed */}
                    <TurnstileCaptcha
                        ref={captchaRef}
                        onVerify={(token) => setTurnstileToken(token)}
                        onExpire={() => setTurnstileToken(null)}
                        onError={() => setTurnstileToken(null)}
                        appearance="interaction-only"
                    />
                    <AnimatePresence mode="wait">
                    {status === 'success' && (
                        <motion.p 
                            initial={{ opacity: 0, y: -10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -10 }}
                            className="text-green-600 text-xs font-medium flex items-center"
                        >
                            <CheckCircle2 className="w-3 h-3 mr-1" /> ¡Suscrito con éxito!
                        </motion.p>
                    )}
                    {status === 'error' && (
                        <motion.p 
                            initial={{ opacity: 0, y: -10 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            exit={{ opacity: 0, y: -10 }}
                            className="text-red-600 text-xs font-medium flex items-center"
                        >
                            <AlertCircle className="w-3 h-3 mr-1" /> {message}
                        </motion.p>
                    )}
                    </AnimatePresence>
                </div>
                <p className="text-[10px] text-gray-400 italic">
                    Sin spam. Solo contenido relevante. Baja cuando quieras.
                </p>
            </div>
        )
    }

    return (
        <div className={`
            ${variant === 'home' ? 'bg-gray-50 rounded-2xl p-6 md:p-12 border border-gray-100' : 'bg-white rounded-2xl p-6 border border-gray-100 shadow-sm'}
        `}>
            <div className="max-w-2xl mx-auto text-center">
                <h4 className={`font-bold text-gray-900 ${variant === 'home' ? 'text-2xl md:text-3xl tracking-tight' : 'text-xl'}`}>
                    {variant === 'home' 
                        ? 'Mantente a la vanguardia de la IA' 
                        : '¿Te ha resultado útil este contenido?'}
                </h4>
                <p className="text-gray-600 mt-2 text-sm md:text-base leading-relaxed">
                    {variant === 'home'
                        ? 'Suscríbete a nuestra newsletter editorial y recibe los mejores insights y soluciones directamente en tu email.'
                        : 'Recibe próximas publicaciones, insights y soluciones exclusivas directamente en tu bandeja de entrada.'}
                </p>

                <form id="newsletter-form" onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto scroll-mt-20">
                    <input
                        id="newsletter-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="tu@empresa.com"
                        required
                        disabled={status === 'loading' || status === 'success'}
                        className="flex-1 px-4 py-3 sm:py-3.5 bg-white border border-gray-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm placeholder:text-gray-400"
                    />

                    <button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className="px-8 py-3 sm:py-3.5 bg-black text-white text-sm font-bold rounded-2xl hover:bg-gray-800 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center whitespace-nowrap shadow-lg shadow-black/5"
                    >
                        {status === 'loading' ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                            <Send className="w-4 h-4 mr-2" />
                        )}
                        {status === 'success' ? '¡Listo!' : 'Suscribirme'}
                    </button>
                </form>

                <div className="flex flex-col mt-2">
                    {/* Turnstile — invisible challenge, shown only when Cloudflare needs it */}
                    <TurnstileCaptcha
                        ref={captchaRef}
                        onVerify={(token) => setTurnstileToken(token)}
                        onExpire={() => setTurnstileToken(null)}
                        onError={() => setTurnstileToken(null)}
                        appearance="interaction-only"
                    />

                    <AnimatePresence mode="wait">
                    {status === 'success' && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="mt-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium flex items-center justify-center border border-green-100"
                        >
                            <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0" /> 
                            ¡Gracias por suscribirte! Ya formas parte de nuestra comunidad.
                        </motion.div>
                    )}
                    {status === 'error' && (
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 10 }} 
                            animate={{ opacity: 1, scale: 1, y: 0 }} 
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="mt-6 p-4 bg-red-50 text-red-700 rounded-xl text-sm font-medium flex items-center justify-center border border-red-100"
                        >
                            <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0" /> {message}
                        </motion.div>
                    )}
                </AnimatePresence>
                </div>

                <p className="mt-6 text-[11px] text-gray-400 leading-relaxed max-w-sm mx-auto">
                    Al suscribirte, aceptas nuestra política de privacidad y el tratamiento de tus datos según el RGPD. Sin spam, puedes darte de baja en cualquier momento.
                </p>
            </div>
        </div>
    )
}
