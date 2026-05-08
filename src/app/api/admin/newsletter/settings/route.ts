import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getNewsletterSettings } from '@/lib/newsletter-automation'

export async function GET() {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const settings = await getNewsletterSettings()
        return NextResponse.json(settings)
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching settings' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    const session = await getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const body = await request.json()
        const settings = await prisma.newsletterSetting.upsert({
            where: { id: 'GLOBAL' },
            update: {
                autoSendEnabled: body.autoSendEnabled,
                autoSendDelayMinutes: parseInt(body.autoSendDelayMinutes) || 15,
                senderName: body.senderName,
                senderEmail: body.senderEmail,
                footerText: body.footerText,
                defaultCrossSellEnabled: body.defaultCrossSellEnabled
            },
            create: {
                id: 'GLOBAL',
                autoSendEnabled: body.autoSendEnabled,
                autoSendDelayMinutes: parseInt(body.autoSendDelayMinutes) || 15,
                senderName: body.senderName,
                senderEmail: body.senderEmail,
                footerText: body.footerText,
                defaultCrossSellEnabled: body.defaultCrossSellEnabled
            }
        })
        return NextResponse.json(settings)
    } catch (error) {
        return NextResponse.json({ error: 'Error updating settings' }, { status: 500 })
    }
}
