import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET /api/courses
export async function GET() {
    const courses = await prisma.course.findMany({
        orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(courses)
}

// POST /api/courses
export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const course = await prisma.course.create({
            data: {
                title: body.title,
                slug: body.slug,
                description: body.description,
                level: body.level,
                duration: body.duration,
                price: body.price,
                coverImage: body.coverImage,
                published: body.published || false,
            },
        })
        return NextResponse.json(course)
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Error creating course' }, { status: 500 })
    }
}
