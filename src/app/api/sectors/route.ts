import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'

// GET /api/sectors - List all
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'

    try {
        const where = activeOnly ? { active: true } : {}
        const sectors = await prisma.sector.findMany({
            where,
            orderBy: { order: 'asc' },
            include: {
                _count: {
                    select: { solutions: true }
                }
            }
        })
        return NextResponse.json(sectors)
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching sectors' }, { status: 500 })
    }
}

// POST /api/sectors - Create new
export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()

        // Basic validation
        if (!body.name || !body.image || !body.externalUrl) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const sector = await prisma.sector.create({
            data: {
                name: body.name,
                slug: body.slug || generateSlug(body.name),
                image: body.image,
                externalUrl: body.externalUrl,
                description: body.description,
                order: body.order || 0,
                active: body.active !== undefined ? body.active : true,
            },
        })

        return NextResponse.json(sector)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error creating sector' }, { status: 500 })
    }
}
