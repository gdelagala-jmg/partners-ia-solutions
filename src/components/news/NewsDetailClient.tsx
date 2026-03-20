'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Calendar, Tag, ArrowLeft, Clock, Linkedin, Facebook, Twitter, MessageCircle, Mail, Link2 } from 'lucide-react'

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
    createdAt: string | Date
    publishedAt: string | Date | null
}

export default function NewsDetailClient({ post }: { post: NewsPost }) {
    const publishDate = post.publishedAt || post.createdAt
    
    // Strip HTML tags to count words for reading time
    const plainText = post.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
    const readingMinutes = Math.max(1, Math.ceil(plainText.split(' ').length / 200))
    // Only show first category in badge
    const primaryCategory = post.category?.split(',')[0]?.trim() || 'Noticia'

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Cover */}
            {post.coverImage && (
                <div className="w-full h-72 md:h-96 relative overflow-hidden bg-gray-100">
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                </div>
            )}

            {/* Article Container */}
            <div className="max-w-4xl mx-auto px-6 lg:px-8 py-8">

                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4 }}
                    className="mb-8"
                >
                    <Link
                        href="/noticias"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 transition-colors font-medium"
                    >
                        <ArrowLeft size={15} />
                        Volver a noticias
                    </Link>
                </motion.div>

                {/* Category + Tags */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.05 }}
                    className="flex flex-wrap gap-2 mb-4"
                >
                    <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-black text-white">
                        {primaryCategory}
                    </span>
                    {post.aiType && (
                        <span className="inline-flex items-center text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200">
                            <Tag size={10} className="mr-1" /> {post.aiType}
                        </span>
                    )}
                    {post.businessArea && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200">
                            {post.businessArea}
                        </span>
                    )}
                    {post.sector && (
                        <span className="text-xs bg-blue-100 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200">
                            {post.sector}
                        </span>
                    )}
                    {post.profession && (
                        <span className="text-xs bg-gray-100 text-gray-700 px-2.5 py-1 rounded-lg border border-gray-200">
                            {post.profession}
                        </span>
                    )}
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-3xl md:text-4xl lg:text-5xl font-semibold text-gray-900 leading-tight mb-5"
                >
                    {post.title}
                </motion.h1>

                {/* Meta */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                    className="flex items-center gap-5 text-sm text-gray-500 mb-8 pb-8 border-b border-gray-200"
                >
                    <span className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {new Date(publishDate).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                        })}
                    </span>
                    <span className="flex items-center gap-1.5">
                        <Clock size={14} />
                        {readingMinutes} min de lectura
                    </span>
                </motion.div>

                {/* Content — rendered as HTML from Quill editor */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="news-article-body"
                    dangerouslySetInnerHTML={{ 
                        __html: post.content
                            .replace(/&nbsp;/g, ' ')
                            .replace(/\s+/g, ' ')
                            .replace(/<span[^>]*>/g, '') // remove span to avoid nested dirty styles
                            .replace(/<\/span>/g, '')
                    }}
                />

                {/* Social Sharing */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="mt-12 pt-8 border-t border-gray-100"
                >
                    <p className="text-sm font-semibold text-gray-500 mb-6 uppercase tracking-wider">
                        Compartir esta noticia
                    </p>
                    <div className="flex flex-wrap gap-3">
                        {/* LinkedIn */}
                        <a
                            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-[#0077b5] hover:text-white transition-all shadow-sm border border-gray-100 group"
                            title="LinkedIn"
                        >
                            <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                        </a>

                        {/* Facebook */}
                        <a
                            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-[#1877f2] hover:text-white transition-all shadow-sm border border-gray-100 group"
                            title="Facebook"
                        >
                            <Facebook size={20} className="group-hover:scale-110 transition-transform" />
                        </a>

                        {/* X (Twitter) */}
                        <a
                            href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(post.title)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-black hover:text-white transition-all shadow-sm border border-gray-100 group"
                            title="X (Twitter)"
                        >
                            <Twitter size={20} className="group-hover:scale-110 transition-transform" />
                        </a>

                        {/* WhatsApp */}
                        <a
                            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${post.title} ${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-[#25d366] hover:text-white transition-all shadow-sm border border-gray-100 group"
                            title="WhatsApp"
                        >
                            <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                        </a>

                        {/* Email */}
                        <a
                            href={`mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                            className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-red-500 hover:text-white transition-all shadow-sm border border-gray-100 group"
                            title="Email"
                        >
                            <Mail size={20} className="group-hover:scale-110 transition-transform" />
                        </a>

                        {/* Copy Link */}
                        <button
                            onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                alert('¡Enlace copiado al portapapeles!');
                            }}
                            className="w-11 h-11 flex items-center justify-center rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-800 hover:text-white transition-all shadow-sm border border-gray-100 group"
                            title="Copiar enlace"
                        >
                            <Link2 size={20} className="group-hover:scale-110 transition-transform" />
                        </button>
                    </div>
                </motion.div>

                {/* Footer CTA */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between flex-wrap gap-4"
                >
                    <Link
                        href="/noticias"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-500 transition-colors font-medium"
                    >
                        <ArrowLeft size={15} />
                        Ver más noticias
                    </Link>
                    <Link
                        href="/contacto"
                        className="inline-flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition-colors"
                    >
                        Contáctanos
                    </Link>
                </motion.div>
            </div>
        </div>
    )
}

