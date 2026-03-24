import { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.partnersiasolutions.com'

    // 1. Rutas Estáticas Principales y Legales
    const routes = [
        '',                 // Inicio (raíz)
        '/equipo',
        '/noticias',
        '/soluciones',
        '/contacto',
        '/politica-privacidad',
        '/politica-cookies',
        '/aviso-legal',
        '/casos-exito',
        '/lab',
        '/escuela',
        '/podcast'
    ]

    const staticUrls = routes.map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: route === '' ? 1 : 0.8,
    }))

    try {
        // 2. Rutas Dinámicas: Noticias (Blog)
        const news = await prisma.newsPost.findMany({
            where: { published: true },
            select: { slug: true, updatedAt: true },
        })

        const newsUrls = news.map((post) => ({
            url: `${baseUrl}/noticias/${post.slug}`,
            lastModified: post.updatedAt || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        }))

        // 3. Rutas Dinámicas: Soluciones
        const solutions = await prisma.solution.findMany({
            select: { slug: true, updatedAt: true },
        })

        const solutionUrls = solutions.map((sol) => ({
            url: `${baseUrl}/soluciones/${sol.slug}`,
            lastModified: sol.updatedAt || new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.9,
        }))

        // 4. Rutas Dinámicas: Apps/Proyectos Internos públicos (DESHABILITADAS TEMPORALMENTE)
        /*
        const apps = await prisma.app.findMany({
            where: { isInternal: false }, // Only public apps
            select: { slug: true, updatedAt: true },
        })

        const appUrls = apps.map((app) => ({
            url: `${baseUrl}/apps/${app.slug}`,
            lastModified: app.updatedAt || new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        }))
        */

        return [...staticUrls, ...newsUrls, ...solutionUrls]

    } catch (error) {
        console.error("Sitemap generation error:", error)
        // Fallback to static urls if DB connection fails
        return staticUrls
    }
}
