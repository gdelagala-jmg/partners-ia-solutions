'use client'

import { Users, Info } from 'lucide-react'
import TeamAdmin from '@/components/admin/TeamAdmin'
import { motion } from 'framer-motion'

export default function TeamPage() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">
                        Gestión de Equipo
                    </h1>
                    <p className="text-gray-400 mt-1 font-medium max-w-xl">
                        Organiza el capital humano y controla la visibilidad de los perfiles en el portal público.
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md p-3.5 px-4 rounded-2xl border border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] max-w-sm">
                    <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 border border-amber-100/50">
                        <Info size={18} />
                    </div>
                    <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                        <strong className="text-[#1D1D1F]">Tip:</strong> Arrastra las fichas por el icono lateral para reordenar el equipo en tiempo real.
                    </p>
                </div>
            </header>

            {/* Team Admin Dashboard */}
            <main className="relative">
                <TeamAdmin />
            </main>
        </div>
    )
}
