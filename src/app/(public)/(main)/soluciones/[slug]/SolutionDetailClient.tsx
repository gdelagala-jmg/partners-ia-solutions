'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, Sparkles, Zap, Shield, Target, ChevronRight, ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

import LeadForm from '@/components/forms/LeadForm'

export default function SolutionDetailClient({ solution }: { solution: any }) {
    const [currentImageIdx, setCurrentImageIdx] = useState(0)

    const images = solution.gallery?.length > 0 
        ? solution.gallery 
        : solution.multimedia 
            ? [{ url: solution.multimedia, alt: solution.title }] 
            : [{ url: '/images/visuals/placeholder.jpg', alt: 'Placeholder' }]

    const nextImage = () => setCurrentImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))
    const prevImage = () => setCurrentImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30">
            {/* DYNAMIC BACKGROUND */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
                <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-purple-600/5 blur-[100px] rounded-full" />
            </div>

            {/* HERO SECTION */}
            <div className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
                <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link href="/soluciones" className="group inline-flex items-center text-sm font-medium text-gray-400 hover:text-blue-400 mb-10 transition-all">
                            <div className="p-2 rounded-full bg-white/5 border border-white/10 mr-3 group-hover:bg-blue-500/20 group-hover:border-blue-500/30 transition-all">
                                <ArrowLeft size={16} />
                            </div>
                            Volver al catálogo de IA
                        </Link>
                    </motion.div>
                    
                    <div className="flex flex-col items-center text-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            <Sparkles size={12} />
                            Solución Inteligente
                        </motion.div>
                        
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-4xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-8"
                        >
                            {solution.title}
                        </motion.h1>
                        
                        {solution.description && (
                            <motion.p 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light"
                            >
                                {solution.description}
                            </motion.p>
                        )}
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-32">
                {/* GLASS CONTAINER */}
                <motion.div 
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative group"
                >
                    {/* Background glow for the card */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-[2.5rem] blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
                    
                    <div className="relative bg-white/[0.03] backdrop-blur-3xl border border-white/10 rounded-[2.5rem] overflow-hidden">
                        {/* GALLERY */}
                        <div className="p-4 md:p-8">
                            <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden bg-white/5 border border-white/10 group/gallery">
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
                                            className="absolute left-6 top-1/2 -translate-y-1/2 p-4 bg-black/40 hover:bg-black/60 text-white rounded-full border border-white/10 backdrop-blur-md opacity-0 group-hover/gallery:opacity-100 transition-all"
                                        >
                                            <ChevronLeft size={24} />
                                        </button>
                                        <button 
                                            onClick={nextImage}
                                            className="absolute right-6 top-1/2 -translate-y-1/2 p-4 bg-black/40 hover:bg-black/60 text-white rounded-full border border-white/10 backdrop-blur-md opacity-0 group-hover/gallery:opacity-100 transition-all"
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
                                            className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentImageIdx ? 'bg-blue-500 w-10' : 'bg-white/20 hover:bg-white/40 w-4'}`}
                                            aria-label={`Ir a imagen ${idx + 1}`}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* DETAILS SECTION */}
                        <div className="px-6 md:px-16 py-12 md:py-20 border-t border-white/5">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24">
                                <div className="space-y-12">
                                    {solution.functionalDescription && (
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                        >
                                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                                    <Zap size={20} />
                                                </div>
                                                Ingeniería de Valor
                                            </h3>
                                            <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap font-light">
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
                                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400 border border-purple-500/20">
                                                    <Target size={20} />
                                                </div>
                                                Desafíos Resueltos
                                            </h3>
                                            <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap font-light">
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
                                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                    <Shield size={20} />
                                                </div>
                                                Capacidades Core
                                            </h3>
                                            <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap font-light">
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
                                            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                                    <Sparkles size={20} />
                                                </div>
                                                Inmersión Técnica
                                            </h3>
                                            <p className="text-gray-400 leading-relaxed text-lg whitespace-pre-wrap font-light">
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
                                        className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-white transition-all rounded-2xl overflow-hidden"
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 group-hover:scale-105 transition-transform duration-500" />
                                        <span className="relative flex items-center gap-2">
                                            Iniciar Despliegue <ArrowLeft size={20} className="rotate-180" />
                                        </span>
                                    </a>
                                </motion.div>
                            )}
                        </div>

                        {/* PREMIUM DEMO SECTION */}
                        <div id="demo-section" className="relative px-6 md:px-16 py-16 md:py-24 bg-gradient-to-b from-transparent to-white/[0.02] border-t border-white/5">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                                <div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
                                        <Zap size={12} />
                                        Prueba de Concepto
                                    </div>
                                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-[1.1]">
                                        Visualiza el futuro de tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">operativa</span>
                                    </h2>
                                    <p className="text-gray-400 text-xl mb-10 font-light leading-relaxed">
                                        No te conformes con la teoría. Agenda una sesión técnica estratégica para ver <span className="text-white font-medium">{solution.title}</span> resolviendo casos de uso reales de tu sector.
                                    </p>
                                    
                                    <div className="space-y-6">
                                        {[
                                            'Sesión estratégica 1:1 con ingenieros de IA',
                                            'Análisis de integración con tu stack actual',
                                            'Estimación de ROI y tiempos de despliegue'
                                        ].map((item, i) => (
                                            <motion.div 
                                                key={i}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: i * 0.1 }}
                                                className="flex items-center gap-4 text-gray-300"
                                            >
                                                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-400 group-hover:scale-110 transition-transform">
                                                    <CheckCircle2 size={18} />
                                                </div>
                                                <span className="text-lg font-light italic">{item}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                                
                                <div className="relative">
                                    {/* Decoration for the form */}
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/30 to-purple-500/30 rounded-3xl blur opacity-20" />
                                    
                                    <div className="relative bg-[#0A0A0A] p-5 sm:p-8 md:p-10 rounded-3xl border border-white/10 shadow-2xl">
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
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
