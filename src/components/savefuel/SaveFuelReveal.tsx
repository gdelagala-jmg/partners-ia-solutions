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

            {/* Route Visualization Card */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
                className="max-w-[960px] mx-auto px-[24px]"
            >
                <div className="relative bg-[#030303] rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5 aspect-[16/8] md:aspect-[21/9]">
                    {/* Dot grid bg */}
                    <div
                        className="absolute inset-0 opacity-[0.05] pointer-events-none"
                        style={{ backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }}
                    />

                    {/* Stats chips at top of card */}
                    <div className="absolute top-[16px] left-1/2 -translate-x-1/2 flex items-center gap-[8px] z-10 flex-wrap justify-center">
                        {[
                            { v: '10 seg', l: 'CONFIGURAR' },
                            { v: '30 seg', l: 'PRIMERA RUTA' },
                            { v: '250€', l: 'AHORRO/AÑO' },
                            { v: '10', l: 'PAÍSES' },
                        ].map((s) => (
                            <div key={s.l} className="flex flex-col items-center bg-white/5 border border-white/10 rounded-[10px] px-[14px] py-[8px] backdrop-blur-sm">
                                <span className="text-[15px] font-black text-white tracking-tight">{s.v}</span>
                                <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.15em]">{s.l}</span>
                            </div>
                        ))}
                    </div>

                    {/* SVG Route */}
                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 900 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                        {/* Base ghost road */}
                        <path d="M80 300C180 300 250 110 380 110C510 110 650 310 820 280" stroke="#1f2937" strokeWidth="1.5" strokeDasharray="10 10" />

                        {/* Animated optimized route */}
                        <motion.path
                            initial={{ pathLength: 0, opacity: 0 }}
                            whileInView={{ pathLength: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 3.5, ease: 'easeInOut', delay: 0.4 }}
                            d="M80 300C180 300 250 110 380 110C510 110 650 310 820 280"
                            stroke="url(#route-grad)"
                            strokeWidth="5"
                            strokeLinecap="round"
                        />

                        <defs>
                            <linearGradient id="route-grad" x1="80" y1="300" x2="820" y2="300" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#10b981" />
                                <stop offset="0.5" stopColor="#34d399" />
                                <stop offset="1" stopColor="#0ea5e9" />
                            </linearGradient>
                        </defs>

                        {/* Origin city — Madrid */}
                        <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.4 }}>
                            <circle cx="80" cy="300" r="7" fill="#10b981" />
                            <circle cx="80" cy="300" r="14" fill="#10b981" fillOpacity="0.2" />
                            <text x="80" y="330" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" opacity="0.4">MADRID</text>
                        </motion.g>

                        {/* Destination — Bruselas */}
                        <motion.g initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 3.4 }}>
                            <circle cx="820" cy="280" r="7" fill="#0ea5e9" />
                            <circle cx="820" cy="280" r="14" fill="#0ea5e9" fillOpacity="0.2" />
                            <text x="820" y="310" fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" opacity="0.4">BRUSELAS</text>
                        </motion.g>

                        {/* Optimized fuel stop */}
                        <motion.g
                            initial={{ scale: 0, opacity: 0 }}
                            whileInView={{ scale: 1, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 1.8, type: 'spring', stiffness: 200 }}
                        >
                            <motion.circle
                                animate={{ r: [14, 22, 14], opacity: [0.2, 0.5, 0.2] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                cx="420" cy="135" r="14" stroke="#10b981" strokeWidth="1.5" fill="none"
                            />
                            <circle cx="420" cy="135" r="6" fill="#10b981" />
                            <circle cx="420" cy="135" r="14" fill="#10b981" fillOpacity="0.15" />
                        </motion.g>
                    </svg>

                    {/* Bottom overlay */}
                    <div className="absolute inset-x-0 bottom-0 p-[24px] md:p-[32px] bg-gradient-to-t from-black/80 to-transparent flex items-end justify-between gap-[16px]">
                        <div className="flex flex-col gap-[6px]">
                            <div className="flex items-center gap-[8px] text-[11px] font-bold text-white/40 uppercase tracking-widest">
                                <span>ESPAÑA</span>
                                <ArrowRight size={10} />
                                <span>BÉLGICA</span>
                            </div>
                            <div className="flex items-center gap-[10px]">
                                <div className="flex -space-x-[6px]">
                                    {[...Array(3)].map((_, i) => (
                                        <div key={i} className="w-[28px] h-[28px] rounded-full border-2 border-black bg-gray-700" />
                                    ))}
                                </div>
                                <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">+1.2k rutas hoy</span>
                            </div>
                        </div>

                        <div className="flex flex-col items-end gap-[8px]">
                            <div className="px-[16px] py-[10px] bg-emerald-500 rounded-[12px] text-white font-bold text-[14px] shadow-lg shadow-emerald-500/30 flex items-center gap-[8px] whitespace-nowrap">
                                <MapPin size={14} />
                                Ahorro: 42,50€
                            </div>
                            <span className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">TIEMPO REAL</span>
                        </div>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}
