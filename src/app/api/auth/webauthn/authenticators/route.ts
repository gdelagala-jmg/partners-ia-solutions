import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/auth/webauthn/authenticators
 * Lists all registered authenticators for the currently authenticated admin user.
 */
export async function GET() {
    try {
        // 1. Verify user is logged in
        const session = await getSession()
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // 2. Fetch authenticators for this user (exlude sensitive fields like public key bytes)
        const authenticators = await prisma.authenticator.findMany({
            where: { adminUserId: session.user.id },
            select: {
                id: true,
                credentialID: true,
                credentialDeviceType: true,
                credentialBackedUp: true,
                name: true,
                createdAt: true,
                lastUsedAt: true,
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json({ authenticators })
    } catch (error) {
        console.error('Error fetching authenticators:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
