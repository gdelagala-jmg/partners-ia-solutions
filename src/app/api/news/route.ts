import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/news - List all with optional filters
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const q = searchParams.get('q')
    const aiType = searchParams.get('aiType')
    const businessArea = searchParams.get('businessArea')
    const sector = searchParams.get('sector')
    const profession = searchParams.get('profession')

    const limit = searchParams.get('limit')
    const includeDrafts = searchParams.get('includeDrafts') === 'true'

    const where: any = {}
    if (!includeDrafts) {
        where.published = true
    }

    // Search logic
    if (q) {
        where.OR = [
            { title: { contains: q } },
            { content: { contains: q } }
        ]
    }

    if (aiType) where.aiType = aiType
    if (businessArea) where.businessArea = businessArea
    if (sector) where.sector = sector
    if (profession) where.profession = profession

    const posts = await prisma.newsPost.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
        take: limit ? parseInt(limit) : undefined,
    })
    return NextResponse.json(posts)
}

// POST /api/news - Create new post
export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const post = await prisma.newsPost.create({
            data: {
                title: body.title,
                slug: body.slug,
                category: body.category,
                aiType: body.aiType,
                businessArea: body.businessArea,
                sector: body.sector,
                profession: body.profession,
                content: body.content,
                coverImage: body.coverImage,
                published: body.published || false,
                publishedAt: body.published ? new Date() : null,
            },
        })

        return NextResponse.json(post)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error creating post' }, { status: 500 })
    }
}
