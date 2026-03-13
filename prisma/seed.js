const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    // 1. Admin User
    const existingAdmin = await prisma.adminUser.findUnique({
        where: { username: 'admin' },
    })

    if (!existingAdmin) {
        await prisma.adminUser.create({
            data: {
                username: 'admin',
                passwordHash: 'admin123',
            },
        })
        console.log('Created admin user')
    }

    // 2. Solutions (Featured)
    const solutionsData = [
        {
            title: 'AI Customer Support',
            slug: 'ai-customer-support',
            description: 'Automate your customer support with our advanced AI agents.',
            type: 'SOLUTION',
            published: true,
            featured: true,
            featuredOrder: 1,
            multimedia: '/images/solutions/support.webp'
        },
        {
            title: 'Predictive Analytics',
            slug: 'predictive-analytics',
            description: 'Anticipate market trends and customer behavior with Machine Learning.',
            type: 'SOLUTION',
            published: true,
            featured: true,
            featuredOrder: 2,
            multimedia: '/images/solutions/analytics.webp'
        },
        {
            title: 'Process Automation',
            slug: 'process-automation',
            description: 'Reduce manual work by up to 80% using intelligent RPA solutions.',
            type: 'SOLUTION',
            published: true,
            featured: true,
            featuredOrder: 3,
            multimedia: '/images/solutions/automation.webp'
        }
    ]

    for (const sol of solutionsData) {
        await prisma.solution.upsert({
            where: { slug: sol.slug },
            update: sol,
            create: sol,
        })
    }
    console.log('Seeded solutions')

    // 3. News
    const newsData = [
        {
            title: 'The Future of Generative AI in Banking',
            slug: 'future-of-gen-ai',
            category: 'Análisis',
            aiType: 'Generative AI',
            sector: 'Finance',
            content: 'Generative AI is transforming how banks interact with customers by providing personalized advice...',
            published: true,
            publishedAt: new Date()
        },
        {
            title: 'ML in Medical Diagnostics',
            slug: 'ml-healthcare-diagnostics',
            category: 'Tecnología',
            aiType: 'Machine Learning',
            businessArea: 'Healthcare',
            content: 'New ML models are achieving higher accuracy in early detection of complex diseases...',
            published: true,
            publishedAt: new Date()
        }
    ]

    for (const news of newsData) {
        await prisma.newsPost.upsert({
            where: { slug: news.slug },
            update: news,
            create: news,
        })
    }
    console.log('Seeded news')

    // 4. Navigation Links
    const navLinks = [
        // Header
        { name: 'Inicio', href: '/', location: 'HEADER', order: 1 },
        { name: 'Soluciones', href: '/soluciones', location: 'HEADER', order: 2 },
        { name: 'Escuela', href: '/escuela', location: 'HEADER', order: 3 },
        { name: 'Noticias IA', href: '/noticias', location: 'HEADER', order: 4 },
        
        // Footer - Explora
        { name: 'Inicio', href: '/', location: 'FOOTER_EXPLORA', order: 1 },
        { name: 'Soluciones', href: '/soluciones', location: 'FOOTER_EXPLORA', order: 2 },
        { name: 'Casos de Éxito', href: '/casos-exito', location: 'FOOTER_EXPLORA', order: 3 },
        { name: 'Blog', href: '/noticias', location: 'FOOTER_EXPLORA', order: 4 },

        // Footer - Soluciones
        { name: 'IA Consulting', href: '/soluciones#consulting', location: 'FOOTER_SOLUCIONES', order: 1 },
        { name: 'Custom AI Agents', href: '/soluciones#agents', location: 'FOOTER_SOLUCIONES', order: 2 },
        { name: 'Data Strategy', href: '/soluciones#data', location: 'FOOTER_SOLUCIONES', order: 3 },

        // Footer - Empresa
        { name: 'Sobre Nosotros', href: '/equipo', location: 'FOOTER_EMPRESA', order: 1 },
        { name: 'Contacto', href: '/contacto', location: 'FOOTER_EMPRESA', order: 2 },
        { name: 'Privacidad', href: '/privacidad', location: 'FOOTER_EMPRESA', order: 3 },
        { name: 'Términos', href: '/terminos', location: 'FOOTER_EMPRESA', order: 4 }
    ]

    console.log('Cleaning existing nav links...')
    await prisma.navLink.deleteMany({})

    for (const link of navLinks) {
        await prisma.navLink.create({
            data: link
        })
    }
    console.log('Seeded navigation links')

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
