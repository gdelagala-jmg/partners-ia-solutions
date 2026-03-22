'use client'

import { motion } from 'framer-motion'
import { Check, Zap } from 'lucide-react'

export default function SaveFuelPricing() {
    return (
        <section id="pricing" className="py-24 bg-white font-sans overflow-hidden">
            <div className="max-w-6xl mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto items-stretch">
                    
                    {/* Gratis Card */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-white border border-gray-100 rounded-[32px] p-10 flex flex-col shadow-xl shadow-gray-100/50"
                    >
                        <div className="mb-10">
                            <h3 className="text-[32px] font-bold text-[#0f172a] mb-2">Gratis</h3>
                            <p className="text-gray-400 text-[18px]">Ideal para conductores ocasionales.</p>
                        </div>

                        <div className="mb-10">
                            <div className="flex items-baseline gap-1">
                                <span className="text-[64px] font-black text-[#0f172a]">0€</span>
                                <span className="text-[24px] text-slate-400 font-medium">/mes</span>
                            </div>
                        </div>

                        <ul className="space-y-5 mb-12 flex-1">
                            <PricingFeature text="3 rutas de prueba" />
                            <PricingFeature text="Tu país" />
                            <PricingFeature text="Ver ahorro detectado" />
                            <PricingFeature text="6 idiomas" />
                        </ul>

                        <button className="w-full py-5 bg-[#F1F3F5] text-[#0f172a] font-bold text-[20px] rounded-[20px] border-2 border-[#1c7ed6] transition-all hover:bg-gray-100">
                            Empezar Gratis
                        </button>
                    </motion.div>

                    {/* PRO Card */}
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="relative bg-[#1A1A1A] border-2 border-[#00D28A] rounded-[32px] p-10 flex flex-col shadow-2xl"
                    >
                        {/* Green Badge */}
                        <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#00D28A] text-white px-6 py-2 rounded-2xl text-[14px] font-bold flex items-center gap-2 shadow-lg">
                            <Zap size={16} fill="white" />
                            RECOMENDADO
                        </div>

                        <div className="mb-10 pt-4">
                            <h3 className="text-[32px] font-bold text-white mb-2">PRO</h3>
                            <p className="text-gray-500 text-[18px]">Todo el potencial del ahorro europeo.</p>
                        </div>

                        <div className="mb-10">
                            <div className="flex items-baseline gap-1">
                                <span className="text-[64px] font-black text-white">9,99€</span>
                                <span className="text-[24px] text-gray-500 font-medium">/año</span>
                            </div>
                        </div>

                        <ul className="space-y-5 mb-12 flex-1 text-white">
                            <PricingFeature text="Rutas ilimitadas 10 países" pro />
                            <PricingFeature text="Sincronización Navi voz IA" pro />
                            <PricingFeature text="Modo Multi-repostaje" pro />
                            <PricingFeature text="Historial de ahorro detallado" pro />
                            <PricingFeature text="Misiones y Gamificación" pro />
                            <PricingFeature text="Acceso anticipado a funciones" pro />
                            <PricingFeature text="Sin publicidad" pro />
                        </ul>

                        <button className="w-full py-5 bg-[#00D28A] hover:bg-[#00bf7d] text-white font-bold text-[20px] rounded-[24px] transition-all hover:scale-[1.02] shadow-xl shadow-emerald-900/20">
                            Suscribirse Ahora
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

function PricingFeature({ text, pro = false }: { text: string, pro?: boolean }) {
    return (
        <li className="flex items-center gap-4 text-[17px] font-medium">
            <Check size={22} className="text-[#00D28A] flex-shrink-0" />
            <span className={pro ? 'text-gray-300' : 'text-slate-700'}>{text}</span>
        </li>
    )
}
