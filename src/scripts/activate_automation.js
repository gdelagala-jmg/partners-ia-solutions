const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const settings = await prisma.newsletterSetting.update({
        where: { id: 'GLOBAL' },
        data: {
            autoSendEnabled: true,
            autoSendDelayMinutes: 2
        }
    })
    console.log('✅ Settings Updated (autoSendEnabled: ON, delay: 2m)')
}

main().catch(console.error).finally(() => prisma.$disconnect())
