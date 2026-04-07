import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import SectorSolutionClient from './SectorSolutionClient'
import JSONLD from '@/components/seo/JSONLD'

interface Props {
  params: { slug: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const sector = await prisma.sector.findUnique({
    where: { slug: params.slug }
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
  const sector = await prisma.sector.findUnique({
    where: { slug: params.slug }
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
