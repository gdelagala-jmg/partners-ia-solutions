import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { sendEmail } from '@/lib/email'
import { generateNewsletterHtml } from '@/lib/newsletter-templates'

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params

    try {
        const body = await request.json().catch(() => ({}))
        const { subscriberIds } = body // Optional array of IDs for controlled tests

        const campaign = await prisma.newsletterCampaign.findUnique({
            where: { id }
        })

        if (!campaign) return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 })
        if (campaign.status === 'SENT' || campaign.status === 'SENDING') {
            return NextResponse.json({ error: 'Esta campaña ya ha sido enviada o está en proceso' }, { status: 400 })
        }

        // 1. Mark as SENDING to prevent race conditions
        await prisma.newsletterCampaign.update({
            where: { id },
            data: { status: 'SENDING' }
        })

        // 2. Get active subscribers
        const where: any = { isActive: true }
        if (subscriberIds && Array.isArray(subscriberIds) && subscriberIds.length > 0) {
            where.id = { in: subscriberIds }
        }

        const subscribers = await prisma.newsletterSubscriber.findMany({
            where
        })

        if (subscribers.length === 0) {
            await prisma.newsletterCampaign.update({
                where: { id },
                data: { status: 'DRAFT' }
            })
            return NextResponse.json({ error: 'No hay suscriptores activos para enviar' }, { status: 400 })
        }

        // 3. Send emails
        const { sendBulkEmails } = await import('@/lib/email')
        const sendResult = await sendBulkEmails(campaign, subscribers)
        
        // 4. Final update
        const finalStatus = sendResult.failed === 0 ? 'SENT' : (sendResult.sent > 0 ? 'PARTIALLY_FAILED' : 'FAILED')
        
        await prisma.newsletterCampaign.update({
            where: { id },
            data: { 
                status: finalStatus,
                sentAt: new Date()
            }
        })

        return NextResponse.json({ 
            success: true, 
            sent: sendResult.sent, 
            failed: sendResult.failed,
            status: finalStatus
        })

    } catch (error) {
        console.error('Error in bulk sending:', error)
        return NextResponse.json({ error: 'Error interno en el envío masivo' }, { status: 500 })
    }
}
