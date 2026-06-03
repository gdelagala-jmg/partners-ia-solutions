import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getSession, decrypt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getWebAuthnConfig } from '@/lib/webauthn'
import { verifyRegistrationResponse } from '@simplewebauthn/server'

/**
 * POST /api/auth/webauthn/register/verify
 * Verifies WebAuthn registration response and registers the device in DB.
 * Requires user to be logged in.
 */
export async function POST(request: Request) {
    try {
        // 1. Verify user is logged in
        const session = await getSession()
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const body = await request.json()
        const { response: credentialResponse, name } = body

        if (!credentialResponse || !name) {
            return NextResponse.json({ error: 'Faltan parámetros' }, { status: 400 })
        }

        // 2. Read and verify challenge from signed cookie
        const cookieStore = await cookies()
        const challengeCookie = cookieStore.get('webauthn-reg-challenge')?.value

        if (!challengeCookie) {
            return NextResponse.json({ error: 'Desafío no encontrado o expirado' }, { status: 400 })
        }

        let decryptedChallengePayload
        try {
            decryptedChallengePayload = await decrypt(challengeCookie)
        } catch (e) {
            return NextResponse.json({ error: 'Desafío inválido o alterado' }, { status: 400 })
        }

        const { challenge: expectedChallenge, userId } = decryptedChallengePayload
        if (userId !== session.user.id) {
            return NextResponse.json({ error: 'ID de usuario no coincide' }, { status: 400 })
        }

        const config = getWebAuthnConfig(request)

        // 3. Verify Registration Response
        const verification = await verifyRegistrationResponse({
            response: credentialResponse,
            expectedChallenge,
            expectedOrigin: config.origin,
            expectedRPID: config.rpId,
            requireUserVerification: true,
        })

        if (!verification.verified || !verification.registrationInfo) {
            return NextResponse.json({ error: 'Verificación fallida' }, { status: 400 })
        }

        const { credential, credentialDeviceType, credentialBackedUp } = verification.registrationInfo

        // 4. Save Authenticator in DB
        await prisma.authenticator.create({
            data: {
                credentialID: credential.id,
                credentialPublicKey: Buffer.from(credential.publicKey).toString('base64url'),
                counter: credential.counter,
                credentialDeviceType,
                credentialBackedUp,
                transports: credential.transports ? JSON.stringify(credential.transports) : null,
                name: name,
                adminUserId: userId
            }
        })

        // 5. Clean up the challenge cookie
        const apiResponse = NextResponse.json({ success: true })
        apiResponse.cookies.set('webauthn-reg-challenge', '', { expires: new Date(0), path: '/' })

        return apiResponse
    } catch (error) {
        console.error('Error verifying registration response:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
