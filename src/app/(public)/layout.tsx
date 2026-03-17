import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FlashNewsTicker from '@/components/news/FlashNewsTicker'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import MaintenanceView from '@/components/public/MaintenanceView'
import { headers } from 'next/headers'

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()
    const headersList = await headers()
    const pathname = headersList.get('x-url-path') || ''

    // Check maintenance mode
    const maintenanceSetting = await prisma.siteSetting.findUnique({
        where: { key: 'maintenance_mode' }
    })

    const isMaintenance = maintenanceSetting?.value === 'true'
    
    // Bypass maintenance for news path
    const isNewsPath = pathname.startsWith('/noticias')

    // Bypass for admins or news paths
    if (isMaintenance && !session && !isNewsPath) {
        return <MaintenanceView />
    }

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-900">
            <Navbar session={session} />
            <main className="flex-1 pt-16">
                {children}
            </main>
            <FlashNewsTicker />
            <Footer />
        </div>
    )
}
