import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SectorSolutionClient from './SectorSolutionClient'
import SolutionDetailClient from './SolutionDetailClient'
import JSONLD from '@/components/seo/JSONLD'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  
  // Try Solution first
  const solution = await prisma.solution.findUnique({
    where: { slug, published: true }
  })

  if (solution) {
    return {
      title: `${solution.title} | Partners IA Solutions`,
      description: solution.description,
      openGraph: {
        title: solution.title,
        description: solution.description,
        images: [solution.multimedia || '/logo-ias.png'],
      }
    }
  }

  // Fallback to Sector
  const sector = await prisma.sector.findUnique({
    where: { slug }
  })

  if (!sector) return {}

  const title = `Soluciones de IA para ${sector.name} | Partners IA Solutions`
  const description = sector.description || `Descubre cómo la Inteligencia Artificial está transformando el sector de ${sector.name.toLowerCase()}. Automatización, agentes inteligentes y eficiencia operativa.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [sector.image || '/logo-ias.png'],
    }
  }
}

export default async function SectorSolutionPage({ params }: Props) {
  const { slug } = await params

  // 1. Try to find a specific Solution
  const solution = await prisma.solution.findUnique({
    where: { slug, published: true },
    include: { gallery: { orderBy: { order: 'asc' } } }
  })

  if (solution) {
    return (
      <>
        <JSONLD 
          schema={{
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: solution.title,
            description: solution.description,
            brand: {
              '@type': 'Brand',
              name: 'Partners IA Solutions'
            }
          }}
        />
        <SolutionDetailClient solution={solution} />
      </>
    )
  }

  // 2. Fallback to Sector
  const sector = await prisma.sector.findUnique({
    where: { slug }
  })

  if (!sector) return notFound()

  // Clean data for client
  const sectorData = {
    id: sector.id,
    name: sector.name,
    slug: sector.slug,
    image: sector.image,
    description: sector.description || undefined
  }

  return (
    <>
      <JSONLD 
        schema={{
          '@context': 'https://schema.org',
          '@type': 'Service',
          name: `Soluciones de IA para ${sector.name}`,
          description: sector.description || `Servicios de consultoría e implementación de IA para el sector ${sector.name.toLowerCase()}.`,
          provider: {
            '@type': 'Organization',
            name: 'Partners IA Solutions',
            url: 'https://partnersiasolutions.com'
          },
          areaServed: 'ES',
          serviceType: 'AI Implementation'
        }}
      />
      <SectorSolutionClient sector={sectorData} />
    </>
  )
}
