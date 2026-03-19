'use client'

import { motion } from 'framer-motion'

const useCases = [
    {
        emoji: '👨‍👩‍👧‍👦',
        title: 'Viajes en familia',
        desc: 'Madrid → Playa. Ahorra 15€ solo eligiendo bien dónde parar. Eso son dos helados.',
    },
    {
        emoji: '🚛',
        title: 'Transportistas',
        desc: 'Rutas diarias entre países. A 3.000 km/semana, el ahorro es de 80-120€/mes.',
    },
    {
        emoji: '💼',
        title: 'Viajeros de negocios',
        desc: 'Repostaje eficiente en rutas internacionales. Justifica el gasto de empresa al céntimo.',
    },
    {
        emoji: '🏕️',
        title: 'Autocaravanistas',
        desc: 'Tu hogar sobre ruedas consume más. SaveFuel te ahorra hasta 400€/año en repostajes.',
    },
]

export default function SaveFuelUseCases() {
    return (
        <section className="py-[80px] bg-[#f8fafc] font-outfit">
            <div className="max-w-[1120px] mx-auto px-[24px]">
                {/* Header */}
                <div className="text-center mb-[48px]">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-[0.25em] mb-[12px] block">
                        CASOS DE USO
                    </span>
                    <h2 className="text-[40px] md:text-[56px] font-black text-[#0f172a] tracking-tight leading-[1.1]">
                        ¿Quién usa{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#0ea5e9]">
                            SaveFuel
                        </span>
                        ?
                    </h2>
                </div>

                {/* Use Case Cards — 2 cols grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px]">
                    {useCases.map((uc, idx) => (
                        <motion.div
                            key={uc.title}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.07 }}
                            className="bg-white rounded-[20px] border border-gray-100 p-[24px] hover:shadow-md transition-all"
                        >
                            <div className="flex items-center gap-[12px] mb-[12px]">
                                <div className="w-[40px] h-[40px] rounded-[12px] bg-gray-100 flex items-center justify-center text-[20px]">
                                    {uc.emoji}
                                </div>
                                <h3 className="text-[16px] font-bold text-[#0f172a]">{uc.title}</h3>
                            </div>
                            <p className="text-[14px] text-gray-500 leading-[1.7] font-normal">{uc.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
