'use client'

/**
 * NewsletterModal — UX/Responsive revisado
 * ─────────────────────────────────────────────────────────────────────────────
 * CORRECCIONES UX v2:
 * - max-h-[92svh] + overflow-y-auto → nunca desborda el viewport
 * - Formulario siempre en columna → sin overflow lateral en ningún breakpoint
 * - Botón full-width → proporcional y limpio
 * - Close button siempre dentro del card, top-right absoluto
 * - Tamaños reducidos: icon, title, padding → todo cabe sin scroll en mobile
 * - sm:max-w-md (448px) en lugar de lg → más compacto y premium
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import {
    X, Mail, Send, CheckCircle2,
    AlertCircle, Loader2, Sparkles, Zap, ShieldCheck
} from 'lucide-react'

const TRUST = [
    { icon: Sparkles,    text: 'Contenido exclusivo' },
    { icon: Zap,         text: 'Sin ruido, solo valor' },
    { icon: ShieldCheck, text: 'Privacidad garantizada' },
]

export default function NewsletterModal() {
    const router   = useRouter()
    const emailRef = useRef<HTMLInputElement>(null)
    const cardRef  = useRef<HTMLDivElement>(null)

    const [email,   setEmail]   = useState('')
    const [status,  setStatus]  = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    // ── Close → home ─────────────────────────────────────────────────────────
    const handleClose = useCallback(() => router.push('/'), [router])

    // ── ESC ──────────────────────────────────────────────────────────────────
    useEffect(() => {
        const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose() }
        window.addEventListener('keydown', fn)
        return () => window.removeEventListener('keydown', fn)
    }, [handleClose])

    // ── Body scroll lock ──────────────────────────────────────────────────────
    useEffect(() => {
        const prev = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = prev }
    }, [])

    // ── Auto-focus email ──────────────────────────────────────────────────────
    useEffect(() => {
        const t = setTimeout(() => emailRef.current?.focus(), 320)
        return () => clearTimeout(t)
    }, [])

    // ── Click outside card ────────────────────────────────────────────────────
    const handleBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
        if (cardRef.current && !cardRef.current.contains(e.target as Node)) handleClose()
    }

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return
        setStatus('loading')
        try {
            const res  = await fetch('/api/newsletter/subscribe', {
                method:  'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    sourceUrl:      window.location.href,
                    sourceLocation: 'NEWSLETTER_MODAL',
                }),
            })
            const data = await res.json()
            if (res.ok) {
                setStatus('success')
                setEmail('')
                setTimeout(() => router.push('/'), 3200)
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
            className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center px-0 sm:px-4"
            onClick={handleBackdrop}
        >
            {/* Overlay desenfocado */}
            <motion.div
                className="absolute inset-0 bg-black/45 backdrop-blur-[5px]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.22 }}
                aria-hidden="true"
            />

            {/* ── Card ─────────────────────────────────────────────────────── */}
            <motion.div
                ref={cardRef}
                role="dialog"
                aria-modal="true"
                aria-labelledby="newsletter-modal-title"
                className={[
                    // Base
                    'relative z-10 w-full bg-white',
                    // ✅ Altura máxima controlada — nunca desborda
                    'max-h-[92svh] overflow-y-auto',
                    // Mobile: bottom sheet
                    'rounded-t-3xl px-5 pt-5 pb-8',
                    // sm+: card flotante, ancho acotado
                    'sm:max-w-md sm:w-full sm:rounded-2xl sm:px-8 sm:pt-8 sm:pb-8',
                    // Sombra premium
                    'shadow-2xl shadow-black/20',
                ].join(' ')}
                initial={{ y: 56, opacity: 0 }}
                animate={{ y: 0,  opacity: 1 }}
                exit={{ y: 32, opacity: 0 }}
                transition={{ type: 'spring', damping: 30, stiffness: 340 }}
            >
                {/* ── Botón cerrar (siempre dentro del card) ───────────────── */}
                <button
                    onClick={handleClose}
                    aria-label="Cerrar newsletter"
                    className={[
                        'absolute top-4 right-4 z-10',
                        'w-7 h-7 flex items-center justify-center',
                        'rounded-full bg-gray-100 hover:bg-gray-200',
                        'text-gray-500 hover:text-gray-900',
                        'transition-all duration-150',
                        'focus:outline-none focus:ring-2 focus:ring-gray-300',
                    ].join(' ')}
                >
                    <X size={14} strokeWidth={2.5} />
                </button>

                {/* Drag handle — mobile only */}
                <div
                    className="sm:hidden w-8 h-1 bg-gray-200 rounded-full mx-auto mb-5"
                    aria-hidden="true"
                />

                {/* ── Icon ─────────────────────────────────────────────────── */}
                <div className="flex justify-center mb-4">
                    <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                        <Mail size={20} />
                    </div>
                </div>

                {/* ── Live pill ────────────────────────────────────────────── */}
                <div className="flex justify-center mb-3">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-blue-100 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Suscripción Editorial
                    </span>
                </div>

                {/* ── Título ───────────────────────────────────────────────── */}
                <h2
                    id="newsletter-modal-title"
                    className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight text-center leading-snug"
                >
                    Mantente a la vanguardia{' '}
                    <span className="text-blue-500">con Partners IA</span>
                </h2>

                {/* ── Descripción ──────────────────────────────────────────── */}
                <p className="mt-2 text-sm text-gray-500 text-center leading-relaxed">
                    Insights semanales de IA aplicada a negocio, directo a tu email.
                </p>

                {/* ── Formulario — siempre en columna ──────────────────────── */}
                <AnimatePresence mode="wait">
                    {status === 'success' ? (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.97 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-6 p-4 bg-green-50 text-green-700 rounded-xl text-sm font-medium flex items-start gap-2 border border-green-100"
                        >
                            <CheckCircle2 className="w-4 h-4 flex-shrink-0 mt-0.5" />
                            <span>¡Gracias! Ya formas parte de nuestra comunidad. Volviendo a la home…</span>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="form"
                            id="newsletter-form"
                            onSubmit={handleSubmit}
                            // ✅ Siempre en columna → sin overflow lateral
                            className="mt-5 flex flex-col gap-2.5"
                        >
                            {/* Email input — ancho completo */}
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
                                    'w-full px-4 py-3',
                                    'bg-white border border-gray-200 rounded-xl',
                                    'text-sm text-gray-900 placeholder:text-gray-400',
                                    'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
                                    'transition-all disabled:opacity-50',
                                ].join(' ')}
                            />

                            {/* CTA button — ancho completo */}
                            <button
                                type="submit"
                                disabled={status === 'loading'}
                                className={[
                                    'w-full px-4 py-3',
                                    'bg-black text-white text-sm font-semibold rounded-xl',
                                    'hover:bg-gray-800 active:scale-[0.98]',
                                    'transition-all duration-150',
                                    'disabled:opacity-50',
                                    'flex items-center justify-center gap-2',
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

                {/* ── Error inline ─────────────────────────────────────────── */}
                {status === 'error' && (
                    <motion.p
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-2 text-xs text-red-600 flex items-center gap-1"
                    >
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                        {message}
                    </motion.p>
                )}

                {/* ── Trust badges ─────────────────────────────────────────── */}
                <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                    {TRUST.map(({ icon: Icon, text }) => (
                        <span
                            key={text}
                            className="flex items-center gap-1 text-[11px] text-gray-400 font-medium"
                        >
                            <Icon size={11} className="text-blue-400" />
                            {text}
                        </span>
                    ))}
                </div>

                {/* ── Legal ────────────────────────────────────────────────── */}
                <p className="mt-4 text-[10px] text-gray-400 text-center leading-relaxed">
                    Al suscribirte aceptas nuestra política de privacidad (RGPD). Sin spam. Baja cuando quieras.
                </p>
            </motion.div>
        </div>
    )
}
