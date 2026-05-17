import crypto from 'crypto'

/**
 * Robust, highly secure PBKDF2 Password Hashing implementation.
 * Compiles with OWASP recommendations:
 *  - Cryptographically secure random 16-byte salt per user
 *  - 100,000 iterations to resist brute-force
 *  - 64-byte key length with SHA-512
 *  - Cryptographic timing-safe equality comparison to prevent timing attacks
 *  - Standard, versioned storage format: pbkdf2$v1$<iterations>$<salt>$<hash>
 */

const ITERATIONS = 100000
const KEY_LEN = 64
const DIGEST = 'sha512'
const VERSION = 'v1'

/**
 * Hashes a plain-text password using PBKDF2.
 */
export function hashPassword(password: string): string {
    const salt = crypto.randomBytes(16).toString('hex')
    const hash = crypto.pbkdf2Sync(password, salt, ITERATIONS, KEY_LEN, DIGEST).toString('hex')
    return `pbkdf2$${VERSION}$${ITERATIONS}$${salt}$${hash}`
}

/**
 * Securely verifies a plain-text password against a stored PBKDF2 hash using a timing-safe check.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
    // If the stored hash is not in our versioned format, reject or fallback to strict plain comparison (temporary)
    if (!storedHash.startsWith('pbkdf2$')) {
        return false // Block legacy plain text passwords in production
    }

    const parts = storedHash.split('$')
    if (parts.length !== 5) {
        return false
    }

    const [, version, iterStr, salt, hash] = parts
    const iterations = parseInt(iterStr, 10)

    if (version !== VERSION || isNaN(iterations) || !salt || !hash) {
        return false
    }

    // Hash the input password using the exact same parameters
    const inputHash = crypto.pbkdf2Sync(password, salt, iterations, KEY_LEN, DIGEST).toString('hex')

    // Timing-safe comparison using crypto.timingSafeEqual
    const inputBuffer = Buffer.from(inputHash, 'hex')
    const storedBuffer = Buffer.from(hash, 'hex')

    if (inputBuffer.length !== storedBuffer.length) {
        return false
    }

    return crypto.timingSafeEqual(inputBuffer, storedBuffer)
}

/**
 * Simple in-memory rate limiting map for login protection against brute-force attacks.
 * Since Vercel serverless functions recycle instances, we combine this with an
 * artificial delay of 1.5 seconds on failed login attempts to actively throttle brute-force requests.
 */
const failedAttempts = new Map<string, { count: number; lastAttempt: number }>()
const MAX_ATTEMPTS = 5
const LOCKTIME = 15 * 60 * 1000 // 15 minutes lockout

export function isRateLimited(ip: string): boolean {
    const record = failedAttempts.get(ip)
    if (!record) return false

    const now = Date.now()
    if (now - record.lastAttempt > LOCKTIME) {
        failedAttempts.delete(ip) // Lockout expired
        return false
    }

    return record.count >= MAX_ATTEMPTS
}

export function recordFailedAttempt(ip: string) {
    const record = failedAttempts.get(ip) || { count: 0, lastAttempt: 0 }
    record.count += 1
    record.lastAttempt = Date.now()
    failedAttempts.set(ip, record)
}

export function resetFailedAttempts(ip: string) {
    failedAttempts.delete(ip)
}
