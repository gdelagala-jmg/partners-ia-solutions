'use client'

import { Check } from 'lucide-react'

const badges = [
    'DATOS GUBERNAMENTALES OFICIALES',
    'SIN REGISTRO',
    'MÓVIL Y PC',
    'RGPD COMPLIANT',
    '6 IDIOMAS',
]

export default function SaveFuelTrustBar() {
    return (
        <div className="bg-[#f8fafc] border-y border-gray-100 py-[16px] font-outfit overflow-hidden">
            <div className="max-w-[1120px] mx-auto px-[24px]">
                <div className="flex flex-wrap items-center justify-center gap-x-[32px] gap-y-[8px]">
                    {badges.map((badge) => (
                        <span key={badge} className="flex items-center gap-[6px] text-[11px] font-semibold text-gray-400 uppercase tracking-[0.15em]">
                            <Check size={12} className="text-emerald-500" strokeWidth={2.5} />
                            {badge}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
