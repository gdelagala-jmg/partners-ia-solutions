import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { generateNewsletterHtml } from '@/lib/newsletter-templates'

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        const body = await req.json()
        const { testEmail } = body

        if (!testEmail) {
            return NextResponse.json({ error: 'Email de prueba requerido' }, { status: 400 })
        }

        const campaign = await prisma.newsletterCampaign.findUnique({
            where: { id }
        })

        if (!campaign) {
            return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 })
        }

        const html = generateNewsletterHtml(campaign, true)
        const subject = `[TEST] ${campaign.subject}`

        const result = await sendEmail({
            to: testEmail,
            subject,
            html
        })

        if (result.success) {
            // Log the test send in campaign logs or a special log?
            // User said: "registrar log de test si es posible"
            // We'll add a manual entry in the database or just return success
            return NextResponse.json({ success: true, messageId: result.messageId })
        } else {
            return NextResponse.json({ error: result.error }, { status: 500 })
        }

    } catch (error: any) {
        console.error('Error in send test API:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
