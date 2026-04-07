'use client'

import Link from 'next/link'
import { ArrowRight, Sparkles, Zap, Target } from 'lucide-react'
import { motion } from 'framer-motion'
import PodcastHomeSection from '@/components/sections/PodcastHomeSection'
import LatestNewsSection from '@/components/sections/LatestNewsSection'
import LeadCaptureSection from '@/components/sections/LeadCaptureSection'
import ClientCarousel from '@/components/sections/ClientCarousel'
import PageBadge from '@/components/ui/PageBadge'

interface Sector {
    id: string
    name: string
    slug: string
    image: string
    description?: string
}

interface HomeClientProps {
    initialSectors: Sector[]
}

export default function HomeClient({ initialSectors }: HomeClientProps) {
    
    const getSectorImage = (sector: Sector) => {
        if (sector.image && sector.image !== '/logo-ias.png' && !sector.image.includes('placeholder')) {
            return sector.image
        }
        const name = sector.name?.toLowerCase() || ''
        const slug = sector.slug?.toLowerCase() || ''
        if (name.includes('legal') || slug.includes('legal')) return '/images/visuals/sector-legal.png'
        if (name.includes('inmobil') || name.includes('real estate') || slug.includes('estate')) return '/images/visuals/sector-real-estate.png'
        if (name.includes('finan') || name.includes('banc') || slug.includes('finan')) return '/images/visuals/sector-finance.png'
        return sector.image || '/logo-ias.png'
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
            <section className="py-8 lg:py-8 bg-gray-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-12 px-4">
                        <PageBadge text="Nuestras Soluciones" icon={<Target size={14} className="text-blue-500" />} />
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#000000] mb-4 tracking-tight">
                            Soluciones Destacadas
                        </h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Ecosistemas de Inteligencia Artificial diseñados para resolver los retos específicos de tu industria
                        </p>
                    </div>

                    {initialSectors.length === 0 ? (
                        <div className="text-center text-gray-500 bg-white py-8 rounded-3xl border border-gray-100">Pronto publicaremos nuestras soluciones especializadas.</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {initialSectors.map((sector) => (
                                <Link
                                    key={sector.id}
                                    href={`/soluciones/${sector.slug}`}
                                    className="group flex flex-col h-[400px] md:h-[420px] rounded-[2rem] overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-200 bg-white relative"
                                >
                                    <div className="h-[55%] w-full relative overflow-hidden bg-gray-100">
                                        <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                        <img
                                            src={getSectorImage(sector)}
                                            alt={`Soluciones IA para ${sector.name}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-4 left-4 md:top-5 md:left-5 z-20">
                                            <span className="px-3 py-1.5 md:px-4 md:py-2 bg-white/95 backdrop-blur-md text-xs md:text-sm font-semibold rounded-xl shadow-sm text-black border border-white/20">
                                                {sector.name}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="h-[45%] p-5 md:p-6 lg:p-8 flex flex-col justify-between bg-white relative z-20">
                                        <div>
                                            <p className="text-gray-600 line-clamp-3 leading-relaxed text-[14px] md:text-[15px]">
                                                {sector.description || `Descubre cómo la IA automatiza tus operaciones y mejora las métricas del sector ${sector.name}.`}
                                            </p>
                                        </div>
                                        <div className="flex items-center text-[14px] md:text-[15px] font-semibold text-blue-600 group-hover:text-black transition-colors">
                                            Descubrir Soluciones
                                            <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}

                    <div className="mt-12 text-center">
                        <Link
                            href="/soluciones"
                            className="inline-flex items-center px-8 py-3 bg-white text-black font-bold rounded-2xl border border-gray-200 hover:border-blue-500 hover:text-blue-600 transition-all shadow-sm hover:shadow-md group"
                        >
                            Ver Todas las Soluciones
                            <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            <PodcastHomeSection />
            <LatestNewsSection />

            <section className="py-8 lg:py-8 bg-white">
                <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        <PageBadge text="Próximos Pasos" icon={<Sparkles size={14} className="text-blue-500" />} />
                        <h2 className="text-3xl md:text-4xl font-semibold text-[#000000] mb-4 tracking-tight">
                            ¿Listo para escalar?
                        </h2>
                        <p className="text-base text-gray-600 mb-2 max-w-2xl mx-auto leading-relaxed">
                            Únete a las empresas que ya están utilizando nuestros agentes de IA para reducir costes y multiplicar ingresos.
                        </p>
                        <ClientCarousel />
                    </motion.div>
                </div>
            </section>

            <LeadCaptureSection />
        </div>
    )
}
