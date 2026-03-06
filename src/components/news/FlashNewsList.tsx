'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Zap, ExternalLink, Calendar, Building2, RefreshCw } from 'lucide-react'

interface FlashNewsItem {
    title: string;
    link: string;
    date: string;
    company: string;
    summary: string;
}

export default function FlashNewsList() {
    const [news, setNews] = useState<FlashNewsItem[]>([])
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false)
    const [error, setError] = useState(false)

    const fetchFlashNews = async (isManualRefresh = false) => {
        if (isManualRefresh) setRefreshing(true)
        try {
            const res = await fetch('/api/news/flash')
            if (res.ok) {
                const data = await res.json()
                setNews(data)
                setError(false)
            } else {
                setError(true)
            }
        } catch (err) {
            console.error(err)
            setError(true)
        } finally {
            setLoading(false)
            if (isManualRefresh) setRefreshing(false)
        }
    }

    useEffect(() => {
        fetchFlashNews()

        // Refresh every 30 minutes
        const interval = setInterval(() => fetchFlashNews(), 30 * 60 * 1000)
        return () => clearInterval(interval)
    }, [])

    if (loading) {
        return (
            <div className="bg-blue-50/50 rounded-2xl p-6 border border-blue-100 mb-10 w-full animate-pulse">
                <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 rounded-full bg-blue-200"></div>
                    <div className="h-6 bg-blue-200 rounded w-48"></div>
                </div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="h-24 bg-white rounded-xl border border-blue-100"></div>
                    ))}
                </div>
            </div>
        )
    }

    if (error || news.length === 0) {
        return null; // Don't show the section if there's an error or no recent news
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 via-white to-indigo-50 rounded-3xl p-6 md:p-8 border border-blue-100 mb-12 shadow-sm relative overflow-hidden">
            {/* Decorative background element */}
            <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl"></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
                <div className="flex items-center space-x-3">
                    <div className="bg-blue-600 p-2 rounded-xl text-white shadow-md shadow-blue-200 animate-pulse">
                        <Zap size={24} className="fill-current" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Noticias IA Flash</h2>
                        <p className="text-sm text-blue-600 font-medium">Últimas 72 horas en la industria</p>
                    </div>
                </div>

                <button
                    onClick={() => fetchFlashNews(true)}
                    disabled={refreshing}
                    className="inline-flex items-center justify-center px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <RefreshCw size={16} className={`mr-2 ${refreshing ? 'animate-spin text-blue-600' : ''}`} />
                    {refreshing ? 'Actualizando...' : 'Actualizar'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 relative z-10">
                {news.map((item, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group flex flex-col"
                    >
                        <div className="flex justify-between items-start mb-3">
                            <h3 className="text-base font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                                {item.title}
                            </h3>
                        </div>

                        <div className="flex items-center space-x-3 mb-4 text-xs font-medium text-gray-500">
                            <span className="flex items-center bg-gray-50 px-2.5 py-1 rounded-md">
                                <Building2 size={12} className="mr-1.5 text-gray-400" />
                                {item.company}
                            </span>
                            <span className="flex items-center">
                                <Calendar size={12} className="mr-1.5 text-gray-400" />
                                {new Date(item.date).toLocaleDateString('es-ES', {
                                    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                                })}
                            </span>
                        </div>

                        <p className="text-sm text-gray-600 flex-grow leading-relaxed">
                            {/* Process the summary text and format the markdown link */}
                            {item.summary.split('[Fuente](')[0]}
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium ml-1"
                            >
                                Fuente <ExternalLink size={12} className="ml-0.5" />
                            </a>
                        </p>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}
