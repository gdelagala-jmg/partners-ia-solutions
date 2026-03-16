const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding Sectors...')

    // Create Sectors
    const sectorsData = [
        {
            name: 'Finanzas',
            slug: 'finanzas',
            image: '/uploads/sector_finanzas.png',
            externalUrl: 'https://partnersiasolutions.com/sectores/finanzas',
            description: 'Soluciones de IA para el sector financiero y bancario.',
            active: true,
            order: 1
        },
        {
            name: 'Salud',
            slug: 'salud',
            image: '/uploads/sector_salud.png',
            externalUrl: 'https://partnersiasolutions.com/sectores/salud',
            description: 'Transformación digital y salud inteligente impulsada por IA.',
            active: true,
            order: 2
        },
        {
            name: 'Retail',
            slug: 'retail',
            image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=1000',
            externalUrl: 'https://partnersiasolutions.com/retail',
            description: 'Personalización y optimización de inventario.',
            active: true,
            order: 3
        },
        {
            name: 'Manufactura',
            slug: 'manufactura',
            image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1000',
            externalUrl: 'https://partnersiasolutions.com/manufactura',
            description: 'Mantenimiento predictivo y automatización.',
            active: true,
            order: 4
        },
        {
            name: 'Legal',
            slug: 'legal',
            image: '/uploads/sector_legal.png',
            externalUrl: 'https://partnersiasolutions.com/sectores/legal',
            description: 'Automatización de documentos y análisis jurídico con IA.',
            active: true,
            order: 5
        },
        {
            name: 'Formación',
            slug: 'formacion',
            image: '/uploads/sector_formacion.png',
            externalUrl: 'https://partnersiasolutions.com/sectores/formacion',
            description: 'Educación personalizada y tutores inteligentes con LLMs.',
            active: true,
            order: 6
        },
        {
            name: 'Gastronomía',
            slug: 'gastronomia',
            image: '/uploads/sector_gastronomia.png',
            externalUrl: 'https://partnersiasolutions.com/sectores/gastronomia',
            description: 'Optimización de menús y gestión inteligente de cocina.',
            active: true,
            order: 7
        },
        {
            name: 'Ocio',
            slug: 'ocio',
            image: '/uploads/sector_ocio.png',
            externalUrl: 'https://partnersiasolutions.com/sectores/ocio',
            description: 'Experiencias inmersivas y recomendaciones personalizadas.',
            active: true,
            order: 8
        }
    ]

    for (const data of sectorsData) {
        await prisma.sector.upsert({
            where: { slug: data.slug },
            update: { order: data.order },
            create: data
        })
        console.log(`Synced sector: ${data.name} (Order: ${data.order})`)
    }

    // Associate Solutions to Sectors
    console.log('Associating Solutions...')
    const solutions = await prisma.solution.findMany()
    const sectors = await prisma.sector.findMany()

    if (solutions.length > 0 && sectors.length > 0) {
        // Associate first solution with first two sectors
        await prisma.solution.update({
            where: { id: solutions[0].id },
            data: {
                sectors: {
                    connect: [
                        { id: sectors[0].id },
                        { id: sectors[1].id }
                    ]
                }
            }
        })
        console.log(`Associated solution ${solutions[0].title} with ${sectors[0].name} and ${sectors[1].name}`)
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
