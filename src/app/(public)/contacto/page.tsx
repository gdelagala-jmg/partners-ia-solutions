'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Mail, Phone, MapPin, Send, Loader2, MessageCircle, Linkedin, Facebook, Instagram, Youtube, Music } from 'lucide-react'
import { motion } from 'framer-motion'

const contactSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().optional(),
    message: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

type ContactFormValues = z.infer<typeof contactSchema>

const socialLinks = [
    { name: 'WhatsApp', href: 'https://api.whatsapp.com/send?phone=34639023805', icon: MessageCircle, color: 'text-green-600' },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/109997641/', icon: Linkedin, color: 'text-blue-600' },
    { name: 'Facebook', href: 'https://www.facebook.com/pgf.iasolutions', icon: Facebook, color: 'text-blue-500' },
    { name: 'Instagram', href: 'https://www.instagram.com/pgf.iasolutions/', icon: Instagram, color: 'text-pink-500' },
    { name: 'YouTube', href: 'https://www.youtube.com/@PGF.IASolutions', icon: Youtube, color: 'text-red-600' },
    { name: 'Spotify', href: 'https://open.spotify.com/show/3hfDKLDnMQwxLQBJGLcCrH', icon: Music, color: 'text-green-500' },
]

export default function ContactPage() {
    const [isSuccess, setIsSuccess] = useState(false)

    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
    })

    const onSubmit = async (data: ContactFormValues) => {
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                setIsSuccess(true)
                reset()
                setTimeout(() => setIsSuccess(false), 5000)
            } else {
                alert('Hubo un error al enviar el mensaje. Inténtalo de nuevo.')
            }
        } catch (error) {
            console.error('Error submitting form:', error)
            alert('Error de conexión.')
        }
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="py-10 lg:py-14 bg-gray-50">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 mb-5">
                            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2" />
                            Contáctanos
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 tracking-tight">
                            Hablemos de tu <span className="text-blue-500">Futuro</span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
                            ¿Listo para transformar tu negocio con IA? Nuestro equipo de expertos está aquí para guiarte.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-10 lg:py-14">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="space-y-6 flex flex-col items-center md:items-start w-full"
                        >
                            <div className="bg-gray-50 border border-gray-200 p-6 lg:p-8 rounded-2xl w-[90%] md:w-full shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center md:text-left">Información de Contacto</h3>

                                <div className="space-y-5">
                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 bg-white rounded-xl flex items-center justify-center border border-gray-200">
                                            <Mail className="text-gray-900" size={18} />
                                        </div>
                                        <div className="ml-4 overflow-hidden">
                                            <p className="text-xs font-medium text-gray-600">Email</p>
                                            <p className="text-sm md:text-base text-gray-900 font-medium break-words">info@partnersiasolutions.com</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 bg-white rounded-xl flex items-center justify-center border border-gray-200">
                                            <Phone className="text-gray-900" size={18} />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-xs font-medium text-gray-600">Teléfono</p>
                                            <p className="text-base text-gray-900 font-medium">+34 639 023 805</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start">
                                        <div className="flex-shrink-0 h-10 w-10 bg-white rounded-xl flex items-center justify-center border border-gray-200">
                                            <MapPin className="text-gray-900" size={18} />
                                        </div>
                                        <div className="ml-4">
                                            <p className="text-xs font-medium text-gray-600">Oficina</p>
                                            <p className="text-base text-gray-900 font-medium">Calle Club 1 Oficina 4<br />Las Arenas Getxo, 48930</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Social Links */}
                            <div className="bg-gray-50 border border-gray-200 p-6 lg:p-8 rounded-2xl w-[90%] md:w-full shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center md:text-left">Síguenos</h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {socialLinks.map((social) => (
                                        <Link
                                            key={social.name}
                                            href={social.href}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all group"
                                        >
                                            <social.icon size={22} className={`${social.color} mb-1.5 group-hover:scale-110 transition-transform`} />
                                            <span className="text-xs text-gray-600 font-medium">{social.name}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="bg-white border border-gray-200 p-6 lg:p-8 rounded-2xl shadow-sm">
                                <h3 className="text-xl font-semibold text-gray-900 mb-5 text-center md:text-left">Envíanos un Mensaje</h3>

                                {isSuccess && (
                                    <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl text-green-800 text-sm">
                                        ¡Mensaje enviado con éxito! Te contactaremos pronto.
                                    </div>
                                )}

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1.5">
                                            Nombre *
                                        </label>
                                        <input
                                            {...register('name')}
                                            type="text"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                            placeholder="Tu nombre completo"
                                        />
                                        {errors.name && <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1.5">
                                            Email *
                                        </label>
                                        <input
                                            {...register('email')}
                                            type="email"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                            placeholder="tu@email.com"
                                        />
                                        {errors.email && <p className="mt-1.5 text-xs text-red-600">{errors.email.message}</p>}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1.5">
                                            Teléfono
                                        </label>
                                        <input
                                            {...register('phone')}
                                            type="tel"
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
                                            placeholder="+34 600 000 000"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-900 mb-1.5">
                                            Mensaje *
                                        </label>
                                        <textarea
                                            {...register('message')}
                                            rows={5}
                                            className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm"
                                            placeholder="Cuéntanos sobre tu proyecto..."
                                        />
                                        {errors.message && <p className="mt-1.5 text-xs text-red-600">{errors.message.message}</p>}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full px-6 py-3.5 bg-black text-white font-medium rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 hover:scale-105 shadow-lg"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="animate-spin" size={18} />
                                                <span>Enviando...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send size={18} />
                                                <span>Enviar Mensaje</span>
                                            </>
                                        )}
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>
        </div>
    )
}
