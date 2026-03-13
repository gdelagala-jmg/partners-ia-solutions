'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import PodcastHomeSection from '@/components/sections/PodcastHomeSection'
import LatestNewsSection from '@/components/sections/LatestNewsSection'
import { useEffect, useState } from 'react'
import { getSolutionImage } from '@/lib/utils/images'
import LeadCaptureSection from '@/components/sections/LeadCaptureSection'
import ClientCarousel from '@/components/sections/ClientCarousel'

const iconMap: any = {
    'Target': Target,
    'Sparkles': Sparkles,
    'Zap': Zap,
}

export default function HomePage() {
    const [featuredSolutions, setFeaturedSolutions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/solutions?featured=true&limit=3')
            .then(res => res.json())
            .then(data => {
                setFeaturedSolutions(data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Error fetching featured solutions:', err)
                setLoading(false)
            })
    }, [])


    return (
        <div className="bg-white">
            {/* HERO SECTION */}
            <section className="relative flex items-center justify-center overflow-hidden bg-white">
                {/* Subtle Background Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,113,227,0.03),transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(0,113,227,0.02),transparent_50%)]" />

                <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center py-20 lg:py-28">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-50 border border-gray-200 text-sm font-medium text-gray-700 mb-5"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2" />
                        Liderando la Revolución de la IA
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-5 tracking-tight leading-[1.1]"
                    >
                        Transformamos el Futuro
                        <br />
                        <span className="text-blue-500">Con Inteligencia Artificial</span>
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

                    {/* Scroll Indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 1 }}
                        className="flex flex-col items-center gap-2 mt-12"
                    >
                        <div className="animate-bounce flex flex-col items-center gap-1.5">
                            <div className="w-6 h-10 rounded-full border-2 border-gray-300 flex items-start justify-center pt-2">
                                <div className="w-1 h-2.5 bg-gray-400 rounded-full animate-[bounce_1.5s_ease-in-out_infinite]" />
                            </div>
                            <span className="text-[10px] font-medium text-gray-400 tracking-widest uppercase">Scroll</span>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* FEATURED SOLUTIONS SECTION */}
            <section className="py-12 lg:py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-10 px-4">
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-3 tracking-tight">
                            Soluciones Destacadas
                        </h2>
                        <p className="text-base text-gray-600 max-w-2xl mx-auto">
                            Servicios diseñados para impulsar tu transformación digital
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center text-gray-500">Cargando soluciones...</div>
                    ) : featuredSolutions.length === 0 ? (
                        <div className="text-center text-gray-500">No hay soluciones destacadas disponibles.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {featuredSolutions.map((solution, idx) => (
                                <motion.div
                                    key={solution.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="group p-6 lg:p-8 rounded-2xl bg-white border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all flex flex-col items-center md:items-start text-center md:text-left"
                                >
                                    {solution.multimedia && (
                                        <div className="w-full h-40 mb-4 rounded-xl overflow-hidden bg-gray-100">
                                            <img
                                                src={getSolutionImage(solution)}
                                                alt={solution.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                        {solution.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed mb-5 text-sm">
                                        {solution.description}
                                    </p>
                                    <Link
                                        href={solution.ctaUrl || "/soluciones"}
                                        className="inline-flex items-center text-blue-500 font-medium hover:text-blue-600 transition-colors group-hover:translate-x-1 transition-transform text-sm"
                                    >
                                        Ver más
                                        <ArrowRight size={15} className="ml-1.5" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* PODCAST SECTION */}
            <PodcastHomeSection />

            {/* LATEST NEWS SECTION */}
            <LatestNewsSection />

            {/* CTA SECTION */}
            <section className="py-12 lg:py-16 bg-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 mb-4 tracking-tight">
                            ¿Listo para escalar?
                        </h2>
                        <p className="text-base text-gray-600 mb-2 max-w-2xl mx-auto leading-relaxed">
                            Únete a las empresas que ya están utilizando nuestros agentes de IA para reducir costes y multiplicar ingresos.
                        </p>
                        <ClientCarousel />
                    </motion.div>
                </div>
            </section>

            {/* LEAD CAPTURE SECTION */}
            <LeadCaptureSection />
        </div>
    )
}
