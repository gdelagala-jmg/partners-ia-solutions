import { NextResponse } from 'next/server'

/**
 * GET /api/security/config
 * Exposes non-sensitive security configuration to the frontend.
 */
export async function GET() {
    return NextResponse.json({
        formSecurityEnabled: process.env.ENABLE_FORM_SECURITY === 'true'
    })
}
