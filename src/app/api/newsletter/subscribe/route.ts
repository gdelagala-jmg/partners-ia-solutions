import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'
import { generateWelcomeEmailHtml } from '@/lib/newsletter-templates'
import { verifyTurnstileToken, isRateLimited, incrementRateLimit } from '@/lib/security/verifyTurnstile'

const subscribeSchema = z.object({
    email: z.string().email('Email inválido'),
    sourceUrl: z.string().optional(),
    sourceLocation: z.string().optional(),
    turnstileToken: z.string().optional().nullable(),
})

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || '0.0.0.0'

        // ── Rate limiting ────────────────────────────────────────────────────
        if (isRateLimited(ip)) {
            console.warn(`[Newsletter] Rate limit exceeded for IP: ${ip}`)
            return NextResponse.json(
                { error: 'Demasiados intentos. Por favor, espera unos minutos.' },
                { status: 429 }
            )
        }

        const body = await req.json()
        const result = subscribeSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues[0]?.message ?? 'Datos inválidos' },
                { status: 400 }
            )
        }

        const { email, sourceUrl, sourceLocation, turnstileToken } = result.data

        // ── Turnstile verification ───────────────────────────────────────────
        const captcha = await verifyTurnstileToken(turnstileToken, ip)
        if (!captcha.success) {
            incrementRateLimit(ip)
            return NextResponse.json({ error: captcha.error }, { status: 403 })
        }

        // Check if already subscribed
        const existing = await prisma.newsletterSubscriber.findUnique({
            where: { email }
        })

        if (existing) {
            if (existing.isActive) {
                return NextResponse.json(
                    { error: 'Este email ya está suscrito.' },
                    { status: 400 }
                )
            } else {
                // Reactivate
                const subscriber = await prisma.newsletterSubscriber.update({
                    where: { email },
                    data: { 
                        isActive: true,
                        sourceUrl,
                        sourceLocation,
                        consentAt: new Date()
                    }
                })

                // Send Welcome Email
                try {
                    await sendEmail({
                        to: email,
                        subject: 'Bienvenido a Partners IA Solutions',
                        html: generateWelcomeEmailHtml(subscriber.unsubscribeToken)
                    })
                } catch (emailError) {
                    console.error('Non-critical: Error sending welcome email (reactivation):', emailError)
                }

                return NextResponse.json({ success: true, message: 'Suscripción reactivada.' })
            }
        }

        // Create new subscriber
        const newSubscriber = await prisma.newsletterSubscriber.create({
            data: {
                email,
                sourceUrl,
                sourceLocation,
                isActive: true,
                consentAccepted: true,
                consentAt: new Date()
                // unsubscribeToken is generated automatically by Prisma default(uuid())
            }
        })

        // Send Welcome Email
        try {
            await sendEmail({
                to: email,
                subject: 'Bienvenido a Partners IA Solutions',
                html: generateWelcomeEmailHtml(newSubscriber.unsubscribeToken)
            })
        } catch (emailError) {
            console.error('Non-critical: Error sending welcome email:', emailError)
        }

        // Also log consent in ConsentLog for audit trail
        try {
            const ip = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
            const userAgent = req.headers.get('user-agent') || 'unknown'

            await prisma.consentLog.create({
                data: {
                    email,
                    action: 'NEWSLETTER_SUBSCRIBE',
                    acceptedAt: new Date(),
                    ipAddress: ip,
                    userAgent: userAgent
                }
            })
        } catch (consentError) {
            console.error('Non-critical: Error logging consent:', consentError)
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Newsletter subscribe error:', error)
        return NextResponse.json(
            { error: 'Error interno del servidor. Por favor, inténtalo más tarde.' },
            { status: 500 }
        )
    }
}
