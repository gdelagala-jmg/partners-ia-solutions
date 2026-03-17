import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const includeDrafts = searchParams.get('includeDrafts') === 'true'

        const where: any = {}
        if (!includeDrafts) {
            where.published = true
        }

        const apps = await prisma.app.findMany({
            where,
            orderBy: { order: 'asc' },
        })

        return NextResponse.json(apps)
    } catch (error) {
        console.error('Error fetching apps:', error)
        return NextResponse.json({ error: 'Failed to fetch apps' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const app = await prisma.app.create({
            data: {
                name: body.name,
                slug: body.slug,
                description: body.description,
                image: body.image,
                externalUrl: body.externalUrl,
                content: body.content,
                published: body.published ?? false,
                order: body.order ?? 0,
            },
        })

        return NextResponse.json(app)
    } catch (error: any) {
        console.error('Error creating app:', error)
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'El slug ya está en uso' }, { status: 400 })
        }
        return NextResponse.json({ error: 'Error al crear la aplicación' }, { status: 500 })
    }
}
