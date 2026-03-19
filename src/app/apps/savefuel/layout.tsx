import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'SaveFuel - El GPS del ahorro en gasolina',
    description: 'La aplicación número 1 para ahorrar en cada repostaje en toda Europa.',
}

export default function SaveFuelLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen bg-white text-gray-900 selection:bg-emerald-100 selection:text-emerald-900 font-outfit antialiased">
            {children}
        </div>
    )
}
