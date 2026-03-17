'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid, ArrowRight, ExternalLink, Globe, FileText, Bot, Zap, Box } from 'lucide-react'
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
                        {apps.map((app, idx) => (
                            <motion.div
                                key={app.id}
                                initial={{ opacity: 0, y: 40 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                                className="group relative flex flex-col h-[520px] bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-500/5 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-700 overflow-hidden"
                            >
                                {/* Floating Tags */}
                                <div className="absolute top-6 left-6 z-20 flex gap-2">
                                    <span className="px-4 py-1.5 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-blue-600 border border-blue-50 shadow-lg">
                                        {app.externalUrl ? 'Integration' : 'Native App'}
                                    </span>
                                </div>

                                {/* Image / Media area */}
                                <div className="relative h-[65%] w-full overflow-hidden p-3 pt-6 px-6">
                                    <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative shadow-2xl shadow-black/5 border border-gray-100/50">
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent group-hover:opacity-40 transition-opacity duration-700 z-10" />
                                        <img
                                            src={app.image || '/logo-ias.png'}
                                            alt={app.name}
                                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/600x800?text=Application')}
                                        />
                                        
                                        {/* Hover Overlay Icon */}
                                        <div className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 group-hover:scale-100 scale-90 transition-all duration-500 pointer-events-none">
                                            <div className="p-5 bg-white shadow-2xl rounded-3xl">
                                                {app.externalUrl ? <Globe size={32} className="text-blue-600" /> : <Bot size={32} className="text-indigo-600" />}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content area */}
                                <div className="flex-1 p-8 pt-4 flex flex-col justify-between">
                                    <div>
                                        <h3 className="text-3xl font-black text-gray-900 tracking-tighter group-hover:text-blue-600 mb-3 transition-colors">
                                            {app.name}
                                        </h3>
                                        <p className="text-gray-500 text-base font-medium leading-relaxed line-clamp-2">
                                            {app.description || 'Una herramienta innovadora diseñada para optimizar procesos mediante IA avanzada.'}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between pt-6 mt-4 border-t border-gray-50">
                                        <Link
                                            href={app.externalUrl ? app.externalUrl : `/apps/${app.slug}`}
                                            target={app.externalUrl ? "_blank" : "_self"}
                                            className="inline-flex items-center gap-3 px-8 py-3.5 bg-gray-900 group-hover:bg-blue-600 text-white rounded-2xl text-sm font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-gray-900/10 group-hover:shadow-blue-500/20"
                                        >
                                            {app.externalUrl ? (
                                                <>Acceso Externo <ExternalLink size={16} /></>
                                            ) : (
                                                <>Explorar App <ChevronRight size={18} className="translate-x-0 group-hover:translate-x-1 transition-transform" /></>
                                            )}
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    )
}
