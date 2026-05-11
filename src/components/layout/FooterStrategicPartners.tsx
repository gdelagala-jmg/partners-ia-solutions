'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

export default function FooterStrategicPartners() {
    const [partners, setPartners] = useState<any[]>([])
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [partnersRes, settingsRes] = await Promise.all([
                    fetch('/api/strategic-partners'),
                    fetch('/api/strategic-partners/settings')
                ])

                if (partnersRes.ok) {
                    const data = await partnersRes.json()
                    setPartners(Array.isArray(data) ? data.filter((p: any) => p.isActive && p.showInFooter) : [])
                }

                if (settingsRes.ok) {
                    const data = await settingsRes.json()
                    setSettings(data)
                }
            } catch (error) {
                console.error('Error fetching footer partners:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    if (loading || partners.length === 0 || (settings && !settings.footerEnabled)) return null

    const strategicPartners = partners.filter(p => p.category === 'Partners')
    const techTools = partners.filter(p => p.category !== 'Partners')

    return (
        <div className="w-full space-y-6 animate-in fade-in slide-in-from-right-4 duration-700">

            {/* ── Partners Estratégicos ─────────────────────────────── */}
            {strategicPartners.length > 0 && (
                <div>
                    <h3 className="text-[10px] font-black text-gray-400 mb-3 tracking-[0.2em] uppercase flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-indigo-200" />
                        {settings?.sectionTitle || 'Partners Estratégicos'}
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {strategicPartners.map((partner) => (
                            <PartnerLogo key={partner.id} partner={partner} size="md" />
                        ))}
                    </div>
                </div>
            )}

            {/* ── Herramientas Utilizadas ───────────────────────────── */}
            {techTools.length > 0 && (
                <div>
                    <h3 className="text-[10px] font-black text-gray-400 mb-3 tracking-[0.2em] uppercase flex items-center gap-2">
                        <span className="w-4 h-[1px] bg-gray-200" />
                        Herramientas Utilizadas
                    </h3>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
                        {techTools.map((partner) => (
                            <PartnerLogo key={partner.id} partner={partner} size="sm" />
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}

// ─── PartnerLogo — Premium Logo Wall ─────────────────────────────────────────
//
//  DISEÑO:
//  • Contenedor limpio — SIN aspecto badge / botón / pill
//  • Border radius 6px (sutil, solo estructural)
//  • Borde 1px casi invisible — solo para delimitar el cuadrado
//  • Fondo blanco muy sutil — NO caja opaca
//  • Logo ocupa el 100% del contenedor vía `fill` + `object-contain`
//  • SIN padding interno que reduzca visualmente el logo
//  • Hover: grayscale → color, opacity 35% → 100%, micro-sombra
//  • Proporciones respetadas — `object-contain` nunca deforma
//
//  TAMAÑOS:
//  • md (Partners): h-10 — ligeramente más protagonistas
//  • sm (Herramientas): h-7 — compactos, misma coherencia editorial
//
// ─────────────────────────────────────────────────────────────────────────────
function PartnerLogo({ partner, size }: { partner: any; size: 'md' | 'sm' }) {
    return (
        <Link
            href={partner.websiteUrl || '#'}
            target={partner.websiteUrl ? '_blank' : undefined}
            rel="noopener noreferrer"
            title={partner.name}
            className={[
                // Estructura base — logo wall limpio
                'group relative block overflow-hidden',
                size === 'md' ? 'h-10' : 'h-7',
                'w-full',
                // Contenedor: radio sutil, sin aspecto botón
                'rounded-[6px]',
                // Borde estructural mínimo
                'border border-gray-100',
                // Fondo: translúcido → sólido en hover
                'bg-white/50',
                // Hover: elevación suave premium
                'hover:border-gray-200/80 hover:bg-white hover:shadow-[0_1px_6px_rgba(0,0,0,0.05)]',
                'transition-all duration-300 ease-out',
            ].join(' ')}
        >
            {partner.logoUrl ? (
                // Logo: fill absoluto — cero padding — respeta proporciones
                <div className="absolute inset-0 grayscale opacity-35 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 ease-out">
                    <Image
                        src={partner.logoUrl}
                        alt={partner.logoAlt || partner.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 50vw, 120px"
                    />
                </div>
            ) : (
                // Fallback textual cuando no hay logo
                <span className="absolute inset-0 flex items-center justify-center text-[7px] font-black text-gray-300 group-hover:text-gray-500 transition-colors duration-300 uppercase tracking-tighter px-1 text-center leading-tight">
                    {partner.name}
                </span>
            )}
        </Link>
    )
}
