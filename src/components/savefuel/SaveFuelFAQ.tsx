'use client'

import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'

const faqs = [
    { 
        q: '¿Es gratis SaveFuel?', 
        a: 'Sí, SaveFuel tiene un plan gratuito para comparar gasolineras y calcular rutas base. El plan PRO desbloquea la optimización completa en toda Europa.' 
    },
    { 
        q: '¿En qué países funciona?', 
        a: 'En España y 28 países de la Unión Europea, con datos oficiales directos de los ministerios nacionales.' 
    },
    { 
        q: '¿Necesito registrarme?', 
        a: 'No es obligatorio. Puedes buscar y calcular rutas de forma anónima. El registro solo es necesario para gestionar tu suscripción PRO.' 
    },
    { 
        q: '¿Cómo calculáis el ahorro?', 
        a: 'Analizamos el precio del combustible por litro multiplicado por tu capacidad de depósito, restando el coste real del desvío (combustible gastado extra).' 
    }
]

export default function SaveFuelFAQ() {
    return (
        <section id="faq" className="py-10 bg-white font-outfit border-t border-gray-100">
            <div className="max-w-[700px] mx-auto px-6">
                <div className="text-center mb-12">
                    <span className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4 block">
                        AYUDA
                    </span>
                    <h2 className="text-[32px] md:text-[40px] font-black text-[#1D1D1F] tracking-tighter">
                        Preguntas <span className="text-emerald-500 italic">frecuentes.</span>
                    </h2>
                </div>
                
                <div className="space-y-3">
                    {faqs.map((faq, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-6 md:p-8 rounded-[24px] border border-gray-100 hover:border-emerald-100 hover:bg-emerald-50/10 transition-all duration-300 bg-gray-50/20 group cursor-pointer"
                        >
                            <h4 className="font-black text-[#1D1D1F] text-[16px] md:text-[18px] mb-3 flex justify-between items-center gap-4">
                                {faq.q}
                                <div className="w-7 h-7 rounded-full bg-white border border-gray-100 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-all shrink-0">
                                    <Plus size={16} strokeWidth={4} />
                                </div>
                            </h4>
                            <p className="text-[14px] md:text-[15px] text-gray-500 font-medium font-inter leading-relaxed">{faq.a}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
