import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const members = await prisma.teamMember.findMany({
            orderBy: { order: 'asc' }
        })
        return NextResponse.json(members)
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching team members' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const member = await prisma.teamMember.create({
            data: {
                name: body.name,
                phone: body.phone,
                photoUrl: body.photoUrl,
                linkedIn: body.linkedIn,
                role: body.role,
                bio: body.bio,
                order: body.order || 0,
                showPhoto: body.showPhoto !== undefined ? body.showPhoto : true,
                showName: body.showName !== undefined ? body.showName : true,
                customFields: body.customFields || '{}',
            } as any,
        })


        return NextResponse.json(member)
    } catch (error: any) {
        console.error('Error creating team member:', error);
        return NextResponse.json({ error: error?.message || 'Error creating team member' }, { status: 500 })
    }
}

