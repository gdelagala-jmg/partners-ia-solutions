import { put } from '@vercel/blob'
import path from 'path'
import fs from 'fs'
import { mkdir, writeFile } from 'fs/promises'

/**
 * Downloads an image from a URL and stores it.
 * In production, it uses Vercel Blob.
 * In development, it saves to public/uploads.
 */
export async function downloadAndStoreImage(url: string, prefix: string = 'news'): Promise<string | null> {
    if (!url) return null

    try {
        let buffer: Buffer
        let contentType: string
        let extension: string

        if (url.startsWith('data:image/')) {
            // Handle Base64 Data URL
            const matches = url.match(/^data:([^;]+);base64,(.+)$/)
            if (!matches || matches.length !== 3) {
                throw new Error('Invalid base64 image data')
            }
            contentType = matches[1]
            extension = contentType.split('/')[1] || 'jpg'
            buffer = Buffer.from(matches[2], 'base64')
        } else if (url.startsWith('http')) {
            // Handle External URL
            const response = await fetch(url)
            if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`)
            
            contentType = response.headers.get('content-type') || 'image/jpeg'
            extension = contentType.split('/')[1] || 'jpg'
            buffer = Buffer.from(await response.arrayBuffer())
        } else {
            // Unknown format or already local path
            return null
        }

        const fileName = `${prefix}-${Date.now()}.${extension}`

        const isProduction = process.env.NODE_ENV === 'production'

        // 1. Production: Vercel Blob strictly enforced
        if (isProduction) {
            if (!process.env.BLOB_READ_WRITE_TOKEN) {
                console.error('[STORAGE_ERROR] downloadAndStoreImage: Blocked in production. BLOB_READ_WRITE_TOKEN is missing. Local filesystem fallback prohibited.');
                return null
            }

            console.log(`[STORAGE_INFO] downloadAndStoreImage: Uploading to Vercel Blob in production for: ${fileName}`);
            const blob = await put(fileName, buffer, {
                access: 'public',
                contentType
            })
            console.log(`[STORAGE_SUCCESS] downloadAndStoreImage: Uploaded to Vercel Blob. Final URL: ${blob.url}`);
            return blob.url
        }

        // 2. Development: Allow Vercel Blob if token exists, fallback to local
        console.log('[STORAGE_INFO] downloadAndStoreImage: Running in development environment.');
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            try {
                console.log(`[STORAGE_INFO] downloadAndStoreImage: Attempting Vercel Blob in development for: ${fileName}`);
                const blob = await put(fileName, buffer, {
                    access: 'public',
                    contentType
                })
                console.log(`[STORAGE_SUCCESS] downloadAndStoreImage: Vercel Blob success. Final URL: ${blob.url}`);
                return blob.url
            } catch (err: any) {
                console.warn('[STORAGE_WARNING] downloadAndStoreImage: Vercel Blob upload failed in development. Falling back to local...', err.message);
            }
        }

        // Local filesystem fallback (strictly for development)
        console.log('[STORAGE_WARNING] downloadAndStoreImage: Writing to local filesystem.');
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        if (!fs.existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }
        
        const filePath = path.join(uploadDir, fileName)
        await writeFile(filePath, buffer)
        
        console.log(`[STORAGE_SUCCESS] downloadAndStoreImage: Stored locally at: /uploads/${fileName}`);
        return `/uploads/${fileName}`

    } catch (error) {
        console.error('Error in downloadAndStoreImage:', error)
        return null
    }
}
