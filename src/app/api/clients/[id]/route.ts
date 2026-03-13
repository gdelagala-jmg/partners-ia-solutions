import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    try {
        const client = await prisma.client.findUnique({
            where: { id }
        })
        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 })
        }
        return NextResponse.json(client)
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching client' }, { status: 500 })
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const data = await request.json()
        const client = await prisma.client.update({
            where: { id },
            data: {
                companyName: data.companyName,
                taxId: data.taxId,
                address: data.address,
                website: data.website,
                sector: data.sector,
                contactName: data.contactName,
                contactPhone: data.contactPhone,
                logoUrl: data.logoUrl,
                active: data.active,
            }
        })
        return NextResponse.json(client)
    } catch (error) {
        console.error('Error updating client:', error)
        return NextResponse.json({ error: 'Error updating client' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        await prisma.client.delete({
            where: { id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting client:', error)
        return NextResponse.json({ error: 'Error deleting client' }, { status: 500 })
    }
}
