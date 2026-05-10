import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureNewsletterCampaign } from '@/lib/newsletter-automation'

export async function POST(req: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await req.json()
        const { postId } = body

        if (!postId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 })
        }

        const post = await prisma.newsPost.findUnique({
            where: { id: postId }
        })

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 })
        }

        if (!post.published) {
            return NextResponse.json({ error: 'El artículo debe estar publicado para generar newsletter' }, { status: 400 })
        }

        // Check if campaign already exists
        const existing = await prisma.newsletterCampaign.findFirst({
            where: { sourcePostId: postId }
        })

        if (existing) {
            return NextResponse.json({ 
                success: true, 
                message: 'Ya existe una campaña para este artículo',
                campaign: existing,
                alreadyExisted: true
            })
        }

        const campaign = await ensureNewsletterCampaign(post)

        return NextResponse.json({ 
            success: true, 
            message: 'Campaña generada exitosamente',
            campaign,
            alreadyExisted: false
        })
    } catch (error: any) {
        console.error('Error generating manual campaign:', error)
        return NextResponse.json({ error: 'Error al generar campaña: ' + error.message }, { status: 500 })
    }
}
