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
        let cleanContent = post.content || '';
        if (cleanContent.length > 500) {
            cleanContent = cleanContent.substring(0, 500) + '...';
        }

        const payload = {
            id: post.id,
            title: post.title,
            slug: post.slug,
            category: post.category,
            content: cleanContent,
            coverImage: post.coverImage,
            url: `https://www.partnersiasolutions.com/noticias/${post.slug}`,
            publishedAt: post.publishedAt
        };

        // El fetch no tiene await bloqueante estricto en la respuesta para no ralentizar la API
        fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        }).catch(err => console.error('Error enviando webhook a Make:', err));
        
        console.log('Webhook dispatched to Make.com for post:', post.slug);

    } catch (error) {
        console.error('Webhook Error:', error);
    }
}
