import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'
import { generateWelcomeEmailHtml } from '@/lib/newsletter-templates'

const subscribeSchema = z.object({
    email: z.string().email('Email inválido'),
    sourceUrl: z.string().optional(),
    sourceLocation: z.string().optional(),
})

export async function POST(req: Request) {
    try {
        const body = await req.json()
        const result = subscribeSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.errors[0].message },
                { status: 400 }
            )
        }

        const { email, sourceUrl, sourceLocation } = result.data

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
