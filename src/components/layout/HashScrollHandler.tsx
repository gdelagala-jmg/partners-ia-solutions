'use client'

/**
 * HashScrollHandler
 * ─────────────────────────────────────────────────────────────────────────────
 * Soluciona el problema de navegación por ancla (#hash) en Next.js App Router.
 *
 * PROBLEMA RAÍZ:
 * Next.js hidrata el DOM de forma asíncrona. Cuando el browser llega a una URL
 * con hash (#newsletter), intenta hacer scroll antes de que React haya renderizado
 * el elemento target. El resultado es scroll inconsistente o nulo.
 *
 * CASOS CUBIERTOS:
 * 1. Direct URL entry    → /partnersiasolutions.com/#newsletter
 * 2. Hard refresh        → F5 / Cmd+R con hash en URL
 * 3. Cross-page nav      → /soluciones → /#newsletter (pathname change)
 * 4. Same-page nav       → click en /#newsletter desde la homepage
 * 5. Browser back/fwd    → hashchange event
 * 6. Safari iOS          → requiere setTimeout extra vs Chrome
 *
 * ESTRATEGIA:
 * - Lee window.location.hash en mount y en cada cambio de ruta
 * - Intenta localizar el elemento 3 veces con delays progresivos (150/400/800ms)
 * - Compensa el header sticky (HEADER_OFFSET = 72px)
 * - Usa window.scrollTo para control total (no scrollIntoView, que no compensa header)
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

// Debe coincidir con la altura del Navbar sticky (pt-16 = 64px + 8px buffer)
const HEADER_OFFSET = 72

// Delays de reintento progresivo en ms
const RETRY_DELAYS = [150, 400, 800]

function scrollToHash(hash: string, attempt = 0): void {
    const id = hash.replace(/^#/, '')
    if (!id) return

    const el = document.getElementById(id)

    if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
        return
    }

    // Elemento aún no disponible — reintentar si quedan intentos
    if (attempt < RETRY_DELAYS.length) {
        setTimeout(() => scrollToHash(hash, attempt + 1), RETRY_DELAYS[attempt])
    }
}

export default function HashScrollHandler() {
    const pathname = usePathname()

    // Dispara en mount y en cada cambio de pathname (navegación entre páginas)
    useEffect(() => {
        const hash = window.location.hash
        if (!hash) return

        // Primer intento inmediato (puede fallar si DOM no listo)
        // Los reintentos con delay cubren el caso de hidratación tardía
        scrollToHash(hash)
    }, [pathname])

    // Cubre navegación same-page con <Link href="/#newsletter">
    // y el botón atrás/adelante del browser
    useEffect(() => {
        const handleHashChange = () => {
            const hash = window.location.hash
            if (!hash) return
            // Delay mínimo para que React procese primero
            setTimeout(() => scrollToHash(hash), 50)
        }

        window.addEventListener('hashchange', handleHashChange)
        return () => window.removeEventListener('hashchange', handleHashChange)
    }, [])

    // Componente invisible — solo lógica
    return null
}
