
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- Newsletter Status Report ---')
    
    console.log('Environment Check:')
    console.log('SMTP_HOST:', process.env.SMTP_HOST ? 'Present' : 'MISSING')
    console.log('SMTP_USER:', process.env.SMTP_USER ? 'Present' : 'MISSING')
    console.log('SMTP_PASS:', process.env.SMTP_PASS ? 'Present' : 'MISSING')
    console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'Present' : 'MISSING')
    
    const settings = await prisma.newsletterSetting.findUnique({
        where: { id: 'GLOBAL' }
    })
    console.log('Settings:', settings)
    
    const subscribers = await prisma.newsletterSubscriber.count({
        where: { isActive: true }
    })
    console.log('Active Subscribers:', subscribers)
    
    const recentCampaigns = await prisma.newsletterCampaign.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5
    })
    console.log('Recent Campaigns:', recentCampaigns.map(c => ({
        id: c.id,
        title: c.title,
        status: c.status,
        scheduledFor: c.scheduledFor,
        sentAt: c.sentAt
    })))
    
    const failedLogs = await prisma.newsletterCampaignLog.findMany({
        where: { deliveryStatus: 'FAILED' },
        take: 5,
        orderBy: { createdAt: 'desc' }
    })
    console.log('Recent Failed Logs:', failedLogs.map(l => ({
        campaignId: l.campaignId,
        subscriberId: l.subscriberId,
        error: l.lastError
    })))
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
