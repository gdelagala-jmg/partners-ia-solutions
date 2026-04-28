'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, BadgeCheck, Lock, Globe } from 'lucide-react'

const trustItems = [
    {
        icon: ShieldCheck,
        label: 'Datos Oficiales',
        desc: '28 APIs de gobierno',
        bg: 'bg-emerald-50',
        color: 'text-emerald-500'
    },
    {
        icon: BadgeCheck,
        label: 'Privacidad',
        desc: 'RGPD Compliant',
        bg: 'bg-sky-50',
        color: 'text-sky-500'
    },
    {
        icon: Lock,
        label: 'Seguridad',
        desc: 'Pagos con Stripe',
        bg: 'bg-emerald-50',
        color: 'text-emerald-500'
    },
    {
        icon: Globe,
        label: 'Cobertura',
        desc: 'Toda la UE',
        bg: 'bg-sky-50',
        color: 'text-sky-500'
    },
]

export default function SaveFuelTrustCards() {
    return (
        <section className="py-16 bg-white font-outfit border-t border-gray-100">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {trustItems.map((item, idx) => (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-gray-50/50 border border-gray-100 rounded-[28px] p-8 flex flex-col items-center text-center hover:bg-white hover:shadow-xl transition-all duration-500"
                        >
                            <div className={`${item.bg} w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${item.color}`}>
                                <item.icon size={28} strokeWidth={2.5} />
                            </div>
                            <h4 className="text-[15px] font-black text-[#1D1D1F] mb-1 tracking-tight uppercase">{item.label}</h4>
                            <p className="text-[13px] text-gray-400 font-bold uppercase tracking-widest">{item.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
