'use client'

import { motion } from 'framer-motion'
import { Cpu, ArrowRight, ArrowUpRight, Beaker, Box, Layers, Globe, Zap, ShieldCheck } from 'lucide-react'
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
        className="group flex flex-col md:flex-row bg-white/[0.03] backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer hover:bg-white/[0.06] transition-all duration-500 border border-white/10 hover:border-blue-500/30 shadow-2xl"
    >
        <div className="w-full md:w-1/3 h-48 md:h-auto relative overflow-hidden bg-white/5 shrink-0">
            <div className="absolute inset-0 bg-blue-500/10 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <img
                src={solution.image || '/images/placeholder.jpg'}
                alt={solution.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3 z-20">
                <span className="px-2.5 py-1 bg-blue-600/90 backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-bold rounded-lg border border-white/20 shadow-lg">
                    Enterprise Ready
                </span>
            </div>
        </div>
        
        <div className="p-6 md:p-10 flex flex-col justify-between flex-1">
            <div>
                <h3 className="text-xl md:text-3xl font-bold text-white group-hover:text-blue-400 transition-colors mb-4 tracking-tight">
                    {solution.title}
                </h3>
                {solution.description && (
                    <p className="text-base text-gray-400 mb-8 line-clamp-3 leading-relaxed font-light">
                        {solution.description}
                    </p>
                )}
            </div>
            <div className="flex items-center text-sm font-semibold text-blue-400 group-hover:text-white transition-colors">
                Explorar Solución
                <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </Link>
)

const LabPrototypeCard = ({ solution }: { solution: Solution }) => (
    <Link
        href={`/soluciones/${solution.slug}`}
        className="group flex flex-col rounded-[2rem] overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 border border-white/10 bg-white/[0.02] backdrop-blur-md hover:bg-white/[0.05]"
    >
        <div className="h-44 w-full relative overflow-hidden bg-black">
            <div className="absolute inset-0 bg-cyan-500/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
            <img
                src={solution.image || '/images/placeholder.jpg'}
                alt={solution.title}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-all duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
            />
            <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1 bg-black/80 backdrop-blur-md text-cyan-400 text-[10px] font-mono font-bold rounded-full border border-cyan-500/30">
                    LAB PROTOTYPE
                </span>
            </div>
        </div>
        
        <div className="p-6 flex flex-col flex-1 justify-between">
            <div>
                <h3 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors mb-3 tracking-tight">
                    {solution.title}
                </h3>
                {solution.description && (
                    <p className="text-xs text-gray-500 mb-6 line-clamp-3 leading-relaxed font-light">
                        {solution.description}
                    </p>
                )}
            </div>
            <div className="flex items-center text-xs font-bold text-cyan-500/80 group-hover:text-cyan-300 transition-colors uppercase tracking-widest">
                Deploy Demo
                <ArrowUpRight size={14} className="ml-1.5 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
        <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 relative overflow-hidden">
            {/* Mesh Gradients Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/15 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-900/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            </div>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden border-b border-white/5">
                <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <PageBadge text="Next-Gen AI Ecosystems" icon={<Cpu size={14} className="text-blue-500" />} className="mb-6" />
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight leading-tight">
                            Soluciones de <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">IA por Sector</span>
                        </h1>
                        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed font-light">
                            Agentes inteligentes y automatización de vanguardia diseñados para redefinir la eficiencia y la estrategia en tu industria.
                        </p>
                    </motion.div>
                </div>
                
                {/* Decorative background grid */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} 
                />
            </section>

            {/* Sectors Grid */}
            <section className="py-24 relative">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-5xl font-bold text-white tracking-tight mb-4">Explorar por Industria</h2>
                            <p className="text-gray-500 text-lg font-light">
                                Selecciona tu sector para descubrir implementaciones de IA adaptadas a tus desafíos operativos únicos.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-gray-500 text-sm font-mono uppercase tracking-widest pb-2">
                            <span className="w-12 h-[1px] bg-white/20" />
                            Industrias Activas
                        </div>
                    </div>

                    {sectors.length === 0 ? (
                        <div className="text-center py-20 bg-white/[0.02] rounded-[3rem] border border-white/5 backdrop-blur-sm">
                            <Box size={64} className="mx-auto text-gray-700 mb-6 stroke-1" />
                            <h3 className="text-2xl font-bold text-white">Catálogo en preparación</h3>
                            <p className="text-gray-500 mt-2 font-light">Pronto publicaremos nuestras soluciones especializadas por industria.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {sectors.map((sector, i) => (
                                <motion.div
                                    key={sector.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <Link
                                        href={`/soluciones/${sector.slug}`}
                                        className="group flex flex-col rounded-[2.5rem] overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 border border-white/10 bg-white/[0.02] backdrop-blur-xl hover:bg-white/[0.05] hover:border-blue-500/30"
                                    >
                                        <div className="h-56 w-full relative overflow-hidden bg-white/5">
                                            <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                            <img
                                                src={getSectorImage(sector)}
                                                alt={sector.name}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute top-6 left-6 z-20">
                                                <div className="px-4 py-1.5 bg-black/60 backdrop-blur-md text-[11px] font-bold uppercase tracking-[0.2em] rounded-full border border-white/10 text-white">
                                                    {sector.name}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-8 flex flex-col flex-1 justify-between">
                                            <div>
                                                <h3 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mb-4 tracking-tight">
                                                    {sector.name}
                                                </h3>
                                                {sector.description && (
                                                    <p className="text-sm text-gray-500 mb-8 line-clamp-3 leading-relaxed font-light">
                                                        {sector.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center text-sm font-bold text-blue-400 group-hover:text-white transition-colors uppercase tracking-widest">
                                                Ver Ecosistema
                                                <ArrowRight size={16} className="ml-2 transform group-hover:translate-x-2 transition-transform" />
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Final Solutions */}
            {finalSolutions.length > 0 && (
                <section className="py-32 bg-white/[0.01] border-y border-white/5 relative">
                    <div className="absolute inset-0 bg-blue-600/[0.02] pointer-events-none" />
                    <div className="max-w-5xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
                        <div className="mb-16 text-center">
                            <h2 className="text-4xl md:text-6xl font-bold text-white tracking-tight mb-6">Soluciones Finales</h2>
                            <p className="text-gray-500 text-xl font-light max-w-2xl mx-auto leading-relaxed">
                                Productos de IA estables, validados y listos para implementarse en entornos de producción comerciales.
                            </p>
                        </div>
                        <div className="flex flex-col gap-10">
                            {finalSolutions.map(sol => (
                                <FinalSolutionCard key={sol.id} solution={sol} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Lab Prototypes */}
            {labPrototypes.length > 0 && (
                <section className="py-32 relative">
                    <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                        <div className="mb-16 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-cyan-500/10 text-cyan-400 text-[10px] font-mono font-bold tracking-[0.3em] rounded-full border border-cyan-500/20">
                                <Beaker size={14} />
                                INNOVATION LAB
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-4">Prototipos y Demos</h2>
                            <p className="text-gray-500 text-lg font-light max-w-2xl leading-relaxed">
                                Exploramos las fronteras de la IA. Accede a nuestras investigaciones y prototipos experimentales en fase de validación técnica.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {labPrototypes.map(sol => (
                                <LabPrototypeCard key={sol.id} solution={sol} />
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* CTA Final */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
                        {/* Decorative background elements for CTA */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none" 
                             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '30px 30px' }} 
                        />
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-black/20 rounded-full blur-3xl" />
                        
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 tracking-tight">
                                ¿No encuentras la solución <br/> exacta para tu problema?
                            </h2>
                            <p className="text-white/80 text-lg mb-12 font-light leading-relaxed">
                                Somos expertos en diseñar ecosistemas de IA a medida. Cuéntanos tu desafío y construiremos la herramienta perfecta para tu negocio.
                            </p>
                            <Link 
                                href="/contacto" 
                                className="inline-flex items-center px-10 py-5 bg-white text-blue-700 font-bold rounded-2xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
                            >
                                Hablar con un Consultor
                                <ArrowRight className="ml-3" size={20} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    )
}

