'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

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

    // Duplicate enough times for seamless loop
    const track = [...clients, ...clients, ...clients, ...clients]

    return (
        <div className="w-full mt-6">
            {/* Divider label */}
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-500 text-center mb-5">
                Empresas que ya confían en nosotros
            </p>

            {/* Marquee wrapper */}
            <div className="relative w-full overflow-hidden">
                {/* Fade masks — white bg */}
                <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

                <div className="flex gap-6 animate-clients-marquee" style={{ width: 'max-content' }}>
                    {track.map((client, idx) => (
                        <div
                            key={`${client.id}-${idx}`}
                            className="group flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-2xl px-6 py-4 hover:bg-gray-200 transition-all duration-300 cursor-pointer"
                            style={{ minWidth: 160, height: 80 }}
                        >
                            <Image
                                src={client.logoUrl}
                                alt={client.companyName}
                                width={140}
                                height={48}
                                className="h-8 w-auto object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-400"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
