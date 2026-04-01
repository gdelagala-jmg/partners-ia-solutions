import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PUT(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const member = await prisma.teamMember.update({
            where: { id: params.id },
            data: {
                name: body.name,
                phone: body.phone,
                photoUrl: body.photoUrl,
                linkedIn: body.linkedIn,
                role: body.role,
                bio: body.bio,
                order: Number(body.order) || 0,
                showPhoto: body.showPhoto === true,
                showName: body.showName === true,
                customFields: body.customFields || '{}',
            } as any,
        })



        return NextResponse.json(member)
    } catch (error: any) {
        console.error('Error updating team member:', error);
        return NextResponse.json({ error: error?.message || 'Error updating team member' }, { status: 500 })
    }
}


export async function DELETE(request: Request, props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        await prisma.teamMember.delete({
            where: { id: params.id },
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting team member:', error);
        return NextResponse.json({ error: 'Error deleting team member' }, { status: 500 })
    }
}
