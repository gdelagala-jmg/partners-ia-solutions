'use client'

import { useEffect, useState } from 'react'
import { Bot, Zap, ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import SectorDashboard from '@/components/sections/SectorDashboard'
import SolutionsFilter from '@/components/sections/SolutionsFilter'
import { getSolutionImage } from '@/lib/utils/images'

interface Solution {
    id: string
    title: string
    description: string
    type: string
    multimedia: string | null
    ctaUrl: string | null
    slug: string
    sectors?: { id: string, name: string }[]
}

export default function SolutionsPage() {
    const [solutions, setSolutions] = useState<Solution[]>([])
    const [loading, setLoading] = useState(true)
    const [selectedSector, setSelectedSector] = useState<string | null>(null)

    useEffect(() => {
        const fetchSolutions = async () => {
            setLoading(true)
            try {
                const url = selectedSector
                    ? `/api/solutions?sector=${selectedSector}`
                    : '/api/solutions'

                const res = await fetch(url)
                if (res.ok) {
                    const data = await res.json()
                    setSolutions(data)
                }
            } catch (error) {
                console.error('Error fetching solutions:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchSolutions()
    }, [selectedSector])


    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="py-10 lg:py-14 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 tracking-tight">
                            Nuestras <span className="text-blue-500">Soluciones</span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Explora nuestro catálogo de agentes inteligentes y proyectos experimentales del LAB IA.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Sector Dashboard */}
            <SectorDashboard />

            {/* Solutions Grid */}
            <section className="py-10 lg:py-14 border-t border-gray-100">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">

                    <SolutionsFilter
                        selectedSector={selectedSector}
                        onSelectSector={setSelectedSector}
                    />

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-80 bg-gray-50 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : solutions.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-200 border-dashed">
                            <Bot size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Sin resultados</h3>
                            <p className="text-gray-600 mb-5 text-sm">No hay soluciones disponibles para esta selección.</p>
                            <button
                                onClick={() => setSelectedSector(null)}
                                className="text-blue-500 hover:text-blue-600 font-medium text-sm"
                            >
                                Ver todas las soluciones
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence mode="popLayout">
                                {solutions.map((solution, idx) => (
                                    <motion.div
                                        key={solution.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.3 }}
                                        className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all flex flex-col h-full"
                                    >
                                        {/* Image */}
                                        <div className="h-48 bg-gray-100 relative overflow-hidden">
                                            <img
                                                src={getSolutionImage(solution)}
                                                alt={solution.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3 z-10">
                                                <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold uppercase tracking-wider backdrop-blur-md ${solution.type === 'SOLUTION'
                                                    ? 'bg-black/80 text-white'
                                                    : 'bg-blue-500/90 text-white'
                                                    }`}>
                                                    {solution.type === 'SOLUTION' ? 'Pro' : 'Lab'}
                                                </span>
                                            </div>

                                            {/* Sector Tags Overlay */}
                                            {solution.sectors && solution.sectors.length > 0 && (
                                                <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black/60 to-transparent pt-8 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                    <div className="flex flex-wrap gap-1">
                                                        {solution.sectors.slice(0, 3).map(sec => (
                                                            <span key={sec.id} className="text-[10px] bg-white/20 backdrop-blur-sm text-white px-2 py-0.5 rounded-full border border-white/10">
                                                                {sec.name}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="p-5 lg:p-6 flex-1 flex flex-col">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors">
                                                {solution.title}
                                            </h3>
                                            <p className="text-gray-600 mb-5 flex-1 leading-relaxed text-balance text-sm">
                                                {solution.description}
                                            </p>

                                            <Link
                                                href={solution.ctaUrl || `/contacto?subject=${solution.slug}`}
                                                className="inline-flex items-center justify-between w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 hover:bg-black hover:text-white hover:border-black transition-all font-medium text-sm"
                                            >
                                                <span>Más información</span>
                                                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                            </Link>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
