import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import HomeClient from './HomeClient'

export const metadata: Metadata = {
  title: 'Partners IA Solutions | Expertos en IA y Automatización para Empresas',
  description: 'Transformamos el futuro con Inteligencia Artificial. Diseñamos ecosistemas inteligentes que automatizan procesos y escalan negocios. Líderes en soluciones de IA a medida.',
  openGraph: {
    title: 'Partners IA Solutions | Liderando la Revolución de la IA',
    description: 'Expertos en desplegar agentes inteligentes y automatización avanzada para empresas en España y Europa.',
    images: ['/logo-ias.png'], // Idealmente una imagen de banner
  }
}

export default async function HomePage() {
  // Fetching featured solutions on the server
  const solutions = await prisma.solution.findMany({
    where: { published: true, featured: true },
    orderBy: { featuredOrder: 'asc' },
    take: 3
  })

  // Adapt database objects to HomeSolution interface
  const featuredSolutions = solutions.map(s => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    multimediaUrl: s.multimedia,
    description: s.description,
    type: s.type
  }))

  return <HomeClient featuredSolutions={featuredSolutions} />
}
