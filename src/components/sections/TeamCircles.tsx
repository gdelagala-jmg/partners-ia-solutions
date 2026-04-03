'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Settings, Rocket, Gem, Handshake, Loader2 } from 'lucide-react'

interface TeamMember {
    id: string
    name: string
    photoUrl: string | null
    role: string | null
    showPhoto: boolean
    showName: boolean
    customFields: string
    order: number
}

const iconMap: Record<string, any> = {
    Zap, Settings, Rocket, Gem, Handshake
}

// Colores de halo + badge por nombre (identidad fija de marca)
const memberStyles: Record<string, { glow: string; badge: string }> = {
    álvaro:  { glow: 'shadow-[0_0_45px_12px_rgba(251,146,60,0.35)]',  badge: 'from-orange-400 to-orange-500' },
    jose:    { glow: 'shadow-[0_0_45px_12px_rgba(59,130,246,0.35)]',  badge: 'from-blue-500 to-blue-600' },
    josé:    { glow: 'shadow-[0_0_45px_12px_rgba(59,130,246,0.35)]',  badge: 'from-blue-500 to-blue-600' },
    diego:   { glow: 'shadow-[0_0_45px_12px_rgba(236,72,153,0.35)]',  badge: 'from-pink-500 to-fuchsia-500' },
    jaime:   { glow: 'shadow-[0_0_45px_12px_rgba(16,185,129,0.35)]',  badge: 'from-emerald-400 to-teal-500' },
    gonzalo: { glow: 'shadow-[0_0_45px_12px_rgba(239,68,68,0.35)]',   badge: 'from-red-500 to-rose-500' },
}

function getMemberStyle(name: string) {
    const key = name.toLowerCase().split(' ')[0]
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quitar tildes para comparar
    // buscar coincidencia
    for (const [k, v] of Object.entries(memberStyles)) {
        const kNorm = k.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        if (key.includes(kNorm) || kNorm.includes(key)) return v
    }
    return { glow: 'shadow-[0_0_45px_12px_rgba(99,102,241,0.3)]', badge: 'from-indigo-500 to-violet-500' }
}

function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

export default function TeamCircles() {
    const [members, setMembers] = useState<TeamMember[]>([])
    const [order, setOrder] = useState<TeamMember[]>([])
    const [visible, setVisible] = useState(true)
    const [loading, setLoading] = useState(true)

    const fetchMembers = async () => {
        try {
            const res = await fetch('/api/team')
            const data = await res.json()
            if (Array.isArray(data)) {
                const publicMembers = data.filter((m: TeamMember) => m.showPhoto)
                setMembers(publicMembers)
                setOrder(publicMembers)
            }
        } catch (error) {
            console.error('Error fetching team:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchMembers() }, [])

    // Shuffle cada 24s: todo el grupo desaparece → se baraja → reaparece
    const cycle = useCallback(() => {
        if (members.length <= 1) return
        setVisible(false)
        setTimeout(() => setOrder(shuffleArray(members)), 600)
        setTimeout(() => setVisible(true), 1000)
    }, [members])

    useEffect(() => {
        if (members.length > 1) {
            const interval = setInterval(cycle, 24000)
            return () => clearInterval(interval)
        }
    }, [cycle, members.length])

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="animate-spin text-blue-400/40" size={28} />
            </div>
        )
    }

    if (members.length === 0) return null

    const visibleMembers = order.filter(m => m.showPhoto)

    return (
        <section className="py-24 relative overflow-hidden bg-transparent">
            {/* Halo de luz azul central como en la versión original */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(219,234,254,0.35)_0%,_rgba(255,255,255,0)_60%)] pointer-events-none" />

            {/* Título */}
            <div className="text-center mb-10 relative z-10">
                <p className="text-[11px] font-semibold tracking-[0.35em] text-slate-500 uppercase">EL EQUIPO</p>
                <p className="text-[11px] text-slate-400 italic mt-1">*Interactúa con los iconos de nuestro ADN</p>
            </div>

            {/* 
                CAPA 1 → motion.div con opacity controlado por `visible`
                         El shuffle de 24s apaga/enciende todo el grupo (fade grupal)
                CAPA 2 → AnimatePresence sin mode
                         Si el admin oculta un miembro, SOLO ese hace fade out/in independiente
            */}
            <div className="relative z-10 w-full max-w-[1400px] mx-auto px-10">
                <motion.div
                    animate={{ opacity: visible ? 1 : 0 }}
                    transition={{ duration: 0.45, ease: 'easeInOut' }}
                    className="flex flex-nowrap justify-center items-center gap-3 sm:gap-6 md:gap-10 lg:gap-16 py-12"
                >
                    <AnimatePresence mode="popLayout">
                        {visibleMembers.map((member) => {
                            const style = getMemberStyle(member.name)

                            let iconName = 'Zap'
                            try {
                                const fields = JSON.parse(member.customFields || '{}')
                                if (fields.icon && iconMap[fields.icon]) iconName = fields.icon
                            } catch (e) {}
                            const Icon = iconMap[iconName] || Zap

                            return (
                                <motion.div
                                    key={member.id}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.4, ease: 'easeOut' }}
                                    className="flex flex-col items-center gap-3 shrink-0"
                                >
                                    {/* Círculo con halo de color */}
                                    <div className="relative group">
                                        {/* Foto circular */}
                                        <div
                                            className={`
                                                relative
                                                w-16 h-16 xs:w-20 xs:h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 lg:w-[140px] lg:h-[140px]
                                                rounded-full
                                                border-[2px] sm:border-[3px] border-white
                                                bg-white
                                                overflow-hidden
                                                ${style.glow}
                                                transition-all duration-500
                                                group-hover:scale-105
                                            `}
                                        >
                                            <Image
                                                src={member.photoUrl || '/images/placeholder-user.jpg'}
                                                alt={member.name}
                                                fill
                                                className="object-cover object-top"
                                                sizes="(max-width: 640px) 80px, (max-width: 768px) 112px, 140px"
                                            />
                                        </div>

                                        {/* Badge de icono ADN */}
                                        <div className={`
                                            absolute -bottom-1 -right-1 sm:bottom-0 sm:right-0 md:bottom-1 md:right-1
                                            w-6 h-6 xs:w-7 xs:h-7 sm:w-9 sm:h-9 md:w-10 md:h-10
                                            rounded-full
                                            bg-gradient-to-br ${style.badge}
                                            border-[1.5px] sm:border-[2.5px] border-white
                                            shadow-lg
                                            flex items-center justify-center
                                            z-10
                                            transition-transform duration-300 group-hover:scale-110
                                        `}>
                                            <Icon className="w-2.5 h-2.5 xs:w-3 xs:h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 text-white" strokeWidth={2.5} />
                                        </div>
                                    </div>

                                    {/* Nombre */}
                                    {member.showName && (
                                        <p className="text-[10px] xs:text-[11px] sm:text-[13px] md:text-[14px] font-medium text-slate-700 tracking-tight sm:tracking-wide text-center">
                                            {member.name.split(' ')[0]}
                                        </p>
                                    )}
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>

            {/* Indicador de estado (opcional, oculto en móvil si hay pocos) */}
            <div className="hidden md:flex justify-center mt-6 relative z-10">
                <div className="flex items-center gap-2.5">
                    <div className="h-1.5 w-7 bg-blue-500/40 rounded-full animate-pulse" />
                </div>
            </div>
        </section>
    )
}
