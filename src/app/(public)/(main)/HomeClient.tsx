'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Target, X, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import PodcastHomeSection from '@/components/sections/PodcastHomeSection'
import LatestNewsSection from '@/components/sections/LatestNewsSection'
import LeadCaptureSection from '@/components/sections/LeadCaptureSection'
import ClientCarousel from '@/components/sections/ClientCarousel'
import PageBadge from '@/components/ui/PageBadge'
import { isLabSolution } from '@/lib/utils'
import NewsletterForm from '@/components/newsletter/NewsletterForm'

interface HomeSolution {
    id: string
    title: string
    slug: string
    multimediaUrl: string | null
    description: string | null
    type: string
}

interface HomeClientProps {
    featuredSolutions: HomeSolution[]
}

export default function HomeClient({ featuredSolutions }: HomeClientProps) {
    const [displaySolutions, setDisplaySolutions] = useState<HomeSolution[]>([])
    const [isDemoOpen, setIsDemoOpen] = useState(false)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [demoData, setDemoData] = useState({ name: '', email: '', phone: '', solutionSlug: '' })
    const [demoSuccess, setDemoSuccess] = useState(false)

    useEffect(() => {
        // Shuffle and pick 6 random solutions
        const shuffled = [...featuredSolutions].sort(() => 0.5 - Math.random())
        setDisplaySolutions(shuffled.slice(0, 6))
    }, [featuredSolutions])

    const handleDemoSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)
        try {
            const res = await fetch('/api/demos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(demoData)
            })
            if (res.ok) {
                setDemoSuccess(true)
                setTimeout(() => {
                    setIsDemoOpen(false)
                    setDemoSuccess(false)
                    setDemoData({ name: '', email: '', phone: '', solutionSlug: '' })
                }, 3000)
            } else {
                alert('Hubo un error al enviar tu solicitud. Inténtalo de nuevo.')
            }
        } catch (error) {
            alert('Error de red. Inténtalo de nuevo.')
        } finally {
            setIsSubmitting(false)
        }
    }

    const getSolutionImage = (solution: HomeSolution) => {
        if (solution.multimediaUrl && !solution.multimediaUrl.includes('placeholder')) {
            return solution.multimediaUrl
        }
        return '/logo-ias.png'
    }

    return (
        <div className="bg-white">
            {/* HERO SECTION */}
            <section className="relative flex items-center justify-center overflow-hidden bg-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,113,227,0.03),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(0,113,227,0.02),transparent_50%)]" />

                <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 lg:px-8 text-center py-6 md:py-8">
                    <PageBadge text="Liderando la Revolución de la IA" icon={<Sparkles size={14} className="text-blue-500" />} />

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-semibold text-[#000000] mb-5 tracking-tight leading-[1.1] overflow-hidden"
                    >
                        Transformamos el Futuro
                        <br className="hidden sm:block" />
                        <span className="text-blue-500 break-words">Con Inteligencia Artificial</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto mb-8 leading-relaxed"
                    >
                        Diseñamos, construimos y desplegamos ecosistemas inteligentes que automatizan procesos y escalan negocios.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        <Link
                            href="/soluciones"
                            className="group px-7 py-3.5 bg-black text-white font-medium rounded-xl transition-all hover:bg-gray-800 hover:scale-105 shadow-lg hover:shadow-xl flex items-center space-x-2"
                        >
                            <span>Explorar Soluciones</span>
                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/contacto"
                            className="px-7 py-3.5 bg-white text-gray-900 font-medium rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all"
                        >
                            Agendar Consultoría
                        </Link>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="flex flex-col items-center gap-2 mt-12"
                    >
                        <div className="animate-bounce flex flex-col items-center gap-1.5">
                            <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center pt-2">
                                <div className="w-1 h-2.5 bg-gray-400 rounded-full" />
                            </div>
                            <span className="text-[10px] font-medium text-gray-400 tracking-widest uppercase">Scroll</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURED SOLUTIONS SECTION */}
            <section className="py-6 md:py-10 bg-gray-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="text-center mb-6 md:mb-8">
                        <PageBadge text="Nuestras Soluciones" icon={<Target size={14} className="text-blue-500" />} />
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
                            Soluciones Destacadas
                        </h2>
                        <p className="text-sm text-gray-600 max-w-xl mx-auto">
                            Ecosistemas de Inteligencia Artificial diseñados para resolver los retos específicos de tu industria
                        </p>
                    </div>

                    {displaySolutions.length === 0 ? (
                        <div className="text-center text-gray-500 bg-white py-8 rounded-2xl border border-gray-100">Cargando soluciones...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {displaySolutions.map((solution) => (
                                <Link
                                    key={solution.id}
                                    href={`/soluciones/${solution.slug}`}
                                    className="group flex flex-col rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-500 border border-gray-200 bg-white"
                                >
                                    <div className="h-40 md:h-44 w-full relative overflow-hidden bg-gray-100">
                                        <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                        <img
                                            src={getSolutionImage(solution)}
                                            alt={`Solución: ${solution.title}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 left-3 z-20 flex gap-2">
                                            <span className={`px-2.5 py-1 backdrop-blur-md text-xs font-semibold rounded-xl shadow-sm border ${
                                                isLabSolution(solution.type)
                                                ? 'bg-slate-900/95 text-white border-white/10' 
                                                : 'bg-white/95 text-black border-white/20'
                                            }`}>
                                                {solution.type}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-4 md:p-5 flex flex-col flex-1 bg-white">
                                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                            {solution.title}
                                        </h3>
                                        <p className="text-gray-600 line-clamp-3 leading-relaxed text-sm mb-4 flex-1">
                                            {solution.description || `Descubre nuestra solución inteligente especializada para maximizar tu rendimiento.`}
                                        </p>
                                        <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:text-black transition-colors mt-auto">
                                            Ver Detalles
                                            <ArrowRight size={16} className="ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => setIsDemoOpen(true)}
                            className="inline-flex items-center px-8 py-3 bg-blue-600 text-white font-medium text-sm rounded-xl hover:bg-blue-700 transition-all shadow-md hover:shadow-lg group"
                        >
                            Solicita tu demo
                            <Zap size={16} className="ml-2 group-hover:animate-pulse" />
                        </button>
                        <Link
                            href="/soluciones"
                            className="inline-flex items-center px-8 py-3 bg-white text-gray-900 font-medium text-sm rounded-xl border border-gray-200 hover:border-gray-300 transition-all shadow-sm group"
                        >
                            Ver Todas las Soluciones
                            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>


            <PodcastHomeSection />
            <LatestNewsSection />

            {/* Newsletter Section */}
            <section id="newsletter" className="py-10 md:py-20 bg-white scroll-mt-24">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <NewsletterForm variant="home" />
                </div>
            </section>

            <section className="pt-6 pb-10 bg-white border-t border-gray-100">
                <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 text-center">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest mb-5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        Próximos Pasos
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 mb-3 tracking-tight leading-tight">
                        ¿Listo para escalar?
                    </h2>
                    <p className="text-sm md:text-base text-gray-500 max-w-xl mx-auto leading-relaxed mb-8">
                        Únete a las empresas que ya utilizan nuestros agentes de IA para reducir costes y multiplicar ingresos.
                    </p>

                    {/* Stats row */}
                    <div className="grid grid-cols-3 gap-4 md:gap-8 max-w-lg mx-auto mb-10">
                        {[
                            { value: '+60%', label: 'Reducción de costes' },
                            { value: '3×', label: 'Captación más rápida' },
                            { value: '+120%', label: 'Más ingresos' },
                        ].map((stat) => (
                            <div key={stat.label} className="flex flex-col items-center gap-0.5">
                                <span className="text-xl md:text-2xl font-bold text-gray-900">{stat.value}</span>
                                <span className="text-[10px] text-gray-400 leading-tight text-center">{stat.label}</span>
                            </div>
                        ))}
                    </div>

                    {/* Client logos carousel */}
                    <ClientCarousel />
                </div>
            </section>


            <LeadCaptureSection />

            {/* DEMO MODAL */}
            <AnimatePresence>
                {isDemoOpen && (
                    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                            onClick={() => setIsDemoOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-2xl shadow-2xl w-[calc(100%-1.5rem)] max-w-lg overflow-hidden z-10 flex flex-col max-h-[90vh]"
                        >

                            <div className="p-5 md:p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Solicita tu Demo</h3>
                                    <p className="text-xs text-gray-500 mt-1">Conoce cómo podemos transformar tu negocio.</p>
                                </div>
                                <button
                                    onClick={() => setIsDemoOpen(false)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            
                            {demoSuccess ? (
                                <div className="p-8 text-center bg-white">
                                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Sparkles size={32} />
                                    </div>
                                    <h4 className="text-lg font-bold text-gray-900 mb-2">¡Solicitud Enviada!</h4>
                                    <p className="text-gray-600">Nos pondremos en contacto contigo muy pronto para agendar la demo.</p>
                                </div>
                            ) : (
                                <form onSubmit={handleDemoSubmit} className="flex flex-col overflow-hidden">
                                    <div className="p-5 md:p-6 space-y-4 md:space-y-6 overflow-y-auto custom-scrollbar">
                                        <div className="space-y-1">
                                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Nombre Completo</label>
                                            <input
                                                type="text"
                                                required
                                                value={demoData.name}
                                                onChange={e => setDemoData(d => ({ ...d, name: e.target.value }))}
                                                className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm bg-gray-50/30"
                                                placeholder="Tu nombre"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Email Profesional</label>
                                                <input
                                                    type="email"
                                                    required
                                                    value={demoData.email}
                                                    onChange={e => setDemoData(d => ({ ...d, email: e.target.value }))}
                                                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm bg-gray-50/30"
                                                    placeholder="tu@empresa.com"
                                                />
                                            </div>
                                            <div className="space-y-1">
                                                <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Teléfono</label>
                                                <input
                                                    type="tel"
                                                    required
                                                    value={demoData.phone}
                                                    onChange={e => setDemoData(d => ({ ...d, phone: e.target.value }))}
                                                    className="w-full px-4 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm bg-gray-50/30"
                                                    placeholder="+34 600 000 000"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider ml-1">Solución de interés</label>
                                            <div className="relative">
                                                <select
                                                    required
                                                    value={demoData.solutionSlug}
                                                    onChange={e => setDemoData(d => ({ ...d, solutionSlug: e.target.value }))}
                                                    className="w-full pl-4 pr-10 py-2.5 sm:py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-sm appearance-none bg-gray-50/30 cursor-pointer"
                                                >
                                                    <option value="" disabled>Selecciona una solución...</option>
                                                    {featuredSolutions.map(s => (
                                                        <option key={s.id} value={s.slug}>{s.title}</option>
                                                    ))}
                                                </select>
                                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="w-full py-3.5 sm:py-4 bg-[#1D1D1F] hover:bg-black text-white rounded-2xl font-bold transition-all transform active:scale-[0.98] disabled:opacity-50 shadow-xl shadow-gray-200 flex items-center justify-center gap-2"
                                            >
                                                {isSubmitting ? (
                                                    <>
                                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                        Enviando...
                                                    </>
                                                ) : 'Solicitar Demo Ahora'}
                                            </button>
                                            <p className="mt-4 text-[11px] text-center text-gray-400 font-medium">
                                                Tus datos están protegidos y no los compartimos con terceros.
                                            </p>
                                        </div>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
