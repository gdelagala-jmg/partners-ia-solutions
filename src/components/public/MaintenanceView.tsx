'use client'

import { Mail, Send, Lock, CheckCircle2, AlertCircle, Instagram, Facebook, Linkedin, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function MaintenanceView() {
    const [mounted, setMounted] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [email, setEmail] = useState('')

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setError(null)

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name: 'Interesado Mantenimiento',
                    email: email,
                    source: 'MAINTENANCE',
                    message: 'Usuario interesado en recibir notificación tras mantenimiento.',
                }),
            })

            if (!response.ok) {
                throw new Error('Hubo un problema al procesar tu solicitud.')
            }

            setSubmitted(true)
        } catch (err: any) {
            setError(err.message || 'Algo salió mal. Por favor, inténtalo de nuevo.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <div className="min-h-screen bg-[#F5F5F7] flex flex-col items-center justify-center p-2 sm:p-4 md:p-6 text-center relative overflow-hidden font-sans">
            {/* Admin Access Icon */}
            <motion.a
                href="/admin/login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1, duration: 0.5 }}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                whileTap={{ scale: 0.95 }}
                className="absolute top-4 right-4 md:top-8 md:right-8 z-50 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.05)] flex items-center justify-center text-[#86868B] hover:text-[#0071E3] transition-colors"
                title="Acceso Admin"
            >
                <User size={20} className="md:w-[22px] md:h-[22px]" />
            </motion.a>

            {/* Dynamic Background Elements */}
            <motion.div 
                animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 90, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-gradient-to-br from-blue-400/20 to-cyan-300/20 rounded-full blur-[100px] pointer-events-none" 
            />
            <motion.div 
                animate={{ 
                    scale: [1, 1.3, 1],
                    rotate: [0, -90, 0],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-gradient-to-tr from-blue-600/10 to-purple-400/10 rounded-full blur-[100px] pointer-events-none" 
            />

            <motion.div 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-3xl w-full space-y-12 relative z-10"
            >
                {/* Logo Section */}
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="flex justify-center"
                >
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-500" />
                        <img 
                            src="/logo-ias.png" 
                            alt="IA Solutions" 
                            className="h-20 md:h-28 w-auto object-contain relative drop-shadow-sm" 
                        />
                    </div>
                </motion.div>

                {/* Main Content */}
                <div className="space-y-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-md border border-white/20 shadow-sm text-blue-600 text-[10px] font-extrabold uppercase tracking-[0.2em]"
                    >
                        <Lock size={12} className="text-blue-500" />
                        <span>Evolución en Progreso</span>
                    </motion.div>
                    
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-[#1D1D1F] tracking-tight leading-[1.1] px-2 md:px-4">
                        Redefiniendo el <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">futuro digital</span> a través de la IA.
                    </h1>
                    
                    <p className="text-base md:text-xl text-[#6E6E73] max-w-xl mx-auto leading-relaxed px-4 md:px-6 font-medium">
                        Estamos integrando capas avanzadas de inteligencia para elevar tu experiencia. Estaremos de vuelta en unos momentos.
                    </p>
                </div>

                {/* Glassmorphism Form Container */}
                <div className="relative max-w-full md:max-w-md mx-auto w-full px-1 md:px-4">
                    <motion.div 
                        layout
                        className="bg-white/70 backdrop-blur-2xl border border-white/40 rounded-[1.5rem] md:rounded-[2.5rem] p-5 md:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] overflow-hidden relative"
                    >
                        <AnimatePresence mode="wait">
                            {submitted ? (
                                <motion.div 
                                    key="success"
                                    initial={{ scale: 0.9, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.9, opacity: 0 }}
                                    className="py-6 space-y-4"
                                >
                                    <div className="w-20 h-20 bg-green-500/10 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2 border border-green-500/20">
                                        <CheckCircle2 size={32} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-[#1D1D1F]">¡Todo listo!</h3>
                                    <p className="text-[#6E6E73] font-medium leading-relaxed">
                                        Te hemos añadido a la lista. Serás el primero en enterarte de nuestras novedades.
                                    </p>
                                </motion.div>
                            ) : (
                                <form key="form" onSubmit={handleSubmit} className="space-y-6 text-left">
                                    <div className="space-y-2">
                                        <h3 className="text-xl font-bold text-[#1D1D1F]">¿Quieres que te avisemos?</h3>
                                        <p className="text-sm text-[#6E6E73]">Déjanos tu email y te notificaremos el relanzamiento.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="relative group">
                                            <label htmlFor="email" className="block text-[10px] font-bold text-[#86868B] uppercase tracking-widest mb-2 ml-1">Tu Email</label>
                                            <div className="relative overflow-hidden rounded-2xl transition-all duration-300 ring-1 ring-[#D2D2D7] focus-within:ring-2 focus-within:ring-blue-500 shadow-sm">
                                                <input 
                                                    type="email" 
                                                    id="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    required
                                                    placeholder="ejemplo@partners-ia.com"
                                                    className="w-full px-5 py-4 bg-white/50 focus:bg-white transition-all text-[#1D1D1F] placeholder:text-[#98989D] outline-none pl-12 text-sm"
                                                />
                                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#98989D] group-focus-within:text-blue-500 transition-colors" size={20} />
                                            </div>
                                        </div>

                                        {error && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="flex items-center space-x-2 text-red-500 text-xs font-semibold bg-red-50 p-3 rounded-xl border border-red-100"
                                            >
                                                <AlertCircle size={14} />
                                                <span>{error}</span>
                                            </motion.div>
                                        )}

                                        <button 
                                            type="submit" 
                                            disabled={isSubmitting}
                                            className="w-full group relative py-4 bg-[#0071E3] hover:bg-[#0077ED] disabled:bg-blue-400 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center space-x-2 overflow-hidden"
                                        >
                                            <motion.div 
                                                className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" 
                                            />
                                            {isSubmitting ? (
                                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                            ) : (
                                                <>
                                                    <span className="relative z-10">Notificarme</span>
                                                    <Send size={18} className="relative z-10 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            )}
                        </AnimatePresence>
                    </motion.div>
                </div>

                {/* Social Media Links */}
                <div className="flex items-center justify-center gap-4 md:gap-6 pt-4 md:pt-8">
                    <motion.a 
                        href="https://www.instagram.com/pgf.iasolutions/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -4, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white shadow-sm flex items-center justify-center hover:shadow-xl transition-all border border-[#E8E8ED] text-[#86868B] hover:text-[#E4405F]"
                    >
                        <Instagram size={20} className="md:w-[22px] md:h-[22px]" />
                    </motion.a>

                    <motion.a 
                        href="https://www.facebook.com/pgf.iasolutions"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -4, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white shadow-sm flex items-center justify-center hover:shadow-xl transition-all border border-[#E8E8ED] text-[#86868B] hover:text-[#1877F2]"
                    >
                        <Facebook size={20} className="md:w-[22px] md:h-[22px]" />
                    </motion.a>

                    <motion.a 
                        href="https://www.linkedin.com/in/partners-ia-solutions-3b89053a0/"
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ y: -4, scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white shadow-sm flex items-center justify-center hover:shadow-xl transition-all border border-[#E8E8ED] text-[#86868B] hover:text-[#0A66C2]"
                    >
                        <Linkedin size={20} className="md:w-[22px] md:h-[22px]" />
                    </motion.a>
                </div>
            </motion.div>
        </div>
    )
}
