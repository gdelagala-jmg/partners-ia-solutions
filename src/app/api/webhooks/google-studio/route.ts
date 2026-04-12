import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils/slugify'
import { downloadAndStoreImage } from '@/lib/utils/image-storage'
import { syncPodcastToFeed } from '@/lib/utils/podcast-sync'

function getCorsHeaders(origin: string | null) {
    // Reflect the requesting origin for max compatibility
    // Security is handled by the x-api-key header
    const allowOrigin = origin || '*'
    return {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-api-key, Authorization',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
    }
}

export async function OPTIONS(request: Request) {
    const origin = request.headers.get('origin')
    return new Response(null, {
        status: 204,
        headers: getCorsHeaders(origin)
    })
}

export async function POST(request: Request) {
    const origin = request.headers.get('origin')
    const corsHeaders = getCorsHeaders(origin)
    
    // Check if it's the right origin (optional logging for debugging)
    console.log('Webhook request from origin:', origin)

    const authHeader = request.headers.get('x-api-key')
    const webhookKey = process.env.GOOGLE_STUDIO_WEBHOOK_KEY

    // Basic security check
    if (!authHeader || authHeader !== webhookKey) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders })
    }

    try {
        const body = await request.json()
        
        if (!body.title || !body.content) {
            return NextResponse.json({ error: 'Missing title or content' }, { status: 400, headers: corsHeaders })
        }

        const title = body.title
        const slug = body.slug || slugify(title)

        // Map tags if it's an array to a string (as per current schema)
        const tags = Array.isArray(body.tags) ? body.tags.join(', ') : body.tags

        const imageUrl = body.imageUrl || body.coverImage || null
        const persistedImageUrl = imageUrl ? await downloadAndStoreImage(imageUrl, `gs-${slugify(title).substring(0, 30)}`) : null

        const post = await prisma.newsPost.create({
            data: {
                title: title,
                slug: slug,
                category: body.category || 'IA News',
                tags: tags || null,
                content: body.content,
                coverImage: persistedImageUrl || imageUrl, // Use persisted if successful, fallback to original
                aiType: body.aiType || null,
                businessArea: body.businessArea || null,
                sector: body.sector || null,
                profession: body.profession || null,
                aiTool: body.aiTool || null,
                published: body.published !== undefined ? body.published : true,
                publishedAt: body.publishedAt ? new Date(body.publishedAt) : new Date(),
            },
        })

        // -- IMPORTANTE: Disparar Sincronización con Google Business Profile --
        if (post.published) {
            try {
                // Importación dinámica para evitar ciclos de dependencia si fuera necesario
                const { triggerMakeWebhook } = await import('@/lib/webhook')
                await triggerMakeWebhook(post, true)
            } catch (webhookError) {
                console.error('[GMB Sync] Failed to trigger GMB webhook:', webhookError)
            }
        }

        // Chained Podcast Sync
        let podcastEpisode = null
        if (body.podcastAudioUrl) {
            try {
                podcastEpisode = await syncPodcastToFeed({
                    title: post.title,
                    content: post.content,
                    audioUrl: body.podcastAudioUrl,
                    newsPostId: post.id,
                    sourceName: body.sourceName || body.company || 'IA Solutions',
                    sourceUrl: body.sourceUrl
                })
            } catch (pError) {
                console.error('Failed to sync podcast:', pError)
                // We don't fail the news creation if podcast sync fails, just log it
            }
        }

        return NextResponse.json({
            success: true,
            message: 'News post created via webhook',
            post: {
                id: post.id,
                slug: post.slug,
                title: post.title,
                podcastSynced: !!podcastEpisode
            }
        }, { headers: corsHeaders })
    } catch (error: any) {
        console.error('Webhook Error:', error)
        return NextResponse.json({ 
            error: 'Failed to create news post', 
            details: error.message 
        }, { status: 500, headers: corsHeaders })
    }
}

