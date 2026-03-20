'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function ClientCarousel() {
    // ...
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
            .catch(err => {
                console.error('Error fetching clients for carousel:', err)
                setLoading(false)
            })
    }, [])

    if (loading || clients.length === 0) return null

    const displayClients = [...clients, ...clients, ...clients]

    return (
        <div className="w-full overflow-hidden py-8 relative">
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

            <motion.div
                className="flex items-center gap-10 sm:gap-16 whitespace-nowrap"
                animate={{
                    x: [0, -1035],
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
                        className="flex items-center justify-center grayscale opacity-40 hover:grayscale-0 hover:opacity-100 transition-all duration-500 h-12 w-auto min-w-[120px] relative"
                    >
                        <Image
                            src={client.logoUrl}
                            alt={client.companyName}
                            width={160}
                            height={48}
                            className="h-full w-auto object-contain max-w-[160px]"
                        />
                    </div>
                ))}
            </motion.div>
        </div>
    )
}
