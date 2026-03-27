'use client'

import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

// objectPosition: ajusta el encuadre de cada foto manualmente
// José (member-2) es la referencia → "50% 15%"
// Diego y Jaime tienen foto de cuerpo entero → usar % más bajos para subir al rostro
const members = [
    {
        id: 1,
        name: 'Álvaro',
        image: '/team/member-1.jpg',
        objectPosition: '50% 10%', // retrato cercano, ligero ajuste
    },
    {
        id: 2,
        name: 'José',
        image: '/team/member-2.jpg',
        objectPosition: '50% 15%', // referencia: headshot perfecto
    },
    {
        id: 3,
        name: 'Diego',
        image: '/team/member-3.jpg',
        objectPosition: '50% 3%',  // cuerpo entero → subir para mostrar solo rostro
    },
    {
        id: 4,
        name: 'Jaime',
        image: '/team/member-4.jpg',
        objectPosition: '50% 2%',  // cuerpo entero en sala grande → subir al máximo
    },
    {
        id: 5,
        name: 'Gonzalo',
        image: '/team/member-5.jpg',
        objectPosition: '50% 8%',  // plano medio, ligero ajuste
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
                        {/* Círculo foto */}
                        <div className="relative">
                            {/* Halo azul hover */}
                            <div className="absolute -inset-1 rounded-full bg-blue-600 opacity-0 blur-sm group-hover:opacity-20 transition-all duration-300" />

                            {/* Imagen circular con borde azul */}
                            <div className="relative w-20 h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 rounded-full overflow-hidden border-[3px] border-blue-600 shadow-lg group-hover:shadow-xl group-hover:border-blue-500 transition-all duration-300">
                                <Image
                                    src={member.image}
                                    alt={member.name}
                                    fill
                                    className="object-cover"
                                    style={{ objectPosition: member.objectPosition }}
                                    sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 112px"
                                />
                            </div>
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
                                i === 0 ? 'bg-blue-600 w-3' : 'bg-slate-200 w-1.5'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
