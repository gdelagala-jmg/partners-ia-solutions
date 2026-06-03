import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'
import { getWebAuthnConfig } from '@/lib/webauthn'
import { decrypt, encrypt } from '@/lib/auth'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'

/**
 * POST /api/auth/webauthn/login/verify
 * Verifies WebAuthn assertion signature, updates counter, and establishes session.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { response: credentialResponse } = body

        if (!credentialResponse) {
            return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
        }

        // 1. Read and verify challenge from signed cookie
        const cookieStore = await cookies()
        const challengeCookie = cookieStore.get('webauthn-auth-challenge')?.value

        if (!challengeCookie) {
            return NextResponse.json({ error: 'Desafío de autenticación no encontrado o expirado' }, { status: 400 })
        }

        let decryptedChallengePayload
        try {
            decryptedChallengePayload = await decrypt(challengeCookie)
        } catch (e) {
            return NextResponse.json({ error: 'Desafío de autenticación inválido o alterado' }, { status: 400 })
        }

        const { challenge: expectedChallenge, userId: expectedUserId } = decryptedChallengePayload

        // 2. Fetch authenticator and its associated AdminUser from DB
        const dbAuthenticator = await prisma.authenticator.findUnique({
            where: { credentialID: credentialResponse.id },
            include: { adminUser: true }
        })

        if (!dbAuthenticator) {
            return NextResponse.json({ error: 'Dispositivo biométrico no registrado o no reconocido' }, { status: 400 })
        }

        // Integrity check if options was scoped to a specific user
        if (expectedUserId && expectedUserId !== dbAuthenticator.adminUserId) {
            return NextResponse.json({ error: 'Usuario no coincide con el dispositivo' }, { status: 400 })
        }

        const config = getWebAuthnConfig(request)

        // 3. Verify Authentication Response
        const verification = await verifyAuthenticationResponse({
            response: credentialResponse,
            expectedChallenge,
            expectedOrigin: config.origin,
            expectedRPID: config.rpId,
            credential: {
                id: dbAuthenticator.credentialID,
                publicKey: Buffer.from(dbAuthenticator.credentialPublicKey, 'base64url'),
                counter: Number(dbAuthenticator.counter),
                transports: dbAuthenticator.transports ? JSON.parse(dbAuthenticator.transports) : undefined,
            },
            requireUserVerification: true,
        })

        if (!verification.verified || !verification.authenticationInfo) {
            return NextResponse.json({ error: 'Verificación biométrica fallida' }, { status: 400 })
        }

        const { newCounter } = verification.authenticationInfo

        // 4. Update the counter and lastUsedAt timestamp in DB (prevents replay/cloning attacks)
        await prisma.authenticator.update({
            where: { credentialID: dbAuthenticator.credentialID },
            data: {
                counter: newCounter,
                lastUsedAt: new Date()
            }
        })

        // 5. Establish Session (set cookie session exactly like traditional login)
        const user = dbAuthenticator.adminUser
        const expires = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
        const sessionToken = await encrypt({ 
            user: { id: user.id, username: user.username }, 
            expires 
        })

        const apiResponse = NextResponse.json({ success: true })
        apiResponse.cookies.set('session', sessionToken, { 
            expires, 
            httpOnly: true, 
            path: '/' 
        })

        // Clean up the challenge cookie
        apiResponse.cookies.set('webauthn-auth-challenge', '', { expires: new Date(0), path: '/' })

        return apiResponse
    } catch (error) {
        console.error('Error verifying authentication response:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
