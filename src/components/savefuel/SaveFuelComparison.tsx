'use client'

import { motion } from 'framer-motion'
import { MapPin, Check, X, Minus, Fuel } from 'lucide-react'

const othersFeatures = [
    { text: 'Te muestran gasolineras cercanas', type: 'check' },
    { text: 'Navegación GPS hasta la estación', type: 'check' },
    { text: 'Algunos precios subidos por usuarios', type: 'warn' },
    { text: 'Comparar precios en toda tu ruta', type: 'none' },
    { text: 'Saber cuántos litros necesitas realmente', type: 'none' },
    { text: 'Calcular si el desvío compensa el ahorro', type: 'none' },
    { text: 'Avisarte de repostar antes de una frontera cara', type: 'none' },
    { text: 'Optimizar paradas según tu depósito y consumo', type: 'none' },
    { text: 'Precios oficiales verificados por gobierno', type: 'none' },
]

const savefuelFeatures = [
    'Analiza todas las gasolineras en tu ruta completa',
    'Compara precios con datos oficiales de 10 gobiernos',
    'Calcula los litros exactos según tu depósito y consumo',
    'Te dice en qué estación parar para máximo ahorro',
    'Descuenta el coste real del desvío del ahorro',
    'Avisa si conviene llenar antes de cruzar frontera',
    'Muestra el coste total de combustible del viaje',
    'Recomienda paradas anti-fatiga en rutas largas',
    'Navegación GPS guiada a cada parada optimizada',
]

export default function SaveFuelComparison() {
    return (
        <section className="py-[80px] bg-white font-outfit">
            <div className="max-w-[1120px] mx-auto px-[24px]">
                {/* Header */}
                <div className="text-center mb-[48px]">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-[0.25em] mb-[12px] block">
                        POR QUÉ SAVEFUEL
                    </span>
                    <h2 className="text-[40px] md:text-[52px] font-black text-[#0f172a] mb-[12px] tracking-tight leading-[1.1]">
                        Las apps de navegación te dicen{' '}
                        <em className="not-italic text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#0ea5e9]">
                            dónde hay
                        </em>{' '}
                        gasolineras. Pero ninguna te dice{' '}
                        <em className="not-italic text-[#0f172a] underline decoration-amber-400 decoration-4 underline-offset-4">
                            en cuál parar
                        </em>{' '}
                        para pagar menos.
                    </h2>
                </div>

                {/* Two-column comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] mb-[12px]">
                    {/* Left: Others */}
                    <motion.div
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-[#f8fafc] border border-gray-200 rounded-[20px] p-[28px]"
                    >
                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-[16px]">
                            BUSCAR GASOLINERAS
                        </div>
                        <div className="flex items-center gap-[12px] mb-[20px]">
                            <div className="w-[40px] h-[40px] rounded-[12px] bg-gray-200 flex items-center justify-center">
                                <MapPin size={20} className="text-gray-500" />
                            </div>
                            <h3 className="text-[18px] font-bold text-[#0f172a]">Apps de navegación</h3>
                        </div>
                        <ul className="space-y-[10px]">
                            {othersFeatures.map((f, i) => (
                                <li key={i} className="flex items-start gap-[10px] text-[13px]">
                                    {f.type === 'check' && <Check size={14} className="text-gray-400 mt-[2px] shrink-0" />}
                                    {f.type === 'warn' && <Minus size={14} className="text-amber-500 mt-[2px] shrink-0" />}
                                    {f.type === 'none' && <Minus size={14} className="text-gray-300 mt-[2px] shrink-0" />}
                                    <span className={
                                        f.type === 'check' ? 'text-gray-600' :
                                        f.type === 'warn' ? 'text-amber-600 font-medium' :
                                        'text-gray-300'
                                    }>{f.text}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>

                    {/* Right: SaveFuel */}
                    <motion.div
                        initial={{ opacity: 0, x: 16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                        className="bg-white border-2 border-emerald-400 rounded-[20px] p-[28px]"
                    >
                        <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-[0.2em] mb-[16px]">
                            OPTIMIZAR TU RUTA
                        </div>
                        <div className="flex items-center gap-[12px] mb-[20px]">
                            <div className="w-[40px] h-[40px] rounded-[12px] bg-gradient-to-br from-[#0d9488] to-[#10b981] flex items-center justify-center text-white">
                                <Fuel size={20} />
                            </div>
                            <h3 className="text-[18px] font-bold text-[#0f172a]">SaveFuel</h3>
                        </div>
                        <ul className="space-y-[10px]">
                            {savefuelFeatures.map((f, i) => (
                                <li key={i} className="flex items-start gap-[10px] text-[13px]">
                                    <div className="w-[18px] h-[18px] rounded-full border-2 border-emerald-500 flex items-center justify-center shrink-0 mt-[1px]">
                                        <Check size={10} className="text-emerald-600" strokeWidth={3} />
                                    </div>
                                    <span className="text-gray-700 font-medium">{f}</span>
                                </li>
                            ))}
                        </ul>
                    </motion.div>
                </div>

                {/* Real example dark card */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-[#0f172a] rounded-[20px] p-[28px] md:p-[36px] flex flex-col md:flex-row items-center justify-between gap-[20px]"
                >
                    <div>
                        <p className="text-[11px] font-bold text-white/40 uppercase tracking-[0.2em] mb-[6px]">EJEMPLO REAL</p>
                        <h3 className="text-[20px] md:text-[24px] font-black text-white mb-[8px]">Un viaje de 600 km</h3>
                        <p className="text-[14px] text-white/60 max-w-[480px] leading-[1.65]">
                            Madrid → Bruselas. Depósito de 55L, consumo de 7L/100km. Con SaveFuel PRO ahorras en media <strong className="text-emerald-400">38,50€</strong> por viaje optimizando solo 2 paradas.
                        </p>
                    </div>
                    <div className="flex gap-[12px] shrink-0">
                        <div className="bg-white/5 border border-white/10 rounded-[14px] px-[20px] py-[14px] text-center">
                            <p className="text-[24px] font-black text-white">42,50€</p>
                            <p className="text-[10px] text-white/40 uppercase tracking-wider">Sin SaveFuel</p>
                        </div>
                        <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-[14px] px-[20px] py-[14px] text-center">
                            <p className="text-[24px] font-black text-emerald-400">4,00€</p>
                            <p className="text-[10px] text-emerald-500/70 uppercase tracking-wider">Con SaveFuel</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
