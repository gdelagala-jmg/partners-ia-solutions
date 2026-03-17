import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        const app = await prisma.application.findUnique({
            where: { id },
        })

        if (!app) {
            return NextResponse.json({ error: 'App not found' }, { status: 404 })
        }

        return NextResponse.json(app)
    } catch (error) {
        console.error('Error fetching app:', error)
        return NextResponse.json({ error: 'Failed to fetch app' }, { status: 500 })
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const app = await prisma.application.update({
            where: { id },
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                image: body.image,
                externalUrl: body.externalUrl,
                content: body.content,
                published: body.published,
                order: body.order,
            },
        })

        return NextResponse.json(app)
    } catch (error: any) {
        console.error('Error updating app:', error)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'El slug ya está en uso' }, { status: 400 })
        }
        return NextResponse.json({ error: 'Failed to update app' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        await prisma.application.delete({
            where: { id },
        })

        return NextResponse.json({ message: 'App deleted' })
    } catch (error) {
        console.error('Error deleting app:', error)
        return NextResponse.json({ error: 'Failed to delete app' }, { status: 500 })
    }
}
