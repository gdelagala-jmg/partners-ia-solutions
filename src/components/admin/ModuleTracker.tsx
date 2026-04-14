'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

const pathToidMap: Record<string, string> = {
    '/admin/soluciones': 'stats-solutions',
    '/admin/leads': 'stats-leads',
    '/admin/equipo': 'stats-team',
    '/admin/noticias': 'activity-recent',
}

export function ModuleTracker() {
    const pathname = usePathname()

    useEffect(() => {
        const idToBump = pathToidMap[pathname]
        if (idToBump) {
            fetch('/api/admin/dashboard/bump', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ widgetId: idToBump })
            }).catch(e => console.error('Error tracking module:', e))
        }
    }, [pathname])

    return null
}
