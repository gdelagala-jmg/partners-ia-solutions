'use client'

import { motion } from 'framer-motion'
import { Cpu, ArrowRight, ArrowUpRight, Beaker, Box } from 'lucide-react'
import { isFinalSolution, isLabSolution } from '@/lib/utils'
import Link from 'next/link'
import PageBadge from '@/components/ui/PageBadge'

interface Sector {
    id: string
    name: string
    slug: string
    image: string
    description?: string
}

interface Solution {
    id: string
    title: string
    slug: string
    description?: string | null
    type: string
    image?: string
}

interface SolutionsClientProps {
    sectors: Sector[]
    solutions?: Solution[]
}

const FinalSolutionCard = ({ solution }: { solution: Solution }) => (
    <Link
        href={`/soluciones/${solution.slug}`}
        className="group flex flex-col md:flex-row bg-white rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-500 border border-gray-200"
    >
        <div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden bg-gray-100 shrink-0">
            <div className="absolute inset-0 bg-blue-900/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <img
                src={solution.image || '/images/placeholder.jpg'}
                alt={solution.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 z-20">
                <span className="px-2.5 py-1 bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm border border-blue-500">
                    Solución Comercial
                </span>
            </div>
        </div>
        
        <div className="p-6 md:p-8 flex flex-col justify-between flex-1 bg-white">
            <div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-3">
                    {solution.title}
                </h3>
                {solution.description && (
                    <p className="text-base text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                        {solution.description}
                    </p>
                )}
            </div>
            <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:text-black transition-colors">
                Ver solución
                <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </Link>
)

const LabPrototypeCard = ({ solution }: { solution: Solution }) => (
    <Link
        href={`/soluciones/${solution.slug}`}
        className="group flex flex-col rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-cyan-900/20 transition-all duration-500 border border-slate-700/50 bg-slate-800/40 backdrop-blur-sm"
    >
        <div className="h-44 w-full relative overflow-hidden bg-slate-800">
            <div className="absolute inset-0 bg-cyan-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <img
                src={solution.image || '/images/placeholder.jpg'}
                alt={solution.title}
                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105 mix-blend-luminosity group-hover:mix-blend-normal"
            />
            <div className="absolute top-3 left-3 z-20">
                <span className="px-2.5 py-1 bg-slate-900/90 backdrop-blur-md text-cyan-400 text-xs font-mono font-semibold rounded-xl shadow-sm border border-cyan-500/30">
                    LAB / Experimental
                </span>
            </div>
        </div>
        
        <div className="p-5 flex flex-col flex-1 justify-between">
            <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-2 font-mono">
                    {solution.title}
                </h3>
                {solution.description && (
                    <p className="text-sm text-slate-400 mb-4 line-clamp-3 leading-relaxed">
                        {solution.description}
                    </p>
                )}
            </div>
            <div className="flex items-center text-sm font-semibold text-cyan-500 group-hover:text-cyan-300 transition-colors">
                Explorar prototipo
                <ArrowRight size={16} className="ml-1.5 transform group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </Link>
)

export default function SolutionsClient({ sectors, solutions = [] }: SolutionsClientProps) {
    
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

    const finalSolutions = solutions.filter(s => isFinalSolution(s.type))
    const labPrototypes = solutions.filter(s => isLabSolution(s.type))

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
            <section className="py-16 lg:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="mb-10 text-center md:text-left">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">Explorar por Industria</h2>
                        <p className="text-gray-600 mt-2 text-base max-w-2xl">
                            Selecciona tu sector para ver casos de uso y soluciones adaptadas a tu modelo de negocio.
                        </p>
                    </div>
                    {sectors.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-2xl border border-gray-100">
                            <Box size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900">Catalogo en preparación</h3>
                            <p className="text-gray-500 mt-2">Pronto publicaremos nuestras soluciones especializadas.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {sectors.map((sector) => (
                                <Link
                                    key={sector.id}
                                    href={`/soluciones/${sector.slug}`}
                                    className="group flex flex-col rounded-2xl overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-500 border border-gray-200 bg-white"
                                >
                                    {/* Image Section */}
                                    <div className="h-44 w-full relative overflow-hidden bg-gray-100">
                                        <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                        <img
                                            src={getSectorImage(sector)}
                                            alt={`Soluciones IA para ${sector.name}`}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 left-3 z-20">
                                            <span className="px-2.5 py-1 bg-white/95 backdrop-blur-md text-xs font-semibold rounded-xl shadow-sm text-black border border-white/20">
                                                {sector.name}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Content Section */}
                                    <div className="p-5 flex flex-col flex-1 justify-between bg-white">
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                                {sector.name}
                                            </h3>
                                            {sector.description && (
                                                <p className="text-sm text-gray-600 mb-4 line-clamp-3 leading-relaxed">
                                                    {sector.description}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:text-black transition-colors">
                                            Descubrir Soluciones 
                                            <ArrowRight size={16} className="ml-1.5 transform group-hover:translate-x-1 transition-transform" />
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Final Solutions */}
            {finalSolutions.length > 0 && (
                <section className="py-16 lg:py-24 bg-slate-50 border-t border-gray-100">
                    <div className="max-w-5xl mx-auto px-6 lg:px-8">
                        <div className="mb-10 text-center md:text-left">
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight">Soluciones Finales</h2>
                            <p className="text-gray-600 mt-3 text-lg max-w-2xl">
                                Productos de Inteligencia Artificial estables y listos para implementarse en entornos comerciales reales.
                            </p>
                        </div>
                        <div className="flex flex-col gap-6">
                            {finalSolutions.map(sol => (
                                <FinalSolutionCard key={sol.id} solution={sol} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Lab Prototypes */}
            {labPrototypes.length > 0 && (
                <section className="py-16 lg:py-24 bg-slate-900 border-t border-slate-800">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <div className="mb-12 text-center md:text-left">
                            <div className="inline-block px-3 py-1 mb-4 bg-cyan-900/30 text-cyan-400 text-sm font-mono rounded-full border border-cyan-500/20">
                                INNOVATION LAB
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Prototipos y Demos</h2>
                            <p className="text-slate-400 mt-3 text-lg max-w-2xl">
                                Explora nuestras investigaciones, validaciones técnicas y prototipos experimentales antes de su fase comercial.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {labPrototypes.map(sol => (
                                <LabPrototypeCard key={sol.id} solution={sol} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

        </div>
    )
}
