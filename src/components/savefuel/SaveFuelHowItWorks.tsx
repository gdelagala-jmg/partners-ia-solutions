'use client'

import { motion } from 'framer-motion'
import { TrendingDown, SlidersHorizontal, ShieldCheck, Zap, Navigation, Trophy, Globe, Car } from 'lucide-react'

const features = [
    {
        icon: TrendingDown,
        label: 'Ahorro Real y Medible',
        desc: 'Calcula tu ahorro exacto al litro. Conductores como tú ya ahorran una media de 250€/año.',
        bg: 'bg-emerald-500',
    },
    {
        icon: SlidersHorizontal,
        label: 'Optimización por Precio',
        desc: 'No para solo cuando te quedas sin gasolina. Analiza precios en toda la ruta y te dice dónde llenar para maximizar ahorro.',
        bg: 'bg-blue-500',
    },
    {
        icon: ShieldCheck,
        label: 'Datos 100% Oficiales',
        desc: 'Precios directos de los ministerios y reguladores de energía de 10 países europeos. Actualizados cada 30 min. Cero datos falsos.',
        bg: 'bg-amber-500',
    },
    {
        icon: Zap,
        label: 'Cargadores Eléctricos',
        desc: 'También para vehículos eléctricos. Encuentra cargadores con potencia, conector y disponibilidad.',
        bg: 'bg-violet-500',
    },
    {
        icon: Navigation,
        label: 'Navegación Integrada',
        desc: 'Navega directamente con Waze, Google Maps o Apple Maps. Un toque y estás en camino.',
        bg: 'bg-sky-500',
    },
    {
        icon: Trophy,
        label: 'Gamificación Única',
        desc: 'Valida precios, completa misiones, sube de nivel como Auditor. Tu comunidad te recompensa.',
        bg: 'bg-rose-500',
    },
    {
        icon: Globe,
        label: '10 Países Europeos',
        desc: 'España, Francia, Alemania, Italia, Portugal, Austria, Bélgica, Holanda, Luxemburgo y Eslovenia. Un buscador, toda Europa.',
        bg: 'bg-teal-500',
    },
    {
        icon: Car,
        label: 'Perfil de Vehículo',
        desc: 'Configura tu coche una vez: modelo, combustible, depósito, consumo. Cálculos ultra-precisos.',
        bg: 'bg-emerald-600',
    },
]

export default function SaveFuelHowItWorks() {
    return (
        <section id="funcionalidades" className="py-[80px] bg-[#f8fafc] font-outfit">
            <div className="max-w-[1120px] mx-auto px-[24px]">
                {/* Header */}
                <div className="text-center mb-[48px]">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-[0.25em] mb-[12px] block">
                        FUNCIONALIDADES
                    </span>
                    <h2 className="text-[40px] md:text-[56px] font-black text-[#0f172a] mb-[16px] tracking-tight leading-[1.1]">
                        Todo lo que necesitas para{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#0ea5e9]">
                            ahorrar de verdad
                        </span>
                    </h2>
                    <p className="text-[17px] text-gray-500 max-w-[600px] mx-auto leading-[1.7]">
                        No es otra app de gasolineras. Es un optimizador de rutas con datos oficiales de 10 países europeos y tecnología inteligente.
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[12px]">
                    {features.map((f, idx) => (
                        <motion.div
                            key={f.label}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                            className="bg-white rounded-[20px] border border-gray-100 p-[20px] hover:shadow-md transition-all"
                        >
                            <div className={`${f.bg} w-[44px] h-[44px] rounded-[14px] flex items-center justify-center mb-[14px] text-white`}>
                                <f.icon size={20} />
                            </div>
                            <h3 className="text-[14px] font-bold text-[#0f172a] mb-[8px]">{f.label}</h3>
                            <p className="text-[13px] text-gray-500 leading-[1.65] font-normal">{f.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
