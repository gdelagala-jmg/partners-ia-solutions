'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Calendar, Tag, Newspaper, Building2 } from 'lucide-react'
import { motion } from 'framer-motion'
import PageBadge from '../ui/PageBadge'

interface NewsPost {
    id: string
    title: string
    slug: string
    category: string
    coverImage: string | null
    aiType: string | null
    aiTool: string | null
    company: string | null
    createdAt: string
    publishedAt: string | null
    content: string
}

export default function LatestNewsSection() {
    const [posts, setPosts] = useState<NewsPost[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const res = await fetch('/api/news?limit=6')
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
    }, [])

    if (!loading && posts.length === 0) return null

    return (
        <section className="py-8 lg:py-8 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 px-4 text-center md:text-left items-center md:items-end">
                    <div>
                        <PageBadge text="Actualidad IA" icon={<Newspaper size={14} className="text-blue-500" />} />
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2 tracking-tight">
                            Últimas Noticias
                        </h2>
                        <p className="text-sm text-gray-600 max-w-xl">
                            Mantente al día con las novedades del ecosistema de IA.
                        </p>
                    </div>
                    <Link
                        href="/noticias"
                        className="inline-flex items-center text-blue-500 font-medium hover:text-blue-600 transition-colors group text-sm"
                    >
                        Ver todas las noticias
                        <ArrowRight size={16} className="ml-1.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-80 bg-gray-200 rounded-2xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post, idx) => (
                            <motion.article
                                key={post.id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: idx * 0.1 }}
                                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all flex flex-col h-full"
                            >
                                {/* Cover Image */}
                                <div className="h-40 bg-gray-100 relative overflow-hidden">
                                    {post.coverImage ? (
                                        <Image
                                            src={post.coverImage}
                                            alt={post.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-300">
                                            <Newspaper size={28} />
                                        </div>
                                    )}
                                    <div className="absolute top-3 left-3 z-20">
                                        <span className="px-2.5 py-1 bg-black/70 backdrop-blur-md rounded-full text-xs font-bold text-white border border-white/10">
                                            {post.category?.split(',')[0]?.trim() || 'Noticia'}
                                        </span>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="mb-3 flex flex-wrap gap-2 items-center">
                                        {post.company && (
                                            <span className="inline-flex items-center text-[10px] font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full uppercase tracking-wider">
                                                <Building2 size={10} className="mr-1.5 opacity-70" />
                                                {post.company}
                                            </span>
                                        )}
                                        {post.aiTool && (
                                            <span className="inline-flex items-center text-[10px] font-bold bg-purple-50 text-purple-600 px-2.5 py-1 rounded-full uppercase tracking-wider border border-purple-100/50">
                                                {post.aiTool}
                                            </span>
                                        )}
                                        {post.aiType && (
                                            <span className="inline-flex items-center text-[10px] font-bold bg-blue-50 text-blue-600 px-2.5 py-1 rounded-full uppercase tracking-wider border border-blue-100/50">
                                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mr-2" />
                                                {post.aiType}
                                            </span>
                                        )}
                                    </div>

                                    <h3 className="text-base font-bold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors line-clamp-2">
                                        <Link href={`/noticias/${post.slug}`} className="hover:underline focus:outline-none">
                                            {post.title}
                                        </Link>
                                    </h3>

                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                                        {post.content.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 150)}...
                                    </p>

                                    <div className="mt-auto pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                                        <span className="flex items-center">
                                            <Calendar size={12} className="mr-1.5" />
                                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </span>
                                        <Link href={`/noticias/${post.slug}`} className="font-medium text-gray-900 hover:text-blue-500 transition-colors">
                                            Leer más
                                        </Link>
                                    </div>
                                </div>
                            </motion.article>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
