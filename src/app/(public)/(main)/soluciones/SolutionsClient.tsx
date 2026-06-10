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
        className="group flex flex-col md:flex-row bg-white rounded-3xl overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-700 border border-solutions-border hover:border-blue-500/20"
    >
        <div className="w-full md:w-2/5 h-64 md:h-auto relative overflow-hidden bg-gray-50 shrink-0">
            <img
                src={solution.image || '/images/placeholder.jpg'}
                alt={solution.title}
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
            />
            <div className="absolute top-4 left-4 z-20">
                <span className="px-3 py-1.5 bg-blue-600 text-white text-[9px] uppercase tracking-[0.2em] font-black rounded-full shadow-lg">
                    PRO SOLUTION
                </span>
            </div>
        </div>
        
        <div className="p-6 md:p-10 flex flex-col justify-between flex-1">
            <div>
                <h3 className="text-xl md:text-3xl font-bold text-solutions-text-primary group-hover:text-blue-600 transition-colors mb-4 tracking-tight">
                    {solution.title}
                </h3>
                {solution.description && (
                    <p className="text-base text-solutions-text-secondary mb-8 line-clamp-3 leading-relaxed font-light">
                        {solution.description}
                    </p>
                )}
            </div>
            <div className="flex items-center text-sm font-semibold text-blue-600 group-hover:text-blue-700 transition-colors">
                Explorar Solución
                <ArrowRight size={18} className="ml-2 transform group-hover:translate-x-1 transition-transform" />
            </div>
        </div>
    </Link>
)

const LabPrototypeCard = ({ solution }: { solution: Solution }) => (
    <Link
        href={`/soluciones/${solution.slug}`}
        className="group flex flex-col rounded-[2.5rem] overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-cyan-500/5 transition-all duration-700 border border-solutions-border bg-white hover:border-cyan-500/20"
    >
        <div className="h-56 w-full relative overflow-hidden bg-gray-50">
            <img
                src={solution.image || '/images/placeholder.jpg'}
                alt={solution.title}
                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
            />
            <div className="absolute top-5 left-5 z-20">
                <span className="px-3 py-1.5 bg-black text-cyan-400 text-[9px] font-mono font-black rounded-full tracking-[0.2em]">
                    LAB PROTOTYPE
                </span>
            </div>
        </div>
        
        <div className="p-8 flex flex-col flex-1 justify-between">
            <div>
                <h3 className="text-xl font-bold text-solutions-text-primary group-hover:text-cyan-600 transition-colors mb-4 tracking-tight">
                    {solution.title}
                </h3>
                {solution.description && (
                    <p className="text-sm text-solutions-text-secondary mb-8 line-clamp-3 leading-relaxed font-light">
                        {solution.description}
                    </p>
                )}
            </div>
            <div className="flex items-center text-[10px] font-black text-cyan-600 group-hover:text-cyan-700 transition-colors uppercase tracking-[0.3em]">
                Deploy Research
                <ArrowUpRight size={14} className="ml-2 transform group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
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
        <div className="min-h-screen bg-white text-solutions-text-primary selection:bg-blue-500/10 relative overflow-hidden font-sans">
            {/* Ultra-soft background accents */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-5%] right-[-5%] w-[40%] h-[40%] bg-blue-50/40 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-indigo-50/40 rounded-full blur-[140px]" />
            </div>

            {/* Hero Section */}
            <section className="relative pt-10 pb-6 md:pt-6 md:pb-8 overflow-hidden border-b border-solutions-border">
                <div className="max-w-4xl mx-auto px-5 md:px-6 lg:px-8 text-center relative z-10 pt-6 md:pt-5">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <PageBadge text="Next-Gen AI Ecosystems" icon={<Cpu size={14} className="text-blue-600" />} className="mb-6" />
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-solutions-text-primary mb-6 tracking-tight leading-tight">
                            Soluciones de <br className="hidden md:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">IA por Sector</span>
                        </h1>
                        <p className="text-lg md:text-xl text-solutions-text-secondary max-w-2xl mx-auto leading-relaxed font-light">
                            Agentes inteligentes y automatización de vanguardia diseñados para redefinir la eficiencia y la estrategia en tu industria.
                        </p>
                    </motion.div>
                </div>
                
                {/* Decorative background grid */}
                <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #111827 1px, transparent 0)', backgroundSize: '40px 40px' }} 
                />
            </section>

            {/* Sectors Grid */}
            <section id="sectores" className="pt-6 pb-8 md:pt-8 md:pb-10 relative bg-solutions-bg-main scroll-mt-24">
                <div className="max-w-7xl mx-auto px-5 md:px-6 lg:px-8">
                    <div className="mb-16 text-center lg:text-left flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-3xl md:text-5xl font-bold text-solutions-text-primary tracking-tight mb-4">Explorar por Industria</h2>
                            <p className="text-solutions-text-secondary text-lg font-light">
                                Selecciona tu sector para descubrir implementaciones de IA adaptadas a tus desafíos operativos únicos.
                            </p>
                        </div>
                        <div className="flex items-center gap-4 text-solutions-muted text-sm font-mono uppercase tracking-widest pb-2">
                            <span className="w-12 h-[1px] bg-solutions-border" />
                            Industrias Activas
                        </div>
                    </div>

                    {sectors.length === 0 ? (
                        <div className="text-center py-20 bg-solutions-bg-commercial rounded-[3rem] border border-solutions-border">
                            <Box size={64} className="mx-auto text-solutions-muted mb-6 stroke-1" />
                            <h3 className="text-2xl font-bold text-solutions-text-primary">Catálogo en preparación</h3>
                            <p className="text-solutions-text-secondary mt-2 font-light">Pronto publicaremos nuestras soluciones especializadas por industria.</p>
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
                                        className="group flex flex-col rounded-[2.5rem] overflow-hidden cursor-pointer hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 border border-solutions-border bg-white hover:bg-white hover:border-blue-500/30"
                                    >
                                        <div className="h-56 w-full relative overflow-hidden bg-gray-50">
                                            <div className="absolute inset-0 bg-blue-900/5 group-hover:bg-transparent transition-colors duration-500 z-10" />
                                            <img
                                                src={getSectorImage(sector)}
                                                alt={sector.name}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            <div className="absolute top-6 left-6 z-20">
                                                <div className="px-4 py-1.5 bg-black/80 text-[11px] font-bold uppercase tracking-[0.2em] rounded-full text-white">
                                                    {sector.name}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        <div className="p-8 flex flex-col flex-1 justify-between">
                                            <div>
                                                <h3 className="text-2xl font-bold text-solutions-text-primary group-hover:text-blue-600 transition-colors mb-4 tracking-tight">
                                                    {sector.name}
                                                </h3>
                                                {sector.description && (
                                                    <p className="text-sm text-solutions-text-secondary mb-8 line-clamp-3 leading-relaxed font-light">
                                                        {sector.description}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="flex items-center text-sm font-bold text-blue-600 group-hover:text-blue-700 transition-colors uppercase tracking-widest">
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
                <section id="soluciones_finales" className="py-10 md:py-12 bg-solutions-bg-commercial border-y border-solutions-border relative scroll-mt-24">
                    <div className="absolute inset-0 bg-blue-50/30 pointer-events-none" />
                    <div className="max-w-5xl mx-auto px-5 md:px-6 lg:px-8 relative z-10">
                        <div className="mb-16 text-center">
                            <h2 className="text-4xl md:text-6xl font-bold text-solutions-text-primary tracking-tight mb-6">Soluciones Finales</h2>
                            <p className="text-solutions-text-secondary text-xl font-light max-w-2xl mx-auto leading-relaxed">
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
                <section id="labs" className="py-8 md:py-10 relative bg-solutions-bg-main scroll-mt-24">
                    <div className="max-w-7xl mx-auto px-5 md:px-6 lg:px-8">
                        <div className="mb-16 text-center lg:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-6 bg-cyan-50 text-cyan-700 text-[10px] font-mono font-bold tracking-[0.3em] rounded-full border border-cyan-100">
                                <Beaker size={14} />
                                INNOVATION LAB
                            </div>
                            <h2 className="text-4xl md:text-5xl font-bold text-solutions-text-primary tracking-tight mb-4">Prototipos y Demos</h2>
                            <p className="text-solutions-text-secondary text-lg font-light max-w-2xl leading-relaxed">
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
            <section className="py-8 md:py-10">
                <div className="max-w-7xl mx-auto px-5 md:px-6 lg:px-8">
                    <div className="bg-gray-50 rounded-[3rem] p-8 md:p-12 text-center relative overflow-hidden border border-gray-100">
                        {/* Decorative background elements for CTA */}
                        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" 
                             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '30px 30px' }} 
                        />
                        
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-8 tracking-tight">
                                ¿No encuentras la solución <br/> exacta para tu problema?
                            </h2>
                            <p className="text-gray-600 text-lg mb-12 font-light leading-relaxed">
                                Somos expertos en diseñar ecosistemas de IA a medida. Cuéntanos tu desafío y construiremos la herramienta perfecta para tu negocio.
                            </p>
                            <Link 
                                href="/contacto" 
                                className="inline-flex items-center px-10 py-5 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all duration-300 hover:scale-105 shadow-xl"
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

