'use client'

import { useEffect, useState } from 'react'
import NewsFilterBar from '@/components/news/NewsFilterBar'
import FlashNewsList from '@/components/news/FlashNewsList'
import Link from 'next/link'
import { Calendar, Tag, Newspaper } from 'lucide-react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'

interface NewsPost {
    id: string
    title: string
    content: string
    slug: string
    category: string
    coverImage: string | null
    aiType: string | null
    businessArea: string | null
    sector: string | null
    profession: string | null
    createdAt: string
}

export default function NewsPageClient() {
    const [posts, setPosts] = useState<NewsPost[]>([])
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams()

    useEffect(() => {
        const fetchNews = async () => {
            setLoading(true)
            try {
                const params = new URLSearchParams()
                if (searchParams.get('q')) params.set('q', searchParams.get('q')!)
                if (searchParams.get('aiType')) params.set('aiType', searchParams.get('aiType')!)
                if (searchParams.get('businessArea')) params.set('businessArea', searchParams.get('businessArea')!)
                if (searchParams.get('sector')) params.set('sector', searchParams.get('sector')!)
                if (searchParams.get('profession')) params.set('profession', searchParams.get('profession')!)

                const res = await fetch(`/api/news?${params.toString()}`)
                if (res.ok) {
                    const data = await res.json()
                    setPosts(data)
                }
            } catch (error) {
                console.error('Error fetching news:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchNews()
    }, [searchParams])

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="py-8 lg:py-8 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 mb-5">
                            <Newspaper size={15} className="mr-2" />
                            Intelligence Hub
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 tracking-tight">
                            Noticias & <span className="text-blue-500">Insights</span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Mantente al día con las últimas tendencias en Inteligencia Artificial aplicada a tu sector.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Flash News Section */}
            <section className="py-2 bg-white antialiased">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-4">
                    <FlashNewsList />
                </div>
            </section>

            {/* Filter Bar */}
            <section className="py-5 bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <NewsFilterBar />
                </div>
            </section>

            {/* News Grid */}
            <section className="py-8 lg:py-8">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-8 bg-gray-50 rounded-3xl border border-gray-200">
                            <Newspaper size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">No hay noticias</h3>
                            <p className="text-gray-600 text-sm">Intenta ajustar tus filtros de búsqueda.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {posts.map((post, idx) => (
                                <motion.article
                                    key={post.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                                    className="group bg-white border border-gray-100 rounded-[1.5rem] overflow-hidden hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/5 transition-all flex flex-col h-full items-start text-left w-full relative"
                                >
                                    {/* Link overlay */}
                                    <Link href={`/noticias/${post.slug}`} className="absolute inset-0 z-10" />

                                    {/* Cover Image */}
                                    <div className="h-56 bg-gray-50 relative overflow-hidden w-full">
                                        {post.coverImage ? (
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 relative group-hover:scale-110 transition-transform duration-700 ease-out">
                                                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_30%,white_0%,transparent_100%)]" />
                                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                                                <div className="flex flex-col items-center gap-2">
                                                    <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                                                        <Newspaper size={32} className="text-white" />
                                                    </div>
                                                    <span className="text-[10px] font-black text-white/40 tracking-[0.2em] uppercase">Intelligence Hub</span>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute top-4 left-4 z-20">
                                            <span className="px-3 py-1 rounded-xl text-[10px] font-black tracking-wider uppercase bg-black/40 backdrop-blur-md text-white border border-white/10">
                                                {post.category?.split(',')[0]?.trim()}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6 lg:p-7 flex-1 flex flex-col w-full">
                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {post.aiType && (
                                                <span className="inline-flex items-center text-[10px] font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg border border-blue-100 uppercase tracking-tight">
                                                    <div className="w-1 h-1 rounded-full bg-blue-500 mr-2 animate-pulse" /> {post.aiType}
                                                </span>
                                            )}
                                            {post.sector && (
                                                <span className="inline-flex items-center text-[10px] font-bold bg-gray-50 text-gray-500 px-2.5 py-1 rounded-lg border border-gray-100 uppercase tracking-tight">
                                                    {post.sector}
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                                            {post.title}
                                        </h2>

                                        <p className="text-gray-500 text-sm mb-6 line-clamp-3 flex-1 leading-relaxed font-medium">
                                            {post.content.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 150)}...
                                        </p>

                                        {/* Meta */}
                                        <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-[11px] text-gray-400 font-bold uppercase tracking-wider">
                                            <span className="flex items-center gap-2">
                                                <Calendar size={14} className="text-blue-500" />
                                                {new Date(post.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                            <div className="flex items-center gap-1.5 px-2 py-1 bg-gray-50 rounded-lg">
                                                <div className="w-1 h-1 rounded-full bg-gray-300" />
                                                <span>Lectura 5 min</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.article>

                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
