'use client'

import { useEffect, useState } from 'react'
import { Check, SlidersHorizontal } from 'lucide-react'

interface Sector {
    id: string
    name: string
}

interface SolutionsFilterProps {
    selectedSector: string | null
    onSelectSector: (id: string | null) => void
}

export default function SolutionsFilter({ selectedSector, onSelectSector }: SolutionsFilterProps) {
    const [sectors, setSectors] = useState<Sector[]>([])

    useEffect(() => {
        const fetchSectors = async () => {
            try {
                const res = await fetch('/api/sectors?active=true')
                if (res.ok) {
                    const data = await res.json()
                    setSectors(data)
                }
            } catch (error) {
                console.error('Error fetching sectors for filter:', error)
            }
        }
        fetchSectors()
    }, [])

    if (sectors.length === 0) return null

    return (
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-8 pb-6 border-b border-gray-100">
            <div className="flex items-center text-gray-500 text-sm font-medium mr-2">
                <SlidersHorizontal size={18} className="mr-2" />
                Filtrar por:
            </div>

            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onSelectSector(null)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedSector === null
                        ? 'bg-black text-white shadow-md'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    Todas
                </button>
                {sectors.map((sector) => (
                    <button
                        key={sector.id}
                        onClick={() => onSelectSector(sector.id)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center ${selectedSector === sector.id
                            ? 'bg-black text-white shadow-md'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                            }`}
                    >
                        {selectedSector === sector.id && <Check size={14} className="mr-1.5" />}
                        {sector.name}
                    </button>
                ))}
            </div>
        </div>
    )
}
