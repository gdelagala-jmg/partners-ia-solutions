// Webhook triggers for external services (Make.com / Zapier)

import { prisma } from '@/lib/prisma';
import { syncPodcastToFeed } from './utils/podcast-sync';

export async function triggerMakeWebhook(post: any, isNewPublish: boolean) {
    const url = process.env.MAKE_WEBHOOK_URL;
    if (!url) {
        console.error('No MAKE_WEBHOOK_URL configured. Skipping webhook trigger.');
        await prisma.newsPost.update({
            where: { id: post.id },
            data: { 
                gmbSyncStatus: 'ERROR',
                gmbErrorMessage: 'Configuración incompleta: falta MAKE_WEBHOOK_URL'
            }
        });
        return;
    }

    if (!isNewPublish) return; // Sólo disparamos si es una publicación nueva

    // Marcar como sincronizando
    try {
        await prisma.newsPost.update({
            where: { id: post.id },
            data: { 
                gmbSyncStatus: 'SYNCING',
                gmbLastSync: new Date()
            }
        });
    } catch (e) {
        console.error('Error updating initial status:', e);
    }

    try {
        // Formato de texto limpio sin HTML para Google Business
        const cleanTitle = (post.title || '')
            .replace(/<[^>]*>?/gm, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        // Limpiar contenido HTML pero manteniendo el texto plano legible
        let cleanContent = (post.content || '')
            .replace(/<[^>]*>?/gm, '')
            .replace(/&nbsp;/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();

        if (post.publishedAt) {
            const date = new Date(post.publishedAt);
            const formattedDate = date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            cleanContent = `📅 ${formattedDate}\n\n${cleanContent}`;
        }

        if (cleanContent.length > 1500) {
            cleanContent = cleanContent.substring(0, 1497) + '...';
        }

        // --- Optimización de Imagen para GMB ---
        let finalImageUrl = 'https://www.partnersiasolutions.com/logo-ias.png';
        const rawImageUrl = post.coverImage || '';
        
        if (rawImageUrl) {
            // Eliminar parámetros de query para verificar extensión real
            const cleanUrl = rawImageUrl.split('?')[0];
            const isSupported = /\.(jpg|jpeg|png)$/i.test(cleanUrl);
            
            if (isSupported) {
                finalImageUrl = rawImageUrl.startsWith('http') 
                    ? rawImageUrl 
                    : `https://www.partnersiasolutions.com${rawImageUrl}`;
            } else {
                console.warn(`[GMB Sync] Imagen no soportada o sin extensión válida (${rawImageUrl}). Usando fallback.`);
            }
        }

        // Advertencia sobre localhost
        if (finalImageUrl.includes('localhost') || finalImageUrl.includes('127.0.0.1')) {
            console.error('[GMB Sync] ERROR CRÍTICO: Google no puede acceder a imágenes en localhost. La sincronización fallará en desarrollo local.');
            throw new Error('Google no puede acceder a imágenes locales. Despliega a producción o usa una URL pública.');
        }

        const payload = {
            id: post.id,
            title: cleanTitle,
            slug: post.slug,
            category: post.category,
            content: cleanContent,
            coverImage: finalImageUrl,
            url: `https://www.partnersiasolutions.com/noticias/${post.slug}`,
            publishedAt: post.publishedAt,
            timestamp: new Date().toISOString()
        };

        console.log(`[GMB Sync] Enviando post "${post.slug}" a Make.com...`);

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Make.com respondió con ${response.status}: ${errorText}`);
        }
        
        console.log('[GMB Sync] Éxito post:', post.slug);

        await prisma.newsPost.update({
            where: { id: post.id },
            data: { 
                gmbSyncStatus: 'SUCCESS',
                gmbErrorMessage: null
            }
        });

    } catch (error: any) {
        console.error('[GMB Sync] Error:', error.message);
        
        try {
            await prisma.newsPost.update({
                where: { id: post.id },
                data: { 
                    gmbSyncStatus: 'ERROR',
                    gmbErrorMessage: error.message || 'Error desconocido'
                }
            });
        } catch (dbErr) {
            console.error('[GMB Sync] Error fatal DB:', dbErr);
        }
    }
}
