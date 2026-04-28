'use client'

import { motion } from 'framer-motion'
import { TrendingDown, SlidersHorizontal, ShieldCheck, Zap, Navigation, Trophy, Globe, Car } from 'lucide-react'

const features = [
    {
        icon: TrendingDown,
        label: 'Ahorro Real',
        desc: 'Calcula tu ahorro exacto al litro. Conductores como tú ahorran una media de 250€/año.',
        bg: 'bg-emerald-50',
        color: 'text-emerald-500'
    },
    {
        icon: SlidersHorizontal,
        label: 'Optimización',
        desc: 'Analiza precios en toda la ruta y te dice dónde llenar para maximizar el ahorro neto.',
        bg: 'bg-sky-50',
        color: 'text-sky-500'
    },
    {
        icon: ShieldCheck,
        label: 'Datos Oficiales',
        desc: 'Precios directos de ministerios de 28 países europeos. Actualizados cada 30 min.',
        bg: 'bg-emerald-50',
        color: 'text-emerald-500'
    },
    {
        icon: Zap,
        label: 'Carga Eléctrica',
        desc: 'Encuentra cargadores con potencia, conector y disponibilidad en tiempo real.',
        bg: 'bg-sky-50',
        color: 'text-sky-500'
    },
    {
        icon: Navigation,
        label: 'Navegación',
        desc: 'Navega directamente con Waze, Google Maps o Apple Maps con un solo toque.',
        bg: 'bg-emerald-50',
        color: 'text-emerald-500'
    },
    {
        icon: Trophy,
        label: 'Gamificación',
        desc: 'Valida precios, completa misiones y sube de nivel en la comunidad SaveFuel.',
        bg: 'bg-sky-50',
        color: 'text-sky-500'
    },
    {
        icon: Globe,
        label: 'Toda Europa',
        desc: 'Un buscador para 28 países. Datos verificados y oficiales en toda la Unión Europea.',
        bg: 'bg-emerald-50',
        color: 'text-emerald-500'
    },
    {
        icon: Car,
        label: 'Perfil de Coche',
        desc: 'Configura tu modelo, combustible y consumo para obtener cálculos ultra-precisos.',
        bg: 'bg-sky-50',
        color: 'text-sky-500'
    },
]

export default function SaveFuelHowItWorks() {
    return (
        <section id="how-it-works" className="py-16 bg-[#f9f9fb] font-outfit relative">
            <div className="max-w-[1200px] mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4 block">
                        FUNCIONALIDADES
                    </span>
                    <h2 className="text-[40px] md:text-[60px] font-black tracking-tighter leading-[1.05] mb-6">
                        Todo para <span className="text-emerald-500">ahorrar de verdad.</span>
                    </h2>
                    <p className="text-[18px] text-gray-400 max-w-[640px] mx-auto leading-relaxed font-inter font-medium">
                        Tecnología inteligente diseñada para conductores que quieren optimizar cada céntimo en sus trayectos diarios o viajes largos.
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f, idx) => (
                        <motion.div
                            key={f.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.05 }}
                            className="bg-gray-50/50 rounded-[32px] border border-gray-100 p-8 hover:bg-white hover:shadow-2xl transition-all duration-500 group"
                        >
                            <div className={`${f.bg} w-[56px] h-[56px] rounded-[18px] flex items-center justify-center mb-6 ${f.color} transform group-hover:scale-110 transition-transform`}>
                                <f.icon size={28} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-[18px] font-black text-[#1D1D1F] mb-3 tracking-tight">{f.label}</h3>
                            <p className="text-[15px] text-gray-500 leading-relaxed font-inter font-medium">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
