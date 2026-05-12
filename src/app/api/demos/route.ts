import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyTurnstileToken, isRateLimited, incrementRateLimit } from '@/lib/security/verifyTurnstile'

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0'

        // ── Rate limiting ────────────────────────────────────────────────────
        if (isRateLimited(ip)) {
            return NextResponse.json(
                { error: 'Demasiados intentos. Por favor, espera unos minutos.' },
                { status: 429 }
            )
        }

        const body = await request.json()
        const { name, phone, email, solutionSlug, turnstileToken } = body

        // ── Turnstile verification ───────────────────────────────────────────
        const captcha = await verifyTurnstileToken(turnstileToken, ip)
        if (!captcha.success) {
            incrementRateLimit(ip)
            return NextResponse.json({ error: captcha.error }, { status: 403 })
        }

        if (!name || !email || !solutionSlug) {
            return NextResponse.json({ error: 'Faltan campos obligatorios' }, { status: 400 })
        }

        // Create the lead in the database
        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                phone: phone || null,
                message: `Solicitud de Demo para la solución: ${solutionSlug}`,
                source: 'DEMO',
                status: 'NEW',
                scope: solutionSlug
            }
        })

        // Send Telegram Notification
        try {
            const { sendTelegramNotification, escapeHTML } = await import('@/lib/telegram')
            
            const telegramMessage = `
<b>🚀 Nueva Solicitud de Demo</b>
────────────────
<b>Nombre:</b> ${escapeHTML(name)}
<b>Email:</b> ${escapeHTML(email)}
<b>Teléfono:</b> ${escapeHTML(phone || 'No proporcionado')}
<b>Solución:</b> ${escapeHTML(solutionSlug)}
<b>Origen:</b> Home Modal
────────────────
            `.trim()

            await sendTelegramNotification(telegramMessage)
        } catch (telegramErr) {
            console.error('Error sending Telegram notification:', telegramErr)
        }

        // If you have MAKE_WEBHOOK_URL, you can also send it there
        if (process.env.MAKE_WEBHOOK_URL) {
            try {
                await fetch(process.env.MAKE_WEBHOOK_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        type: 'DEMO_REQUEST',
                        leadId: lead.id,
                        name,
                        email,
                        phone,
                        solutionSlug
                    })
                })
            } catch (webhookErr) {
                console.error('Error sending to Make Webhook:', webhookErr)
            }
        }

        return NextResponse.json({ success: true, leadId: lead.id })
    } catch (error) {
        console.error('Error saving demo request:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
