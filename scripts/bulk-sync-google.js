const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const MAKE_URL = 'https://hook.eu2.make.com/pkhu8cc9bhoekyp2rjndcj0y8qpd4yzi';

// Función para dormir el script (evitar rate limits de Google - 5 segundos)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function main() {
  console.log('--- 🚀 RECARGA FINAL: 35 NOTICIAS (UNIQUENESS FIX) ---');
  
  try {
    const posts = await prisma.newsPost.findMany({
      where: { published: true },
      orderBy: { publishedAt: 'asc' }, 
    });

    console.log(`Encontradas ${posts.length} noticias publicadas.`);

    for (const post of posts) {
      console.log(`Procesando: ${post.title}...`);
      
      const cleanTitle = (post.title || '')
          .replace(/<[^>]*>?/gm, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();

      const cleanContent = (post.content || '')
          .replace(/<[^>]*>?/gm, '')
          .replace(/&nbsp;/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .substring(0, 1500);

      // Manejo de compatibilidad de imágenes para Google Business (Sólo soporta PNG/JPG/JPEG)
      // Añadimos cache-busting (?v=id) para que Google no lo rechace como duplicado
      let finalImageUrl = `https://www.partnersiasolutions.com/logo-ias.png?v=${post.id}`;
      const rawImageUrl = post.coverImage || '';
      
      if (rawImageUrl) {
          const isSupported = /\.(jpg|jpeg|png)$/i.test(rawImageUrl);
          if (isSupported) {
              finalImageUrl = rawImageUrl.startsWith('http') 
                  ? rawImageUrl 
                  : `https://www.partnersiasolutions.com${rawImageUrl}`;
          } else {
              console.log(`⚠️ WebP/Incompatible detectado: ${post.title}. Usando logo único.`);
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

      try {
        const response = await fetch(MAKE_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
    
          if (response.ok) {
            console.log(`✅ Enviado a Make: ${cleanTitle}`);
          } else {
            console.log(`❌ Error Make: ${cleanTitle}`, await response.text());
          }
      } catch (e) {
        console.error(`Error en fetch para ${post.title}:`, e.message);
      }

      await sleep(5000);
    }

    console.log('--- 🏁 CARGA COMPLETA FINALIZADA ---');
  } catch (error) {
    console.error('Error crítico:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
