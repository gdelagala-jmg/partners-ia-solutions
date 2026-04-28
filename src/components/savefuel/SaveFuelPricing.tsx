'use client'

import { motion } from 'framer-motion'
import { Check, Zap } from 'lucide-react'

export default function SaveFuelPricing() {
    return (
        <section id="pricing" className="py-10 bg-white font-outfit overflow-hidden border-t border-gray-100">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="text-center mb-16">
                    <span className="text-[12px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4 block">
                        PLANES Y PRECIOS
                    </span>
                    <h2 className="text-[36px] md:text-[52px] font-black tracking-tighter leading-[1.1] mb-6 text-[#1D1D1F]">
                        La inversión que <br className="hidden md:block" />
                        se <span className="text-emerald-500 italic">paga sola.</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-[900px] mx-auto">
                    
                    {/* Básico Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="bg-gray-50/50 border border-gray-100 rounded-[32px] p-8 md:p-10 flex flex-col hover:bg-white hover:shadow-xl transition-all duration-500"
                    >
                        <div className="mb-6">
                            <h3 className="text-[24px] font-black text-[#1D1D1F] mb-1">Básico</h3>
                            <p className="text-gray-400 text-[15px] font-medium font-inter">Conductores ocasionales.</p>
                        </div>

                        <div className="mb-8">
                            <div className="flex items-baseline gap-1">
                                <span className="text-[48px] font-black text-[#1D1D1F]">0€</span>
                                <span className="text-[18px] text-gray-400 font-bold uppercase tracking-widest">/mes</span>
                            </div>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1">
                            <PricingFeature text="Rutas base" />
                            <PricingFeature text="Acceso 1 país" />
                            <PricingFeature text="Ahorro detectado" />
                            <PricingFeature text="Soporte web" />
                        </ul>

                        <button className="w-full py-4 bg-white border border-gray-200 text-[#1D1D1F] font-black text-[16px] rounded-[20px] hover:bg-gray-50 transition-all">
                            Empezar Gratis
                        </button>
                    </motion.div>

                    {/* PRO Card */}
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        className="relative bg-white border-2 border-emerald-500 rounded-[32px] p-8 md:p-10 flex flex-col shadow-2xl shadow-emerald-500/10 overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 bg-emerald-500 text-white px-6 py-2 rounded-bl-[20px] text-[10px] font-black uppercase tracking-widest flex items-center gap-2 z-10">
                            <Zap size={12} fill="currentColor" />
                            MÁS POPULAR
                        </div>

                        <div className="mb-6 relative z-10">
                            <h3 className="text-[24px] font-black text-[#1D1D1F] mb-1">PRO</h3>
                            <p className="text-gray-400 text-[15px] font-medium font-inter">Potencial europeo total.</p>
                        </div>

                        <div className="mb-8 relative z-10">
                            <div className="flex items-baseline gap-1">
                                <span className="text-[48px] font-black text-emerald-500">9,99€</span>
                                <span className="text-[18px] text-emerald-500/50 font-bold uppercase tracking-widest">/año</span>
                            </div>
                            <p className="text-[12px] text-gray-400 font-bold mt-1 uppercase tracking-widest">Pago único anual</p>
                        </div>

                        <ul className="space-y-3 mb-8 flex-1 relative z-10">
                            <PricingFeature text="Rutas ilimitadas 28 países" pro />
                            <PricingFeature text="Alertas de precio real" pro />
                            <PricingFeature text="Cálculo ahorro neto" pro />
                            <PricingFeature text="Modo Multi-repostaje" pro />
                            <PricingFeature text="Sin publicidad" pro />
                        </ul>

                        <button className="relative z-10 w-full py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-[16px] rounded-[20px] transition-all hover:scale-[1.02] shadow-xl shadow-emerald-500/20">
                            Suscribirse PRO
                        </button>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

function PricingFeature({ text, pro = false }: { text: string, pro?: boolean }) {
    return (
        <li className="flex items-center gap-3 text-[15px] font-semibold font-inter">
            <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${pro ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-300'}`}>
                <Check size={12} strokeWidth={4} />
            </div>
            <span className={pro ? 'text-[#1D1D1F]' : 'text-gray-400'}>{text}</span>
        </li>
    )
}
