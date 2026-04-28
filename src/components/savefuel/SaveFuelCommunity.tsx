'use client'

import { motion } from 'framer-motion'
import { Users, TrendingUp } from 'lucide-react'
import { useState, useEffect } from 'react'

export default function SaveFuelCommunity() {
    const [count, setCount] = useState(601)
    const [saved, setSaved] = useState(2555)

    useEffect(() => {
        const interval = setInterval(() => {
            setCount(prev => prev + Math.floor(Math.random() * 2))
            setSaved(prev => prev + Math.floor(Math.random() * 5))
        }, 3000)
        return () => clearInterval(interval)
    }, [])

    return (
        <section className="py-10 bg-white font-outfit border-t border-gray-100 overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="bg-gray-50/50 rounded-[40px] p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 border border-gray-100 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-transparent pointer-events-none" />

                    <div className="flex flex-col gap-4 relative z-10 text-center lg:text-left">
                        <div className="flex items-center justify-center lg:justify-start text-emerald-500 mb-2">
                             <Users size={20} className="mr-3" />
                             <span className="text-[12px] font-black uppercase tracking-[0.3em]">Comunidad Real</span>
                        </div>
                        <h3 className="text-[32px] md:text-[44px] font-black text-[#1D1D1F] tracking-tighter leading-tight">
                            Únete a miles de <br className="hidden md:block" /> conductores inteligentes.
                        </h3>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto relative z-10">
                        <div className="bg-white p-6 lg:p-8 rounded-[32px] shadow-xl shadow-emerald-500/5 border border-gray-100 flex flex-col flex-1 min-w-[260px]">
                            <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-2">En directo</span>
                            <div className="flex items-baseline gap-2 whitespace-nowrap">
                                <span className="text-[40px] font-black text-emerald-500 leading-none">{count}</span>
                                <span className="text-[14px] font-bold text-gray-400 uppercase tracking-widest">ahorrando</span>
                            </div>
                            <div className="flex items-center mt-6 text-[11px] font-black text-emerald-600/60 uppercase tracking-widest whitespace-nowrap">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                                Repostando ahora
                            </div>
                        </div>

                        <div className="bg-white p-6 lg:p-8 rounded-[32px] shadow-xl shadow-emerald-500/5 border border-gray-100 flex flex-col flex-1 min-w-[260px]">
                            <span className="text-[11px] font-black text-gray-300 uppercase tracking-widest mb-2">Ahorro Hoy</span>
                            <div className="flex items-baseline gap-2 whitespace-nowrap">
                                <span className="text-[40px] font-black text-emerald-500 leading-none">+{saved}€</span>
                                <span className="text-[14px] font-bold text-gray-400 uppercase tracking-widest">euros</span>
                            </div>
                            <div className="flex items-center mt-6 text-[11px] font-black text-sky-500/60 uppercase tracking-widest whitespace-nowrap">
                                <TrendingUp size={14} className="mr-2" />
                                Tendencia al alza
                            </div>
                        </div>
                    </div>
                </div>
                
                <div className="mt-12 flex flex-wrap justify-center gap-x-12 gap-y-4 opacity-40">
                     <span className="text-[11px] font-black tracking-widest uppercase text-gray-300">Datos Oficiales Verificados</span>
                     <span className="text-[11px] font-black tracking-widest uppercase text-gray-300">RGPD Compliant</span>
                     <span className="text-[11px] font-black tracking-widest uppercase text-gray-300">Infraestructura Prosegur</span>
                </div>
            </div>
        </section>
    )
}
