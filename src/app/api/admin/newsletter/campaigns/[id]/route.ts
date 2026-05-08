import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        const campaign = await prisma.newsletterCampaign.findUnique({
            where: { id },
            include: { logs: true }
        })
        if (!campaign) return NextResponse.json({ error: 'Campaña no encontrada' }, { status: 404 })
        return NextResponse.json(campaign)
    } catch (error) {
        console.error('Error fetching campaign:', error)
        return NextResponse.json({ error: 'Error al obtener la campaña' }, { status: 500 })
    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id: campaignId } = await params
    try {
        const body = await req.json()
        
        // Remove fields that should not be updated manually
        const { id, createdAt, updatedAt, logs, ...updateData } = body

        const campaign = await prisma.newsletterCampaign.update({
            where: { id: campaignId },
            data: updateData
        })
        return NextResponse.json(campaign)
    } catch (error) {
        console.error('Error updating campaign:', error)
        return NextResponse.json({ error: 'Error al actualizar la campaña' }, { status: 500 })
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    try {
        await prisma.newsletterCampaign.delete({
            where: { id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting campaign:', error)
        return NextResponse.json({ error: 'Error al eliminar la campaña' }, { status: 500 })
    }
}
