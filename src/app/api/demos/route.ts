import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, phone, email, solutionSlug } = body

        if (!name || !email || !solutionSlug) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
        }

        // Create the lead in the database
        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                phone: phone || null,
                message: `Solicitud de Demo para la solución: ${solutionSlug}`,
                source: 'DEMO',
                status: 'NEW',
                scope: solutionSlug
            }
        })

        // If you have MAKE_WEBHOOK_URL, you can also send it there
        if (process.env.MAKE_WEBHOOK_URL) {
            try {
                await fetch(process.env.MAKE_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'DEMO_REQUEST',
                        leadId: lead.id,
                        name,
                        email,
                        phone,
                        solutionSlug
                    })
                })
            } catch (webhookErr) {
                console.error('Error sending to Make Webhook:', webhookErr)
            }
        }

        return NextResponse.json({ success: true, leadId: lead.id })
    } catch (error) {
        console.error('Error saving demo request:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
