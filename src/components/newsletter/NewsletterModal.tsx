'use client'

/**
 * NewsletterModal
 * ─────────────────────────────────────────────────────────────────────────────
 * Modal premium para /newsletter.
 *
 * COMPORTAMIENTO:
 * - Se renderiza sobre la página actual (backdrop oscurecido/blur)
 * - Cierre con: botón X, tecla ESC, click fuera del card
 * - Al cerrar → router.push('/') (home)
 * - Focus inicial en el campo email (autoFocus)
 *
 * ACCESIBILIDAD:
 * - role="dialog" + aria-modal="true" + aria-labelledby
 * - Botón cerrar con aria-label="Cerrar newsletter"
 * - ESC listener en useEffect con cleanup
 * - Body scroll lock mientras el modal está abierto
 *
 * MOBILE:
 * - En mobile (< sm) se presenta como bottom sheet anclado abajo
 * - En tablet/desktop se centra verticalmente como modal estándar
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Mail, Send, CheckCircle2, AlertCircle, Loader2, Sparkles, Zap, ShieldCheck } from 'lucide-react'

// ── Trust badges ──────────────────────────────────────────────────────────────
const TRUST = [
    { icon: Sparkles, text: 'Contenido exclusivo' },
    { icon: Zap,      text: 'Sin ruido, solo valor' },
    { icon: ShieldCheck, text: 'Privacidad garantizada' },
]

export default function NewsletterModal() {
    const router = useRouter()
    const emailRef = useRef<HTMLInputElement>(null)
    const cardRef  = useRef<HTMLDivElement>(null)

    // ── Form state ────────────────────────────────────────────────────────────
    const [email,  setEmail]  = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    // ── Close → home ─────────────────────────────────────────────────────────
    const handleClose = useCallback(() => {
        router.push('/')
    }, [router])

    // ── ESC key ───────────────────────────────────────────────────────────────
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose()
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
    }, [handleClose])

    // ── Body scroll lock ──────────────────────────────────────────────────────
    useEffect(() => {
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = prev }
    }, [])

    // ── Auto-focus email ──────────────────────────────────────────────────────
    useEffect(() => {
        // Delay para que la animación de entrada no compita con el focus
        const t = setTimeout(() => emailRef.current?.focus(), 350)
        return () => clearTimeout(t)
    }, [])

    // ── Click outside card ────────────────────────────────────────────────────
    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
            handleClose()
        }
    }

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setStatus('loading')
        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    sourceUrl: window.location.href,
                    sourceLocation: 'NEWSLETTER_MODAL',
                }),
            })
            const data = await res.json()
            if (res.ok) {
                setStatus('success')
                setEmail('')
                // Cierra automáticamente hacia home tras éxito
                setTimeout(() => router.push('/'), 3000)
            } else {
                setStatus('error')
                setMessage(data.error || 'Algo salió mal. Inténtalo de nuevo.')
            }
        } catch {
            setStatus('error')
            setMessage('Error de conexión. Inténtalo de nuevo.')
        }
    }

    return (
        // ── Backdrop ──────────────────────────────────────────────────────────
        <div
            className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center"
            onClick={handleBackdropClick}
        >
            {/* Blur + dark overlay */}
            <motion.div
                className="absolute inset-0 bg-black/40 backdrop-blur-[6px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                aria-hidden="true"
            />

            {/* ── Card / Modal ─────────────────────────────────────────────── */}
            <motion.div
                ref={cardRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="newsletter-modal-title"
                // Mobile: bottom sheet  |  sm+: centered card
                className={[
                    'relative z-10 w-full bg-white',
                    // Mobile: bottom sheet con bordes superiores redondeados
                    'rounded-t-[28px] px-6 pb-10 pt-8',
                    // sm+: card flotante centrado
                    'sm:max-w-lg sm:rounded-3xl sm:px-10 sm:py-10',
                    // Sombra premium
                    'shadow-2xl shadow-black/20',
                ].join(' ')}
                initial={{ y: 60, opacity: 0, scale: 0.97 }}
                animate={{ y: 0,  opacity: 1, scale: 1 }}
                exit={{   y: 40, opacity: 0, scale: 0.97 }}
                transition={{ type: 'spring', damping: 28, stiffness: 320 }}
            >
                {/* ── Botón cerrar ────────────────────────────────────────── */}
                <button
                    onClick={handleClose}
                    aria-label="Cerrar newsletter"
                    className={[
                        'absolute top-4 right-4',
                        'w-8 h-8 flex items-center justify-center',
                        'rounded-full bg-gray-100 hover:bg-gray-200',
                        'text-gray-500 hover:text-gray-900',
                        'transition-all duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-gray-300',
                    ].join(' ')}
                >
                    <X size={16} strokeWidth={2.5} />
                </button>

                {/* Drag handle visual — mobile only */}
                <div className="sm:hidden w-10 h-1 bg-gray-200 rounded-full mx-auto mb-6" aria-hidden="true" />

                {/* ── Icon badge ──────────────────────────────────────────── */}
                <div className="flex justify-center mb-5">
                    <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-sm">
                        <Mail size={24} />
                    </div>
                </div>

                {/* ── Live pill ───────────────────────────────────────────── */}
                <div className="flex justify-center mb-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-100 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Suscripción Editorial
                    </span>
                </div>

                {/* ── Título ──────────────────────────────────────────────── */}
                <h2
                    id="newsletter-modal-title"
                    className="text-2xl sm:text-3xl font-semibold text-gray-900 tracking-tight text-center leading-snug"
                >
                    Mantente a la vanguardia<br />
                    <span className="text-blue-500">con Partners IA</span>
                </h2>

                {/* ── Descripción ─────────────────────────────────────────── */}
                <p className="mt-3 text-sm text-gray-500 text-center leading-relaxed max-w-sm mx-auto">
                    Únete a líderes y profesionales que reciben semanalmente la mejor curación de IA aplicada a negocio.
                </p>

                {/* ── Formulario ──────────────────────────────────────────── */}
                <AnimatePresence mode="wait">
                    {status === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-8 p-5 bg-green-50 text-green-700 rounded-2xl text-sm font-medium flex items-center justify-center gap-2 border border-green-100"
                        >
                            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                            ¡Gracias! Ya formas parte de nuestra comunidad. Volviendo a la home…
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            id="newsletter-form"
                            onSubmit={handleSubmit}
                            className="mt-7 flex flex-col sm:flex-row gap-3"
                            initial={{ opacity: 1 }}
                        >
                            <input
                                ref={emailRef}
                                id="newsletter-email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="tu@empresa.com"
                                required
                                disabled={status === 'loading'}
                                className={[
                                    'flex-1 px-4 py-3 bg-white',
                                    'border border-gray-200 rounded-2xl',
                                    'text-sm text-gray-900 placeholder:text-gray-400',
                                    'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
                                    'transition-all shadow-sm disabled:opacity-50',
                                ].join(' ')}
                            />
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className={[
                                    'px-6 py-3 bg-black text-white text-sm font-bold rounded-2xl',
                                    'hover:bg-gray-800 transition-all',
                                    'hover:scale-[1.02] active:scale-[0.98]',
                                    'disabled:opacity-50 disabled:hover:scale-100',
                                    'flex items-center justify-center gap-2 whitespace-nowrap',
                                    'shadow-lg shadow-black/5',
                                ].join(' ')}
                            >
                                {status === 'loading'
                                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Enviando…</>
                                    : <><Send className="w-4 h-4" /> Suscribirme</>
                                }
                            </button>
                        </motion.form>
                    )}
                </AnimatePresence>

                {/* ── Error inline ────────────────────────────────────────── */}
                {status === 'error' && (
                    <motion.p
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-3 text-xs text-red-600 flex items-center gap-1"
                    >
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {message}
                    </motion.p>
                )}

                {/* ── Trust badges ────────────────────────────────────────── */}
                <div className="mt-6 flex flex-wrap justify-center gap-x-5 gap-y-2">
                    {TRUST.map(({ icon: Icon, text }) => (
                        <span key={text} className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
                            <Icon size={12} className="text-blue-400" />
                            {text}
                        </span>
                    ))}
                </div>

                {/* ── Legal ───────────────────────────────────────────────── */}
                <p className="mt-5 text-[10px] text-gray-400 text-center leading-relaxed max-w-xs mx-auto">
                    Al suscribirte aceptas nuestra política de privacidad y el tratamiento de tus datos según el RGPD. Sin spam. Baja cuando quieras.
                </p>
            </motion.div>
        </div>
    )
}
