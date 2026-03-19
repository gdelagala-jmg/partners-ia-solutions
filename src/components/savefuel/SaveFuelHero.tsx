'use client'

import { motion } from 'framer-motion'
import { ArrowRight, Globe, Fuel, TrendingDown, Users } from 'lucide-react'

const stats = [
    {
        icon: Globe,
        value: '10',
        label: 'PAÍSES',
        bg: 'bg-[#d1fae5]',
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-100',
    },
    {
        icon: Fuel,
        value: '55.000+',
        label: 'GASOLINERAS',
        bg: 'bg-[#e0f2fe]',
        iconColor: 'text-sky-500',
        iconBg: 'bg-sky-100',
    },
    {
        icon: TrendingDown,
        value: '250€/año',
        label: 'AHORRO MEDIO',
        bg: 'bg-[#fef9c3]',
        iconColor: 'text-amber-500',
        iconBg: 'bg-amber-100',
    },
    {
        icon: Users,
        value: '6',
        label: 'IDIOMAS',
        bg: 'bg-[#ede9fe]',
        iconColor: 'text-violet-500',
        iconBg: 'bg-violet-100',
    },
]

export default function SaveFuelHero() {
    return (
        <section className="relative overflow-hidden bg-white">
            <div className="max-w-[720px] mx-auto px-[24px] text-center pt-[120px] pb-[64px]">

                {/* Badge */}
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center px-[16px] py-[8px] rounded-full bg-white border border-gray-200 text-[13px] font-medium text-gray-600 mb-[40px] shadow-sm gap-[8px]"
                >
                    <span className="relative flex h-[8px] w-[8px] shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-[8px] w-[8px] bg-emerald-500"></span>
                    </span>
                    <span>Activo en 🇪🇸 🇫🇷 🇩🇪 🇮🇹 🇵🇹 🇦🇹 🇧🇪 🇳🇱 🇱🇺 🇸🇮</span>
                    <span className="text-gray-300">—</span>
                    <span>55.000+ gasolineras</span>
                </motion.div>

                {/* H1 */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className="text-[52px] md:text-[72px] font-black text-[#0f172a] mb-[24px] tracking-tight leading-[1.05] font-outfit"
                >
                    El GPS del
                    <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#0ea5e9]">
                        ahorro en gasolina
                    </span>
                </motion.h1>

                {/* Main Subtitle */}
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-[18px] text-[#374151] max-w-[600px] mx-auto mb-[12px] leading-[1.7] font-outfit font-normal"
                >
                    Analiza tu ruta por Europa, compara precios oficiales de 10 países y te dice exactamente dónde repostar para ahorrar más.
                </motion.p>

                {/* Secondary note */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.25 }}
                    className="text-[13px] text-gray-400 mb-[36px] leading-[1.6] font-outfit"
                >
                    Funciona para coches, furgonetas, camiones y vehículos eléctricos. Sin registro. Sin descarga.
                </motion.p>

                {/* CTAs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-[12px] mb-[64px]"
                >
                    <button className="w-full sm:w-auto px-[28px] py-[16px] bg-[#059669] text-white font-semibold rounded-[14px] hover:bg-[#047857] transition-all shadow-lg flex items-center justify-center group text-[16px] gap-[8px]">
                        Calcular mi Ahorro Gratis
                        <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    <button className="w-full sm:w-auto flex items-center justify-center gap-[10px] text-[15px] font-medium text-gray-600 hover:text-gray-800 transition-colors py-[16px] px-[20px]">
                        <span className="w-[32px] h-[32px] rounded-full border border-gray-200 flex items-center justify-center shrink-0 bg-white shadow-sm">
                            <svg width="10" height="12" viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M1 1L9 6L1 11V1Z" fill="#6B7280" stroke="#6B7280" strokeWidth="1" strokeLinejoin="round" />
                            </svg>
                        </span>
                        Ver cómo funciona
                    </button>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 }}
                    className="grid grid-cols-2 lg:grid-cols-4 gap-[12px]"
                >
                    {stats.map((stat) => (
                        <div
                            key={stat.label}
                            className={`${stat.bg} rounded-[20px] px-[16px] py-[20px] flex flex-col items-center gap-[4px]`}
                        >
                            <div className={`${stat.iconBg} w-[36px] h-[36px] rounded-full flex items-center justify-center mb-[4px]`}>
                                <stat.icon size={18} className={stat.iconColor} strokeWidth={2} />
                            </div>
                            <span className="text-[28px] font-black text-[#0f172a] leading-tight tracking-tight font-outfit">
                                {stat.value}
                            </span>
                            <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-widest">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    )
}
