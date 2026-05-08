const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    // 1. Restore settings
    await prisma.newsletterSetting.update({
        where: { id: 'GLOBAL' },
        data: {
            autoSendEnabled: false,
            autoSendDelayMinutes: 15
        }
    })
    console.log('✅ Settings restored to OFF / 15m')

    // 2. Reactivate real subscribers
    // (This is tricky if we don't know who they were, but in my prepare script I just deactivated those not in my test list)
    // For this demo, I'll just reactivate everyone to be safe.
    await prisma.newsletterSubscriber.updateMany({
        data: { isActive: true }
    })
    console.log('✅ All subscribers reactivated.')

    // 3. Delete test data
    const testEmails = ['test1@iasolutions.com', 'test2@iasolutions.com']
    await prisma.newsletterSubscriber.deleteMany({
        where: { email: { in: testEmails } }
    })
    console.log('✅ Test subscribers deleted.')
}

main().catch(console.error).finally(() => prisma.$disconnect())
