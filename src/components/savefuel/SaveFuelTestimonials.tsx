'use client'

import { motion } from 'framer-motion'
import { Quote } from 'lucide-react'

const testimonials = [
    {
        name: 'Carlos M.',
        role: 'Conductor Profesional',
        text: 'En mi ruta Madrid→Bruselas cada semana, ahorro 38€ de media. En un año llevo más de 1.900€ ahorrados.',
        saving: '38€/viaje',
    },
    {
        name: 'Sophie T.',
        role: 'Commuter Diario',
        text: 'Voy a trabajar en coche 500km semanales. Desde que uso SaveFuel, mi gasto en gasolina bajó un 18%.',
        saving: '120€/mes',
    },
    {
        name: 'Markus K.',
        role: 'Gestor de Flotas',
        text: 'Tenemos una furgoneta de reparto. En 3 meses hemos ahorrado casi 600€ solo optimizando las paradas.',
        saving: '200€/mes',
    },
]

export default function SaveFuelTestimonials() {
    return (
        <section className="py-10 bg-white font-outfit border-t border-gray-100 overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4 block">
                        TESTIMONIOS REALES
                    </span>
                    <h2 className="text-[40px] md:text-[60px] font-black text-[#1D1D1F] tracking-tighter leading-[1.05]">
                        Conductores que <br />
                        <span className="text-emerald-500">ya están ahorrando.</span>
                    </h2>
                </div>

                {/* Testimonial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: idx * 0.1 }}
                            className="bg-gray-50/50 border border-gray-100 rounded-[32px] p-10 hover:bg-white hover:shadow-2xl transition-all duration-500 relative group"
                        >
                            <Quote className="text-emerald-500/10 absolute top-8 right-8 w-16 h-16 transform group-hover:scale-110 transition-transform" />
                            
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-8">
                                    <span className="text-[12px] font-black text-emerald-500 bg-emerald-50 px-4 py-2 rounded-full uppercase tracking-widest">
                                        AHORRO: {t.saving}
                                    </span>
                                </div>
                                <p className="text-[17px] text-gray-500 font-medium font-inter leading-relaxed mb-8 italic">
                                    "{t.text}"
                                </p>
                                <div>
                                    <h4 className="text-[18px] font-black text-[#1D1D1F] tracking-tight">{t.name}</h4>
                                    <p className="text-[13px] text-gray-400 font-bold uppercase tracking-widest">{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
