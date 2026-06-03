import { NextResponse } from 'next/server'
import { getSession, encrypt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getWebAuthnConfig } from '@/lib/webauthn'
import { generateRegistrationOptions } from '@simplewebauthn/server'

/**
 * GET /api/auth/webauthn/register/options
 * Generates options for the navigator.credentials.create() call in the client.
 * Requires user to be logged in (custom session JWT).
 */
export async function GET(request: Request) {
    try {
        // 1. Verify user is logged in
        const session = await getSession()
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // 2. Fetch User with existing authenticators
        const user = await prisma.adminUser.findUnique({
            where: { id: session.user.id },
            include: { authenticators: true }
        })

        if (!user) {
            return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
        }

        const config = getWebAuthnConfig(request)

        // 3. Generate Registration Options
        const options = await generateRegistrationOptions({
            rpName: config.rpName,
            rpID: config.rpId,
            userID: new TextEncoder().encode(user.id),
            userName: user.username,
            userDisplayName: user.username,
            attestationType: 'none',
            excludeCredentials: user.authenticators.map((auth) => ({
                id: auth.credentialID,
                type: 'public-key',
                transports: auth.transports ? JSON.parse(auth.transports) : undefined,
            })),
            authenticatorSelection: {
                residentKey: 'preferred',
                userVerification: config.userVerification,
            },
        })

        // 4. Save challenge and current userId in a secure short-lived cookie (encrypted via Jose JWT)
        const challengeToken = await encrypt({
            challenge: options.challenge,
            userId: user.id,
            expires: new Date(Date.now() + 2 * 60 * 1000) // 2 minutes expiry
        })

        const response = NextResponse.json(options)
        
        response.cookies.set('webauthn-reg-challenge', challengeToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 120, // 2 minutes
            path: '/'
        })

        return response
    } catch (error) {
        console.error('Error generating registration options:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
