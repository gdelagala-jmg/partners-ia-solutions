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

        // Disparar webhooks en paralelo para evitar timeout de Vercel (especialmente para 49 noticias)
        await Promise.all(posts.map(post => triggerMakeWebhook(post, true)));

        return NextResponse.json({ 
            success: true, 
            message: `Sincronización iniciada para ${posts.length} noticias.` 
        })
    } catch (error: any) {
        console.error('SERVER ERROR SYNC ALL:', error)
        return NextResponse.json({ error: 'Error in bulk sync: ' + error.message }, { status: 500 })
    }
}
