import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
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

        // Trigger webhook for each post
        // Using a loop with a small delay for safety, although triggerMakeWebhook is non-blocking
        for (const post of posts) {
            await triggerMakeWebhook(post, true)
            // Pequeño retardo de 100ms para evitar saturar el webhook de Make si hay cientos de noticias
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        return NextResponse.json({ 
            success: true, 
            message: `Sincronización iniciada para ${posts.length} noticias.` 
        })
    } catch (error: any) {
        console.error('SERVER ERROR SYNC ALL:', error)
        return NextResponse.json({ error: 'Error in bulk sync: ' + error.message }, { status: 500 })
    }
}
