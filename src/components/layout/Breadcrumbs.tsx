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
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
    }, [])
    
    // No mostramos en la home o si aún no hemos hidratado
    if (!mounted || pathname === '/') return null

    const pathSegments = pathname.split('/').filter(segment => segment !== '')
    
    return (
        <nav 
            className="flex w-full bg-white/90 backdrop-blur-xl border-b border-gray-100 sticky top-[104px] z-[90] transition-all duration-300 shadow-sm" 
            aria-label="Breadcrumb"
        >
            <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                <div className="flex items-center h-12 overflow-x-auto no-scrollbar relative">
                    <ol className="flex items-center whitespace-nowrap py-1">
                        <li className="flex items-center">
                            <Link 
                                href="/" 
                                className="flex items-center text-gray-500 hover:text-blue-600 transition-colors duration-200 group"
                            >
                                <Home className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" />
                                <span className="text-[10px] font-bold uppercase tracking-[0.2em] pt-0.5">Inicio</span>
                            </Link>
                        </li>
                        
                        {pathSegments.map((segment, index) => {
                            const href = `/${pathSegments.slice(0, index + 1).join('/')}`
                            const isLast = index === pathSegments.length - 1
                            const name = routeNames[segment] || segment.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())

                            return (
                                <li key={href} className="flex items-center">
                                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 mx-3.5 flex-shrink-0" />
                                    {isLast ? (
                                        <span className="text-[11px] md:text-sm font-bold text-gray-900 truncate max-w-[200px] sm:max-w-xs md:max-w-md bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                                            {name}
                                        </span>
                                    ) : (
                                        <Link 
                                            href={href}
                                            className="text-[10px] font-bold text-gray-500 hover:text-blue-600 uppercase tracking-[0.2em] transition-colors duration-200 pt-0.5"
                                        >
                                            {name}
                                        </Link>
                                    )}
                                </li>
                            )
                        })}
                    </ol>

                    {/* Subtle Gradient Fade for mobile scroll indicator */}
                    <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white to-transparent pointer-events-none sm:hidden" />
                </div>
            </div>
        </nav>
    )
}
