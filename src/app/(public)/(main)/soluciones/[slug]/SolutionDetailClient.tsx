'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function SolutionDetailClient({ solution }: { solution: any }) {
    const [currentImageIdx, setCurrentImageIdx] = useState(0)

    const images = solution.gallery?.length > 0 
        ? solution.gallery 
        : solution.multimedia 
            ? [{ url: solution.multimedia, alt: solution.title }] 
            : [{ url: '/images/visuals/placeholder.jpg', alt: 'Placeholder' }]

    return (
        <div className="min-h-screen bg-gray-50 pb-16">
            <div className="relative pt-28 pb-16 lg:pt-28 lg:pb-24 bg-white border-b border-gray-100 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 pointer-events-none" />
                <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
                    <Link href="/soluciones" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-blue-600 mb-8 transition-colors">
                        <ArrowLeft size={16} className="mr-2" />
                        Volver al catálogo
                    </Link>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight"
                    >
                        {solution.title}
                    </motion.h1>
                    {solution.description && (
                        <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                            {solution.description}
                        </p>
                    )}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 mt-8 md:mt-12">
                <div className="bg-white p-6 md:p-12 rounded-3xl shadow-sm border border-gray-100 mb-12">
                    {/* GALLERY */}
                    <div className="mb-12">
                        <div className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden bg-gray-100 border border-gray-200">
                            <img 
                                src={images[currentImageIdx].url} 
                                alt={images[currentImageIdx].alt || solution.title} 
                                className="w-full h-full object-cover"
                            />
                            {images.length > 1 && (
                                <>
                                    <button 
                                        onClick={() => setCurrentImageIdx((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow backdrop-blur-sm transition-all"
                                    >
                                        &larr;
                                    </button>
                                    <button 
                                        onClick={() => setCurrentImageIdx((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow backdrop-blur-sm transition-all"
                                    >
                                        &rarr;
                                    </button>
                                </>
                            )}
                        </div>
                        {images.length > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-4">
                                {images.map((_: any, idx: number) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setCurrentImageIdx(idx)}
                                        className={`w-2.5 h-2.5 rounded-full transition-all ${idx === currentImageIdx ? 'bg-blue-600 w-6' : 'bg-gray-300 hover:bg-gray-400'}`}
                                        aria-label={`Ir a imagen ${idx + 1}`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* NEW DETAILS FIELDS */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-8">
                            {solution.functionalDescription && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="text-blue-500" size={20}/> 
                                        Cómo Funciona
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{solution.functionalDescription}</p>
                                </div>
                            )}
                            {solution.problemsSolved && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="text-blue-500" size={20}/> 
                                        Problemas que Resuelve
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{solution.problemsSolved}</p>
                                </div>
                            )}
                        </div>
                        <div className="space-y-8">
                            {solution.capabilities && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="text-blue-500" size={20}/> 
                                        Capacidades Principales
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{solution.capabilities}</p>
                                </div>
                            )}
                            {solution.longDescription && (
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="text-blue-500" size={20}/> 
                                        Más Detalles
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{solution.longDescription}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    
                    {solution.ctaUrl && (
                        <div className="mt-12 text-center">
                            <a href={solution.ctaUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-blue-600 rounded-xl hover:bg-blue-700 shadow-lg hover:shadow-xl hover:-translate-y-1">
                                Empezar ahora
                            </a>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
