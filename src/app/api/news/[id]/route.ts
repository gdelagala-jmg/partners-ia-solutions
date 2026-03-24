import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { triggerMakeWebhook } from '@/lib/webhook'
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
                published: body.published,
                publishedAt: (body.publishedAt && !isNaN(new Date(body.publishedAt).getTime())) 
                    ? new Date(body.publishedAt) 
                    : (body.published ? new Date() : null),
            },
        })

        // Detectar si la noticia acaba de ser publicada ahora (false -> true)
        const isNewPublish = !existing.published && post.published
        if (isNewPublish) {
            await triggerMakeWebhook(post, true)
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
