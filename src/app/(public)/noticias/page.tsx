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

export default function NewsPage() {
    const [posts, setPosts] = useState<NewsPost[]>([])
    const [loading, setLoading] = useState(true)
    const searchParams = useSearchParams()

    useEffect(() => {
        const fetchNews = async () => {
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
            <section className="py-10 lg:py-14 bg-gray-50">
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
            <section className="py-10 lg:py-14">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-200">
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
                                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all flex flex-col h-full items-start text-left w-full"
                                >
                                    {/* Cover Image */}
                                    <div className="h-48 bg-gray-100 relative overflow-hidden w-full">
                                        {post.coverImage ? (
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-300">
                                                <Newspaper size={40} />
                                            </div>
                                        )}
                                        <div className="absolute top-3 left-3">
                                            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-black/70 backdrop-blur-md text-white border border-white/10">
                                                {post.category}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 lg:p-6 flex-1 flex flex-col w-full">
                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-1.5 mb-3">
                                            {post.aiType && (
                                                <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-lg border border-blue-200">
                                                    <Tag size={10} className="mr-1" /> {post.aiType}
                                                </span>
                                            )}
                                            {post.businessArea && (
                                                <span className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg border border-gray-200">
                                                    {post.businessArea}
                                                </span>
                                            )}
                                            {post.sector && (
                                                <span className="inline-flex items-center text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-lg border border-blue-200">
                                                    {post.sector}
                                                </span>
                                            )}
                                        </div>

                                        <h2 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors line-clamp-2">
                                            <Link href={`/noticias/${post.slug}`} className="hover:underline">
                                                {post.title}
                                            </Link>
                                        </h2>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
                                            {post.content.substring(0, 150)}...
                                        </p>

                                        {/* Meta */}
                                        <div className="pt-3 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500 mt-auto">
                                            <span className="flex items-center">
                                                <Calendar size={12} className="mr-1.5" />
                                                {new Date(post.createdAt).toLocaleDateString('es-ES')}
                                            </span>
                                            <span>5 min</span>
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
