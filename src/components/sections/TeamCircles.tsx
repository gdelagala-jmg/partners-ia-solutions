'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

// Para fotos de cuerpo entero se usa scale + transformOrigin para hacer zoom al rostro
// José (member-2) es la referencia: headshot perfecto, sin zoom
const members = [
    {
        id: 1,
        name: 'Álvaro',
        image: '/team/member-1.jpg',
        style: { objectPosition: '50% 8%', transform: 'scale(1.15)', transformOrigin: '50% 8%' },
    },
    {
        id: 2,
        name: 'José',
        image: '/team/member-2.jpg',
        style: { objectPosition: '50% 15%', transform: 'scale(1.0)', transformOrigin: '50% 15%' },
    },
    {
        id: 3,
        name: 'Diego',
        image: '/team/member-3.jpg',
        // Cuerpo entero: zoom fuerte + centrado en cabeza (parte superior izquierda del frame)
        style: { objectPosition: '50% 0%', transform: 'scale(3.2)', transformOrigin: '48% 14%' },
    },
    {
        id: 4,
        name: 'Jaime',
        image: '/team/member-4.jpg',
        // Gran sala, persona aparece pequeña: zoom mayor
        style: { objectPosition: '50% 0%', transform: 'scale(4.0)', transformOrigin: '46% 13%' },
    },
    {
        id: 5,
        name: 'Gonzalo',
        image: '/team/member-5.jpg',
        style: { objectPosition: '50% 8%', transform: 'scale(1.2)', transformOrigin: '50% 8%' },
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
        setVisible(false)
        setTimeout(() => {
            setOrder(shuffleArray(members))
            setCycleKey(k => k + 1)
        }, 700)
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
            <div className="flex flex-wrap justify-center gap-5 md:gap-7 lg:gap-10 px-4">
                {order.map((member, idx) => (
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
                        {/* Círculo foto — sin borde de color, solo sombra */}
                        <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                            <Image
                                src={member.image}
                                alt={member.name}
                                fill
                                className="object-cover"
                                style={member.style}
                                sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                            />
                        </div>

                        {/* Nombre */}
                        <p className="text-xs font-semibold text-slate-700 leading-tight">
                            {member.name}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Indicador de ciclo */}
            <div className="flex justify-center mt-6">
                <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-full transition-all duration-300 ${
                                i === 0 ? 'bg-slate-400 w-3' : 'bg-slate-200 w-1.5'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
