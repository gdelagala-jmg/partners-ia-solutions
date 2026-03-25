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
    if (!url || !url.startsWith('http')) return null

    try {
        const response = await fetch(url)
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`)
        
        const contentType = response.headers.get('content-type') || 'image/jpeg'
        const extension = contentType.split('/')[1] || 'jpg'
        const fileName = `${prefix}-${Date.now()}.${extension}`
        
        const buffer = Buffer.from(await response.arrayBuffer())

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
