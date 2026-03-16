'use client'

import { useState, useEffect } from 'react'
import { Video, Mic, Radio, Play } from 'lucide-react'
import { motion } from 'framer-motion'

interface MediaItem {
    id: string
    title: string
    description: string | null
    type: string
    url: string | null
    embedHtml: string | null
    thumbnail: string | null
}

export default function PodcastPage() {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>([])
    const [mainChannelHtml, setMainChannelHtml] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [mediaRes, settingsRes] = await Promise.all([
                    fetch('/api/media'),
                    fetch('/api/settings?key=main_podcast_channel')
                ])

                if (mediaRes.ok) {
                    const mediaData = await mediaRes.json()
                    setMediaItems(mediaData)
                }

                if (settingsRes.ok) {
                    const settingsData = await settingsRes.json()
                    setMainChannelHtml(settingsData.value || '')
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

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
                            <span className="flex h-2 w-2 rounded-full bg-blue-500 mr-2" />
                            Intelligence Broadcast
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 tracking-tight">
                            Podcast & <span className="text-blue-500">Videos</span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Explora las últimas tendencias, entrevistas y demos tecnológicas en nuestro hub multimedia de IA.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Main Channel Section */}
            {mainChannelHtml && (
                <section className="py-8 lg:py-8 bg-white">
                    <div className="max-w-5xl mx-auto px-6 lg:px-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-8"
                        >
                            <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-2xl mb-4 border border-gray-200">
                                <Radio className="text-gray-900" size={22} />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
                                Canal Principal
                            </h2>
                            <p className="text-sm text-gray-600 max-w-xl mx-auto">
                                Escucha nuestros últimos episodios y mantente al día con la innovación en IA.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all p-2"
                        >
                            <div
                                className="w-full min-h-[160px] flex items-center justify-center"
                                dangerouslySetInnerHTML={{ __html: mainChannelHtml }}
                            />
                        </motion.div>
                    </div>
                </section>
            )}

            {/* Media Grid */}
            <section className="py-8 lg:py-8 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-3 tracking-tight">
                            Contenido Destacado
                        </h2>
                        <p className="text-sm text-gray-600 max-w-xl mx-auto">
                            Explora nuestra colección de podcasts, videos y entrevistas.
                        </p>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-72 bg-gray-100 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : mediaItems.length === 0 ? (
                        <div className="text-center py-8 bg-white rounded-3xl border border-gray-200">
                            <Video size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Próximamente</h3>
                            <p className="text-gray-600 text-sm">Estamos preparando nuevo contenido multimedia.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {mediaItems.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all flex flex-col"
                                >
                                    {/* Media Content */}
                                    {item.embedHtml ? (
                                        <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                            <div
                                                className="w-full h-full"
                                                dangerouslySetInnerHTML={{ __html: item.embedHtml }}
                                            />
                                        </div>
                                    ) : item.thumbnail ? (
                                        <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                            <img
                                                src={item.thumbnail}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                                                <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Play size={20} className="text-gray-900 ml-1" />
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="aspect-video bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                                            {item.type === 'VIDEO' ? (
                                                <Video size={40} className="text-gray-300" />
                                            ) : (
                                                <Mic size={40} className="text-gray-300" />
                                            )}
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="p-5 lg:p-6 flex-1 flex flex-col">
                                        <div className="mb-2">
                                            <span className="inline-flex items-center text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg border border-gray-200 font-medium">
                                                {item.type === 'VIDEO' ? (
                                                    <><Video size={11} className="mr-1" /> Video</>
                                                ) : (
                                                    <><Mic size={11} className="mr-1" /> Podcast</>
                                                )}
                                            </span>
                                        </div>

                                        <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors">
                                            {item.title}
                                        </h3>

                                        {item.description && (
                                            <p className="text-gray-600 text-sm leading-relaxed flex-1 line-clamp-3">
                                                {item.description}
                                            </p>
                                        )}

                                        {item.url && (
                                            <a
                                                href={item.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="mt-4 inline-flex items-center justify-center px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 hover:bg-black hover:text-white hover:border-black transition-all font-medium text-sm"
                                            >
                                                Ver Completo
                                            </a>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
