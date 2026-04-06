import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const data = await req.json()
    const { name, email, phone, company, chatSummary } = data

    if (!name || !email) {
      return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
    }

    const lead = await prisma.assistantLead.create({
      data: {
        name,
        email,
        phone,
        company,
        chatSummary,
        status: 'NEW',
        priority: 'MEDIUM', // Por defecto, se re-evaluará en el admin
        sentiment: 'NEUTRAL'
      }
    })

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error al guardar lead del asistente:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
