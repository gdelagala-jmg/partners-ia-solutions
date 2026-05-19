import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { uploadToPersistentMedia } from '@/lib/media-upload';
import path from 'path';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
];

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: 'File too large. Maximum size is 5MB.' }, { status: 400 });
        }

        // Validate file type
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
            return NextResponse.json({
                error: `Invalid file type: ${file.type}. Allowed types: JPEG, PNG, GIF, WebP, SVG.`
            }, { status: 400 });
        }

        const isProduction = process.env.NODE_ENV === 'production';
        const secret = process.env.MEDIA_UPLOAD_SECRET;

        // 1. Production Mode: Strictly use Hostinger persistent media
        if (isProduction) {
            if (!secret) {
                console.error('[STORAGE_ERROR] CRITICAL: Attempted upload in production but MEDIA_UPLOAD_SECRET is missing. Local filesystem fallback blocked.');
                return NextResponse.json({ 
                    error: 'Error de configuración: El almacenamiento persistente (Hostinger) no está configurado en producción. Escritura local bloqueada.' 
                }, { status: 500 });
            }

            try {
                const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                console.log(`[STORAGE_INFO] Starting upload to Hostinger in production for file: ${filename}`);
                
                const url = await uploadToPersistentMedia(file, filename, file.type);
                
                console.log(`[STORAGE_SUCCESS] Uploaded successfully to Hostinger. Final URL: ${url}`);
                return NextResponse.json({ url });
            } catch (uploadError: any) {
                console.error('[STORAGE_ERROR] Error uploading to Hostinger:', uploadError.message);
                return NextResponse.json({ 
                    error: `Error al comunicarse con el almacenamiento persistente Hostinger: ${uploadError.message}` 
                }, { status: 500 });
            }
        }

        // 2. Development Mode: Attempt Hostinger upload if secret is present, otherwise fallback to local filesystem
        console.log('[STORAGE_INFO] Development environment detected.');
        if (secret) {
            try {
                const filename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
                console.log(`[STORAGE_INFO] Development: Uploading to Hostinger for: ${filename}`);
                
                const url = await uploadToPersistentMedia(file, filename, file.type);
                
                console.log(`[STORAGE_SUCCESS] Development: Uploaded successfully to Hostinger. Final URL: ${url}`);
                return NextResponse.json({ url });
            } catch (err: any) {
                console.warn('[STORAGE_WARNING] Development Hostinger upload failed. Attempting local fallback...', err.message);
            }
        }

        // Local filesystem fallback (strictly for development)
        console.log('[STORAGE_WARNING] Running local filesystem fallback in development.');
        const { writeFile, mkdir } = await import('fs/promises');
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filename = Date.now() + '-' + file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uploadDir = path.join(process.cwd(), 'public/uploads');
        await mkdir(uploadDir, { recursive: true });
        const filepath = path.join(uploadDir, filename);
        await writeFile(filepath, buffer);
        
        console.log(`[STORAGE_SUCCESS] Local fallback complete. File stored at: /uploads/${filename}`);
        return NextResponse.json({ url: `/uploads/${filename}` });

    } catch (error: any) {
        console.error('Error uploading file:', error);
        return NextResponse.json({ error: error.message || 'Error uploading file' }, { status: 500 });
    }
}
