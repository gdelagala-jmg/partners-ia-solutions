'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Settings, Rocket, Gem, Handshake } from 'lucide-react'

const members = [
    {
        id: 1,
        name: 'Álvaro',
        image: '/team/member-1.jpg',
        icon: Zap,
        color: 'from-amber-400 to-orange-500',
    },
    {
        id: 2,
        name: 'José',
        image: '/team/member-2.jpg',
        icon: Settings,
        color: 'from-blue-400 to-indigo-500',
    },
    {
        id: 3,
        name: 'Diego',
        image: '/team/member-3.jpg',
        icon: Rocket,
        color: 'from-purple-400 to-pink-500',
    },
    {
        id: 4,
        name: 'Jaime',
        image: '/team/member-4.jpg',
        icon: Gem,
        color: 'from-emerald-400 to-teal-500',
    },
    {
        id: 5,
        name: 'Gonzalo',
        image: '/team/member-5.jpg',
        icon: Handshake,
        color: 'from-rose-400 to-red-500',
    },
]

function shuffleArray<T>(array: T[]): T[] {
    const arr = [...array]
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
}

export default function TeamCircles() {
    const [visible, setVisible] = useState(true)
    const [order, setOrder] = useState(members)
    const [cycleKey, setCycleKey] = useState(0)

    const cycle = useCallback(() => {
        // 1. Apagar
        setVisible(false)

        // 2. Reordenar aleatoriamente mientras están "apagados"
        setTimeout(() => {
            setOrder(shuffleArray(members))
            setCycleKey(k => k + 1)
        }, 700)

        // 3. Encender con nuevo orden
        setTimeout(() => {
            setVisible(true)
        }, 1100)
    }, [])

    useEffect(() => {
        const interval = setInterval(cycle, 24000)
        return () => clearInterval(interval)
    }, [cycle])

    return (
        <div className="mt-10 md:mt-14">
            {/* Título */}
            <p className="text-center text-xs md:text-sm font-medium text-slate-400 uppercase tracking-widest mb-6 md:mb-8">
                El Equipo
            </p>

            {/* Círculos */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 lg:gap-8 px-4">
                {order.map((member, idx) => {
                    const Icon = member.icon
                    return (
                        <motion.div
                            key={`${cycleKey}-${member.id}`}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={
                                visible
                                    ? { opacity: 1, scale: 1 }
                                    : { opacity: 0, scale: 0.85 }
                            }
                            transition={{
                                duration: 0.5,
                                delay: visible ? idx * 0.08 : (4 - idx) * 0.05,
                                ease: 'easeInOut',
                            }}
                            className="flex flex-col items-center gap-2 group"
                        >
                            {/* Círculo foto */}
                            <div className="relative">
                                {/* Anillo de color de skill */}
                                <div
                                    className={`absolute -inset-1 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 opacity-70 blur-sm group-hover:opacity-100 group-hover:blur-0 transition-all duration-300`}
                                />
                                <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-[3px] border-white shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover object-top"
                                        sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                                    />
                                </div>

                                {/* Icono skill en badge */}
                                <div
                                    className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center shadow-md border-2 border-white`}
                                >
                                    <Icon size={13} className="text-white" />
                                </div>
                            </div>

                            {/* Nombre */}
                            <div className="text-center">
                                <p className="text-xs font-semibold text-slate-700 leading-tight">{member.name}</p>
                            </div>
                        </motion.div>
                    )
                })}
            </div>

            {/* Indicador de ciclo */}
            <div className="flex justify-center mt-6">
                <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                                i === 0 ? 'bg-blue-500 w-3' : 'bg-slate-300'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
