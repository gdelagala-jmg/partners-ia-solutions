import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { items } = await request.json()
        
        // Batch update display order
        await Promise.all(
            items.map((item: { id: string, order: number }) =>
                prisma.strategicPartner.update({
                    where: { id: item.id },
                    data: { displayOrder: item.order }
                })
            )
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error reordering partners:', error)
        return NextResponse.json({ error: 'Error reordering partners' }, { status: 500 })
    }
}
