import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    try {
        const partners = await prisma.strategicPartner.findMany({
            orderBy: { displayOrder: 'asc' }
        })
        return NextResponse.json(partners)
    } catch (error) {
        console.error('Error fetching strategic partners:', error)
        return NextResponse.json({ error: 'Error fetching strategic partners' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const data = await request.json()
        const partner = await prisma.strategicPartner.create({
            data: {
                name: data.name,
                slug: data.slug,
                logoUrl: data.logoUrl,
                logoAlt: data.logoAlt,
                websiteUrl: data.websiteUrl,
                category: data.category,
                displayOrder: data.displayOrder ?? 0,
                isActive: data.isActive ?? true,
                isFeatured: data.isFeatured ?? false,
                showInFooter: data.showInFooter ?? true,
                showInHomepage: data.showInHomepage ?? false,
                showInSolutions: data.showInSolutions ?? false,
                brandColor: data.brandColor,
                logoVariant: data.logoVariant ?? 'ORIGINAL',
            }
        })
        return NextResponse.json(partner)
    } catch (error) {
        console.error('Error creating strategic partner:', error)
        return NextResponse.json({ error: 'Error creating strategic partner' }, { status: 500 })
    }
}
