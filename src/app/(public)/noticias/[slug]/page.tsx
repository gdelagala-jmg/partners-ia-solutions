import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import NewsDetailClient from '@/components/news/NewsDetailClient'
import JSONLD from '@/components/seo/JSONLD'

export const dynamic = 'force-dynamic'

interface Props {
    params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    try {
        const { slug } = await params
        
        const post = await prisma.newsPost.findUnique({
            where: { slug },
        })

        if (!post) {
            return { 
                title: 'Noticia no encontrada | IA Solutions' 
            }
        }

        const description = post.content
            .replace(/<[^>]*>/g, ' ')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim()
            .substring(0, 160) + '...'

        const domain = 'https://www.partnersiasolutions.com'
        const url = `${domain}/noticias/${slug}`
        
        const imageUrl = post.coverImage ? 
            (post.coverImage.startsWith('http') ? post.coverImage : `${domain}${post.coverImage}`) : 
            `${domain}/logo-ias.png`

        return {
            title: `${post.title} | Inteligencia Hub`,
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
    } catch (error) {
        console.error('Metadata Error:', error)
        return {
            title: 'Noticias & Insights Hub | IA Solutions'
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

    const domain = 'https://www.partnersiasolutions.com'
    const url = `${domain}/noticias/${slug}`
    const imageUrl = post.coverImage ? 
        (post.coverImage.startsWith('http') ? post.coverImage : `${domain}${post.coverImage}`) : 
        `${domain}/logo-ias.png`

    const articleSchema = {
        headline: post.title,
        image: imageUrl,
        datePublished: post.publishedAt?.toISOString() || post.createdAt.toISOString(),
        dateModified: post.updatedAt?.toISOString() || post.createdAt.toISOString(),
        author: {
            '@type': 'Organization',
            name: 'Partners IA Solutions',
            url: domain
        },
        publisher: {
            '@type': 'Organization',
            name: 'Partners IA Solutions',
            logo: {
                '@type': 'ImageObject',
                url: `${domain}/logo-ias.png`
            }
        },
        description: post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': url
        }
    }

    const breadcrumbSchema = {
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Inicio',
                item: domain
            },
            {
                '@type': 'ListItem',
                position: 2,
                name: 'Noticias',
                item: `${domain}/noticias`
            },
            {
                '@type': 'ListItem',
                position: 3,
                name: post.title,
                item: url
            }
        ]
    }

    return (
        <>
            <JSONLD type="NewsArticle" data={articleSchema} />
            <JSONLD type="BreadcrumbList" data={breadcrumbSchema} />
            <NewsDetailClient post={post} />
        </>
    )
}
