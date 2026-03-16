import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
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
        const post = await prisma.newsPost.update({
            where: { id },
            data: {
                title: body.title,
                slug: body.slug,
                category: body.category,
                tags: body.tags,
                aiType: body.aiType,
                businessArea: body.businessArea,
                sector: body.sector,
                profession: body.profession,
                content: body.content,
                coverImage: body.coverImage,
                published: body.published,
                publishedAt: body.publishedAt ? new Date(body.publishedAt) : (body.published ? new Date() : null),
            },
        })
        return NextResponse.json(post)
    } catch (error) {
        return NextResponse.json({ error: 'Error updating post' }, { status: 500 })
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
