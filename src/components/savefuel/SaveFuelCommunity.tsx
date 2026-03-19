'use client'

import { motion } from 'framer-motion'
import { Users, TrendingUp, ShieldCheck } from 'lucide-react'
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
        <section className="py-[80px] bg-[#f8fafc] font-outfit">
            <div className="max-w-[1120px] mx-auto px-[24px]">
                <div className="bg-emerald-50 rounded-[24px] p-[28px] md:p-[40px] flex flex-col md:flex-row items-center justify-between gap-[24px] border border-emerald-100">
                    <div className="flex flex-col gap-[8px]">
                        <div className="flex items-center text-emerald-600 mb-[8px]">
                             <Users size={18} className="mr-[10px]" />
                             <span className="text-[11px] font-bold uppercase tracking-[0.25em]">Comunidad Real</span>
                        </div>
                        <h3 className="text-[28px] md:text-[36px] font-black text-[#0f172a] tracking-tight">
                            Únete a miles de <br className="hidden md:block" /> conductores inteligentes.
                        </h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[10px] w-full md:w-auto">
                        <div className="bg-white p-[20px] rounded-[16px] shadow-sm border border-emerald-100/50 flex flex-col">
                            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest mb-[4px]">En directo</span>
                            <div className="flex items-baseline gap-[6px]">
                                <span className="text-[28px] font-black text-emerald-600">{count}</span>
                                <span className="text-[12px] font-medium text-slate-500">conductores</span>
                            </div>
                            <p className="text-[11px] font-medium text-slate-400 mt-[8px] flex items-center">
                                <span className="w-[6px] h-[6px] rounded-full bg-emerald-500 mr-[8px] animate-pulse" />
                                Ahorrando ahora mismo
                            </p>
                        </div>

                        <div className="bg-white p-[20px] rounded-[16px] shadow-sm border border-emerald-100/50 flex flex-col">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-[4px] text-center">Hoy</span>
                            <div className="flex justify-center items-baseline gap-[6px]">
                                <span className="text-[28px] font-black text-emerald-600">+{saved}€</span>
                                <span className="text-[12px] font-medium text-gray-500">ahorrados</span>
                            </div>
                            <p className="text-[11px] font-medium text-gray-400 mt-[8px] flex items-center justify-center">
                                <TrendingUp size={11} className="mr-[6px] text-emerald-500" />
                                Basado en precios oficiales
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="mt-[40px] flex flex-wrap justify-center gap-[24px] opacity-30 grayscale">
                     <span className="text-[10px] font-bold tracking-widest uppercase">Datos Oficiales Verificados</span>
                     <span className="text-[10px] font-bold tracking-widest uppercase">RGPD Compliant</span>
                     <span className="text-[10px] font-bold tracking-widest uppercase">App Web Prosegur</span>
                </div>

            </div>
        </section>
    )
}
