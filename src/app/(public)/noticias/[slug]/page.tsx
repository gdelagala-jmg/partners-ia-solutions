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

    return {
        title: `${post.title} | IA Solutions`,
        description,
        openGraph: {
            title: post.title,
            description,
            type: 'article',
            publishedTime: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
            images: post.coverImage ? [{ url: post.coverImage }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description,
            images: post.coverImage ? [post.coverImage] : [],
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
