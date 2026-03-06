import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    const admin = await prisma.adminUser.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            username: 'admin',
            passwordHash: 'admin123', // In production, hash this!
        },
    })

    console.log(`Created admin user with id: ${admin.id}`)

    const solution = await prisma.solution.create({
        data: {
            title: 'AI Customer Support',
            slug: 'ai-customer-support',
            description: 'Automate your customer support with our advanced AI agents.',
            type: 'SOLUTION',
            published: true,
        },
    })

    console.log(`Created solution with id: ${solution.id}`)

    await prisma.mediaItem.createMany({
        data: [
            {
                type: 'VIDEO',
                title: 'Introducción a la IA Generativa',
                url: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder
                published: true,
            },
            {
                type: 'PODCAST',
                title: 'El Futuro de los Agentes Autónomos',
                url: 'https://open.spotify.com/embed/episode/7f5mX9z2G8X4mR8yB2z1w5', // Placeholder
                published: true,
            },
        ]
    })

    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
