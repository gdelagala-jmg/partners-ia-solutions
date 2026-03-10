import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const setting = await prisma.siteSetting.findUnique({
        where: { key: 'main_podcast_channel' }
    })
    console.log("PODCAST HTML:")
    console.log(setting?.value || 'NO_SETTING')
}

main().finally(() => prisma.$disconnect())
