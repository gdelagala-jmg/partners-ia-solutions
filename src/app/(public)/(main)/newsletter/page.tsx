import { Metadata } from 'next'
import NewsletterModal from '@/components/newsletter/NewsletterModal'

/**
 * /newsletter — Modal de suscripción premium
 *
 * ARQUITECTURA:
 * Esta ruta se presenta como un modal overlay, no como una página completa.
 * El layout público subyacente (Navbar + Footer) actúa como fondo.
 * El modal se centra sobre él con backdrop blur/dark.
 *
 * Al cerrar → router.push('/') — el componente gestiona la redirección.
 */
export const metadata: Metadata = {
    title: 'Newsletter Editorial | Partners IA Solutions',
    description: 'Suscríbete a nuestra newsletter editorial y recibe los mejores insights de Inteligencia Artificial aplicada a negocio directamente en tu email.',
    openGraph: {
        title: 'Newsletter Editorial — Partners IA Solutions',
        description: 'Suscríbete y mantente a la vanguardia de la IA aplicada a negocio.',
    },
}

export default function NewsletterPage() {
    return (
        /**
         * Fondo mínimo visible bajo el modal.
         * El modal usa `position: fixed inset-0 z-[999]` por lo que se superpone
         * correctamente sobre cualquier contenido del layout.
         */
        <div className="min-h-[50vh]" aria-hidden="true">
            <NewsletterModal />
        </div>
    )
}
