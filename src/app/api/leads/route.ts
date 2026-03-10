import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(leads)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error fetching leads' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, phone, message, scope, bottleneck, urgency, desiredResult, source } = body

        if (!name || !email) {
            return NextResponse.json({ error: 'Nombre y email son requeridos' }, { status: 400 })
        }

        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                phone: phone || null,
                message: message || '',
                source: source || 'CONTACT',
                scope: scope || null,
                bottleneck: bottleneck || null,
                urgency: urgency ? parseInt(urgency) : null,
                desiredResult: desiredResult || null,
                status: 'NEW',
            } as any,
        })

        return NextResponse.json(lead, { status: 201 })
    } catch (error) {
        console.error('Error creating lead:', error)
        return NextResponse.json({ error: 'Error al guardar el formulario' }, { status: 500 })
    }
}
