'use client'

import { motion } from 'framer-motion'
import { Map, Radar, ArrowRight } from 'lucide-react'

const useCases = [
    {
        icon: Map,
        title: 'Modo Ruta (Trayecto)',
        desc: 'Calculamos el ahorro neto real en tu trayecto completo, descontando el coste exacto de cada desvío.',
        color: 'text-emerald-500',
        bg: 'bg-emerald-50',
        borderColor: 'border-emerald-100'
    },
    {
        icon: Radar,
        title: 'Modo Radar (Cercanía)',
        desc: 'Encuentra las mejores opciones en un radio de hasta 50km. Ideal para el día a día en tu ciudad.',
        color: 'text-sky-500',
        bg: 'bg-sky-50',
        borderColor: 'border-sky-100'
    }
]

export default function SaveFuelUseCases() {
    return (
        <section id="use-cases" className="py-10 bg-white font-outfit border-t border-gray-100">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center mb-12">
                    <span className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4 block">
                        COMO AHORRAR
                    </span>
                    <h2 className="text-[40px] md:text-[52px] font-black tracking-tighter leading-[1.1]">
                        Dos formas de usar <span className="text-emerald-500 italic">SaveFuel</span>
                    </h2>
                </div>

                {/* Tighter Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[1000px] mx-auto">
                    {useCases.map((uc, idx) => (
                        <motion.div
                            key={uc.title}
                            initial={{ opacity: 0, scale: 0.98 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className={`group bg-gray-50/30 rounded-[32px] border ${uc.borderColor} p-8 md:p-10 hover:bg-white hover:shadow-2xl transition-all duration-500 relative overflow-hidden`}
                        >
                            <div className="flex flex-col h-full relative z-10">
                                <div className={`w-16 h-16 rounded-[20px] ${uc.bg} flex items-center justify-center mb-8 transform group-hover:scale-110 transition-transform`}>
                                    <uc.icon className={`${uc.color}`} size={28} strokeWidth={2.5} />
                                </div>
                                <h3 className="text-[24px] md:text-[28px] font-black text-[#1D1D1F] mb-4 tracking-tight">{uc.title}</h3>
                                <p className="text-[16px] text-gray-500 leading-relaxed font-inter font-medium mb-8 flex-1">{uc.desc}</p>
                                
                                <div className="flex items-center gap-2 text-emerald-600 font-black text-sm group-hover:gap-4 transition-all uppercase tracking-widest">
                                    Explorar modo <ArrowRight size={18} />
                                </div>
                            </div>
                            
                            {/* Decorative background circle */}
                            <div className={`absolute -bottom-10 -right-10 w-48 h-48 ${uc.bg} rounded-full blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity`} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
