import * as crypto from 'crypto';

interface UploadResponse {
  success: boolean;
  filename: string;
  url: string;
  size: number;
}

/**
 * Uploads a file (Buffer, File, or Blob) to the Hostinger Governed Media server.
 * All signature calculations and uploads are handled strictly server-side.
 * FASE 1: Only image extensions are allowed (png, jpg, jpeg, gif, webp, svg).
 */
export async function uploadToPersistentMedia(
  fileBufferOrFile: Buffer | File | Blob,
  fileName: string,
  contentType?: string
): Promise<string> {
  const secret = process.env.MEDIA_UPLOAD_SECRET;
  const endpoint = 'https://media.partnersiasolutions.com/api/secure-receiver.php';

  const timestamp = Math.floor(Date.now() / 1000);
  
  let buffer: Buffer;
  let size: number;
  let finalFileName = fileName;

  if (fileBufferOrFile instanceof File) {
    const arrayBuffer = await fileBufferOrFile.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
    size = fileBufferOrFile.size;
    if (!finalFileName) finalFileName = fileBufferOrFile.name;
  } else if (fileBufferOrFile instanceof Blob) {
    const arrayBuffer = await fileBufferOrFile.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
    size = fileBufferOrFile.size;
  } else if (Buffer.isBuffer(fileBufferOrFile)) {
    buffer = fileBufferOrFile;
    size = fileBufferOrFile.length;
  } else {
    throw new Error('Unsupported upload payload type. Must be File, Blob, or Buffer.');
  }

  if (!finalFileName) {
    const ext = contentType ? contentType.split('/')[1] || 'png' : 'png';
    finalFileName = `upload-${timestamp}.${ext}`;
  }

  // FASE 1 extension sanity check (Images only)
  const allowedExtensions = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg'];
  const fileExt = finalFileName.split('.').pop()?.toLowerCase() || '';
  if (!allowedExtensions.includes(fileExt)) {
    throw new Error(`File extension '.${fileExt}' is prohibited in FASE 1. Only image uploads are allowed.`);
  }

  if (!secret) {
    throw new Error('MEDIA_UPLOAD_SECRET is not defined. Cannot sign media upload request.');
  }

  // Signature = HMAC-SHA256(secret, timestamp + fileName + fileSize)
  const message = timestamp.toString() + finalFileName + size.toString();
  const signature = crypto.createHmac('sha256', secret).update(message).digest('hex');

  // Build FormData for multipart POST
  const formData = new FormData();
  const blob = new Blob([new Uint8Array(buffer)], { type: contentType || 'image/png' });
  formData.append('file', blob, finalFileName);

  console.log(`[PERSISTENT_UPLOAD] Dispatching upload for ${finalFileName} (${size} bytes) to Hostinger...`);

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'X-Media-Signature': signature,
      'X-Media-Timestamp': timestamp.toString(),
    },
    body: formData,
  });

  if (!response.ok) {
    let errorMsg = `Server returned HTTP ${response.status}`;
    try {
      const errJson = await response.json();
      if (errJson && errJson.error) {
        errorMsg = errJson.error;
      }
    } catch (_) {}
    throw new Error(`Hostinger persistent media upload failed: ${errorMsg}`);
  }

  const result: UploadResponse = await response.json();
  if (!result.success || !result.url) {
    throw new Error('Hostinger persistent receiver returned an invalid response format.');
  }

  console.log(`[PERSISTENT_UPLOAD] Upload complete. Stable URL: ${result.url}`);
  return result.url;
}
