'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Zap, ChevronDown, Send, CheckCircle2, AlertCircle } from 'lucide-react'

const SCOPE_OPTIONS = [
    'Gestión Profesional / Negocio',
    'Organización Personal',
    'Modelo Híbrido',
]

export default function LeadCaptureSection() {
    const [form, setForm] = useState({
        scope: '',
        bottleneck: '',
        urgency: 5,
        desiredResult: '',
        name: '',
        email: '',
    })
    const [loading, setLoading] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [errorMsg, setErrorMsg] = useState('')

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
        const { name, value } = e.target
        setForm(prev => ({ ...prev, [name]: value }))
    }

    function handleUrgencyChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm(prev => ({ ...prev, urgency: parseInt(e.target.value) }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setStatus('idle')
        setErrorMsg('')

        try {
            const res = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: form.name,
                    email: form.email,
                    message: form.desiredResult || '',
                    scope: form.scope,
                    bottleneck: form.bottleneck,
                    urgency: form.urgency,
                    desiredResult: form.desiredResult,
                    source: 'LEAD_CAPTURE',
                }),
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data.error || 'Error al enviar el formulario')
            }

            setStatus('success')
            setForm({ scope: '', bottleneck: '', urgency: 5, desiredResult: '', name: '', email: '' })
        } catch (err: any) {
            setStatus('error')
            setErrorMsg(err.message || 'Error inesperado. Inténtalo de nuevo.')
        } finally {
            setLoading(false)
        }
    }

    const urgencyLabel = (v: number) => {
        if (v <= 3) return 'Baja'
        if (v <= 6) return 'Media'
        if (v <= 8) return 'Alta'
        return 'Crítica'
    }
    const urgencyColor = (v: number) => {
        if (v <= 3) return 'text-green-600'
        if (v <= 6) return 'text-yellow-600'
        if (v <= 8) return 'text-orange-500'
        return 'text-red-500'
    }

    return (
        <section className="py-6 lg:py-12 bg-gray-50">
            <div className="max-w-5xl mx-auto px-6 lg:px-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-10"
                >
                    <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 mb-5">
                        <Zap size={14} className="mr-2 text-blue-500" />
                        Solicita tu Estrategia Digital Optimizada con IA
                    </div>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-4 tracking-tight leading-tight">
                        Da el paso hacia una{' '}
                        <span className="text-blue-500">ejecución de alto rendimiento</span>
                    </h2>
                    <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                        Optimiza tu ecosistema personal o profesional con una gestión inteligente. Cuéntanos tu desafío y tracemos el camino.
                    </p>
                </motion.div>

                {/* Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="bg-white border border-gray-200 rounded-3xl shadow-xl overflow-hidden"
                >
                    {status === 'success' ? (
                        <div className="flex flex-col items-center justify-center py-8 px-8 text-center">
                            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-5 border border-green-100">
                                <CheckCircle2 size={32} className="text-green-500" />
                            </div>
                            <h3 className="text-2xl font-semibold text-gray-900 mb-2">¡Solicitud recibida!</h3>
                            <p className="text-gray-600 max-w-md leading-relaxed">
                                Hemos recibido tu hoja de ruta. Nuestro equipo revisará tu caso y se pondrá en contacto contigo a la brevedad.
                            </p>
                            <button
                                onClick={() => setStatus('idle')}
                                className="mt-8 text-sm text-blue-500 hover:text-blue-600 font-medium transition-colors"
                            >
                                Enviar otra solicitud
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="p-6 lg:p-10">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* Scope */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                        ¿En qué ámbito buscas optimizar?
                                        <span className="text-blue-500 ml-1">*</span>
                                    </label>
                                    <div className="relative">
                                        <select
                                            name="scope"
                                            value={form.scope}
                                            onChange={handleChange}
                                            required
                                            className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all pr-10"
                                        >
                                            <option value="" disabled>Selecciona una opción...</option>
                                            {SCOPE_OPTIONS.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                        <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                </div>

                                {/* Bottleneck */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                        ¿Cuál es el principal "cuello de botella" que frena tu avance hoy?
                                        <span className="text-blue-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="bottleneck"
                                        value={form.bottleneck}
                                        onChange={handleChange}
                                        required
                                        placeholder="Ej: Falta de sistematización, procesos manuales, falta de tiempo..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                {/* Urgency Slider */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-800 mb-2.5">
                                        Nivel de urgencia para implementar mejoras
                                        <span className="ml-3 text-xs font-normal">
                                            <span className={`font-semibold ${urgencyColor(form.urgency)}`}>
                                                {form.urgency}/10 — {urgencyLabel(form.urgency)}
                                            </span>
                                        </span>
                                    </label>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-gray-400 w-4 text-center">1</span>
                                        <input
                                            type="range"
                                            min={1}
                                            max={10}
                                            step={1}
                                            value={form.urgency}
                                            onChange={handleUrgencyChange}
                                            className="flex-1 h-2 accent-blue-500 cursor-pointer"
                                        />
                                        <span className="text-xs text-gray-400 w-4 text-center">10</span>
                                    </div>
                                    <div className="flex justify-between mt-1 px-7">
                                        <span className="text-xs text-gray-400">Sin urgencia</span>
                                        <span className="text-xs text-gray-400">Crítico</span>
                                    </div>
                                </div>

                                {/* Desired Result */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                        Describe tu deseo de mejora o el resultado específico que buscas alcanzar
                                    </label>
                                    <textarea
                                        name="desiredResult"
                                        value={form.desiredResult}
                                        onChange={handleChange}
                                        rows={4}
                                        placeholder="Cuéntanos en detalle qué transformación quieres lograr..."
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                                    />
                                </div>

                                {/* Divider */}
                                <div className="md:col-span-2 flex items-center gap-4 my-2">
                                    <div className="flex-1 h-px bg-gray-200" />
                                    <span className="text-xs text-gray-400 font-medium">Datos de contacto</span>
                                    <div className="flex-1 h-px bg-gray-200" />
                                </div>

                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                        Nombre completo
                                        <span className="text-blue-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Tu nombre"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                                        Email
                                        <span className="text-blue-500 ml-1">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="tu@email.com"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-gray-800 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all"
                                    />
                                </div>

                                {/* Error */}
                                {status === 'error' && (
                                    <div className="md:col-span-2 flex items-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm">
                                        <AlertCircle size={16} />
                                        {errorMsg}
                                    </div>
                                )}

                                {/* Submit */}
                                <div className="md:col-span-2 pt-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="group w-full md:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 bg-black hover:bg-gray-800 text-white font-semibold rounded-xl transition-all hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none text-sm"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Enviando...
                                            </>
                                        ) : (
                                            <>
                                                <Send size={16} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                Solicitar Hoja de Ruta
                                            </>
                                        )}
                                    </button>
                                    <p className="mt-3 text-xs text-gray-400">
                                        Al enviar, aceptas que nuestro equipo se ponga en contacto contigo. Sin spam, solo valor.
                                    </p>
                                </div>
                            </div>
                        </form>
                    )}
                </motion.div>
            </div>
        </section>
    )
}
