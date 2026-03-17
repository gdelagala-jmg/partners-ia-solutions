import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PUT(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { orders } = body // Expected: [{ id: string, order: number }, ...]

        if (!Array.isArray(orders)) {
            return NextResponse.json({ error: 'Orders array is required' }, { status: 400 })
        }

        // Perform updates in a transaction
        await prisma.$transaction(
            orders.map((item: { id: string, order: number }) =>
                prisma.navLink.update({
                    where: { id: item.id },
                    data: { order: item.order }
                })
            )
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error reordering navigation links:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
