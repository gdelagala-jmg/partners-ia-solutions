import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils/slugify'

export async function POST(request: Request) {
    const authHeader = request.headers.get('x-api-key')
    const webhookKey = process.env.GOOGLE_STUDIO_WEBHOOK_KEY

    // Basic security check
    if (!authHeader || authHeader !== webhookKey) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        
        if (!body.title || !body.content) {
            return NextResponse.json({ error: 'Missing title or content' }, { status: 400 })
        }

        const title = body.title
        const slug = body.slug || `${slugify(title)}-${Math.random().toString(36).substring(2, 7)}`

        const post = await prisma.newsPost.create({
            data: {
                title: title,
                slug: slug,
                category: body.category || 'IA News',
                tags: body.tags,
                content: body.content,
                coverImage: body.coverImage,
                aiType: body.aiType,
                businessArea: body.businessArea,
                profession: body.profession,
                sector: body.sector,
                published: body.published !== undefined ? body.published : true,
                publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
            },
        })

        return NextResponse.json({
            success: true,
            message: 'News post created via webhook',
            post: {
                id: post.id,
                slug: post.slug,
                title: post.title
            }
        })
    } catch (error: any) {
        console.error('Webhook Error:', error)
        return NextResponse.json({ 
            error: 'Failed to create news post', 
            details: error.message 
        }, { status: 500 })
    }
}
