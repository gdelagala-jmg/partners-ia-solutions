import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import NewsDetailClient from '@/components/news/NewsDetailClient'

export const dynamic = 'force-dynamic'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    return {
        title: `TEST: ${slug} | IA Solutions`,
        description: 'Testing metadata propagation in production',
        openGraph: {
            title: `OG TEST: ${slug}`,
            description: 'Testing metadata propagation in production',
            url: `https://www.partnersiasolutions.com/noticias/${slug}`,
            siteName: 'IA Solutions',
            images: ['https://www.partnersiasolutions.com/logo-ias.png'],
        }
    }
}

export default async function NewsDetailPage({ params }: Props) {
    const { slug } = await params

    const post = await prisma.newsPost.findUnique({
        where: { slug },
    })

    if (!post) {
        notFound()
    }

    return <NewsDetailClient post={post} />
}
