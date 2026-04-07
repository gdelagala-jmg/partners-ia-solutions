import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import SolutionsClient from './SolutionsClient'

export const metadata: Metadata = {
  title: 'Soluciones de IA por Industrias | Partners IA Solutions',
  description: 'Explora nuestras soluciones de Inteligencia Artificial especializadas por sector: Legal, Inmobiliario, Finanzas, Salud y más. Automatización inteligente a tu alcance.',
  openGraph: {
    title: 'Catálogo de Soluciones IA | Partners IA Solutions',
    description: 'Encuentra la solución de IA perfecta para tu industria y escala tu negocio con tecnología de vanguardia.',
    images: ['/logo-ias.png'],
  }
}

export default async function SolutionsPage() {
  const sectors = await prisma.sector.findMany({
    where: { active: true },
    orderBy: { order: 'asc' }
  })

  // Adapt to interface
  const sectorsData = sectors.map(s => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    image: s.image,
    description: s.description || undefined
  }))

  return <SolutionsClient sectors={sectorsData} />
}
