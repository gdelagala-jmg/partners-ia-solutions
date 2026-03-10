import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

type Params = Promise<{ id: string }>

export async function PATCH(request: Request, { params }: { params: Params }) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        const body = await request.json()

        const lead = await prisma.lead.update({
            where: { id },
            data: { status: body.status },
        })

        return NextResponse.json(lead)
    } catch (error) {
        console.error('Error updating lead:', error)
        return NextResponse.json({ error: 'Error updating lead' }, { status: 500 })
    }
}
