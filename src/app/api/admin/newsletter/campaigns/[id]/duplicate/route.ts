import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
        const original = await prisma.newsletterCampaign.findUnique({
            where: { id: params.id }
        })

        if (!original) return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 })

        const { id, createdAt, updatedAt, sentAt, logs, ...rest } = original as any

        const duplicated = await prisma.newsletterCampaign.create({
            data: {
                ...rest,
                title: `${rest.title} (Copia)`,
                status: 'DRAFT',
                scheduledFor: null,
            }
        })

        return NextResponse.json(duplicated)
    } catch (error) {
        console.error('Error duplicating campaign:', error)
        return NextResponse.json({ error: 'Error al duplicar la campaña' }, { status: 500 })
    }
}
