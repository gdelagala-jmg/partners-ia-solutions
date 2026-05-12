import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import nodemailer from 'nodemailer'
import { z } from 'zod'
import { sendTelegramNotification } from '@/lib/telegram'
import { verifyTurnstileToken, isRateLimited, incrementRateLimit } from '@/lib/security/verifyTurnstile'

// 1. Validation Schema
const leadSchema = z.object({
    name: z.string().min(1, 'El nombre es requerido'),
    email: z.string().email('Email inválido'),
    phone: z.string().optional().nullable(),
    company: z.string().optional().nullable(),
    message: z.string().optional().nullable(),
    source: z.enum([
        'DEMO_REQUEST',
        'CONTACT',
        'ROADMAP_REQUEST',
        'LEGACY_DEMO',
        'LEGACY_CONTACT',
        'LEAD_CAPTURE'
    ]).optional().default('CONTACT'),
    solutionSlug: z.string().optional().nullable(),
    solutionTitle: z.string().optional().nullable(),
    solutionType: z.string().optional().nullable(),
    sourceUrl: z.string().optional().nullable(),
    sourcePage: z.string().optional().nullable(),
    consentAccepted: z.boolean().optional(),
    consentText: z.string().optional().nullable(),
    // Legacy fields from LeadCaptureSection
    scope: z.string().optional().nullable(),
    bottleneck: z.string().optional().nullable(),
    urgency: z.union([z.string(), z.number()]).optional().nullable(),
    desiredResult: z.string().optional().nullable(),
    // Also accept turnstileToken in the payload (not validated via zod, handled separately)
    turnstileToken: z.string().optional().nullable(),
})

export async function GET() {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const leads = await prisma.lead.findMany({
            orderBy: { createdAt: 'desc' },
        })
        return NextResponse.json(leads)
    } catch (error) {
        console.error('Error fetching leads:', error)
        return NextResponse.json({ error: 'Error fetching leads' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0'
        const userAgent = request.headers.get('user-agent') || 'Unknown'

        // ── Rate limiting ────────────────────────────────────────────────────
        if (isRateLimited(ip)) {
            console.warn(`[Leads] Rate limit exceeded for IP: ${ip}`)
            return NextResponse.json(
                { error: 'Demasiados intentos. Por favor, espera unos minutos.' },
                { status: 429 }
            )
        }

        const body = await request.json()
        const { turnstileToken, ...rest } = body

        // ── Turnstile verification ───────────────────────────────────────────
        const captcha = await verifyTurnstileToken(turnstileToken, ip)
        if (!captcha.success) {
            incrementRateLimit(ip)
            return NextResponse.json({ error: captcha.error }, { status: 403 })
        }

        // 2. Validate Payload
        const result = leadSchema.safeParse(rest)
        if (!result.success) {
            return NextResponse.json({ 
                error: 'Datos inválidos', 
                details: result.error.format() 
            }, { status: 400 })
        }

        const data = result.data
        // ip and userAgent already extracted above

        // 3. Save to Database (Lead)
        // We ensure DB persistence even if mail fails
        const lead = await prisma.lead.create({
            data: {
                name: data.name,
                email: data.email,
                phone: data.phone || null,
                company: data.company || null,
                message: data.message || '',
                source: data.source,
                solutionSlug: data.solutionSlug || null,
                solutionTitle: data.solutionTitle || null,
                solutionType: data.solutionType || null,
                sourceUrl: data.sourceUrl || null,
                sourcePage: data.sourcePage || null,
                // Legacy fields
                scope: data.scope || data.solutionSlug || null,
                bottleneck: data.bottleneck || null,
                urgency: data.urgency ? parseInt(data.urgency.toString()) : null,
                desiredResult: data.desiredResult || null,
                status: 'NEW',
            } as any,
        })

        // 4. Log Consent
        try {
            await prisma.consentLog.create({
                data: {
                    email: data.email,
                    action: data.source === 'DEMO_REQUEST' ? 'DEMO_REQUEST_SUBMIT' : 'LEAD_CAPTURE_UNIFIED',
                    ipAddress: ip,
                    userAgent: userAgent,
                    // Note: If schema doesn't have consentText yet, we skip it or use it if available
                }
            })
        } catch (consentError) {
            console.error('Non-critical: Error logging consent:', consentError)
        }

        // 5. Internal Notification (SMTP)
        // Wrapped in try/catch to ensure API success even if mail fails
        try {
            if (process.env.SMTP_HOST && process.env.SMTP_USER) {
                const transporter = nodemailer.createTransport({
                    host: process.env.SMTP_HOST,
                    port: Number(process.env.SMTP_PORT) || 587,
                    secure: process.env.SMTP_SECURE === 'true',
                    auth: {
                        user: process.env.SMTP_USER,
                        pass: process.env.SMTP_PASS,
                    },
                })

                const typeLabels: Record<string, string> = {
                    DEMO_REQUEST: 'Solicitud de Demo',
                    CONTACT: 'Contacto Genérico',
                    ROADMAP_REQUEST: 'Solicitud de Hoja de Ruta',
                    LEAD_CAPTURE: 'Captación de Lead (Hoja de Ruta)',
                    LEGACY_DEMO: 'Demo (Legacy)',
                    LEGACY_CONTACT: 'Contacto (Legacy)'
                }

                const label = typeLabels[data.source] || 'Nuevo Lead'
                const solutionInfo = data.solutionTitle ? `\nSolución: ${data.solutionTitle} (${data.solutionType || 'N/A'})` : ''

                await transporter.sendMail({
                    from: `"Partners IA System" <${process.env.SMTP_USER}>`,
                    to: 'info@partnersiasolutions.com',
                    subject: `${label}: ${data.name}`,
                    text: `
                    Nueva entrada recibida (${label}):
                    Nombre: ${data.name}
                    Email: ${data.email}
                    Teléfono: ${data.phone || 'N/A'}
                    Empresa: ${data.company || 'N/A'}${solutionInfo}
                    
                    Mensaje:
                    ${data.message || 'Sin mensaje'}
                    
                    ---
                    Página de origen: ${data.sourcePage || 'N/A'}
                    URL: ${data.sourceUrl || 'N/A'}
                    `,
                    html: `
                    <div style="font-family: sans-serif; padding: 20px; color: #333;">
                        <h2 style="color: #10b981;">${label}</h2>
                        <p><strong>Nombre:</strong> ${data.name}</p>
                        <p><strong>Email:</strong> ${data.email}</p>
                        <p><strong>Teléfono:</strong> ${data.phone || 'N/A'}</p>
                        <p><strong>Empresa:</strong> ${data.company || 'N/A'}</p>
                        ${data.solutionTitle ? `<p><strong>Solución de interés:</strong> ${data.solutionTitle} (${data.solutionType || 'N/A'})</p>` : ''}
                        
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin-top: 0;"><strong>Mensaje:</strong></p>
                            <p style="white-space: pre-wrap;">${data.message || 'Sin mensaje'}</p>
                        </div>
                        
                        <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #666;">
                            <strong>Capturado en:</strong> ${data.sourcePage || 'N/A'}<br/>
                            <strong>URL:</strong> <a href="${data.sourceUrl}">${data.sourceUrl || 'N/A'}</a>
                        </p>
                    </div>
                    `,
                })
                console.log('Internal notification sent for lead:', lead.id)
            }
        } catch (mailError) {
            console.error('Non-critical: Error sending internal notification:', mailError)
        }

        // 6. Telegram Notification
        try {
            const { sendTelegramNotification, escapeHTML } = await import('@/lib/telegram')
            const typeLabels: Record<string, string> = {
                DEMO_REQUEST: '🚀 SOLICITUD DE DEMO',
                CONTACT: '📩 CONTACTO GENÉRICO',
                ROADMAP_REQUEST: '🗺️ SOLICITUD DE HOJA DE RUTA',
                LEAD_CAPTURE: '🎯 CAPTACIÓN DE LEAD',
                LEGACY_DEMO: '⏳ DEMO (LEGACY)',
                LEGACY_CONTACT: '⏳ CONTACTO (LEGACY)'
            }

            const label = typeLabels[data.source] || '🆕 NUEVO LEAD'
            const solutionInfo = data.solutionTitle ? `\n<b>Solución:</b> ${escapeHTML(data.solutionTitle)}` : ''
            
            // Build detailed info for Roadmap/Lead Capture
            let detailedInfo = ''
            if (data.scope) detailedInfo += `\n<b>Ámbito:</b> ${escapeHTML(data.scope)}`
            if (data.bottleneck) detailedInfo += `\n<b>Cuello de botella:</b> ${escapeHTML(data.bottleneck)}`
            if (data.urgency) detailedInfo += `\n<b>Urgencia:</b> ${data.urgency}/10`
            if (data.desiredResult) detailedInfo += `\n<b>Resultado deseado:</b> ${escapeHTML(data.desiredResult)}`

            const telegramMessage = `
<b>${label}</b>
────────────────
<b>Nombre:</b> ${escapeHTML(data.name)}
<b>Email:</b> ${escapeHTML(data.email)}
<b>Teléfono:</b> ${escapeHTML(data.phone || 'N/A')}
<b>Empresa:</b> ${escapeHTML(data.company || 'N/A')}${solutionInfo}${detailedInfo}

<b>Mensaje:</b>
<i>${escapeHTML(data.message || 'Sin mensaje')}</i>
────────────────
<b>Origen:</b> ${escapeHTML(data.sourcePage || 'N/A')}
<b>URL:</b> ${data.sourceUrl || 'N/A'}
`.trim()

            await sendTelegramNotification(telegramMessage)
        } catch (tgError) {
            console.error('Non-critical: Error sending Telegram notification:', tgError)
        }

        return NextResponse.json(lead, { status: 201 })
    } catch (error) {
        console.error('Critical error in /api/leads:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
