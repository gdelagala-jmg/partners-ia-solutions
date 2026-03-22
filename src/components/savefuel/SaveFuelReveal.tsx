'use client'

import { motion } from 'framer-motion'
import { MapPin, ArrowRight } from 'lucide-react'

export default function SaveFuelReveal() {
    return (
        <section id="how-it-works" className="py-[80px] bg-gradient-to-b from-white via-[#f8fbff] to-[#f0f9ff] font-outfit overflow-hidden">
            <div className="max-w-[720px] mx-auto px-[24px] text-center mb-[56px]">
                {/* Section Label */}
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="inline-block text-[11px] font-bold text-violet-500 uppercase tracking-[0.25em] mb-[16px]"
                >
                    MIRA CÓMO FUNCIONA
                </motion.span>

                {/* Heading */}
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.05 }}
                    className="text-[40px] md:text-[56px] font-black text-[#0f172a] mb-[20px] tracking-tight leading-[1.1]"
                >
                    Tu ruta,{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#0ea5e9]">
                        optimizada
                    </span>
                </motion.h2>

                {/* Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-[17px] text-gray-500 leading-[1.7] max-w-[560px] mx-auto"
                >
                    Introduce tu origen y destino. En segundos sabrás dónde parar para ahorrar más.
                </motion.p>
            </div>

            {/* YouTube Video Container */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="max-w-[1000px] mx-auto px-[24px]"
            >
                <div className="relative w-full rounded-[2.5rem] overflow-hidden shadow-2xl bg-white aspect-video max-w-[860px] mx-auto">
                    <iframe
                        className="absolute inset-0 w-full h-full"
                        src="https://www.youtube.com/embed/OnTcspCEy1E?autoplay=1&mute=1&loop=1&playlist=OnTcspCEy1E&controls=0&modestbranding=1&rel=0&playsinline=1&showinfo=0&iv_load_policy=3"
                        title="SaveFuel Demo"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                    ></iframe>
                    
                    {/* Overlay to prevent interaction and keep it looking like a background video */}
                    <div className="absolute inset-0 pointer-events-none" />
                </div>
            </motion.div>
        </section>
    )
}
