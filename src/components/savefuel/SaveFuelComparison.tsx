'use client'

import { motion } from 'framer-motion'
import { MapPin, Check, X, Minus, Fuel } from 'lucide-react'

const othersFeatures = [
    { text: 'Gasolineras cercanas', type: 'check' },
    { text: 'Navegación GPS básica', type: 'check' },
    { text: 'Precios desactualizados', type: 'warn' },
    { text: 'Sin cálculo de ruta completa', type: 'none' },
    { text: 'Sin optimización de repostaje', type: 'none' },
    { text: 'Sin coste real de desvío', type: 'none' },
]

const savefuelFeatures = [
    'Optimización en ruta completa',
    'Precios oficiales verificados',
    'Cálculo de ahorro neto real',
    'Detección de paradas óptimas',
    'Avisos de fronteras baratas',
    'Cero publicidad',
]

export default function SaveFuelComparison() {
    return (
        <section id="comparison" className="py-10 bg-white text-[#1D1D1F] font-outfit border-t border-gray-100">
            <div className="max-w-[1200px] mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4 block">
                        COMPARATIVA REAL
                    </span>
                    <h2 className="text-[40px] md:text-[60px] font-black tracking-tighter leading-[1.05] mb-6">
                        Google Maps te dice <br className="hidden md:block" />
                        donde hay <span className="text-gray-300 italic">gasolineras.</span>
                    </h2>
                    <p className="text-[18px] text-gray-400 max-w-[700px] mx-auto leading-relaxed font-inter font-medium">
                        Pero no te dice cuánto vas a ahorrar. Nosotros sí. Calculamos el ahorro neto real descontando el combustible que gastas en el desvío.
                    </p>
                </div>

                {/* Two-column comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[1000px] mx-auto">
                    {/* Left: Others */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-gray-50/50 border border-gray-100 rounded-[40px] p-10 hover:bg-white hover:shadow-2xl transition-all duration-500"
                    >
                        <div className="flex items-center gap-4 mb-8">
                            <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center">
                                <MapPin size={24} className="text-gray-300" />
                            </div>
                            <h3 className="text-[20px] font-black text-[#1D1D1F]">Apps de Mapas</h3>
                        </div>
                        <ul className="space-y-4">
                            {othersFeatures.map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-[15px] font-semibold font-inter">
                                    {f.type === 'check' && <Check size={18} className="text-gray-300" />}
                                    {f.type === 'warn' && <Minus size={18} className="text-amber-400" />}
                                    {f.type === 'none' && <X size={18} className="text-gray-200" />}
                                    <span className={f.type === 'none' ? 'text-gray-300' : 'text-gray-400'}>{f.text}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Right: SaveFuel */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative bg-white border-2 border-emerald-500 rounded-[40px] p-10 shadow-2xl shadow-emerald-500/10 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full blur-[60px] opacity-50" />
                        
                        <div className="flex items-center gap-4 mb-8 relative z-10">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30">
                                <Fuel size={24} fill="currentColor" />
                            </div>
                            <h3 className="text-[20px] font-black text-[#1D1D1F]">SaveFuel</h3>
                        </div>
                        <ul className="space-y-4 relative z-10">
                            {savefuelFeatures.map((f, i) => (
                                <li key={i} className="flex items-center gap-3 text-[15px] font-bold font-inter">
                                    <div className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                    <span className="text-[#1D1D1F]">{f}</span>
                                </li>
                            ))}
                        </ul>
                        
                        <div className="mt-10 pt-8 border-t border-gray-50 flex items-center justify-between relative z-10">
                            <span className="text-[12px] font-black text-emerald-500 uppercase tracking-widest">AHORRO MEDIO</span>
                            <span className="text-[24px] font-black text-[#1D1D1F]">250€ / AÑO</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}
