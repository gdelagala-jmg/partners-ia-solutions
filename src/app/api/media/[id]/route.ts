import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const media = await prisma.mediaItem.findUnique({
            where: { id }
        })

        if (!media) {
            return NextResponse.json({ error: 'Media item not found' }, { status: 404 })
        }

        return NextResponse.json(media)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch media item' }, { status: 500 })
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAuth = await verifyAuth(request)
        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        const data = await request.json()
        const media = await prisma.mediaItem.update({
            where: { id },
            data: {
                type: data.type,
                title: data.title,
                url: data.url,
                embedHtml: data.embedHtml,
                thumbnail: data.thumbnail,
                published: data.published,
                order: data.order,
            }
        })

        return NextResponse.json(media)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update media item' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const isAuth = await verifyAuth(request)
        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { id } = await params
        await prisma.mediaItem.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete media item' }, { status: 500 })
    }
}
