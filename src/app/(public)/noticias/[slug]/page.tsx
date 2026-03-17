import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import NewsDetailClient from '@/components/news/NewsDetailClient'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params
    
    const post = await prisma.newsPost.findUnique({
        where: { slug },
    })

    if (!post) return { title: 'Noticia no encontrada' }

    // Strip HTML tags for description
    const description = post.content
        .replace(/<[^>]*>/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .substring(0, 160) + '...'

    const url = `https://www.partnersiasolutions.com/noticias/${slug}`
    const imageUrl = post.coverImage ? 
        (post.coverImage.startsWith('http') ? post.coverImage : `https://www.partnersiasolutions.com${post.coverImage}`) : 
        'https://www.partnersiasolutions.com/logo-ias.png'

    return {
        title: `${post.title} | IA Solutions`,
        description,
        alternates: {
            canonical: url,
        },
        openGraph: {
            title: post.title,
            description,
            url,
            siteName: 'IA Solutions',
            type: 'article',
            publishedTime: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
            images: [{
                url: imageUrl,
                width: 1200,
                height: 630,
                alt: post.title,
            }],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description,
            images: [imageUrl],
        },
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
