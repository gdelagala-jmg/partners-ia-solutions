import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyAuth } from '@/lib/auth'

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const key = searchParams.get('key')

    if (!key) {
        return NextResponse.json({ error: 'Key is required' }, { status: 400 })
    }

    try {
        const setting = await prisma.siteSetting.findUnique({
            where: { key }
        })
        return NextResponse.json(setting || { key, value: '' })
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch setting' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const isAuth = await verifyAuth(request)
        if (!isAuth) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await request.json()
        const setting = await prisma.siteSetting.upsert({
            where: { key: data.key },
            update: { value: data.value },
            create: { key: data.key, value: data.value }
        })

        return NextResponse.json(setting)
    } catch (error) {
        return NextResponse.json({ error: 'Failed to save setting' }, { status: 500 })
    }
}
