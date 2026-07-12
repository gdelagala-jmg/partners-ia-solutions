'use client'

import { useState, useRef } from 'react'
import { X, Lightbulb, Loader2, CheckCircle2 } from 'lucide-react'
import TurnstileCaptcha, { type TurnstileHandle } from '@/components/security/TurnstileCaptcha'
import { useSecurity } from '@/context/SecurityContext'

export default function FundingCTA() {
    const { formSecurityEnabled } = useSecurity()
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
    const turnstileRef = useRef<TurnstileHandle>(null)
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formSecurityEnabled && !turnstileToken) {
            setError('Por favor, completa la verificación de seguridad antes de enviar.')
            return
        }

        setIsLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name'),
            company: formData.get('company'),
            phone: formData.get('phone'),
            turnstileToken,
        }

        try {
            const res = await fetch('/api/contact/funding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}))
                throw new Error(errorData.error || 'Error al enviar la solicitud')
            }

            setIsSuccess(true)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.'
            setError(message)
            turnstileRef.current?.reset()
            setTurnstileToken(null)
        } finally {
            setIsLoading(false)
        }
    }

    // Reset state when closing to allow multiple attempts if needed
    const handleClose = () => {
        setIsOpen(false)
        setTimeout(() => {
            setIsSuccess(false)
            setError('')
            setTurnstileToken(null)
            turnstileRef.current?.reset()
        }, 300)
    }

    return (
        <>
            {/* Floating Trigger Buttons */}
            <div className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-[9990] flex flex-col gap-2">
                {/* Desktop/Tablet Capsule Button */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="hidden sm:flex items-center gap-2 bg-white text-blue-900 px-5 py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105 group"
                    aria-label="Consultar Ayudas"
                >
                    <div className="bg-blue-100 p-2.5 rounded-full group-hover:bg-blue-200 transition-colors">
                        <Lightbulb className="w-5 h-5 text-blue-700" />
                    </div>
                    <span className="font-semibold text-sm pr-2">Consultar Ayudas</span>
                </button>

                {/* Mobile Circular Button */}
                <button
                    onClick={() => setIsOpen(true)}
                    className="sm:hidden relative flex items-center justify-center w-[90px] h-[90px] bg-white rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.15)] hover:shadow-2xl transition-all duration-300 hover:scale-105 group border border-blue-50"
                    aria-label="Consultar Ayudas y Subvenciones"
                >
                    {/* SVG Circular Text */}
                    <svg viewBox="0 0 120 120" className="absolute inset-0 w-full h-full text-[#1d4ed8] pointer-events-none">
                        <defs>
                            <path id="curve-top" d="M 24 60 A 36 36 0 0 1 96 60" />
                            <path id="curve-bottom" d="M 12 60 A 48 48 0 0 0 108 60" />
                        </defs>
                        <text fill="currentColor" fontSize="11" fontWeight="bold" letterSpacing="0.25em" className="uppercase">
                            <textPath href="#curve-top" startOffset="50%" textAnchor="middle">AYUDAS</textPath>
                        </text>
                        <text fill="currentColor" fontSize="10.5" fontWeight="bold" letterSpacing="0.15em" className="uppercase">
                            <textPath href="#curve-bottom" startOffset="50%" textAnchor="middle">SUBVENCIONES</textPath>
                        </text>
                    </svg>

                    {/* Center Icon */}
                    <div className="bg-[#e0e7ff] w-[36px] h-[36px] rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors relative z-10">
                        <Lightbulb className="w-4 h-4 text-[#1d4ed8]" />
                    </div>
                </button>
            </div>

            {/* Modal Overlay */}
            {isOpen && (
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm transition-opacity"
                        onClick={handleClose}
                    />

                    {/* Modal Content */}
                    <div className="relative w-[calc(100vw-24px)] sm:w-full max-w-sm max-h-[calc(100dvh-24px)] sm:max-h-[calc(100vh-32px)] overflow-hidden rounded-2xl bg-gradient-to-br from-[#1d4ed8] to-[#1e3a8a] text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-2 p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-4 sm:p-5 flex flex-col justify-center h-full">
                            {isSuccess ? (
                                <div className="text-center py-4">
                                    <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-400" />
                                    <h3 className="text-lg sm:text-xl font-bold mb-2 !text-white">¡Solicitud Recibida!</h3>
                                    <p className="!text-white/90 text-sm mb-5">
                                        Un experto de nuestro equipo evaluará tu caso y te llamará pronto.
                                    </p>
                                    <button
                                        onClick={handleClose}
                                        className="bg-white/20 hover:bg-white/30 !text-white font-medium py-2 px-8 rounded-full transition-colors text-sm"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-base sm:text-lg font-bold leading-tight mb-1 !text-white pr-6">
                                        ¿Sabías que tu proyecto puede acceder a fondos y ayudas directas?
                                    </h2>
                                    <p className="!text-white text-xs sm:text-[13px] mb-3 leading-snug">
                                        Descubre tus opciones de respaldo económico y te acompañamos en la tramitación.
                                    </p>

                                    {error && (
                                        <div className="bg-red-500/20 text-red-100 p-2 rounded-lg text-xs mb-3 border border-red-500/30">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-2">
                                        <div>
                                            <label htmlFor="name" className="sr-only">Nombre</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                placeholder="Nombre"
                                                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 px-3 py-1.5 rounded-xl outline-none focus:ring-2 focus:ring-white/50 transition-all text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="company" className="sr-only">Nombre de la empresa</label>
                                            <input
                                                type="text"
                                                id="company"
                                                name="company"
                                                required
                                                placeholder="Nombre de la empresa"
                                                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 px-3 py-1.5 rounded-xl outline-none focus:ring-2 focus:ring-white/50 transition-all text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="phone" className="sr-only">Teléfono</label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                required
                                                placeholder="Teléfono"
                                                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 px-3 py-1.5 rounded-xl outline-none focus:ring-2 focus:ring-white/50 transition-all text-sm"
                                            />
                                        </div>

                                        <div className="flex items-start gap-2 pt-1">
                                            <input
                                                type="checkbox"
                                                id="privacy"
                                                name="privacy"
                                                required
                                                defaultChecked
                                                className="mt-0.5 w-3.5 h-3.5 rounded border-white/30 bg-white/10 text-blue-600 focus:ring-white/50 cursor-pointer"
                                            />
                                            <label htmlFor="privacy" className="text-[10px] sm:text-[11px] !text-white/80 leading-tight cursor-pointer">
                                                He leído y acepto la{' '}
                                                <a href="/politica-privacidad" target="_blank" rel="noopener noreferrer" className="underline hover:!text-white transition-colors">
                                                    política de privacidad
                                                </a>
                                            </label>
                                        </div>

                                        <div className="flex flex-col gap-2 mt-1">
                                            {formSecurityEnabled && (
                                                <TurnstileCaptcha
                                                    ref={turnstileRef}
                                                    onVerify={(token) => setTurnstileToken(token)}
                                                />
                                            )}

                                            <div className="pt-1">
                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="w-full flex items-center justify-center gap-2 bg-white text-blue-900 font-bold py-2 px-6 rounded-full hover:bg-gray-50 transition-colors shadow-lg shadow-white/10 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                                                >
                                                    {isLoading ? (
                                                        <Loader2 className="w-4 h-4 animate-spin" />
                                                    ) : (
                                                        'Consulta con un Experto'
                                                    )}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-center mt-2">
                                            <a 
                                                href="https://www.partners.es/" 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="inline-block text-[10px] text-white/70 hover:text-white uppercase tracking-widest font-medium transition-colors"
                                            >
                                                By Partners Global Funding
                                            </a>
                                        </div>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
