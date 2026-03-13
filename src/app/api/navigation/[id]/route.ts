import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// PUT /api/navigation/[id] - Update a navigation link
export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    try {
        const body = await request.json()
        const { name, href, order, active, location } = body

        const link = await prisma.navLink.update({
            where: { id },
            data: {
                name,
                href,
                order,
                active,
                location
            }
        })

        return NextResponse.json(link)
    } catch (error) {
        console.error('Error updating navigation link:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// DELETE /api/navigation/[id] - Delete a navigation link
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    try {
        await prisma.navLink.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting navigation link:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
