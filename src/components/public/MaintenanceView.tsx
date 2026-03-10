'use client'

import { Mail, MessageSquare, Phone, Send, Lock } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function MaintenanceView() {
    const [mounted, setMounted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500))
        setIsSubmitting(false)
        setSubmitted(true)
    }

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-400 to-blue-600"></div>
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-50 rounded-full blur-3xl opacity-50"></div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-cyan-50 rounded-full blur-3xl opacity-50"></div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-2xl w-full space-y-12 relative z-10"
            >
                {/* Logo */}
                <div className="flex justify-center">
                    <img src="/logo-ias.png" alt="IA Solutions" className="h-24 md:h-32 w-auto object-contain" />
                </div>

                {/* Message */}
                <div className="space-y-4">
                    <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider border border-blue-100 mb-4">
                        <Lock size={14} />
                        <span>Mantenimiento Programado</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight leading-tight break-words px-2">
                        Estamos mejorando para <span className="text-blue-600">transformar</span> tu futuro.
                    </h1>
                    <p className="text-lg text-gray-500 max-w-lg mx-auto leading-relaxed px-4">
                        Nuestra plataforma está en mantenimiento breve. Estamos integrando nuevas capas de IA para ofrecerte una experiencia superior. Estaremos de vuelta muy pronto.
                    </p>
                </div>

                {/* Contact Form */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-xl shadow-blue-50/50 max-w-md mx-auto mx-4 sm:mx-auto">
                    {submitted ? (
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="py-8 space-y-4"
                        >
                            <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Send size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900">¡Mensaje Recibido!</h3>
                            <p className="text-gray-500">Te notificaremos en cuanto estemos de vuelta.</p>
                        </motion.div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4 text-left">
                            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Quieres que te avisemos?</h3>
                            <div>
                                <label htmlFor="email" className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">Tu Email</label>
                                <div className="relative">
                                    <input 
                                        type="email" 
                                        id="email"
                                        required
                                        placeholder="tu@email.com"
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-gray-900 placeholder:text-gray-400 outline-none pl-11"
                                    />
                                    <Mail className="absolute left-4 top-3.5 text-gray-400" size={18} />
                                </div>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isSubmitting}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center space-x-2 active:scale-[0.98] disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                ) : (
                                    <>
                                        <span>Notificarme</span>
                                        <Send size={18} />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* Footer Info */}
                <div className="flex flex-wrap items-center justify-center gap-6 pt-4">
                    <div className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <Phone size={16} />
                        <span className="text-sm font-medium">+34 600 000 000</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-400 hover:text-blue-500 transition-colors">
                        <MessageSquare size={16} />
                        <span className="text-sm font-medium">@partners-ia</span>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
