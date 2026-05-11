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
                    // Filter active and show in footer
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

    if (loading || partners.length === 0 || (settings && !settings.isActive)) return null

    const gridCols = settings?.layout === 'GRID' ? 'grid-cols-3 sm:grid-cols-4 lg:grid-cols-4' : 'grid-cols-2 sm:grid-cols-3'

    return (
        <div className="w-full animate-in fade-in slide-in-from-right-4 duration-700">
            <h3 className="text-[10px] font-black text-gray-400 mb-4 tracking-[0.2em] uppercase">
                {settings?.title || 'Partners Estratégicos'}
            </h3>
            
            <div className={`grid ${gridCols} gap-2`}>
                {partners.map((partner) => (
                    <Link 
                        key={partner.id}
                        href={partner.websiteUrl || '#'}
                        target={partner.websiteUrl ? "_blank" : undefined}
                        className="group relative h-10 w-full bg-white rounded-lg border border-gray-200/50 p-1.5 flex items-center justify-center transition-all hover:border-indigo-200 hover:shadow-sm"
                        title={partner.name}
                    >
                        {partner.logoUrl ? (
                            <div className="relative w-full h-full grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                                <Image
                                    src={partner.logoUrl}
                                    alt={partner.logoAlt || partner.name}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <span className="text-[8px] font-black text-gray-400 group-hover:text-indigo-600 transition-colors truncate uppercase tracking-tighter">
                                {partner.name}
                            </span>
                        )}
                    </Link>
                ))}
            </div>
        </div>
    )
}
