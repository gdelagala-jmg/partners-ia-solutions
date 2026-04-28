'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid, ArrowRight, ExternalLink, Globe, FileText, Bot, Zap, Box, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface App {
    id: string
    name: string
    slug: string
    description: string
    image: string
    externalUrl?: string
    published: boolean
    order: number
}

import { redirect } from 'next/navigation'

export default function AppsIndexPage() {
    const [apps, setApps] = useState<App[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchApps = async () => {
            try {
                const res = await fetch('/api/apps')
                if (res.ok) {
                    const data = await res.json()
                    setApps(data)
                }
            } catch (error) {
                console.error('Error fetching apps:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchApps()
    }, [])

    return (
        <div className="min-h-screen bg-[#fafafa] selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
            {/* Header / Hero Section */}
            <section className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full -z-10 pointer-events-none opacity-40">
                    <div className="absolute top-[10%] left-[5%] w-[400px] h-[400px] bg-blue-100/50 rounded-full blur-[100px] animate-pulse" />
                    <div className="absolute bottom-[20%] right-[5%] w-[300px] h-[300px] bg-indigo-100/40 rounded-full blur-[100px] animate-pulse delay-700" />
                </div>

                <div className="max-w-7xl mx-auto text-center relative pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white border border-gray-100 shadow-sm rounded-full text-xs font-black text-blue-600 uppercase tracking-widest mb-8">
                            <Zap size={14} className="fill-blue-600" /> Ecosystem Hub
                        </span>
                        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-gray-900 tracking-tighter leading-[0.9] mb-8">
                            Nuestra Factoría <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">de Aplicaciones</span>
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
                            Descubre las herramientas y ecosistemas digitales que estamos construyendo. Soluciones verticales con IA diseñadas para potenciar tu sector.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Apps Grid */}
            <section className="max-w-7xl mx-auto px-6 pb-32">
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="h-[450px] bg-white rounded-[3rem] animate-pulse border border-gray-100 shadow-xl shadow-gray-100/20" />
                        ))}
                    </div>
                ) : apps.length === 0 ? (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-100 shadow-inner group"
                    >
                        <div className="p-10 bg-gray-50 rounded-full inline-block mb-8 relative transition-transform duration-500 group-hover:scale-110">
                            <LayoutGrid size={64} className="text-gray-200" />
                            <div className="absolute inset-0 bg-blue-500/5 rounded-full blur-xl scale-150 -z-10" />
                        </div>
                        <h3 className="text-3xl font-black text-gray-900 tracking-tight">Factoría en Marcha</h3>
                        <p className="text-gray-500 mt-4 text-lg font-medium max-w-sm mx-auto">Pronto publicaremos nuestras aplicaciones estrella aquí. ¡Estate atento!</p>
                        <Link href="/contacto" className="mt-10 inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-black hover:bg-black transition-all hover:shadow-2xl active:scale-95">
                            Saber más
                        </Link>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {apps.map((app, idx) => {
                            const isSaveFuel = app.slug === 'savefuel';
                            const mediaAreaPadding = isSaveFuel ? 'p-2 sm:p-3' : 'p-3 pt-6 px-6';
                            const mediaContainerClasses = isSaveFuel
                                ? 'border-gray-800/40 bg-gradient-to-br from-gray-900 via-gray-800 to-black'
                                : 'border-gray-100/50 bg-white';

                            return (
                                <motion.div
                                    key={app.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                    className="group relative flex flex-col h-[480px] bg-white rounded-[2.5rem] border border-gray-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.05)] hover:shadow-2xl hover:shadow-gray-200 transition-all duration-500 overflow-hidden"
                                >
                                    {/* Top Image / Media Area */}
                                    <div className="relative h-[55%] w-full overflow-hidden bg-gray-50 shrink-0">
                                        {/* Floating Tag Overlay */}
                                        <div className="absolute top-5 left-5 z-20">
                                            <span className="inline-flex items-center px-6 py-3 bg-white/95 backdrop-blur-md rounded-[1.25rem] text-[15px] font-bold text-gray-900 shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
                                                {app.name}
                                            </span>
                                        </div>

                                        {isSaveFuel ? (
                                            <>
                                                {/* SaveFuel Custom Design */}
                                                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black z-0" />
                                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent)] z-0" />
                                                <iframe
                                                    className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-transform duration-700 group-hover:scale-105 z-10 p-4"
                                                    src="https://www.youtube.com/embed/OnTcspCEy1E?autoplay=1&mute=1&loop=1&playlist=OnTcspCEy1E&controls=0&modestbranding=1&rel=0&playsinline=1&showinfo=0&iv_load_policy=3"
                                                    title="SaveFuel Preview"
                                                    frameBorder="0"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                ></iframe>
                                            </>
                                        ) : (
                                            <>
                                                <img
                                                    src={app.image || '/logo-ias.png'}
                                                    alt={app.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/600x800?text=Application')}
                                                />
                                            </>
                                        )}
                                    </div>

                                    {/* Bottom Content Area */}
                                    <div className="flex-1 p-8 sm:p-10 flex flex-col justify-center bg-white relative z-10">
                                        <p className="text-gray-500 text-[1.1rem] font-medium leading-[1.6] line-clamp-3 mb-4">
                                            {app.description || 'Una herramienta innovadora diseñada para optimizar procesos mediante IA avanzada.'}
                                        </p>

                                        <Link
                                            href={app.externalUrl ? app.externalUrl : `/apps/${app.slug}`}
                                            target={app.externalUrl ? "_blank" : "_self"}
                                            className="inline-flex items-center gap-3 text-blue-600 font-bold text-base group-hover:text-blue-700 transition-colors"
                                        >
                                            {app.externalUrl ? 'Acceso Externo' : 'Descubrir Soluciones'} 
                                            <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1.5" />
                                        </Link>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    )
}
