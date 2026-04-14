import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

const DEFAULT_ORDER = ['stats-solutions', 'stats-leads', 'stats-team', 'activity-recent', 'system-status']

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session || !session.username) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { widgetId } = await request.json()
        if (!widgetId) return NextResponse.json({ error: 'Missing widgetId' }, { status: 400 })

        const user = await prisma.adminUser.findUnique({
            where: { username: session.username },
            select: { dashboardConfig: true }
        })

        // Get current config or the default one
        let currentConfig: string[] = []
        if (user?.dashboardConfig) {
            try {
                const parsed = JSON.parse(user.dashboardConfig)
                if (Array.isArray(parsed)) currentConfig = parsed
            } catch (e) {
                currentConfig = [...DEFAULT_ORDER]
            }
        } else {
            currentConfig = [...DEFAULT_ORDER]
        }

        // Only bump if the element exists in our known configs and isn't already first
        if (currentConfig.includes(widgetId) && currentConfig.indexOf(widgetId) !== 0) {
            const index = currentConfig.indexOf(widgetId)
            currentConfig.splice(index, 1) // Remove it
            currentConfig.unshift(widgetId) // Add to the top
            
            await prisma.adminUser.update({
                where: { username: session.username },
                data: { dashboardConfig: JSON.stringify(currentConfig) }
            })
        }

        return NextResponse.json({ success: true, newOrder: currentConfig })

    } catch (error) {
        console.error('Error bumping dashboard config:', error)
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 })
    }
}
