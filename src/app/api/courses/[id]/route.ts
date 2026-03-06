import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
type Params = Promise<{ id: string }>

export async function GET(request: Request, { params }: { params: Params }) {
    const { id } = await params
    const course = await prisma.course.findUnique({
        where: { id },
    })
    if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(course)
}

export async function PUT(request: Request, { params }: { params: Params }) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { id } = await params
        const body = await request.json()
        const course = await prisma.course.update({
            where: { id },
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description,
                level: body.level,
                duration: body.duration,
                price: body.price,
                coverImage: body.coverImage,
                published: body.published,
            },
        })
        return NextResponse.json(course)
    } catch (error) {
        return NextResponse.json({ error: 'Error updating course' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Params }) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const { id } = await params
        await prisma.course.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting course' }, { status: 500 })
    }
}
