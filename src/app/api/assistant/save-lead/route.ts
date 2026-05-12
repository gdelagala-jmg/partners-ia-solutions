import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { sendTelegramNotification } from '@/lib/telegram'
import { isRateLimited, incrementRateLimit } from '@/lib/security/verifyTurnstile'

export async function POST(req: Request) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0'

    // ── Rate limiting ────────────────────────────────────────────────────
    if (isRateLimited(ip)) {
        console.warn(`[AssistantLead] Rate limit exceeded for IP: ${ip}`)
        return NextResponse.json(
            { error: 'Demasiados intentos. Por favor, espera unos minutos.' },
            { status: 429 }
        )
    }

    const data = await req.json()
    const { name, email, phone, company, chatSummary } = data

    if (!name || !email) {
      incrementRateLimit(ip)
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

    // Send Telegram Notification
    try {
      const telegramMessage = `
<b>🤖 NUEVO LEAD (ASISTENTE IA)</b>
────────────────
<b>Nombre:</b> ${name}
<b>Email:</b> ${email}
<b>Teléfono:</b> ${phone || 'N/A'}
<b>Empresa:</b> ${company || 'N/A'}

<b>Resumen del chat:</b>
<i>${chatSummary || 'Sin resumen'}</i>
────────────────
`.trim()

      await sendTelegramNotification(telegramMessage)
    } catch (tgError) {
      console.error('Non-critical: Error sending Telegram notification:', tgError)
    }

    return NextResponse.json(lead)
  } catch (error) {
    console.error('Error al guardar lead del asistente:', error)
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
  }
}
