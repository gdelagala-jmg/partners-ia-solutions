import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

// GET /api/navigation - Get all navigation links
export async function GET() {
    try {
        const links = await prisma.navLink.findMany({
            orderBy: {
                order: 'asc'
            }
        })
        return NextResponse.json(links)
    } catch (error) {
        console.error('Error fetching navigation links:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST /api/navigation - Create a new navigation link
export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const body = await request.json()
        const { name, href, order, active, location } = body

        if (!name || !href) {
            return NextResponse.json({ error: 'Name and href are required' }, { status: 400 })
        }

        const link = await prisma.navLink.create({
            data: {
                name,
                href,
                location: location || "HEADER",
                order: order || 0,
                active: active !== undefined ? active : true
            }
        })

        return NextResponse.json(link)
    } catch (error) {
        console.error('Error creating navigation link:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
