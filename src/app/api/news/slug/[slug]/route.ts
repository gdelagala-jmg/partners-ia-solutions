import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

type Params = Promise<{ slug: string }>

export async function GET(request: Request, { params }: { params: Params }) {
    const { slug } = await params
    const post = await prisma.newsPost.findUnique({
        where: { slug },
    })
    if (!post) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(post)
}
