import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generateSlug } from '@/lib/utils'
// Helper to await params in Next.js 15+ if needed, but here we can just use the second arg
// Note: In recent Next.js versions params is a Promise
type Params = Promise<{ id: string }>

// GET /api/solutions/[id]
export async function GET(request: Request, { params }: { params: Params }) {
    const { id } = await params
    const solution = await prisma.solution.findUnique({
        where: { id },
        include: { gallery: { orderBy: { order: 'asc' } }, sectors: true }
    })

    if (!solution) {
        return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(solution)
}

// PUT /api/solutions/[id]
export async function PUT(request: Request, { params }: { params: Params }) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        const body = await request.json()
        let { 
            title, description, slug, type, multimedia, ctaUrl, published, sectorIds, 
            featured, featuredOrder, functionalDescription, problemsSolved, capabilities, workflowDescription, gallery 
        } = body

        // Auto-generate slug if missing
        if (!slug || slug.trim() === '') {
            slug = generateSlug(title)
        }

        const solution = await prisma.solution.update({
            where: { id },
            data: {
                title,
                description,
                slug,
                type,
                multimedia,
                ctaUrl,
                published,
                functionalDescription,
                problemsSolved,
                capabilities,
                workflowDescription,
                featured: featured !== undefined ? featured : undefined,
                featuredOrder: featuredOrder !== undefined ? featuredOrder : undefined,
                sectors: sectorIds ? {
                    set: sectorIds.map((id: string) => ({ id }))
                } : undefined,
                ...(gallery !== undefined ? {
                    gallery: {
                        deleteMany: {},
                        create: gallery.map((g: any, index: number) => ({
                            url: g.url,
                            alt: g.alt || '',
                            type: g.type || 'IMAGE',
                            order: g.order !== undefined ? g.order : index,
                            isPrimary: g.isPrimary || false
                        }))
                    }
                } : {})
            },
        })

        return NextResponse.json(solution)
    } catch (error) {
        console.error('Error updating solution:', error)
        return NextResponse.json({
            error: 'Error updating solution',
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}

// DELETE /api/solutions/[id]
export async function DELETE(request: Request, { params }: { params: Params }) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const { id } = await params
        await prisma.solution.delete({
            where: { id },
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting solution' }, { status: 500 })
    }
}
