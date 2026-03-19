'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, BadgeCheck, Shield, Globe } from 'lucide-react'

const trustItems = [
    {
        icon: ShieldCheck,
        label: 'Datos Oficiales Verificados',
        desc: '10 APIs gubernamentales',
        bg: 'bg-emerald-500',
    },
    {
        icon: BadgeCheck,
        label: 'RGPD Compliant',
        desc: 'Privacidad garantizada',
        bg: 'bg-blue-500',
    },
    {
        icon: Shield,
        label: 'Pagos Seguros',
        desc: 'Stripe certificado PCI',
        bg: 'bg-violet-500',
    },
    {
        icon: Globe,
        label: 'Cobertura Europea',
        desc: '55.000+ estaciones',
        bg: 'bg-amber-500',
    },
]

export default function SaveFuelTrustCards() {
    return (
        <section className="py-[64px] bg-white font-outfit">
            <div className="max-w-[1120px] mx-auto px-[24px]">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-[12px]">
                    {trustItems.map((item, idx) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 12 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.07 }}
                            className="bg-white border border-gray-100 rounded-[20px] p-[24px] flex flex-col items-center text-center hover:shadow-md transition-all"
                        >
                            <div className={`${item.bg} w-[48px] h-[48px] rounded-[14px] flex items-center justify-center mb-[14px] text-white`}>
                                <item.icon size={22} />
                            </div>
                            <p className="text-[14px] font-bold text-[#0f172a] mb-[4px]">{item.label}</p>
                            <p className="text-[12px] text-gray-400 font-normal">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
