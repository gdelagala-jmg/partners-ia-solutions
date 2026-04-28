'use client'

import { ShieldCheck } from 'lucide-react'

const badges = [
    'DATOS GUBERNAMENTALES OFICIALES',
    'SIN REGISTRO OBLIGATORIO',
    'INSTALABLE EN MÓVIL',
    'COBERTURA 28 PAÍSES',
    'SOPORTE 6 IDIOMAS',
]

export default function SaveFuelTrustBar() {
    return (
        <div className="bg-gray-50/50 border-y border-gray-100 py-6 font-outfit overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
                    {badges.map((badge) => (
                        <span key={badge} className="flex items-center gap-2 text-[10px] sm:text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] transition-colors hover:text-emerald-500 cursor-default">
                            <ShieldCheck size={14} className="text-emerald-500/50" />
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
