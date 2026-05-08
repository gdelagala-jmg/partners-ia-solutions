import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const campaigns = await prisma.newsletterCampaign.findMany({
            orderBy: { createdAt: 'desc' }
        })
        return NextResponse.json(campaigns)
    } catch (error) {
        console.error('Error fetching campaigns:', error)
        return NextResponse.json({ error: 'Error al obtener campañas' }, { status: 500 })
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { title, subject } = body

        if (!title || !subject) {
            return NextResponse.json({ error: 'Título y Asunto son requeridos' }, { status: 400 })
        }

        const campaign = await prisma.newsletterCampaign.create({
            data: {
                title,
                subject,
                status: 'DRAFT',
                recommendedSolutions: []
            }
        })

        return NextResponse.json(campaign)
    } catch (error) {
        console.error('Error creating campaign:', error)
        return NextResponse.json({ error: 'Error al crear la campaña' }, { status: 500 })
    }
}
