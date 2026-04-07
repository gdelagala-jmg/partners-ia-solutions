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
        <nav className="flex px-4 py-3 text-gray-500 bg-white/50 backdrop-blur-sm sticky top-16 z-30 overflow-x-auto scrollbar-hide" aria-label="Breadcrumb">
            <div className="max-w-7xl mx-auto w-full flex items-center space-x-1 md:space-x-2 text-xs md:text-sm whitespace-nowrap">
                <Link 
                    href="/" 
                    className="inline-flex items-center hover:text-blue-600 transition-colors duration-200 flex-shrink-0"
                >
                    <Home className="w-3.5 h-3.5 md:w-4 md:h-4 mr-1" />
                    <span className="hidden sm:inline">Inicio</span>
                </Link>
                
                {pathSegments.map((segment, index) => {
                    const href = `/${pathSegments.slice(0, index + 1).join('/')}`
                    const isLast = index === pathSegments.length - 1
                    const name = routeNames[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

                    return (
                        <div key={href} className="flex items-center">
                            <ChevronRight className="w-3 h-3 md:w-4 md:h-4 text-gray-400 mx-1" />
                            {isLast ? (
                                <span className="font-medium text-gray-900 truncate max-w-[150px] md:max-w-xs">
                                    {name}
                                </span>
                            ) : (
                                <Link 
                                    href={href}
                                    className="hover:text-blue-600 transition-colors duration-200"
                                >
                                    {name}
                                </Link>
                            )}
                        </div>
                    )
                })}
            </div>
        </nav>
    )
}
