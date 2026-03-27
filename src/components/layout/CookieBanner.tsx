'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, X, ChevronRight } from 'lucide-react'

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
                    initial={{ y: 100, opacity: 0, scale: 0.95 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 100, opacity: 0, scale: 0.95 }}
                    className="fixed bottom-6 left-6 right-6 md:left-auto md:right-8 md:max-w-md z-[200]"
                >
                    <div className="bg-white/70 backdrop-blur-2xl border border-white/40 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-3xl overflow-hidden">
                        {!showConfig ? (
                            <div className="p-6 md:p-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-black text-white rounded-xl">
                                        <ShieldCheck size={20} />
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900">Privacidad</h3>
                                </div>
                                
                                <p className="text-[13px] md:text-sm text-gray-600 leading-relaxed mb-8">
                                    Utilizamos cookies para mejorar tu experiencia y analizar el tráfico. 
                                    Consulta nuestra{' '}
                                    <Link href="/politica-cookies" className="text-black font-semibold hover:underline">
                                        Política de Cookies
                                    </Link>.
                                </p>

                                <div className="grid grid-cols-2 gap-3 mb-3">
                                    <button
                                        onClick={() => setShowConfig(true)}
                                        className="px-4 py-3 text-xs font-bold text-gray-700 bg-gray-100/50 hover:bg-gray-100 rounded-xl transition-all"
                                    >
                                        Configurar
                                    </button>
                                    <button
                                        onClick={handleRejectAll}
                                        className="px-4 py-3 text-xs font-bold text-gray-700 bg-gray-100/50 hover:bg-gray-100 rounded-xl transition-all"
                                    >
                                        Rechazar
                                    </button>
                                </div>
                                
                                <button
                                    onClick={handleAcceptAll}
                                    className="w-full px-4 py-4 text-sm font-black text-white bg-black rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-black/10 hover:shadow-black/20 hover:-translate-y-0.5"
                                >
                                    Aceptar todas
                                </button>
                            </div>
                        ) : (
                            <div className="p-6 md:p-8">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-lg font-bold text-gray-900">Preferencias</h3>
                                    <button 
                                        onClick={() => setShowConfig(false)} 
                                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        <X size={18} className="text-gray-400" />
                                    </button>
                                </div>

                                <div className="space-y-5 mb-8">
                                    <div className="flex items-center justify-between gap-4 p-3 bg-white/40 rounded-2xl border border-white/60">
                                        <div className="flex-1">
                                            <h4 className="text-[13px] font-bold text-gray-900">Técnicas</h4>
                                            <p className="text-[11px] text-gray-500 leading-tight">Esenciales para la web.</p>
                                        </div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Activado</span>
                                    </div>

                                    <div className="flex items-center justify-between gap-4 p-3 bg-white/40 rounded-2xl border border-white/60">
                                        <div className="flex-1">
                                            <h4 className="text-[13px] font-bold text-gray-900">Analíticas</h4>
                                            <p className="text-[11px] text-gray-500 leading-tight">Medición de audiencia.</p>
                                        </div>
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-black"></div>
                                        </label>
                                    </div>
                                </div>

                                <button
                                    onClick={handleConfigSave}
                                    className="w-full px-4 py-4 text-sm font-black text-white bg-black rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
                                >
                                    Guardar y aceptar
                                </button>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
