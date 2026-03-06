import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function GET() {
    try {
        const media = await prisma.mediaItem.findMany({
            where: { published: true },
            orderBy: { order: 'asc' }
        })
        return NextResponse.json(media)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const isAuth = await verifyAuth(request)
        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()
        const media = await prisma.mediaItem.create({
            data: {
                type: data.type,
                title: data.title,
                url: data.url,
                embedHtml: data.embedHtml,
                thumbnail: data.thumbnail,
                published: data.published ?? false,
                order: data.order ?? 0,
            }
        })

        return NextResponse.json(media)
    } catch (error) {
        console.error('POST /api/media error:', error)
        return NextResponse.json({ error: 'Failed to create media item' }, { status: 500 })
    }
}
