// Webhook triggers for external services (Make.com / Zapier)

export async function triggerMakeWebhook(post: any, isNewPublish: boolean) {
    const url = process.env.MAKE_WEBHOOK_URL;
    if (!url) {
        console.log('No MAKE_WEBHOOK_URL configured. Skipping webhook trigger.');
        return;
    }

    if (!isNewPublish) return; // Sólo disparamos si es una publicación nueva

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

        // Prependemos la fecha de publicación al contenido para que Google Business lo muestre (limpio y visual)
        if (post.publishedAt) {
            const date = new Date(post.publishedAt);
            const formattedDate = date.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
            cleanContent = `📅 Publicado el ${formattedDate}\n\n${cleanContent}`;
        }

        // Truncar al final para asegurar el límite de 1500 caracteres de Google Business
        if (cleanContent.length > 1500) {
            cleanContent = cleanContent.substring(0, 1497) + '...';
        }

        // Manejo de compatibilidad de imágenes para Google Business (Sólo soporta PNG/JPG/JPEG)
        let finalImageUrl = 'https://www.partnersiasolutions.com/logo-ias.png';
        const rawImageUrl = post.coverImage || '';
        
        if (rawImageUrl) {
            // Google Business es estricto: solo JPG, JPEG o PNG. 
            // Si es WEBP u otro formato, usamos el logo por defecto para evitar que GMB rechace el post.
            const isSupported = /\.(jpg|jpeg|png)$/i.test(rawImageUrl);
            if (isSupported) {
                finalImageUrl = rawImageUrl.startsWith('http') 
                    ? rawImageUrl 
                    : `https://www.partnersiasolutions.com${rawImageUrl}`;
            }
        }

        const payload = {
            id: post.id,
            title: cleanTitle,
            slug: post.slug,
            category: post.category,
            content: cleanContent,
            coverImage: finalImageUrl,
            url: `https://www.partnersiasolutions.com/noticias/${post.slug}`,
            publishedAt: post.publishedAt
        };

        // El fetch tiene await para asegurar que se complete antes de que la función finalice (especialmente en Vercel)
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Make.com responded with ${response.status}: ${errorText}`);
        }
        
        console.log('Webhook successfully delivered to Make.com for post:', post.slug);

    } catch (error) {
        console.error('Webhook Error:', error);
    }
}
