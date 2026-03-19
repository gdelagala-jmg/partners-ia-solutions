'use client'

import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'

const testimonials = [
    {
        name: 'Carlos M.',
        country: '🇪🇸 España',
        text: 'En mi ruta Madrid→Bruselas cada semana, ahorro 38€ de media. En un año llevo más de 1.900€ ahorrados.',
        saving: '38€/viaje',
    },
    {
        name: 'Sophie T.',
        country: '🇫🇷 Francia',
        text: 'Voy a trabajar en coche 500km semanales. Desde que uso SaveFuel, mi gasto en gasolina bajó un 18%.',
        saving: '120€/mes',
    },
    {
        name: 'Markus K.',
        country: '🇩🇪 Alemania',
        text: 'Tenemos una furgoneta de reparto. En 3 meses hemos ahorrado casi 600€ solo optimizando las paradas.',
        saving: '200€/mes',
    },
]

export default function SaveFuelTestimonials() {
    return (
        <section className="py-[80px] bg-[#f8fafc] font-outfit">
            <div className="max-w-[1120px] mx-auto px-[24px]">
                {/* Header */}
                <div className="text-center mb-[16px]">
                    <span className="text-[11px] font-bold text-amber-500 uppercase tracking-[0.25em] mb-[12px] block">
                        TESTIMONIOS REALES
                    </span>
                    <h2 className="text-[40px] md:text-[56px] font-black text-[#0f172a] mb-[0] tracking-tight leading-[1.1]">
                        Conductores de toda Europa{' '}
                        <span className="text-amber-400">ya ahorran</span>
                    </h2>
                </div>

                {/* ROI Callout */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[16px] bg-emerald-50 border border-emerald-100 rounded-[16px] px-[24px] py-[16px] mb-[40px]"
                >
                    <div className="flex items-start gap-[12px]">
                        <Lightbulb size={18} className="text-amber-500 mt-[2px] shrink-0" />
                        <p className="text-[14px] text-gray-700 leading-[1.6]">
                            <strong className="font-bold">SaveFuel PRO cuesta <span className="text-emerald-600">2,50€ al mes</span> — menos que un café.</strong>
                            <br />
                            El ahorro medio en el <strong className="text-emerald-600">primer trayecto</strong> es de 20€. La app ya está más que pagada antes de llegar a destino.
                        </p>
                    </div>
                    <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-[20px] py-[10px] rounded-[12px] font-semibold text-[13px] whitespace-nowrap transition-colors shrink-0">
                        ROI en 1 viaje
                    </button>
                </motion.div>

                {/* Testimonial Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[12px]">
                    {testimonials.map((t, idx) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.07 }}
                            className="bg-white rounded-[20px] border border-gray-100 p-[24px] hover:shadow-md transition-all"
                        >
                            <div className="flex items-center justify-between mb-[16px]">
                                <div>
                                    <p className="text-[14px] font-bold text-[#0f172a]">{t.name}</p>
                                    <p className="text-[12px] text-gray-400">{t.country}</p>
                                </div>
                                <span className="text-[14px] font-black text-emerald-600 bg-emerald-50 px-[10px] py-[4px] rounded-full">
                                    {t.saving}
                                </span>
                            </div>
                            <p className="text-[14px] text-gray-500 leading-[1.7]">{t.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
