const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('--- Newsletter Validation Script ---')
    
    // 1. Ensure settings exist
    let settings = await prisma.newsletterSetting.findUnique({ where: { id: 'GLOBAL' } })
    if (!settings) {
        settings = await prisma.newsletterSetting.create({
            data: {
                id: 'GLOBAL',
                autoSendEnabled: false,
                autoSendDelayMinutes: 15,
                senderName: 'IA Solutions Test',
                senderEmail: 'test@partnersiasolutions.com'
            }
        })
        console.log('✅ Settings created (autoSendEnabled: OFF)')
    } else {
        console.log('✅ Settings found:', settings)
    }

    // 2. Ensure test subscribers exist
    const testSubscribers = [
        { email: 'test1@iasolutions.com' },
        { email: 'test2@iasolutions.com' }
    ]

    for (const sub of testSubscribers) {
        await prisma.newsletterSubscriber.upsert({
            where: { email: sub.email },
            update: { isActive: true },
            create: {
                email: sub.email,
                isActive: true,
                consentAccepted: true,
                consentAt: new Date(),
                unsubscribeToken: Math.random().toString(36).substring(2, 15)
            }
        })
    }
    console.log('✅ Test subscribers ensured.')

    // 3. Deactivate other subscribers to be safe
    const deactivated = await prisma.newsletterSubscriber.updateMany({
        where: {
            email: {
                notIn: testSubscribers.map(s => s.email)
            }
        },
        data: { isActive: false }
    })
    console.log(`⚠️ Deactivated ${deactivated.count} real subscribers for safety during test.`)
}

main().catch(console.error).finally(() => prisma.$disconnect())
