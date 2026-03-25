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

        // 1. Production: Vercel Blob
        if (process.env.BLOB_READ_WRITE_TOKEN) {
            const blob = await put(fileName, buffer, {
                access: 'public',
                contentType
            })
            return blob.url
        }

        // 2. Development: Local Filesystem
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        if (!fs.existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true })
        }
        
        const filePath = path.join(uploadDir, fileName)
        await writeFile(filePath, buffer)
        
        return `/uploads/${fileName}`

    } catch (error) {
        console.error('Error in downloadAndStoreImage:', error)
        return null
    }
}
