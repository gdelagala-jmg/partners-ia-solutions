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

        // 3. Prepare sending results
        let sentCount = 0
        let failedCount = 0
        const batchSize = 10 // Safe batch size for SMTP
        
        // Process in batches
        for (let i = 0; i < subscribers.length; i += batchSize) {
            const batch = subscribers.slice(i, i + batchSize)
            
            await Promise.all(batch.map(async (subscriber) => {
                try {
                    // Generate HTML with unique unsubscribe token
                    const html = generateNewsletterHtml(campaign, false, subscriber.unsubscribeToken)
                    
                    const result = await sendEmail({
                        to: subscriber.email,
                        subject: campaign.subject,
                        html
                    })

                    // Log success
                    await prisma.newsletterCampaignLog.upsert({
                        where: {
                            campaignId_subscriberId: {
                                campaignId: id,
                                subscriberId: subscriber.id
                            }
                        },
                        create: {
                            campaignId: id,
                            subscriberId: subscriber.id,
                            deliveryStatus: 'SENT',
                            provider: 'SMTP',
                            providerMsgId: (result as any).messageId
                        },
                        update: {
                            deliveryStatus: 'SENT',
                            providerMsgId: (result as any).messageId
                        }
                    })
                    sentCount++
                } catch (error: any) {
                    // Log failure
                    await prisma.newsletterCampaignLog.upsert({
                        where: {
                            campaignId_subscriberId: {
                                campaignId: id,
                                subscriberId: subscriber.id
                            }
                        },
                        create: {
                            campaignId: id,
                            subscriberId: subscriber.id,
                            deliveryStatus: 'FAILED',
                            lastError: error.message
                        },
                        update: {
                            deliveryStatus: 'FAILED',
                            lastError: error.message
                        }
                    })
                    failedCount++
                }
            }))
            
            // Optional: Small delay between batches if needed
            // await new Promise(resolve => setTimeout(resolve, 500))
        }

        // 4. Final update
        const finalStatus = failedCount === 0 ? 'SENT' : (sentCount > 0 ? 'PARTIALLY_FAILED' : 'FAILED')
        
        await prisma.newsletterCampaign.update({
            where: { id },
            data: { 
                status: finalStatus,
                sentAt: new Date()
            }
        })

        return NextResponse.json({ 
            success: true, 
            sent: sentCount, 
            failed: failedCount,
            status: finalStatus
        })

    } catch (error) {
        console.error('Error in bulk sending:', error)
        return NextResponse.json({ error: 'Error interno en el envío masivo' }, { status: 500 })
    }
}
