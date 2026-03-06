import { NextResponse } from 'next/server'
import { encrypt } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    const body = await request.json()
    const { username, password } = body

    // In production, use bcrypt/argon2 to compare hashed passwords
    // For this prototype, we store plain text or simple comparison as per seed
    const user = await prisma.adminUser.findUnique({
        where: { username },
    })

    if (!user || user.passwordHash !== password) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Create session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({ user: { id: user.id, username: user.username }, expires })

    const response = NextResponse.json({ success: true })
    response.cookies.set('session', session, { expires, httpOnly: true, path: '/' })

    return response
}
