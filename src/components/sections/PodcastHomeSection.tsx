'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Headphones, Radio } from 'lucide-react'

export default function PodcastHomeSection() {
    const [mainChannelHtml, setMainChannelHtml] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchSetting = async () => {
            try {
                const res = await fetch('/api/settings?key=main_podcast_channel')
                if (res.ok) {
                    const data = await res.json()
                    setMainChannelHtml(data.value || '')
                }
            } catch (error) {
                console.error('Error fetching podcast setting:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchSetting()
    }, [])

    if (!loading && !mainChannelHtml) return null

    return (
        <section className="py-8 lg:py-8 bg-white">
            <div className="max-w-6xl mx-auto px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-8"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 mb-5 shadow-sm"
                    >
                        <Radio size={12} className="mr-2 text-blue-500" />
                        Noticias & Podcast 24/7
                    </motion.div>

                    <h2 className="text-3xl md:text-5xl font-semibold text-gray-900 mb-4 tracking-tight">
                        Nuestra <span className="text-blue-500">Voz IA</span>
                    </h2>

                    <p className="text-sm text-gray-600 max-w-xl mx-auto leading-relaxed">
                        Escucha nuestro canal principal. Mantente al día con las últimas innovaciones en inteligencia artificial.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="max-w-4xl mx-auto"
                >
                    {loading ? (
                        <div className="aspect-[16/6] bg-gray-50 animate-pulse rounded-2xl border border-gray-200" />
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all p-2">
                            <div
                                className="w-full min-h-[160px] flex items-center justify-center"
                                dangerouslySetInnerHTML={{ __html: mainChannelHtml }}
                            />
                        </div>
                    )}

                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
                        <div className="flex items-center text-gray-600 text-sm">
                            <Headphones className="mr-2 text-gray-900" size={16} />
                            <span>Audio High-Fidelity</span>
                        </div>
                        <div className="hidden sm:block h-4 w-px bg-gray-200" />
                        <div className="flex items-center text-gray-600 text-sm">
                            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2" />
                            <span>actualizado diariamente</span>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
