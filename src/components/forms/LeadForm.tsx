'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion, AnimatePresence } from 'framer-motion'
import { 
    User, 
    Mail, 
    Phone, 
    Building, 
    MessageSquare, 
    CheckCircle, 
    AlertCircle, 
    Loader2,
    ArrowRight
} from 'lucide-react'
import { leadFormSchema, type LeadFormData } from '@/lib/validations/lead'

interface LeadFormProps {
    layout?: 'inline' | 'modal'
    variant?: 'standard' | 'premium'
    source?: 'DEMO_REQUEST' | 'CONTACT' | 'ROADMAP_REQUEST'
    context?: {
        solutionSlug?: string
        solutionTitle?: string
        solutionType?: string
        sourcePage?: string
    }
    onSuccess?: () => void
}

export default function LeadForm({ 
    layout = 'inline', 
    variant = 'standard',
    source = 'CONTACT',
    context = {},
    onSuccess 
}: LeadFormProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

    const isPremium = variant === 'premium'

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<LeadFormData>({
        resolver: zodResolver(leadFormSchema)
    })

    const onSubmit = async (data: LeadFormData) => {
        setStatus('loading')
        setErrorMessage(null)

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    source,
                    ...context,
                    sourceUrl: typeof window !== 'undefined' ? window.location.href : '',
                    sourcePage: context.sourcePage || (typeof document !== 'undefined' ? document.title : 'Unknown'),
                    consentAccepted: data.consent,
                    consentText: 'Acepto la política de privacidad y el tratamiento de mis datos para fines comerciales.'
                })
            })

            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(errorData.error || 'Error al enviar el formulario')
            }

            setStatus('success')
            reset()
            if (onSuccess) {
                setTimeout(onSuccess, 2000)
            }
        } catch (error: any) {
            console.error('LeadForm Error:', error)
            setStatus('error')
            setErrorMessage(error.message || 'Ocurrió un error inesperado. Por favor, inténtalo de nuevo.')
        }
    }

    if (status === 'success') {
        return (
            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`flex flex-col items-center justify-center py-12 px-6 text-center space-y-4 rounded-2xl border ${
                    isPremium 
                        ? 'bg-emerald-500/10 border-emerald-500/20 text-white' 
                        : 'bg-emerald-50/50 border-emerald-100 text-gray-900'
                }`}
            >
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                    <CheckCircle size={32} />
                </div>
                <h3 className={`text-2xl font-bold font-outfit ${isPremium ? 'text-white' : 'text-gray-900'}`}>¡Solicitud Enviada!</h3>
                <p className={`${isPremium ? 'text-gray-400' : 'text-gray-600'} max-w-xs`}>
                    Gracias por tu interés. Nuestro equipo se pondrá en contacto contigo muy pronto.
                </p>
            </motion.div>
        )
    }

    const labelClass = `text-xs font-bold uppercase tracking-wider ml-1 mb-1.5 block ${isPremium ? 'text-gray-400' : 'text-gray-500'}`
    const inputClass = `w-full pl-11 pr-4 py-2.5 sm:py-3 rounded-xl outline-none transition-all font-outfit shadow-sm border ${
        isPremium 
            ? 'bg-white/5 border-white/10 text-white focus:border-blue-500/50 focus:bg-white/10 focus:ring-4 focus:ring-blue-500/10 placeholder:text-gray-600' 
            : 'bg-white border-gray-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/5 placeholder:text-gray-400'
    }`
    const iconClass = `absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${isPremium ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-emerald-500'}`

    return (
        <div className={`w-full ${layout === 'modal' ? 'max-w-lg mx-auto' : ''}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Nombre */}
                    <div className="space-y-0.5">
                        <label className={labelClass}>Nombre Completo</label>
                        <div className="relative group">
                            <User className={iconClass} size={18} />
                            <input 
                                {...register('name')}
                                type="text"
                                placeholder="Juan Pérez"
                                className={`${inputClass} ${errors.name ? 'border-red-500/50 bg-red-500/5' : ''}`}
                            />
                        </div>
                        {errors.name && <p className="text-[11px] text-red-500 font-medium mt-1.5 ml-1">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-0.5">
                        <label className={labelClass}>Email Corporativo</label>
                        <div className="relative group">
                            <Mail className={iconClass} size={18} />
                            <input 
                                {...register('email')}
                                type="email"
                                placeholder="tu@empresa.com"
                                className={`${inputClass} ${errors.email ? 'border-red-500/50 bg-red-500/5' : ''}`}
                            />
                        </div>
                        {errors.email && <p className="text-[11px] text-red-500 font-medium mt-1.5 ml-1">{errors.email.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Teléfono */}
                    <div className="space-y-0.5">
                        <label className={labelClass}>Teléfono</label>
                        <div className="relative group">
                            <Phone className={iconClass} size={18} />
                            <input 
                                {...register('phone')}
                                type="tel"
                                placeholder="+34 600 000 000"
                                className={`${inputClass} ${errors.phone ? 'border-red-500/50 bg-red-500/5' : ''}`}
                            />
                        </div>
                        {errors.phone && <p className="text-[11px] text-red-500 font-medium mt-1.5 ml-1">{errors.phone.message}</p>}
                    </div>

                    {/* Empresa */}
                    <div className="space-y-0.5">
                        <label className={labelClass}>Empresa</label>
                        <div className="relative group">
                            <Building className={iconClass} size={18} />
                            <input 
                                {...register('company')}
                                type="text"
                                placeholder="Tu organización"
                                className={inputClass}
                            />
                        </div>
                    </div>
                </div>

                {/* Mensaje */}
                <div className="space-y-0.5">
                    <label className={labelClass}>¿Cómo podemos ayudarte?</label>
                    <div className="relative group">
                        <MessageSquare className={`absolute left-4 top-4 transition-colors ${isPremium ? 'text-gray-500 group-focus-within:text-blue-400' : 'text-gray-400 group-focus-within:text-emerald-500'}`} size={18} />
                        <textarea 
                            {...register('message')}
                            rows={3}
                            placeholder="Cuéntanos brevemente tus necesidades..."
                            className={`${inputClass} min-h-[100px] resize-none ${errors.message ? 'border-red-500/50 bg-red-500/5' : ''}`}
                        />
                    </div>
                    {errors.message && <p className="text-[11px] text-red-500 font-medium mt-1.5 ml-1">{errors.message.message}</p>}
                </div>

                {/* RGPD */}
                <div className="py-1">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center mt-0.5">
                            <input 
                                type="checkbox"
                                {...register('consent')}
                                className={`peer appearance-none w-5 h-5 border-2 rounded-md transition-all ${
                                    isPremium 
                                        ? 'border-white/10 checked:bg-blue-600 checked:border-blue-600' 
                                        : 'border-gray-300 checked:bg-emerald-500 checked:border-emerald-500'
                                }`}
                            />
                            <CheckCircle className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={14} />
                        </div>
                        <span className={`text-[11px] leading-tight transition-colors ${isPremium ? 'text-gray-500 group-hover:text-gray-400' : 'text-gray-500 group-hover:text-gray-700'}`}>
                            Acepto la <a href="/politica-privacidad" className={`${isPremium ? 'text-blue-400' : 'text-emerald-600'} hover:underline font-bold`}>política de privacidad</a> y autorizo el tratamiento de mis datos.
                        </span>
                    </label>
                    {errors.consent && <p className="text-[11px] text-red-500 font-medium mt-1.5 ml-8">{errors.consent.message}</p>}
                </div>

                {/* Error Message */}
                <AnimatePresence>
                    {status === 'error' && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
                                isPremium ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-red-50 border border-red-100 text-red-600'
                            }`}
                        >
                            <AlertCircle size={18} className="flex-shrink-0" />
                            <p>{errorMessage}</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={status === 'loading'}
                    className={`w-full py-3 sm:py-4 px-6 rounded-xl font-bold font-outfit flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed overflow-hidden relative group ${
                        isPremium 
                            ? 'bg-blue-600 text-white hover:bg-blue-500 shadow-xl shadow-blue-900/20' 
                            : 'bg-[#1D1D1F] text-white hover:bg-black shadow-xl shadow-gray-200'
                    }`}
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Procesando solicitud...</span>
                        </>
                    ) : (
                        <>
                            <span className="relative z-10">{source === 'DEMO_REQUEST' ? 'Solicitar Demo Ahora' : 'Enviar Mensaje'}</span>
                            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                    
                    {/* Shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
            </form>
        </div>
    )
}
