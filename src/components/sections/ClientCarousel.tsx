'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function ClientCarousel() {
    const [clients, setClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/clients')
            .then(res => res.json())
            .then(data => {
                // Only show active clients with logos
                const activeWithLogos = data.filter((c: any) => c.active && c.logoUrl)
                setClients(activeWithLogos)
                setLoading(false)
            })
            .catch(err => {
                console.error('Error fetching clients for carousel:', err)
                setLoading(false)
            })
    }, [])

    if (loading || clients.length === 0) return null

    // Double the array for seamless infinite loop
    const displayClients = [...clients, ...clients, ...clients]

    return (
        <div className="w-full overflow-hidden py-10 relative">
            {/* Gradient Mask for edges */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex items-center gap-12 sm:gap-20 whitespace-nowrap"
                animate={{
                    x: [0, -1035], // Adjust based on content width roughly
                }}
                transition={{
                    x: {
                        repeat: Infinity,
                        repeatType: "loop",
                        duration: 30,
                        ease: "linear",
                    },
                }}
                style={{ width: "max-content" }}
            >
                {displayClients.map((client, idx) => (
                    <div 
                        key={`${client.id}-${idx}`}
                        className="flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 h-12 w-auto min-w-[120px]"
                    >
                        <img
                            src={client.logoUrl}
                            alt={client.companyName}
                            className="h-full w-auto object-contain max-w-[160px]"
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    )
}
