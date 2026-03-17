import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getSession } from './lib/auth'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname
    const userAgent = request.headers.get('user-agent') || ''
    
    // Set headers to access pathname and bot status in server components
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('x-antigravity-version', '3.0')
    requestHeaders.set('x-url-path', path)
    
    // Comprehensive bot detection
    const isBot = /bot|googlebot|crawler|spider|robot|crawling|whatsapp|facebook|twitter|linkedin|slack|notebooklm|openai|bingbot|yandex/i.test(userAgent)
    if (isBot) {
        requestHeaders.set('x-is-bot', 'true')
    }

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

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    })
    
    response.headers.set('x-antigravity-version', '3.0')
    return response
}

export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - api (API routes)
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
}
