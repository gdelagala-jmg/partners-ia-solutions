import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { createdAt: 'desc' }
    })
    return NextResponse.json(properties)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to fetch properties' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const property = await prisma.property.create({
      data: {
        address: data.address,
        price: parseFloat(data.price),
        category: data.category,
        type: data.type,
        thumb: data.thumb,
        featured: data.featured || false,
        visible: data.visible ?? true,
        description: data.description,
        matterportUrl: data.matterportUrl
      }
    })
    return NextResponse.json(property)
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Failed to create property' }, { status: 500 })
  }
}
