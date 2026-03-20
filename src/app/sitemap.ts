import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.partnersiasolutions.com'

    // Static routes
    const routes = [
        '',
        '/soluciones',
        '/noticias',
        '/podcast',
        '/contacto',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date().toISOString(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    // Dynamic News posts
    const posts = await prisma.newsPost.findMany({
        where: { published: true },
        select: { slug: true, updatedAt: true },
    })

    const newsRoutes = posts.map((post) => ({
        url: `${baseUrl}/noticias/${post.slug}`,
        lastModified: post.updatedAt.toISOString(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
    }))

    // Dynamic Sectors (Solutions)
    const sectors = await prisma.sector.findMany({
        where: { active: true },
        select: { slug: true, updatedAt: true },
    })

    const sectorRoutes = sectors.map((sector) => ({
        url: `${baseUrl}/soluciones/${sector.slug}`,
        lastModified: sector.updatedAt.toISOString(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
    }))

    return [...routes, ...newsRoutes, ...sectorRoutes]
}
