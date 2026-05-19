import { uploadToPersistentMedia } from '../media-upload';
import path from 'path';
import fs from 'fs';
import { mkdir, writeFile } from 'fs/promises';

/**
 * Downloads an image from a URL and stores it on Hostinger Governed Media.
 * In production, it uses Hostinger persistence.
 * In development, it saves to public/uploads with Hostinger fallback.
 */
export async function downloadAndStoreImage(url: string, prefix: string = 'news'): Promise<string | null> {
    if (!url) return null;

    try {
        let buffer: Buffer;
        let contentType: string;
        let extension: string;

        if (url.startsWith('data:image/')) {
            // Handle Base64 Data URL
            const matches = url.match(/^data:([^;]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                throw new Error('Invalid base64 image data');
            }
            contentType = matches[1];
            extension = contentType.split('/')[1] || 'jpg';
            buffer = Buffer.from(matches[2], 'base64');
        } else if (url.startsWith('http')) {
            // Handle External URL
            const response = await fetch(url);
            if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
            
            contentType = response.headers.get('content-type') || 'image/jpeg';
            extension = contentType.split('/')[1] || 'jpg';
            buffer = Buffer.from(await response.arrayBuffer());
        } else {
            // Unknown format or already local path
            return null;
        }

        // Normalize extension for standard web formats
        if (extension === 'jpeg' || extension === 'jpg') {
            extension = 'jpg';
        } else if (extension === 'svg+xml') {
            extension = 'svg';
        }

        const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
        if (!allowedExtensions.includes(extension.toLowerCase())) {
            console.warn(`[STORAGE_WARNING] downloadAndStoreImage: Prohibited extension '.${extension}' for FASE 1. Skipping upload.`);
            return null;
        }

        const fileName = `${prefix}-${Date.now()}.${extension}`;
        const isProduction = process.env.NODE_ENV === 'production';
        const secret = process.env.MEDIA_UPLOAD_SECRET;

        // 1. Production: Hostinger persistent media strictly enforced
        if (isProduction) {
            if (!secret) {
                console.error('[STORAGE_ERROR] downloadAndStoreImage: Blocked in production. MEDIA_UPLOAD_SECRET is missing. Local filesystem fallback prohibited.');
                return null;
            }

            console.log(`[STORAGE_INFO] downloadAndStoreImage: Uploading to Hostinger in production for: ${fileName}`);
            const url = await uploadToPersistentMedia(buffer, fileName, contentType);
            console.log(`[STORAGE_SUCCESS] downloadAndStoreImage: Uploaded to Hostinger. Final URL: ${url}`);
            return url;
        }

        // 2. Development: Allow Hostinger if secret exists, fallback to local filesystem
        console.log('[STORAGE_INFO] downloadAndStoreImage: Running in development environment.');
        if (secret) {
            try {
                console.log(`[STORAGE_INFO] downloadAndStoreImage: Attempting Hostinger in development for: ${fileName}`);
                const url = await uploadToPersistentMedia(buffer, fileName, contentType);
                console.log(`[STORAGE_SUCCESS] downloadAndStoreImage: Hostinger success. Final URL: ${url}`);
                return url;
            } catch (err: any) {
                console.warn('[STORAGE_WARNING] downloadAndStoreImage: Hostinger upload failed in development. Falling back to local...', err.message);
            }
        }

        // Local filesystem fallback (strictly for development)
        console.log('[STORAGE_WARNING] downloadAndStoreImage: Writing to local filesystem.');
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        if (!fs.existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }
        
        const filePath = path.join(uploadDir, fileName);
        await writeFile(filePath, buffer);
        
        console.log(`[STORAGE_SUCCESS] downloadAndStoreImage: Stored locally at: /uploads/${fileName}`);
        return `/uploads/${fileName}`;

    } catch (error) {
        console.error('Error in downloadAndStoreImage:', error);
        return null;
    }
}
