import 'dotenv/config'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

import crypto from 'crypto'

function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex')
    return `pbkdf2$v1$100000$${salt}$${hash}`
}

async function main() {
    console.log('Start seeding ...')

    const existingAdmin = await prisma.adminUser.findUnique({
        where: { username: 'admin' },
    })

    if (!existingAdmin) {
        let adminPassword = process.env.ADMIN_PASSWORD

        if (!adminPassword) {
            if (process.env.NODE_ENV === 'production') {
                throw new Error('[SECURITY ERROR] ADMIN_PASSWORD environment variable must be set in production to seed!')
            }
            adminPassword = crypto.randomBytes(12).toString('hex')
            console.warn(`\n[SECURITY WARNING] ADMIN_PASSWORD was not provided. Generated a secure random fallback for development:`)
            console.warn(`>> USERNAME: admin`)
            console.warn(`>> PASSWORD: ${adminPassword}\n`)
        }

        const admin = await prisma.adminUser.create({
            data: {
                username: 'admin',
                passwordHash: hashPassword(adminPassword),
            },
        })
        console.log(`Created secure admin user with id: ${admin.id}`)
    } else {
        console.log('Admin user already exists.')
    }

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
