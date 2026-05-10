import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { triggerMakeWebhook } from '@/lib/webhook'
import { ensureNewsletterCampaign } from '@/lib/newsletter-automation'
import { syncPodcastToFeed } from '@/lib/utils/podcast-sync'
type Params = Promise<{ id: string }>

export async function GET(request: Request, { params }: { params: Params }) {
    const { id } = await params
    const post = await prisma.newsPost.findUnique({
        where: { id },
    })
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(post)
}

export async function PUT(request: Request, { params }: { params: Params }) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { id } = await params
        const body = await request.json()
        
        const existing = await prisma.newsPost.findUnique({ where: { id } })
        if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        const post = await prisma.newsPost.update({
            where: { id },
            data: {
                title: body.title,
                slug: body.slug,
                category: body.category,
                tags: body.tags,
                // @ts-ignore
                aiType: body.aiType,
                // @ts-ignore
                businessArea: body.businessArea,
                // @ts-ignore
                sector: body.sector,
                // @ts-ignore
                profession: body.profession,
                // @ts-ignore
                aiTool: body.aiTool,
                // @ts-ignore
                company: body.company,
                content: body.content,
                coverImage: body.coverImage,
                podcastAudioUrl: body.podcastAudioUrl,
                published: body.published,
                publishedAt: (body.publishedAt && !isNaN(new Date(body.publishedAt).getTime())) 
                    ? new Date(body.publishedAt) 
                    : (body.published ? new Date() : null),
            },
        })

        // Si se ha añadido o cambiado el audio del podcast, sincronizar a RSS
        if (body.podcastAudioUrl && body.podcastAudioUrl !== existing.podcastAudioUrl) {
            try {
                await syncPodcastToFeed({
                    title: post.title,
                    content: post.content,
                    audioUrl: body.podcastAudioUrl,
                    newsPostId: post.id,
                    sourceName: body.company || 'IA Solutions',
                    sourceUrl: `/noticias/${post.slug}`
                })
            } catch (err) {
                console.error('Error syncing podcast on update:', err)
            }
        }

        // Generación de newsletter (siempre que esté publicado)
        if (post.published) {
            // Si antes no estaba publicado, disparamos webhook de GMB
            if (!existing.published) {
                await triggerMakeWebhook(post, true)
            }
            
            // FASE 6: Generación automática de newsletter (centralizado)
            console.log(`[Newsletter] Iniciando trigger para post: ${post.id} (${post.title})`)
            try {
                const result = await ensureNewsletterCampaign(post)
                if (result) {
                    console.log(`[Newsletter] ÉXITO: Campaña procesada para post ${post.id}`)
                } else {
                    console.log(`[Newsletter] INFO: No se requirió creación para post ${post.id} (posible duplicado u omitido)`)
                }
            } catch (err: any) {
                console.error(`[Newsletter][ERROR] Fallo al generar campaña para post ${post.id}:`, err.message)
            }
        } else {
            console.log(`[Newsletter] Omitido: El post ${post.id} no está marcado como publicado.`)
        }
        return NextResponse.json(post)
    } catch (error: any) {
        console.error('SERVER ERROR UPDATE:', error)
        return NextResponse.json({ error: 'Error updating post: ' + error.message }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { id } = await params
        await prisma.newsPost.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting post' }, { status: 500 })
    }
}
