import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(leads)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error fetching leads' }, { status: 500 })
    }
}
