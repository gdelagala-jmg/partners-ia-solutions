import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getWebAuthnConfig } from '@/lib/webauthn'
import { encrypt } from '@/lib/auth'
import { generateAuthenticationOptions } from '@simplewebauthn/server'

/**
 * GET /api/auth/webauthn/login/options
 * Generates options for navigator.credentials.get() to authenticate the user.
 * Can take an optional 'username' query param to restrict matching credentials.
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const username = searchParams.get('username')

        let user = null
        if (username) {
            user = await prisma.adminUser.findUnique({
                where: { username },
                include: { authenticators: true }
            })
        }

        const config = getWebAuthnConfig(request)

        // Generate Authentication Options
        const options = await generateAuthenticationOptions({
            rpID: config.rpId,
            allowCredentials: user?.authenticators.map((auth) => ({
                id: auth.credentialID,
                type: 'public-key' as const,
                transports: auth.transports ? JSON.parse(auth.transports) : undefined,
            })),
            userVerification: config.userVerification,
        })

        // Store the challenge securely in a short-lived signed cookie
        const challengeToken = await encrypt({
            challenge: options.challenge,
            userId: user?.id || null, // Might be null for usernameless/conditional UI flows
            expires: new Date(Date.now() + 2 * 60 * 1000) // 2 minutes expiry
        })

        const response = NextResponse.json(options)
        
        response.cookies.set('webauthn-auth-challenge', challengeToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 120, // 2 minutes
            path: '/'
        })

        return response
    } catch (error) {
        console.error('Error generating authentication options:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
