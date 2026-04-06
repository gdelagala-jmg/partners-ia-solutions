import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key: 'assistant_active' }
    })
    
    // Default to true if not found in db
    const isActive = setting ? setting.value === 'true' : true
    
    return NextResponse.json({ active: isActive })
  } catch (error) {
    console.error('Failed to get assistant config:', error)
    return NextResponse.json({ active: true }) // Fallback to true so we don't break the widget on error
  }
}
