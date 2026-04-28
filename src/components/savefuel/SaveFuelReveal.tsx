'use client'

import { motion } from 'framer-motion'
import { Play } from 'lucide-react'
import { useState } from 'react'

export default function SaveFuelReveal() {
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlay = () => {
        setIsPlaying(true);
    };

    return (
        <section id="how-it-works" className="py-10 bg-white font-outfit overflow-hidden relative border-t border-gray-50">
            <div className="max-w-[1200px] mx-auto px-6 relative z-10">
                <div className="text-center mb-10">
                    <motion.span
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block text-[11px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-3"
                    >
                        ASÍ FUNCIONA SAVEFUEL
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-[36px] md:text-[48px] font-black text-[#1D1D1F] tracking-tighter leading-[1.05]"
                    >
                        En <span className="text-emerald-500 italic">60 segundos</span> te enseñamos <br />
                        cómo empezar a ahorrar.
                    </motion.h2>
                </div>

                {/* Real Video Implementation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="relative max-w-[900px] mx-auto aspect-video rounded-[32px] overflow-hidden bg-gray-900 shadow-2xl group"
                >
                    {isPlaying ? (
                        <iframe
                            className="w-full h-full"
                            src="https://www.youtube.com/embed/nDEvnumyKGw?autoplay=1&rel=0&showinfo=0&modestbranding=1"
                            title="SaveFuel Demo"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                        />
                    ) : (
                        <img 
                            src="https://img.youtube.com/vi/nDEvnumyKGw/maxresdefault.jpg" 
                            alt="SaveFuel Video Thumbnail" 
                            className="w-full h-full object-cover opacity-60"
                        />
                    )}

                    {/* Play Overlay */}
                    {!isPlaying && (
                        <div 
                            onClick={handlePlay}
                            className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px] cursor-pointer group-hover:bg-black/20 transition-all duration-500"
                        >
                            <div className="w-20 h-20 rounded-full bg-white text-emerald-500 flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-500">
                                <Play size={32} fill="currentColor" className="ml-1" />
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
            
            {/* Background decorative glows */}
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[300px] h-[300px] bg-emerald-50/40 blur-[100px] -z-10" />
        </section>
    )
}
