import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// PUT /api/sectors/[id] - Update
export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const sector = await prisma.sector.update({
            where: { id: params.id },
            data: {
                name: body.name,
                slug: body.slug,
                image: body.image,
                externalUrl: body.externalUrl,
                description: body.description,
                order: body.order,
                active: body.active,
            },
        })
        return NextResponse.json(sector)
    } catch (error) {
        return NextResponse.json({ error: 'Error updating sector' }, { status: 500 })
    }
}

// DELETE /api/sectors/[id] - Delete
export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        await prisma.sector.delete({
            where: { id: params.id },
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting sector' }, { status: 500 })
    }
}
