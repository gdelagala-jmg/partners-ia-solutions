'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

const faqs = [
    { q: '¿Es realmente gratuito?', a: 'Sí, la versión básica permite buscar y comparar precios en tu país de origen sin coste alguno.' },
    { q: '¿De dónde vienen los datos?', a: 'Los precios son oficiales y se obtienen directamente de las bases de datos gubernamentales de cada país europeo (como el Geoportal en España).' },
    { q: '¿Cómo ahorro 250€ al año?', a: 'Basado en un consumo medio de 1.500km/mes, la diferencia entre la gasolinera más cara y la más barata suele ser de 0.15€/litro.' },
]

export default function SaveFuelFAQ() {
    return (
        <section id="faq" className="py-[80px] bg-[#f8fafc] font-outfit">
            <div className="max-w-[720px] mx-auto px-[24px]">
                <h2 className="text-[36px] font-black text-[#0f172a] mb-[40px] text-center tracking-tight">Preguntas Frecuentes</h2>
                <div className="space-y-[8px]">
                    {faqs.map((faq, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="p-[20px] rounded-[16px] border border-gray-100 hover:border-emerald-100 transition-colors bg-white shadow-sm"
                        >
                            <h4 className="font-bold text-[#0f172a] text-[15px] mb-[8px] flex justify-between items-center group cursor-pointer">
                                {faq.q}
                                <Plus size={16} className="text-emerald-600 transition-transform group-hover:rotate-90 flex-shrink-0" />
                            </h4>
                            <p className="text-[14px] text-slate-500 font-normal leading-[1.7]">{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
