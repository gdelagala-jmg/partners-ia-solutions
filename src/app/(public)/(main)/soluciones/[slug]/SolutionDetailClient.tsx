'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Sparkles, Zap, Shield, Target, ChevronRight, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import LeadForm from '@/components/forms/LeadForm'
import SectionBlock from '@/components/ui/layout/SectionBlock'
import SectionHeader from '@/components/ui/layout/SectionHeader'

export default function SolutionDetailClient({ solution }: { solution: any }) {
    const [currentImageIdx, setCurrentImageIdx] = useState(0)

    const images = solution.gallery?.length > 0 
        ? solution.gallery 
        : solution.multimedia 
            ? [{ url: solution.multimedia, alt: solution.title }] 
            : [{ url: '/images/placeholder.jpg', alt: 'Placeholder' }]

    const nextImage = () => setCurrentImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))
    const prevImage = () => setCurrentImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))

    return (
        <div className="min-h-screen bg-white text-solutions-text-primary selection:bg-blue-500/10 font-sans">
            {/* Ultra-soft background accents */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-50/40 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-50/40 rounded-full blur-[140px]" />
            </div>

            {/* HERO SECTION */}
            <div className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
                <div className="max-w-6xl mx-auto px-5 md:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link href="/soluciones" className="group inline-flex items-center text-sm font-medium text-solutions-text-secondary hover:text-blue-600 mb-10 transition-all">
                            <div className="p-2 rounded-full bg-white border border-solutions-border mr-3 group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all shadow-sm">
                                <ArrowLeft size={16} />
                            </div>
                            Volver al catálogo de IA
                        </Link>
                    </motion.div>
                    
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            <Sparkles size={12} />
                            Solución Inteligente
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black text-solutions-text-primary tracking-tight leading-[1.05] mb-8"
                        >
                            {solution.title}
                        </motion.h1>
                        
                        {solution.description && (
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl md:text-2xl text-solutions-text-secondary max-w-3xl mx-auto leading-relaxed font-light"
                            >
                                {solution.description}
                            </motion.p>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-5 md:px-6 lg:px-8">
                {/* CONTAINER */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative group"
                >
                    <div className="relative bg-white border border-solutions-border rounded-[2.5rem] overflow-hidden shadow-2xl">
                        {/* GALLERY */}
                        <div className="p-4 md:p-8">
                            <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden bg-gray-50 border border-solutions-border group/gallery">
                                <motion.img 
                                    key={currentImageIdx}
                                    initial={{ opacity: 0, scale: 1.05 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.7 }}
                                    src={images[currentImageIdx].url} 
                                    alt={images[currentImageIdx].alt || solution.title} 
                                    className="w-full h-full object-cover"
                                />
                                
                                {images.length > 1 && (
                                    <>
                                        <button 
                                            onClick={prevImage}
                                            className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-white/80 hover:bg-white text-solutions-text-primary rounded-full border border-solutions-border backdrop-blur-md opacity-0 group-hover/gallery:opacity-100 transition-all shadow-lg"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button 
                                            onClick={nextImage}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-white/80 hover:bg-white text-solutions-text-primary rounded-full border border-solutions-border backdrop-blur-md opacity-0 group-hover/gallery:opacity-100 transition-all shadow-lg"
                                        >
                                            <ChevronRight size={24} />
                                        </button>
                                    </>
                                )}
                                
                                <div className="absolute bottom-6 inset-x-0 flex justify-center gap-2">
                                    {images.map((_: any, idx: number) => (
                                        <button 
                                            key={idx}
                                            onClick={() => setCurrentImageIdx(idx)}
                                            className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentImageIdx ? 'bg-blue-600 w-10' : 'bg-black/20 hover:bg-black/40 w-4'}`}
                                            aria-label={`Ir a imagen ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* DETAILS SECTION */}
                        <div className="px-6 md:px-10 py-12 md:py-20 border-t border-solutions-border">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
                                <div className="space-y-12">
                                    {solution.functionalDescription && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                        >
                                            <h3 className="text-2xl font-bold text-solutions-text-primary mb-6 flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100">
                                                    <Zap size={20} />
                                                </div>
                                                Ingeniería de Valor
                                            </h3>
                                            <p className="text-solutions-text-secondary leading-relaxed text-lg whitespace-pre-wrap font-light">
                                                {solution.functionalDescription}
                                            </p>
                                        </motion.div>
                                    )}
                                    
                                    {solution.problemsSolved && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <h3 className="text-2xl font-bold text-solutions-text-primary mb-6 flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
                                                    <Target size={20} />
                                                </div>
                                                Desafíos Resueltos
                                            </h3>
                                            <p className="text-solutions-text-secondary leading-relaxed text-lg whitespace-pre-wrap font-light">
                                                {solution.problemsSolved}
                                            </p>
                                        </motion.div>
                                    )}
                                </div>

                                <div className="space-y-12">
                                    {solution.capabilities && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                        >
                                            <h3 className="text-2xl font-bold text-solutions-text-primary mb-6 flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
                                                    <Shield size={20} />
                                                </div>
                                                Capacidades Core
                                            </h3>
                                            <p className="text-solutions-text-secondary leading-relaxed text-lg whitespace-pre-wrap font-light">
                                                {solution.capabilities}
                                            </p>
                                        </motion.div>
                                    )}
                                    
                                    {solution.longDescription && (
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.1 }}
                                        >
                                            <h3 className="text-2xl font-bold text-solutions-text-primary mb-6 flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-amber-50 text-amber-600 border border-amber-100">
                                                    <Sparkles size={20} />
                                                </div>
                                                Inmersión Técnica
                                            </h3>
                                            <p className="text-solutions-text-secondary leading-relaxed text-lg whitespace-pre-wrap font-light">
                                                {solution.longDescription}
                                            </p>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                            
                            {solution.ctaUrl && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="mt-20 text-center"
                                >
                                    <a 
                                        href={solution.ctaUrl} 
                                        target="_blank" 
                                        rel="noopener noreferrer" 
                                        className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white transition-all rounded-2xl overflow-hidden shadow-xl"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:scale-105 transition-transform duration-500" />
                                        <span className="relative flex items-center gap-2">
                                            Iniciar Despliegue <ArrowLeft size={20} className="rotate-180" />
                                        </span>
                                    </a>
                                </motion.div>
                            )}
                        </div>

                        {/* PREMIUM DEMO SECTION - REPLICATING HOJA DE RUTA STRUCTURE */}
                        <SectionBlock id="demo-section" spacing="standard" containerWidth="narrow" className="bg-solutions-bg-commercial border-t border-solutions-border">
                                <SectionHeader 
                                    badgeText="Prueba de Concepto"
                                    badgeIcon={<Zap size={12} />}
                                    title={<>Visualiza el futuro de tu <br className="hidden md:block" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">operativa inteligente</span></>}
                                    subtitle={<>No te conformes con la teoría. Agenda una sesión técnica estratégica para ver <span className="text-solutions-text-primary font-medium">{solution.title}</span> resolviendo casos de uso reales de tu sector.</>}
                                />
                                <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm text-solutions-text-secondary mb-10 md:mb-16 -mt-4">
                                    {[
                                        'Sesión estratégica 1:1',
                                        'Análisis de integración',
                                        'Estimación de ROI'
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2">
                                            <CheckCircle2 size={16} className="text-blue-600" />
                                            <span className="italic">{item}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <motion.div 
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    className="relative"
                                >
                                    <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 rounded-[3rem] blur-2xl opacity-50" />
                                    <div className="relative md:bg-white md:border md:border-solutions-border md:rounded-[2.5rem] p-0 sm:p-4 md:p-16 md:shadow-2xl overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10 hidden md:block" />
                                        <LeadForm 
                                            layout="inline"
                                            variant="premium"
                                            source="DEMO_REQUEST"
                                            context={{
                                                solutionSlug: solution.slug,
                                                solutionTitle: solution.title,
                                                solutionType: solution.type,
                                                sourcePage: "Solution Detail"
                                            }}
                                        />
                                    </div>
                                </motion.div>
                        </SectionBlock>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
