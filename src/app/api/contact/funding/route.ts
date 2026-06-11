import { NextResponse } from 'next/server'
import { sendTelegramNotification } from '@/lib/telegram'

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const { name, company, phone } = body

        // 1. Validate required fields
        if (!name || !company || !phone) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // 2. Prepare Telegram Message exactly as requested
        const telegramMessage = `
[🎯 NUEVO LEAD - AYUDAS Y FONDOS]
👤 Nombre: ${name}
🏢 Empresa: ${company}
📱 Teléfono: ${phone}
🌐 Origen: Página Empresas / CTA flotante
`.trim()

        // 3. Send Telegram Notification
        try {
            await sendTelegramNotification(telegramMessage)
        } catch (tgError) {
            console.error('Error sending Telegram notification for funding lead:', tgError)
            // We don't fail the request if Telegram fails, but it's important to log it.
        }

        // 4. Return success response
        return NextResponse.json(
            { success: true, message: 'Lead received successfully' },
            { status: 200 }
        )

    } catch (error) {
        console.error('Error processing funding lead:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
