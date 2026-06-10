'use client'

import { useState, useEffect } from 'react'
import { FileWarning, Loader2, Sparkles } from 'lucide-react'

export default function EmpresasFormPortal() {
    const [isLoading, setIsLoading] = useState(true)
    const [hasUrl, setHasUrl] = useState(false)
    const FALLBACK_URL = 'https://docs.google.com/forms/d/12-MgNvZ-SgtKTKc2u_SOZcNhKCGyNOEI1Ztd6yXOxGU/viewform?embedded=true'
    const formUrl = process.env.NEXT_PUBLIC_EMPRESAS_FORM_URL || FALLBACK_URL

    useEffect(() => {
        if (formUrl && formUrl.trim() !== '') {
            setHasUrl(true)
        }
        // Small delay to prevent layout shift harshness and show premium loading state if needed
        const timer = setTimeout(() => setIsLoading(false), 500)
        return () => clearTimeout(timer)
    }, [formUrl])

    return (
        <section id="diagnostico" className="py-24 bg-gray-50 relative overflow-hidden scroll-mt-24">
            {/* Decorative background elements for CTA */}
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
                 style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '30px 30px' }} 
            />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Inicia tu Diagnóstico IA</h2>
                    <p className="text-gray-600 text-lg">
                        Cuéntanos sobre tu empresa y qué procesos te gustaría optimizar. 
                        Analizaremos la viabilidad y nos pondremos en contacto contigo.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col border border-white/10 relative">
                    {isLoading ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-12">
                            <Loader2 className="w-10 h-10 animate-spin mb-4 text-blue-600" />
                            <p>Preparando portal seguro...</p>
                        </div>
                    ) : hasUrl ? (
                        <div className="w-full h-[800px] relative">
                            {/* Header fake para que parezca más integrado */}
                            <div className="h-12 bg-gray-50 border-b border-gray-100 flex items-center px-6">
                                <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                                <span className="text-sm font-medium text-gray-600">Portal de Captación Empresarial</span>
                            </div>
                            <iframe 
                                src={formUrl} 
                                className="w-full h-[calc(100%-3rem)] bg-white"
                                frameBorder="0" 
                                marginHeight={0} 
                                marginWidth={0}
                                title="Formulario de Diagnóstico Empresas"
                            >
                                Cargando...
                            </iframe>
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-gray-50">
                            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                                <FileWarning className="w-10 h-10 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-3">Portal en Configuración</h3>
                            <p className="text-gray-600 max-w-md">
                                El formulario de diagnóstico empresarial está siendo actualizado. 
                                Por favor, vuelve más tarde o utiliza nuestra sección de contacto general.
                            </p>
                            <a href="/contacto" className="mt-8 px-6 py-3 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all">
                                Ir a Contacto
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
