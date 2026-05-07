'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import PodcastHomeSection from '@/components/sections/PodcastHomeSection'
import LatestNewsSection from '@/components/sections/LatestNewsSection'
import LeadCaptureSection from '@/components/sections/LeadCaptureSection'
import ClientCarousel from '@/components/sections/ClientCarousel'
import PageBadge from '@/components/ui/PageBadge'
import { isLabSolution } from '@/lib/utils'

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

                <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 text-center py-8 lg:py-8">
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
            <section className="py-8 bg-gray-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <PageBadge text="Nuestras Soluciones" icon={<Target size={14} className="text-blue-500" />} />
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
                            Soluciones Destacadas
                        </h2>
                        <p className="text-sm text-gray-600 max-w-xl mx-auto">
                            Ecosistemas de Inteligencia Artificial diseñados para resolver los retos específicos de tu industria
                        </p>
                    </div>

                    {featuredSolutions.length === 0 ? (
                        <div className="text-center text-gray-500 bg-white py-8 rounded-2xl border border-gray-100">Pronto publicaremos nuestras soluciones destacadas.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredSolutions.map((solution) => (
                                <Link
                                    key={solution.id}
                                    href={`/soluciones/${solution.slug}`}
                                    className="group flex flex-col rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-500 border border-gray-200 bg-white"
                                >
                                    <div className="h-44 w-full relative overflow-hidden bg-gray-100">
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
                                    <div className="p-5 flex flex-col flex-1 bg-white">
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

                    <div className="mt-8 text-center">
                        <Link
                            href="/soluciones"
                            className="inline-flex items-center px-6 py-2.5 bg-white text-gray-900 font-medium text-sm rounded-xl border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm hover:shadow-md group"
                        >
                            Ver Todas las Soluciones
                            <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>


            <PodcastHomeSection />
            <LatestNewsSection />

            <section className="pt-6 pb-10 bg-white border-t border-gray-100">
                <div className="max-w-5xl mx-auto px-6 lg:px-8 text-center">
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
        </div>
    )
}
