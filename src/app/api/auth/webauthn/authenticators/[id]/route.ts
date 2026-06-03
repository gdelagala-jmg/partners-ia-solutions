import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface RouteParams {
    params: Promise<{ id: string }>
}

/**
 * DELETE /api/auth/webauthn/authenticators/[id]
 * Revokes (deletes) a registered biometric credential.
 * Validates that it belongs to the logged-in admin user.
 */
export async function DELETE(
    request: Request,
    props: RouteParams
) {
    try {
        const params = await props.params
        const { id } = params

        if (!id) {
            return NextResponse.json({ error: 'Falta ID de credencial' }, { status: 400 })
        }

        // 1. Verify user is logged in
        const session = await getSession()
        if (!session || !session.user || !session.user.id) {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        // 2. Fetch the authenticator to verify ownership
        const authenticator = await prisma.authenticator.findUnique({
            where: { id }
        })

        if (!authenticator) {
            return NextResponse.json({ error: 'Dispositivo no encontrado' }, { status: 404 })
        }

        if (authenticator.adminUserId !== session.user.id) {
            return NextResponse.json({ error: 'No tienes permiso para eliminar esta credencial' }, { status: 403 })
        }

        // 3. Delete the authenticator from DB
        await prisma.authenticator.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting authenticator:', error)
        return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 })
    }
}
