import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './lib/auth'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    
    // Set headers to access pathname in server components
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-url-path', path)

    // Public paths inside admin that don't need auth
    if (path === '/admin/login') {
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        })
    }

    // Protect all /admin routes
    if (path.startsWith('/admin')) {
        const session = await getSession()
        if (!session) {
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    return NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
}

export const config = {
    matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], // Match all paths except static/api
}
