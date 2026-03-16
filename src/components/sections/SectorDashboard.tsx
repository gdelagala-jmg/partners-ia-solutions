'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Box } from 'lucide-react'

interface Sector {
    id: string
    name: string
    slug: string
    image: string
    externalUrl: string
    description?: string
    _count?: {
        solutions: number
    }
}

export default function SectorDashboard() {
    const [sectors, setSectors] = useState<Sector[]>([])
    const [loading, setLoading] = useState(true)

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

    useEffect(() => {
        const fetchSectors = async () => {
            try {
                const res = await fetch('/api/sectors?active=true')
                if (res.ok) {
                    const data = await res.json()
                    setSectors(data)
                }
            } catch (error) {
                console.error('Error fetching sectors:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchSectors()
    }, [])

    if (!loading && sectors.length === 0) return null

    return (
        <section className="py-10 lg:py-14 bg-white">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
                        Explora por Sector
                    </h2>
                    <p className="text-sm text-gray-600 max-w-2xl mx-auto">
                        Descubre cómo nuestras soluciones transforman tu sector específico.
                    </p>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-64 bg-gray-50 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sectors.map((sector, idx) => (
                            <Link href={`/soluciones/${sector.slug}`} passHref key={sector.id} legacyBehavior>
                                <motion.a
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                                    className="group relative h-64 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 block"
                                >
                                    {/* Background Image */}
                                    <div className="absolute inset-0">
                                        <img
                                            src={getSectorImage(sector)}
                                            alt={sector.name}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                                    </div>

                                    {/* Content Overlay */}
                                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl transform transition-all duration-500 group-hover:bg-white/20 group-hover:scale-105 shadow-2xl">
                                            <h3 className="text-xl md:text-2xl font-bold tracking-tight !text-white drop-shadow-lg px-2">
                                                {sector.name}
                                            </h3>
                                            <div className="mt-1 text-[10px] text-blue-200 font-bold uppercase tracking-[0.2em]">
                                                {sector._count?.solutions || 0} Soluciones
                                            </div>
                                        </div>

                                        {/* Arrow Indicator */}
                                        <div className="absolute bottom-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                                            <div className="bg-white text-black p-2 rounded-full shadow-xl">
                                                <ArrowRight size={18} />
                                            </div>
                                        </div>
                                    </div>
                                </motion.a>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
