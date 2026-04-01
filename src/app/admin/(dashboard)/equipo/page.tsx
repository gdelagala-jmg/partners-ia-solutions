'use client'

import { Users, Info } from 'lucide-react'
import TeamAdmin from '@/components/admin/TeamAdmin'
import { motion } from 'framer-motion'

export default function TeamPage() {
    return (
        <div className="space-y-10 pb-20">
            {/* Page Header */}
            <header className="relative flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
                <div className="space-y-1">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100 mb-2"
                    >
                        <Users size={12} />
                        Gestión de Capital Humano
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                        Gestión de <span className="text-blue-600 underline decoration-blue-100 decoration-8 underline-offset-4">Equipo</span>
                    </h1>
                    <p className="text-lg text-slate-500 font-medium">Administra los integrantes, sus perfiles y el orden de aparición.</p>
                </div>

                <div className="flex items-center gap-3 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm max-w-sm">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0">
                        <Info size={20} />
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                        <span className="font-bold text-slate-700">Tip:</span> Arrastra las fichas por el icono lateral para cambiar su orden en la web pública.
                    </p>
                </div>
            </header>

            {/* Team Admin Dashboard */}
            <main className="relative z-10">
                <TeamAdmin />
            </main>

            {/* Background elements */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-50/50 rounded-full blur-3xl -z-10 opacity-30 pointer-events-none" />
            <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-indigo-50/50 rounded-full blur-3xl -z-10 opacity-20 pointer-events-none" />
        </div>
    )
}

