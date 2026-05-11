import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET() {
    try {
        let settings = await prisma.sitePartnerSettings.findUnique({
            where: { id: 'GLOBAL' }
        })

        if (!settings) {
            // Create default settings if not exists
            settings = await prisma.sitePartnerSettings.create({
                data: {
                    id: 'GLOBAL',
                    sectionTitle: 'Partners Estratégicos',
                    layoutType: 'horizontal-logos',
                    maxVisibleItems: 8,
                    autoplay: false,
                    showDividers: true,
                    mobileStack: true,
                    footerEnabled: true
                }
            })
        }

        return NextResponse.json(settings)
    } catch (error) {
        console.error('Error fetching partner settings:', error)
        return NextResponse.json({ error: 'Error fetching partner settings' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    try {
        const data = await request.json()
        const settings = await prisma.sitePartnerSettings.upsert({
            where: { id: 'GLOBAL' },
            update: {
                sectionTitle: data.sectionTitle,
                sectionSubtitle: data.sectionSubtitle,
                layoutType: data.layoutType,
                maxVisibleItems: data.maxVisibleItems,
                autoplay: data.autoplay,
                animationSpeed: data.animationSpeed,
                showDividers: data.showDividers,
                showBackground: data.showBackground,
                backgroundStyle: data.backgroundStyle,
                mobileStack: data.mobileStack,
                footerEnabled: data.footerEnabled,
            },
            create: {
                id: 'GLOBAL',
                sectionTitle: data.sectionTitle,
                sectionSubtitle: data.sectionSubtitle,
                layoutType: data.layoutType,
                maxVisibleItems: data.maxVisibleItems,
                autoplay: data.autoplay,
                animationSpeed: data.animationSpeed,
                showDividers: data.showDividers,
                showBackground: data.showBackground,
                backgroundStyle: data.backgroundStyle,
                mobileStack: data.mobileStack,
                footerEnabled: data.footerEnabled,
            }
        })
        return NextResponse.json(settings)
    } catch (error) {
        console.error('Error updating partner settings:', error)
        return NextResponse.json({ error: 'Error updating partner settings' }, { status: 500 })
    }
}
