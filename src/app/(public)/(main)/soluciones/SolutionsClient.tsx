'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Box, Cpu } from 'lucide-react'
import Link from 'next/link'
import PageBadge from '@/components/ui/PageBadge'

interface Sector {
    id: string
    name: string
    slug: string
    image: string
    description?: string
}

interface SolutionsClientProps {
    sectors: Sector[]
}

export default function SolutionsClient({ sectors }: SolutionsClientProps) {
    
    const getSectorImage = (sector: Sector) => {
        if (sector.image && sector.image !== '/logo-ias.png' && !sector.image.includes('placeholder')) {
            return sector.image
        }

        const name = sector.name.toLowerCase()
        const slug = sector.slug.toLowerCase()

        if (name.includes('legal') || slug.includes('legal')) return '/images/visuals/sector-legal.png'
        if (name.includes('inmobil') || name.includes('real estate') || slug.includes('estate')) return '/images/visuals/sector-real-estate.png'
        if (name.includes('finan') || name.includes('banc') || slug.includes('finan')) return '/images/visuals/sector-finance.png'

        return sector.image || '/logo-ias.png'
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="py-8 lg:py-8 bg-gray-50 border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-5 md:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <PageBadge text="Ecosistemas de IA a Medida" icon={<Cpu size={14} className="text-blue-500" />} />
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 tracking-tight leading-tight">
                            Soluciones de IA por <br className="hidden md:block"/> <span className="text-blue-600">Sector</span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
                            Descubre cómo nuestros agentes inteligentes diseñados a medida están transformando la productividad y la estrategia en tu sector específico.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Sectors Grid as Solutions */}
            <section className="py-8 lg:py-8 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {sectors.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-3xl border border-gray-100">
                            <Box size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900">Catalogo en preparación</h3>
                            <p className="text-gray-500 mt-2">Pronto publicaremos nuestras soluciones especializadas.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                            {sectors.map((sector) => (
                                <Link
                                    key={sector.id}
                                    href={`/soluciones/${sector.slug}`}
                                    className="group flex flex-col h-[400px] rounded-3xl overflow-hidden cursor-pointer shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 bg-white relative"
                                >
                                    {/* Image Section */}
                                    <div className="h-3/5 w-full relative overflow-hidden bg-gray-100">
                                        <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                        <img
                                            src={getSectorImage(sector)}
                                            alt={`Soluciones IA para ${sector.name}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </div>
                                    
                                    {/* Content Section */}
                                    <div className="h-2/5 p-6 flex flex-col justify-between bg-white relative z-20">
                                        <div>
                                            <h3 className="text-xl md:text-2xl font-bold tracking-tight text-gray-900 group-hover:text-blue-600 transition-colors">
                                                {sector.name}
                                            </h3>
                                            {sector.description && (
                                                <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                                                    {sector.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors mt-4">
                                            Ver soluciones del sector 
                                            <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
