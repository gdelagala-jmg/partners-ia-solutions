import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    try {
        const clients = await prisma.client.findMany({
            orderBy: { companyName: 'asc' }
        })
        return NextResponse.json(clients)
    } catch (error) {
        console.error('Error fetching clients:', error)
        return NextResponse.json({ error: 'Error fetching clients' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const data = await request.json()
        const client = await prisma.client.create({
            data: {
                companyName: data.companyName,
                taxId: data.taxId,
                address: data.address,
                website: data.website,
                sector: data.sector,
                contactName: data.contactName,
                contactPhone: data.contactPhone,
                logoUrl: data.logoUrl,
                active: data.active ?? true,
            }
        })
        return NextResponse.json(client)
    } catch (error) {
        console.error('Error creating client:', error)
        return NextResponse.json({ error: 'Error creating client' }, { status: 500 })
    }
}
