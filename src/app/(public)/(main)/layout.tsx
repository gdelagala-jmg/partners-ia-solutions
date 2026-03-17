import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import MaintenanceView from '@/components/public/MaintenanceView'
import { headers } from 'next/headers'

export default async function ProtectedPublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()
    const headersList = await headers()
    
    // Fallback bot detection directly in layout
    const userAgent = headersList.get('user-agent') || ''
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|whatsapp|facebook|twitter|linkedin|slack|notebooklm|openai|bingbot|yandex/i.test(userAgent) || 
                  headersList.get('x-is-bot') === 'true'

    // Check maintenance mode from database
    const maintenanceSetting = await prisma.siteSetting.findUnique({
        where: { key: 'maintenance_mode' }
    })

    const isMaintenance = maintenanceSetting?.value === 'true'
    
    // Bypass maintenance if:
    // 1. It's an admin session
    // 2. It's a recognized bot crawler
    const shouldBypass = session || isBot

    if (isMaintenance && !shouldBypass) {
        return <MaintenanceView />
    }

    return <>{children}</>
}
