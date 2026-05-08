import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const email = searchParams.get('email') || undefined
        const active = searchParams.get('active')
        
        const where: any = {}
        if (email) {
            where.email = { contains: email }
        }
        if (active !== null && active !== undefined && active !== 'all') {
            where.isActive = active === 'true'
        }

        const subscribers = await prisma.newsletterSubscriber.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        })

        // Stats calculation
        const now = new Date()
        const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

        const [total, activeCount, inactiveCount, last7Days, lastSubscriber] = await Promise.all([
            prisma.newsletterSubscriber.count(),
            prisma.newsletterSubscriber.count({ where: { isActive: true } }),
            prisma.newsletterSubscriber.count({ where: { isActive: false } }),
            prisma.newsletterSubscriber.count({ where: { createdAt: { gte: sevenDaysAgo } } }),
            prisma.newsletterSubscriber.findFirst({ orderBy: { createdAt: 'desc' } })
        ])

        return NextResponse.json({
            subscribers,
            stats: {
                total,
                activeCount,
                inactiveCount,
                last7Days,
                lastSubscriber: lastSubscriber?.email || 'Ninguno'
            }
        })
    } catch (error) {
        console.error('Admin Newsletter API Error:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}

export async function PATCH(req: Request) {
    try {
        const body = await req.json()
        const { id, isActive } = body

        if (!id) {
            return NextResponse.json({ error: 'ID es requerido' }, { status: 400 })
        }

        const updated = await prisma.newsletterSubscriber.update({
            where: { id },
            data: { isActive }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Admin Newsletter PATCH Error:', error)
        return NextResponse.json({ error: 'Error al actualizar el suscriptor' }, { status: 500 })
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url)
        const id = searchParams.get('id')

        if (!id) {
            return NextResponse.json({ error: 'ID es requerido' }, { status: 400 })
        }

        await prisma.newsletterSubscriber.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Admin Newsletter DELETE Error:', error)
        return NextResponse.json({ error: 'Error al eliminar el suscriptor' }, { status: 500 })
    }
}
