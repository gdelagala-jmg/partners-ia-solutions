import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const data = await request.json()
        const partner = await prisma.strategicPartner.update({
            where: { id: params.id },
            data: {
                name: data.name,
                slug: data.slug,
                logoUrl: data.logoUrl,
                logoAlt: data.logoAlt,
                websiteUrl: data.websiteUrl,
                category: data.category,
                displayOrder: data.displayOrder,
                isActive: data.isActive,
                isFeatured: data.isFeatured,
                showInFooter: data.showInFooter,
                showInHomepage: data.showInHomepage,
                showInSolutions: data.showInSolutions,
                brandColor: data.brandColor,
                logoVariant: data.logoVariant,
            }
        })
        return NextResponse.json(partner)
    } catch (error) {
        console.error('Error updating strategic partner:', error)
        return NextResponse.json({ error: 'Error updating strategic partner' }, { status: 500 })
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        await prisma.strategicPartner.delete({
            where: { id: params.id }
        })
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting strategic partner:', error)
        return NextResponse.json({ error: 'Error deleting strategic partner' }, { status: 500 })
    }
}
