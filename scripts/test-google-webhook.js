require('dotenv').config();

const API_URL = 'http://localhost:3000/api/webhooks/google-studio';
const API_KEY = process.env.GOOGLE_STUDIO_WEBHOOK_KEY;

async function testWebhook() {
    console.log('--- 🧪 TEST GOOGLE STUDIO WEBHOOK ---');
    
    if (!API_KEY) {
        console.error('❌ Error: No existe GOOGLE_STUDIO_WEBHOOK_KEY en el .env');
        process.exit(1);
    }

    const payload = {
        title: "Test de Automatización con Imagen " + new Date().toLocaleTimeString(),
        content: "Este es un post de prueba para verificar que las imágenes externas se descargan y persisten correctamente en el servidor local o Vercel Blob.",
        category: "Test Automation",
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800", // Imagen real de Unsplash
        aiType: "Prueba Técnica",
        aiTool: "Antigravity Browser",
        published: true
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (response.ok) {
            console.log('✅ Éxito:', result.message);
            console.log('📝 Post ID:', result.post.id);
            console.log('🔗 Slug:', result.post.slug);
            
            console.log('\nPróximos pasos:');
            console.log('1. Verifica en la DB que el campo coverImage NO sea la URL de unsplash.');
            console.log('2. Debería empezar por /uploads/ (en local) o por una URL de vercel-blob.com (en dev/prod).');
        } else {
            console.error('❌ Error en el Webhook:', result);
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        console.log('Asegúrate de que el servidor esté corriendo en http://localhost:3000');
    }
}

testWebhook();
