import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { updates } = body // [{ id, order }, ...]

        if (!Array.isArray(updates)) {
            return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
        }

        // Perform updates in a transaction
        await prisma.$transaction(
            updates.map(({ id, order }: { id: string, order: number }) =>
                prisma.teamMember.update({
                    where: { id },
                    data: { order }
                })
            )
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error reordering team members:', error)
        return NextResponse.json({ error: 'Error updating order' }, { status: 500 })
    }
}
