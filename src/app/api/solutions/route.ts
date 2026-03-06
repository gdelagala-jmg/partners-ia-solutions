import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'

// GET /api/solutions - List all
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const sectorId = searchParams.get('sector')
    const featured = searchParams.get('featured')
    const limit = searchParams.get('limit')

    const where: any = { published: true }
    if (sectorId) {
        where.sectors = {
            some: {
                id: sectorId
            }
        }
    }
    if (featured === 'true') {
        where.featured = true
    }

    const solutions = await prisma.solution.findMany({
        where,
        orderBy: featured === 'true' ? { featuredOrder: 'asc' } : { order: 'asc' },
        take: limit ? parseInt(limit) : undefined,
        include: {
            sectors: true
        }
    })
    return NextResponse.json(solutions)
}

// POST /api/solutions - Create new
export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        let { title, description, slug, type, multimedia, ctaUrl, published, sectorIds, featured, featuredOrder } = body

        // Auto-generate slug if missing
        if (!slug || slug.trim() === '') {
            slug = generateSlug(title)
        }

        const solution = await prisma.solution.create({
            data: {
                title,
                description,
                slug,
                type,
                multimedia,
                ctaUrl,
                published,
                featured: featured || false,
                featuredOrder: featuredOrder || null,
                sectors: sectorIds && sectorIds.length > 0 ? {
                    connect: sectorIds.map((id: string) => ({ id }))
                } : undefined
            },
        })

        return NextResponse.json(solution)
    } catch (error) {
        console.error('Error creating solution:', error)
        return NextResponse.json({
            error: 'Error creating solution',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
