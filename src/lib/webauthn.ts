import { 
    generateRegistrationOptions, 
    verifyRegistrationResponse, 
    generateAuthenticationOptions, 
    verifyAuthenticationResponse 
} from '@simplewebauthn/server'

export const rpName = 'Partners IA Solutions'

/**
 * Returns the WebAuthn configuration (rpId, origin, userVerification) 
 * dynamically based on environment or the request context.
 */
export function getWebAuthnConfig(request?: Request) {
    const envRpId = process.env.WEBAUTHN_RP_ID
    const envOrigin = process.env.WEBAUTHN_ORIGIN
    
    let rpId = envRpId || 'localhost'
    let origin = envOrigin || 'http://localhost:3000'
    
    if (process.env.NODE_ENV === 'production') {
        // Enforce production domain defaults if not set in env
        rpId = envRpId || 'partnersiasolutions.com'
        origin = envOrigin || 'https://partnersiasolutions.com'
    } else if (request) {
        // Dynamic detection for easier testing in development / staging
        const host = request.headers.get('host')
        if (host) {
            const proto = request.headers.get('x-forwarded-proto') || 'http'
            rpId = host.split(':')[0]
            origin = `${proto}://${host}`
        }
    }
    
    return {
        rpName,
        rpId,
        origin,
        userVerification: 'required' as const // Enforce biometrics (PIN/FaceID/TouchID)
    }
}
