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
    source = 'CONTACT',
    context = {},
    onSuccess 
}: LeadFormProps) {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [errorMessage, setErrorMessage] = useState<string | null>(null)

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
                className="flex flex-col items-center justify-center py-12 px-6 text-center space-y-4 bg-emerald-50/50 rounded-2xl border border-emerald-100"
            >
                <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                    <CheckCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 font-outfit">¡Solicitud Enviada!</h3>
                <p className="text-gray-600 max-w-xs">
                    Gracias por tu interés. Nuestro equipo se pondrá en contacto contigo muy pronto.
                </p>
            </motion.div>
        )
    }

    return (
        <div className={`w-full ${layout === 'modal' ? 'max-w-lg mx-auto' : ''}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nombre */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Nombre Completo</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input 
                                {...register('name')}
                                type="text"
                                placeholder="Ej. Juan Pérez"
                                className={`w-full pl-11 pr-4 py-3 bg-white border ${errors.name ? 'border-red-300 bg-red-50/30' : 'border-gray-200 focus:border-emerald-500'} rounded-xl outline-none transition-all font-outfit shadow-sm`}
                            />
                        </div>
                        {errors.name && <p className="text-[11px] text-red-500 font-medium ml-1">{errors.name.message}</p>}
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Email Corporativo</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input 
                                {...register('email')}
                                type="email"
                                placeholder="tu@empresa.com"
                                className={`w-full pl-11 pr-4 py-3 bg-white border ${errors.email ? 'border-red-300 bg-red-50/30' : 'border-gray-200 focus:border-emerald-500'} rounded-xl outline-none transition-all font-outfit shadow-sm`}
                            />
                        </div>
                        {errors.email && <p className="text-[11px] text-red-500 font-medium ml-1">{errors.email.message}</p>}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Teléfono */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Teléfono</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input 
                                {...register('phone')}
                                type="tel"
                                placeholder="+34 600 000 000"
                                className={`w-full pl-11 pr-4 py-3 bg-white border ${errors.phone ? 'border-red-300 bg-red-50/30' : 'border-gray-200 focus:border-emerald-500'} rounded-xl outline-none transition-all font-outfit shadow-sm`}
                            />
                        </div>
                        {errors.phone && <p className="text-[11px] text-red-500 font-medium ml-1">{errors.phone.message}</p>}
                    </div>

                    {/* Empresa */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">Empresa / Organización</label>
                        <div className="relative group">
                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                            <input 
                                {...register('company')}
                                type="text"
                                placeholder="Nombre de tu empresa"
                                className={`w-full pl-11 pr-4 py-3 bg-white border ${errors.company ? 'border-red-300 bg-red-50/30' : 'border-gray-200 focus:border-emerald-500'} rounded-xl outline-none transition-all font-outfit shadow-sm`}
                            />
                        </div>
                    </div>
                </div>

                {/* Mensaje */}
                <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider ml-1">¿En qué podemos ayudarte?</label>
                    <div className="relative group">
                        <MessageSquare className="absolute left-4 top-4 text-gray-400 group-focus-within:text-emerald-500 transition-colors" size={18} />
                        <textarea 
                            {...register('message')}
                            rows={3}
                            placeholder="Cuéntanos brevemente tus necesidades..."
                            className={`w-full pl-11 pr-4 py-3 bg-white border ${errors.message ? 'border-red-300 bg-red-50/30' : 'border-gray-200 focus:border-emerald-500'} rounded-xl outline-none transition-all font-outfit shadow-sm resize-none`}
                        />
                    </div>
                    {errors.message && <p className="text-[11px] text-red-500 font-medium ml-1">{errors.message.message}</p>}
                </div>

                {/* RGPD */}
                <div className="py-2">
                    <label className="flex items-start gap-3 cursor-pointer group">
                        <div className="relative flex items-center mt-0.5">
                            <input 
                                type="checkbox"
                                {...register('consent')}
                                className="peer appearance-none w-5 h-5 border-2 border-gray-300 rounded-md checked:bg-emerald-500 checked:border-emerald-500 transition-all"
                            />
                            <CheckCircle className="absolute inset-0 m-auto text-white opacity-0 peer-checked:opacity-100 transition-opacity" size={14} />
                        </div>
                        <span className="text-[12px] text-gray-500 leading-tight group-hover:text-gray-700 transition-colors">
                            Acepto la <a href="/politica-privacidad" className="text-emerald-600 hover:underline font-bold">política de privacidad</a> y autorizo el tratamiento de mis datos para la gestión de esta demo.
                        </span>
                    </label>
                    {errors.consent && <p className="text-[11px] text-red-500 font-medium mt-1 ml-8">{errors.consent.message}</p>}
                </div>

                {/* Error Message */}
                <AnimatePresence>
                    {status === 'error' && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm"
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
                    className={`w-full py-4 px-6 bg-[#1D1D1F] text-white rounded-xl font-bold font-outfit flex items-center justify-center gap-2 hover:bg-black transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed shadow-xl shadow-gray-200 overflow-hidden relative group`}
                >
                    {status === 'loading' ? (
                        <>
                            <Loader2 className="animate-spin" size={20} />
                            <span>Procesando...</span>
                        </>
                    ) : (
                        <>
                            <span>{source === 'DEMO_REQUEST' ? 'Solicitar Demo Ahora' : 'Enviar Mensaje'}</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </>
                    )}
                    
                    {/* Subtle shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </button>
            </form>
        </div>
    )
}
