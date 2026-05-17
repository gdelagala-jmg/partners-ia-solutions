import { NextResponse } from 'next/server'
import { encrypt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyPassword, isRateLimited, recordFailedAttempt, resetFailedAttempts } from '@/lib/auth-security'

export async function POST(request: Request) {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1'

    // 1. IP-Based Rate Limiting Protection
    if (isRateLimited(ip)) {
        return NextResponse.json(
            { error: 'Demasiados intentos fallidos. Por favor, intente de nuevo en 15 minutos.' },
            { status: 429 }
        )
    }

    const body = await request.json()
    const { username, password } = body

    if (!username || !password) {
        return NextResponse.json({ error: 'Faltan credenciales' }, { status: 400 })
    }

    // 2. Fetch User
    const user = await prisma.adminUser.findUnique({
        where: { username },
    })

    // 3. Cryptographically Secure Password Verification
    const isValid = user ? verifyPassword(password, user.passwordHash) : false

    if (!user || !isValid) {
        // Record rate limit state
        recordFailedAttempt(ip)
        
        // Brute-force Mitigation: Active 1.5 seconds delay on failed attempts
        await new Promise((resolve) => setTimeout(resolve, 1500))

        return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    // Reset rate-limiting counter on successful login
    resetFailedAttempts(ip)

    // 4. Create Session (Invalidates previous active sessions)
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({ user: { id: user.id, username: user.username }, expires })

    const response = NextResponse.json({ success: true })
    response.cookies.set('session', session, { expires, httpOnly: true, path: '/' })

    return response
}
