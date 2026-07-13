import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import HomeClient from './HomeClient'

export const revalidate = 60 // Revalidación ISR cada minuto para asegurar actualidad de noticias y editorial

export const metadata: Metadata = {
  title: 'Partners IA Solutions | Expertos en IA y Automatización para Empresas',
  description: 'Transformamos el futuro con Inteligencia Artificial. Diseñamos ecosistemas inteligentes que automatizan procesos y escalan negocios. Líderes en soluciones de IA a medida.',
  openGraph: {
    title: 'Partners IA Solutions | Liderando la Revolución de la IA',
    description: 'Expertos en desplegar agentes inteligentes y automatización avanzada para empresas en España y Europa.',
    images: ['/logo-ias.png'], // Idealmente una imagen de banner
  }
}

const FALLBACK_HERO = {
    id: 'static-fallback',
    badge: "Liderando la Revolución de la IA",
    titleLine1: "Transformamos el Futuro",
    titleLine2: "Con Inteligencia Artificial",
    subtitle: "Diseñamos, construimos y desplegamos ecosistemas inteligentes que automatizan procesos y escalan negocios.",
    ctaText: "Explorar Soluciones",
    ctaUrl: "/soluciones"
}

export default async function HomePage() {
  // 1. Fetch Soluciones Destacadas
  const allSolutions = await prisma.solution.findMany({
    where: { published: true },
    orderBy: [
      { featuredOrder: 'asc' },
      { slug: 'asc' }
    ],
    include: { gallery: { orderBy: { order: 'asc' } } }
  })

  // Ordenación segura en JS para priorizar featuredOrder y enviar nulos/0 al final
  const sortedSolutions = allSolutions.sort((a, b) => {
    // Si ambos tienen order
    if (typeof a.featuredOrder === 'number' && typeof b.featuredOrder === 'number') {
      return a.featuredOrder - b.featuredOrder;
    }
    // Si uno tiene y el otro no
    if (typeof a.featuredOrder === 'number') return -1;
    if (typeof b.featuredOrder === 'number') return 1;
    // Desempate por slug
    return a.slug.localeCompare(b.slug);
  })

  const featuredSolutions = sortedSolutions.slice(0, 6).map(s => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    multimediaUrl: (s.gallery && s.gallery.length > 0) ? s.gallery[0].url : (s.multimedia || null),
    description: s.description,
    type: s.type
  }))

  // 2. Fetch Editorial Content (Hero)
  const now = new Date()
  let editorial = FALLBACK_HERO
  try {
    const content = await prisma.editorialContent.findMany({
      where: {
        pageKey: 'home',
        sectionKey: 'hero',
        isActive: true,
        AND: [
          { OR: [{ startDate: null }, { startDate: { lte: now } }] },
          { OR: [{ endDate: null }, { endDate: { gte: now } }] }
        ]
      },
      orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }]
    })

    if (content && content.length > 0) {
      // Tomamos el de mayor prioridad para mantener estabilidad (sin Math.random())
      const selected = content[0]
      editorial = {
        id: selected.id,
        badge: selected.badge || FALLBACK_HERO.badge,
        titleLine1: selected.titleLine1 || FALLBACK_HERO.titleLine1,
        titleLine2: selected.titleLine2 || FALLBACK_HERO.titleLine2,
        subtitle: selected.subtitle || FALLBACK_HERO.subtitle,
        ctaText: selected.ctaText || FALLBACK_HERO.ctaText,
        ctaUrl: selected.ctaUrl || FALLBACK_HERO.ctaUrl,
      }
    }
  } catch (error) {
    console.error('[HOME_PAGE] Error fetching editorial:', error)
  }

  // 3. Fetch Podcast Settings
  let mainChannelHtml = ''
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'main_podcast_channel' }
    })
    if (setting) {
      mainChannelHtml = setting.value || ''
    }
  } catch (error) {
    console.error('[HOME_PAGE] Error fetching podcast setting:', error)
  }

  // 4. Fetch Latest News
  let initialNewsPosts: any[] = []
  try {
    const posts = await prisma.newsPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'desc' },
      take: 6,
    })
    
    // Serializar fechas para pasar al cliente
    initialNewsPosts = posts.map(p => ({
      ...p,
      createdAt: p.createdAt.toISOString(),
      publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
      updatedAt: p.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error('[HOME_PAGE] Error fetching news:', error)
  }

  return (
    <HomeClient 
      featuredSolutions={featuredSolutions} 
      editorial={editorial}
      mainChannelHtml={mainChannelHtml}
      initialNewsPosts={initialNewsPosts}
    />
  )
}
