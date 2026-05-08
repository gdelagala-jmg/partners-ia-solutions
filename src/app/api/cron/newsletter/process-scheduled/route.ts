import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendBulkEmails } from '@/lib/email'
import { generateNewsletterHtml } from '@/lib/newsletter-templates'

export async function GET(request: Request) {
    // 🛡️ Security Check
    const authHeader = request.headers.get('authorization')
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('key') || searchParams.get('secret') || authHeader?.replace('Bearer ', '')

    if (secret !== process.env.CRON_SECRET) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        // 1. Find campaigns that are SCHEDULED and past their time
        const now = new Date()
        const pendingCampaigns = await prisma.newsletterCampaign.findMany({
            where: {
                status: 'SCHEDULED',
                scheduledFor: {
                    lte: now
                }
            }
        })

        if (pendingCampaigns.length === 0) {
            return NextResponse.json({ message: 'No pending campaigns' })
        }

        console.log(`[CRON] Processing ${pendingCampaigns.length} campaigns`)
        
        const results = []

        for (const campaign of pendingCampaigns) {
            // Update status to SENDING to avoid parallel processing if multiple cron calls
            await prisma.newsletterCampaign.update({
                where: { id: campaign.id },
                data: { status: 'SENDING' }
            })

            try {
                // Get active subscribers
                const activeSubscribers = await prisma.newsletterSubscriber.findMany({
                    where: { isActive: true }
                })

                if (activeSubscribers.length === 0) {
                    await prisma.newsletterCampaign.update({
                        where: { id: campaign.id },
                        data: { status: 'SENT', sentAt: new Date() }
                    })
                    results.push({ campaignId: campaign.id, sent: 0, status: 'NO_SUBSCRIBERS' })
                    continue
                }

                // Use the same logic as manual send
                const sendResult = await sendBulkEmails(campaign, activeSubscribers)
                
                // Update final status
                const finalStatus = sendResult.failed > 0 ? 'FAILED' : 'SENT'
                await prisma.newsletterCampaign.update({
                    where: { id: campaign.id },
                    data: { 
                        status: finalStatus,
                        sentAt: new Date()
                    }
                })

                results.push({ 
                    campaignId: campaign.id, 
                    sent: sendResult.sent, 
                    failed: sendResult.failed, 
                    status: finalStatus 
                })
            } catch (err: any) {
                console.error(`[CRON] Error processing campaign ${campaign.id}:`, err)
                await prisma.newsletterCampaign.update({
                    where: { id: campaign.id },
                    data: { status: 'FAILED' }
                })
                results.push({ campaignId: campaign.id, error: err.message, status: 'ERROR' })
            }
        }

        return NextResponse.json({ 
            processed: pendingCampaigns.length, 
            results 
        })

    } catch (error: any) {
        console.error('[CRON ERROR]:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
