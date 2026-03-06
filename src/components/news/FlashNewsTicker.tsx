'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Zap } from 'lucide-react'

interface FlashNewsItem {
    title: string;
    link: string;
    date: string;
    company: string;
    summary: string;
}

export default function FlashNewsTicker() {
    const [news, setNews] = useState<FlashNewsItem[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/news/flash')
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Limit to 10 latest news items for the ticker
                    setNews(data.slice(0, 10))
                }
                setLoading(false)
            })
            .catch(err => {
                console.error('Error fetching flash news ticker:', err)
                setLoading(false)
            })
    }, [])

    if (loading || news.length === 0) return null

    // We duplicate the news array to create a seamless infinite scrolling effect
    const duplicatedNews = [...news, ...news]

    return (
        <div className="bg-gray-900 border-b border-gray-800 text-white overflow-hidden py-4 relative flex items-center min-h-[60px] w-full">
            <div className="absolute left-0 top-0 bottom-0 z-10 bg-gradient-to-r from-gray-900 via-gray-900/90 to-transparent w-32 md:w-48 px-4 flex items-center">
                <div className="flex items-center space-x-1.5 text-blue-400 font-bold text-xs uppercase tracking-wider whitespace-nowrap">
                    <Zap size={14} className="animate-pulse flex-shrink-0" />
                    <span>IA Flash</span>
                </div>
            </div>

            <div className="flex-1 relative ml-24 md:ml-40 flex items-center">
                <div className="animate-marquee whitespace-nowrap flex space-x-32 absolute left-0 flex-nowrap items-center min-w-max">
                    {duplicatedNews.map((item, idx) => (
                        <Link
                            key={idx}
                            href="/noticias"
                            className="inline-flex items-center space-x-3 text-base text-gray-200 hover:text-white transition-colors group flex-shrink-0"
                        >
                            <span className="text-gray-500 text-xs">•</span>
                            <span className="font-semibold text-white group-hover:text-blue-400 transition-colors tracking-wide uppercase text-sm">
                                {item.company}
                            </span>
                            <span className="text-blue-400 font-bold px-1">|</span>
                            <span className="font-medium tracking-wide">{item.title}</span>
                            <span className="text-gray-400 text-sm ml-2">- {item.summary.replace(/ \[Fuente\]\(.*?\)/, '').substring(0, 80)}...</span>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    )
}
