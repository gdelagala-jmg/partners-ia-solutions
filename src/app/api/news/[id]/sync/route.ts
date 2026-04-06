import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { triggerMakeWebhook } from '@/lib/webhook'

type Params = Promise<{ id: string }>

export async function POST(request: Request, { params }: { params: Params }) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        const post = await prisma.newsPost.findUnique({
            where: { id },
        })

        if (!post) {
            return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }

        // Forzamos el disparo del webhook independientemente de si es nuevo o no
        await triggerMakeWebhook(post, true)

        return NextResponse.json({ success: true, message: 'Webhook triggered successfully' })
    } catch (error: any) {
        console.error('SERVER ERROR SYNC:', error)
        return NextResponse.json({ error: 'Error triggering sync: ' + error.message }, { status: 500 })
    }
}
