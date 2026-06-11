'use client'

import { useState } from 'react'
import { X, Lightbulb, Loader2, CheckCircle2 } from 'lucide-react'

export default function FundingCTA() {
    const [isOpen, setIsOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)
        setError('')

        const formData = new FormData(e.currentTarget)
        const data = {
            name: formData.get('name'),
            company: formData.get('company'),
            phone: formData.get('phone'),
        }

        try {
            const res = await fetch('/api/contact/funding', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!res.ok) {
                throw new Error('Error al enviar la solicitud')
            }

            setIsSuccess(true)
        } catch (err) {
            setError('Hubo un problema al procesar tu solicitud. Por favor, inténtalo de nuevo.')
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
        }, 300)
    }

    return (
        <>
            {/* Floating Trigger Button */}
            <div className="fixed right-2 sm:right-6 top-1/2 -translate-y-1/2 z-[9990]">
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 bg-white text-blue-900 p-3 sm:px-5 sm:py-3 rounded-full shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:scale-105 group"
                    aria-label="Consultar Ayudas"
                >
                    <div className="bg-blue-100 p-2.5 rounded-full group-hover:bg-blue-200 transition-colors">
                        <Lightbulb className="w-5 h-5 text-blue-700" />
                    </div>
                    <span className="font-semibold text-sm hidden sm:block pr-2">Consultar Ayudas</span>
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
                    <div className="relative w-[calc(100vw-24px)] sm:w-full max-w-md max-h-[calc(100dvh-24px)] sm:max-h-[calc(100vh-32px)] overflow-hidden rounded-2xl bg-gradient-to-br from-[#1d4ed8] to-[#1e3a8a] text-white shadow-2xl animate-in fade-in zoom-in-95 duration-200 flex flex-col">
                        {/* Close Button */}
                        <button
                            onClick={handleClose}
                            className="absolute top-2 right-2 p-1.5 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors z-10"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <div className="p-5 sm:p-6 flex flex-col justify-center h-full">
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
                                    <h2 className="text-lg sm:text-xl font-bold leading-snug mb-1.5 !text-white pr-6">
                                        ¿Sabías que tu proyecto puede acceder a fondos y ayudas directas?
                                    </h2>
                                    <p className="!text-white text-xs sm:text-sm mb-4 leading-relaxed">
                                        Descubre tus opciones de respaldo económico y te acompañamos en la tramitación.
                                    </p>

                                    {error && (
                                        <div className="bg-red-500/20 text-red-100 p-2.5 rounded-lg text-xs mb-4 border border-red-500/30">
                                            {error}
                                        </div>
                                    )}

                                    <form onSubmit={handleSubmit} className="space-y-2.5">
                                        <div>
                                            <label htmlFor="name" className="sr-only">Nombre</label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                placeholder="Nombre"
                                                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-white/50 transition-all text-sm"
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
                                                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-white/50 transition-all text-sm"
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
                                                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/60 px-3 py-2 rounded-xl outline-none focus:ring-2 focus:ring-white/50 transition-all text-sm"
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
                                            <label htmlFor="privacy" className="text-[10px] sm:text-xs !text-white/80 leading-tight cursor-pointer">
                                                He leído y acepto la{' '}
                                                <a href="/politica-privacidad" target="_blank" rel="noopener noreferrer" className="underline hover:!text-white transition-colors">
                                                    política de privacidad
                                                </a>
                                            </label>
                                        </div>

                                        <div className="pt-1">
                                            <button
                                                type="submit"
                                                disabled={isLoading}
                                                className="w-full flex items-center justify-center gap-2 bg-white text-blue-900 font-bold py-2.5 px-6 rounded-full hover:bg-gray-50 transition-colors shadow-lg shadow-white/10 disabled:opacity-70 disabled:cursor-not-allowed text-sm"
                                            >
                                                {isLoading ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    'Consulta con un Experto'
                                                )}
                                            </button>
                                        </div>

                                        <div className="text-center mt-3">
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
