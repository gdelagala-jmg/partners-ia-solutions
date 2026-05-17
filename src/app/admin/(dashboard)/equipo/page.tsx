'use client'

import { Users, Info } from 'lucide-react'
import TeamAdmin from '@/components/admin/TeamAdmin'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import { motion } from 'framer-motion'

export default function TeamPage() {
    return (
        <div className="w-full max-w-full min-w-0 space-y-8">
            <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md p-3.5 px-4 rounded-2xl border border-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] max-w-sm mx-4 md:mx-0">
                <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 shrink-0 border border-amber-100/50">
                    <Info size={18} />
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                    <strong className="text-[#1D1D1F]">Tip:</strong> Arrastra las fichas por el icono lateral para reordenar el equipo en tiempo real.
                </p>
            </div>

            {/* Team Admin Dashboard */}
            <main className="relative">
                <TeamAdmin />
            </main>
        </div>
    )
}
