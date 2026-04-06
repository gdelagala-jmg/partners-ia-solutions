import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const session = await getSession()
        if (!session || !session.username) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const user = await prisma.adminUser.findUnique({
            where: { username: session.username },
            select: { dashboardConfig: true }
        })

        return NextResponse.json({ config: user?.dashboardConfig ? JSON.parse(user.dashboardConfig) : null })
    } catch (error) {
        console.error('Error fetching dashboard config:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = await getSession()
        if (!session || !session.username) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { config } = await request.json()
        
        await prisma.adminUser.update({
            where: { username: session.username },
            data: { dashboardConfig: JSON.stringify(config) }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error saving dashboard config:', error)
        return NextResponse.json({ error: 'Error interno' }, { status: 500 })
    }
}
