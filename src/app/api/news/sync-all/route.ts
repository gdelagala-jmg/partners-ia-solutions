import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ensureNewsletterCampaign } from '@/lib/newsletter-automation'
import { triggerMakeWebhook } from '@/lib/webhook'

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const posts = await prisma.newsPost.findMany({
            where: { published: true },
            orderBy: { publishedAt: 'desc' },
        })

        if (posts.length === 0) {
            return NextResponse.json({ success: true, message: 'No published news to sync' })
        }

        // Disparar webhooks y asegurar newsletter para cada noticia publicada
        await Promise.all(posts.map(async (post) => {
            // Webhook de Google Business
            await triggerMakeWebhook(post, true);
            
            // Asegurar campaña de newsletter
            console.log(`[Newsletter] Iniciando trigger (SYNC-ALL) para post: ${post.id} (${post.title})`)
            try {
                const result = await ensureNewsletterCampaign(post)
                if (result) {
                    console.log(`[Newsletter] ÉXITO: Campaña procesada para post ${post.id}`)
                } else {
                    console.log(`[Newsletter] INFO: No se requirió creación para post ${post.id} (posible duplicado u omitido)`)
                }
            } catch (err: any) {
                console.error(`[Newsletter][ERROR] Fallo al generar campaña para post ${post.id} en sync-all:`, err.message)
            }
        }));

        return NextResponse.json({ 
            success: true, 
            message: `Sincronización iniciada para ${posts.length} noticias.` 
        })
    } catch (error: any) {
        console.error('SERVER ERROR SYNC ALL:', error)
        return NextResponse.json({ error: 'Error in bulk sync: ' + error.message }, { status: 500 })
    }
}
