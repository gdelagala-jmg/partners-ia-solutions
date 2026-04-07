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
  // Fetching data on the server
  const sectors = await prisma.sector.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
    take: 6
  })

  // Adapt database objects to Sector interface
  const initialSectors = sectors.map(s => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    image: s.image,
    description: s.description || undefined
  }))

  return <HomeClient initialSectors={initialSectors} />
}
