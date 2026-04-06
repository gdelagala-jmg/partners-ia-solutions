import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'assistant_active' }
    })
    
    // Default to true if not found
    const isActive = setting ? setting.value === 'true' : true
    
    return NextResponse.json({ active: isActive })
  } catch (error) {
    console.error('Failed to get assistant status:', error)
    return NextResponse.json({ error: 'Failed to fetch' }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const { active } = await req.json()
    
    await prisma.siteSetting.upsert({
      where: { key: 'assistant_active' },
      update: { value: String(active) },
      create: { key: 'assistant_active', value: String(active) }
    })
    
    return NextResponse.json({ success: true, active })
  } catch (error) {
    console.error('Failed to update assistant status:', error)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}
