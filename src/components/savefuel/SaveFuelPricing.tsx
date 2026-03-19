'use client'

import { motion } from 'framer-motion'
import { Check, Zap } from 'lucide-react'

const tiers = [
    {
        name: 'Gratis',
        price: '0',
        description: 'Ideal para conductores ocasionales.',
        features: [
            '3 rutas de prueba',
            'Tu país',
            'Ver ahorro detectado',
            '6 idiomas',
        ],
        cta: 'Empezar Gratis',
        featured: false,
    },
    {
        name: 'PRO',
        price: '9,99',
        description: 'Todo el potencial del ahorro europeo.',
        features: [
            'Rutas ilimitadas 10 países',
            'Sincronización Navi voz IA',
            'Modo Multi-repostaje',
            'Historial de ahorro detallado',
            'Misiones y Gamificación',
            'Acceso anticipado a funciones',
            'Sin publicidad',
        ],
        cta: 'Suscribirse Ahora',
        featured: true,
    },
]

export default function SaveFuelPricing() {
    return (
        <section id="pricing" className="py-[80px] bg-white font-outfit">
            <div className="max-w-[900px] mx-auto px-[24px]">
                <div className="text-center mb-[48px]">
                    <h2 className="text-[36px] md:text-[48px] font-black text-[#0f172a] mb-[12px] tracking-tight">
                        Planes de <span className="text-emerald-600">Ahorro</span>
                    </h2>
                    <p className="text-[17px] text-gray-500 max-w-[480px] mx-auto font-normal leading-[1.7]">
                        Elige el plan que mejor se adapte a tus kilómetros.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[16px] max-w-[800px] mx-auto">
                    {tiers.map((tier, idx) => (
                        <motion.div
                            key={tier.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`relative p-[32px] rounded-[24px] flex flex-col h-full transition-all ${
                                tier.featured 
                                ? 'bg-gray-900 text-white shadow-2xl shadow-emerald-200/50 border-2 border-emerald-500' 
                                : 'bg-white text-gray-900 border border-gray-100 shadow-md'
                            }`}
                        >
                            {tier.featured && (
                                <div className="absolute -top-[18px] left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-[16px] py-[4px] rounded-full text-[11px] font-bold uppercase tracking-widest flex items-center gap-[4px]">
                                    <Zap size={11} /> RECOMENDADO
                                </div>
                            )}

                            <div className="mb-[24px]">
                                <h3 className="text-[22px] font-bold mb-[6px]">{tier.name}</h3>
                                <p className={`text-[14px] ${tier.featured ? 'text-gray-400' : 'text-slate-500'} font-normal`}>
                                    {tier.description}
                                </p>
                            </div>

                            <div className="mb-[24px] flex items-baseline select-none">
                                <span className="text-[48px] font-black tracking-tighter">{tier.price}€</span>
                                <span className={`ml-[4px] text-[18px] font-medium ${tier.featured ? 'text-gray-400' : 'text-slate-500'}`}>{tier.name === 'PRO' ? '/año' : '/mes'}</span>
                            </div>

                            <ul className="space-y-[12px] mb-[32px] flex-1">
                                {tier.features.map((feature) => (
                                    <li key={feature} className="flex items-center text-[14px] font-normal gap-[10px]">
                                        <Check size={16} className={`flex-shrink-0 ${tier.featured ? 'text-emerald-400' : 'text-emerald-600'}`} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-[14px] rounded-[14px] font-semibold text-[15px] transition-all ${
                                tier.featured 
                                ? 'bg-emerald-500 hover:bg-emerald-400 text-white hover:scale-[1.02]' 
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                            }`}>
                                {tier.cta}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
