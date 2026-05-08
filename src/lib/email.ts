import nodemailer from 'nodemailer'

export async function getTransporter() {
    const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT, SMTP_SECURE } = process.env

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        console.error('SMTP configuration missing in environment variables')
        return null
    }

    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: SMTP_SECURE === 'true',
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    })
}

export async function sendEmail({ to, subject, html, text }: { to: string, subject: string, html: string, text?: string }) {
    const transporter = await getTransporter()
    if (!transporter) return { success: false, error: 'Configuración SMTP no encontrada' }

    try {
        const info = await transporter.sendMail({
            from: process.env.SMTP_FROM || `"Partners IA Solutions" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
            text: text || 'Por favor, activa el visor HTML para ver este mensaje.'
        })
        return { success: true, messageId: info.messageId }
    } catch (error: any) {
        console.error('Error sending email:', error)
        return { success: false, error: error.message }
    }
}

export async function sendBulkEmails(campaign: any, subscribers: any[]) {
    const { prisma } = await import('@/lib/prisma')
    const { generateNewsletterHtml } = await import('@/lib/newsletter-templates')
    
    let sentCount = 0
    let failedCount = 0
    const batchSize = 10 
    
    for (let i = 0; i < subscribers.length; i += batchSize) {
        const batch = subscribers.slice(i, i + batchSize)
        
        await Promise.all(batch.map(async (subscriber) => {
            try {
                const html = generateNewsletterHtml(campaign, false, subscriber.unsubscribeToken)
                
                const result = await sendEmail({
                    to: subscriber.email,
                    subject: campaign.subject,
                    html
                })

                if (!result.success) {
                    throw new Error(result.error)
                }

                await prisma.newsletterCampaignLog.upsert({
                    where: {
                        campaignId_subscriberId: {
                            campaignId: campaign.id,
                            subscriberId: subscriber.id
                        }
                    },
                    create: {
                        campaignId: campaign.id,
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
                await prisma.newsletterCampaignLog.upsert({
                    where: {
                        campaignId_subscriberId: {
                            campaignId: campaign.id,
                            subscriberId: subscriber.id
                        }
                    },
                    create: {
                        campaignId: campaign.id,
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
    }

    return { sent: sentCount, failed: failedCount }
}
