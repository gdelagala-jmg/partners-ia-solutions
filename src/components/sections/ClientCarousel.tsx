'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

// ─── ClientCarousel — Premium Logo Wall ──────────────────────────────────────
//
//  FILOSOFÍA:
//  Los assets se suben normalizados 1:1 (canvas cuadrado, logo a borde,
//  cero padding interno). El frontend NO reinterpreta ni reduce el logo:
//  actúa como ventana transparente al asset.
//
//  RENDER:
//  • Contenedor cuadrado responsivo — sin fondo, sin borde, sin card
//  • Imagen con fill + object-contain — logo ocupa todo el cuadrado
//  • Sin padding interno — inset-0 absoluto
//  • opacity-70 base → opacity-100 en hover
//  • grayscale suave → color en hover
//  • Transición premium 300ms ease-out
//
//  TAMAÑOS:
//  • Mobile  (default):  64 × 64 px  — w-16 h-16
//  • Tablet  (sm: 640px): 80 × 80 px  — sm:w-20 sm:h-20
//  • Desktop (md: 768px): 96 × 96 px  — md:w-24 md:h-24
//
//  GAP:
//  • Mobile:  gap-4  (16px)
//  • Tablet:  sm:gap-6 (24px)
//  • Desktop: md:gap-8 (32px)
//
// ─────────────────────────────────────────────────────────────────────────────

export default function ClientCarousel() {
    const [clients, setClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/clients')
            .then(res => res.json())
            .then(data => {
                const activeWithLogos = data.filter((c: any) => c.active && c.logoUrl)
                setClients(activeWithLogos)
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    if (loading || clients.length === 0) return null

    // Duplicate track for seamless marquee loop
    const track = [...clients, ...clients, ...clients, ...clients]

    return (
        <div className="w-full mt-6">

            {/* Label */}
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 text-center mb-5">
                Empresas que ya confían en nosotros
            </p>

            {/* Marquee container */}
            <div className="relative w-full overflow-hidden">

                {/* Fade edges — blends with white page background */}
                <div className="absolute inset-y-0 left-0 w-16 md:w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-16 md:w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                {/* Scrolling track */}
                <div
                    className="flex gap-4 sm:gap-6 md:gap-8 animate-clients-marquee"
                    style={{ width: 'max-content' }}
                >
                    {track.map((client, idx) => (
                        // ── Logo slot ────────────────────────────────────────
                        // Cuadrado puro: sin fondo, sin borde, sin padding.
                        // Tamaño responsivo: 64 / 80 / 96 px.
                        // El asset 1:1 ocupa el 100% del slot vía fill + inset-0.
                        <div
                            key={`${client.id}-${idx}`}
                            className={[
                                'group flex-shrink-0 relative',
                                // Responsive square sizes
                                'w-16 h-16',          // mobile  — 64px
                                'sm:w-20 sm:h-20',    // tablet  — 80px
                                'md:w-24 md:h-24',    // desktop — 96px
                            ].join(' ')}
                        >
                            <Image
                                src={client.logoUrl}
                                alt={client.companyName}
                                fill
                                // object-contain: respeta proporciones, no deforma.
                                // inset-0 ya está en fill — cero reducción artificial.
                                className={[
                                    'object-contain',
                                    // Grayscale suave por defecto — no invisible
                                    'grayscale opacity-70',
                                    // Hover: color completo, opacidad total
                                    'group-hover:grayscale-0 group-hover:opacity-100',
                                    'transition-all duration-300 ease-out',
                                ].join(' ')}
                                sizes="(max-width: 640px) 64px, (max-width: 768px) 80px, 96px"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
