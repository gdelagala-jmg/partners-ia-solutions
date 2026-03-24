'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false)
    const [showConfig, setShowConfig] = useState(false)

    useEffect(() => {
        const consent = localStorage.getItem('cookieConsent')
        if (!consent) {
            setIsVisible(true)
        }
    }, [])

    const handleAcceptAll = () => {
        localStorage.setItem('cookieConsent', 'all')
        setIsVisible(false)
    }

    const handleRejectAll = () => {
        localStorage.setItem('cookieConsent', 'rejected')
        setIsVisible(false)
    }

    const handleConfigSave = () => {
        localStorage.setItem('cookieConsent', 'custom')
        setIsVisible(false)
    }

    if (!isVisible) return null

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 100, opacity: 0 }}
                    className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
                >
                    <div className="max-w-6xl mx-auto bg-white border border-gray-200 shadow-2xl rounded-2xl p-6 md:p-8">
                        {!showConfig ? (
                            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Valoramos tu privacidad</h3>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Utilizamos cookies propias y de terceros para fines analíticos y para mostrarte publicidad 
                                        personalizada en base a un perfil elaborado a partir de tus hábitos de navegación. 
                                        Para más información puedes visitar nuestra{' '}
                                        <Link href="/politica-cookies" className="text-blue-600 hover:text-blue-800 underline">
                                            Política de Cookies
                                        </Link>.
                                    </p>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                                    <button
                                        onClick={() => setShowConfig(true)}
                                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 flex-1 sm:flex-none transition-colors"
                                    >
                                        Configurar
                                    </button>
                                    <button
                                        onClick={handleRejectAll}
                                        className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 flex-1 sm:flex-none transition-colors"
                                    >
                                        Rechazar todas
                                    </button>
                                    <button
                                        onClick={handleAcceptAll}
                                        className="px-6 py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 flex-1 sm:flex-none transition-colors shadow-md hover:shadow-lg"
                                    >
                                        Aceptar todas
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Configuración de Cookies</h3>
                                    <button onClick={() => setShowConfig(false)} className="text-sm text-gray-500 hover:text-gray-900 font-medium">Volver</button>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Cookies Técnicas (Estrictamente necesarias)</h4>
                                            <p className="text-sm text-gray-600">Necesarias para el funcionamiento de la web. No pueden desactivarse.</p>
                                        </div>
                                        <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100">Siempre activas</div>
                                    </div>
                                    <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                                        <div>
                                            <h4 className="font-medium text-gray-900">Cookies Analíticas</h4>
                                            <p className="text-sm text-gray-600">Permiten medir y analizar la audiencia de nuestra web.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>
                                </div>
                                <div className="flex justify-end pt-4 border-t border-gray-100 mt-4">
                                    <button
                                        onClick={handleConfigSave}
                                        className="px-6 py-2.5 text-sm font-medium text-white bg-black rounded-xl hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg"
                                    >
                                        Guardar preferencias
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
