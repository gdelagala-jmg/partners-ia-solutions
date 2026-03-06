const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

console.log('DATABASE_URL loaded:', process.env.DATABASE_URL ? 'YES' : 'NO')

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL,
        },
    },
})

async function main() {
    console.log('Start seeding ...')

    // Check if admin exists
    const existingAdmin = await prisma.adminUser.findUnique({
        where: { username: 'admin' },
    })

    if (!existingAdmin) {
        const admin = await prisma.adminUser.create({
            data: {
                username: 'admin',
                passwordHash: 'admin123', // In production, hash this!
            },
        })
        console.log(`Created admin user with id: ${admin.id}`)
    } else {
        console.log('Admin user already exists')
    }

    // Check if solution exists (by slug)
    const existingSolution = await prisma.solution.findUnique({
        where: { slug: 'ai-customer-support' },
    })

    if (!existingSolution) {
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
    } else {
        console.log('Solution already exists')
    }

    // Seeding News
    const news1 = await prisma.newsPost.findUnique({ where: { slug: 'future-of-gen-ai' } })
    if (!news1) {
        await prisma.newsPost.create({
            data: {
                title: 'The Future of Generative AI in Banking',
                slug: 'future-of-gen-ai',
                category: 'Analysis',
                aiType: 'Generative AI',
                sector: 'Finance',
                industry: 'Banking',
                profession: 'Executives',
                content: 'Generative AI is transforming how banks interact with customers...',
                published: true,
            }
        })
        console.log('Created News: Future of Gen AI')
    }

    const news2 = await prisma.newsPost.findUnique({ where: { slug: 'ml-healthcare-diagnostics' } })
    if (!news2) {
        await prisma.newsPost.create({
            data: {
                title: 'Machine Learning in Medical Diagnostics',
                slug: 'ml-healthcare-diagnostics',
                category: 'Technology',
                aiType: 'Machine Learning',
                businessArea: 'Healthcare',
                sector: 'Hospitals',
                profession: 'Doctors',
                content: 'New ML models are achieving higher accuracy in early detection...',
                published: true,
            }
        })
        console.log('Created News: ML in Healthcare')
    }

    // Seeding Courses
    const course1 = await prisma.course.findUnique({ where: { slug: 'intro-prompt-engineering' } })
    if (!course1) {
        await prisma.course.create({
            data: {
                title: 'Master en Prompt Engineering',
                slug: 'intro-prompt-engineering',
                description: 'Domina el arte de comunicarte con LLMs para obtener resultados profesionales.',
                level: 'Intermedio',
                duration: '3 semanas',
                price: '$199',
                published: true,
            }
        })
        console.log('Created Course: Prompt Engineering')
    }

    const course2 = await prisma.course.findUnique({ where: { slug: 'ai-for-business' } })
    if (!course2) {
        await prisma.course.create({
            data: {
                title: 'IA para Ejecutivos',
                slug: 'ai-for-business',
                description: 'Implementación estratégica de IA en flujos de trabajo corporativos.',
                level: 'Avanzado',
                duration: '4 semanas',
                price: '$299',
                published: true,
            }
        })
        console.log('Created Course: AI for Business')
    }

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
