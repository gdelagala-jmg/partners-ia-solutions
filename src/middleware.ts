import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './lib/auth'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Public paths inside admin that don't need auth
    if (path === '/admin/login') {
        return NextResponse.next()
    }

    // Protect all /admin routes
    if (path.startsWith('/admin')) {
        const session = await getSession()
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/admin/:path*'],
}
