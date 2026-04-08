'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, Home } from 'lucide-react'

const routeNames: Record<string, string> = {
    'noticias': 'Noticias',
    'equipo': 'Equipo',
    'soluciones': 'Soluciones',
    'contacto': 'Contacto',
    'casos-exito': 'Casos de Éxito',
    'lab': 'IA Lab',
    'escuela': 'Escuela de IA',
    'podcast': 'Podcast',
}

export default function Breadcrumbs() {
    const pathname = usePathname()
    
    // No mostramos en la home
    if (pathname === '/') return null

    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    
    return (
        <nav 
            className="flex w-full bg-white/80 backdrop-blur-xl border-b border-gray-100/50 sticky top-16 z-30 transition-all duration-300" 
            aria-label="Breadcrumb"
        >
            <div className="max-w-7xl mx-auto w-full relative">
                {/* Contenedor con scroll horizontal suave */}
                <div className="flex items-center space-x-1 md:space-x-2 px-6 py-3.5 overflow-x-auto scrollbar-hide mask-fade-edges">
                    <Link 
                        href="/" 
                        className="inline-flex items-center text-gray-400 hover:text-black transition-all duration-300 flex-shrink-0 group"
                    >
                        <Home className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:scale-110" />
                        <span className="ml-1.5 text-[11px] md:text-xs font-semibold uppercase tracking-wider hidden sm:inline">Inicio</span>
                    </Link>
                    
                    {pathSegments.map((segment, index) => {
                        const href = `/${pathSegments.slice(0, index + 1).join('/')}`
                        const isLast = index === pathSegments.length - 1
                        const name = routeNames[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

                        return (
                            <div key={href} className="flex items-center flex-shrink-0">
                                <span className="text-gray-300 mx-1.5 md:mx-2 font-light select-none">/</span>
                                {isLast ? (
                                    <span className="text-[11px] md:text-sm font-bold text-black tracking-tight max-w-[200px] md:max-w-md truncate">
                                        {name}
                                    </span>
                                ) : (
                                    <Link 
                                        href={href}
                                        className="text-[11px] md:text-xs font-semibold text-gray-400 hover:text-black uppercase tracking-wider transition-all duration-300"
                                    >
                                        {name}
                                    </Link>
                                )}
                            </div>
                        )
                    })}
                </div>

                {/* Sutil gradiente para indicar scroll en móvil si es necesario */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent pointer-events-none xl:hidden" />
            </div>
        </nav>
    )
}
