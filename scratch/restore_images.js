const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Restoring manual blog posts with images...')
  
  // Create an array of the recovered original posts with their images from the local DB logs
  const recoveredPosts = [
    {
      title: "OpenAI Frontier optimiza tareas empresariales con IA",
      slug: "openai-frontier-optimiza-tareas-empresariales-con-ia",
      excerpt: "OpenAI Frontier presenta nuevas formas de optimizar el trabajo y acelerar los procesos empresariales mediante inteligencia artificial avanzada.",
      content: "OpenAI Frontier presenta nuevas formas de optimizar el trabajo y acelerar los procesos empresariales mediante inteligencia artificial avanzada. Esta nueva iteración promete revolucionar cómo los equipos interactúan con los datos.",
      category: "Actualidad IA",
      coverImage: "https://partnersiasolutions.com/wp-content/uploads/2026/02/ias_090226.jpg",
      published: true,
      publishedAt: new Date("2026-02-09T10:00:00.000Z")
    },
    {
      title: "Qwen-3.5 de Alibaba: Multimodal y open-source potente",
      slug: "qwen-3-5-de-alibaba-multimodal-y-open-source-potente",
      excerpt: "El gigante asiático lanza su modelo más avanzado hasta la fecha, ofreciendo capacidades multimodales en un entorno de código abierto.",
      content: "El gigante asiático lanza su modelo más avanzado hasta la fecha, ofreciendo capacidades multimodales en un entorno de código abierto. Qwen-3.5 establece nuevos estándares en la eficiencia de inferencia.",
      category: "Nuevos Modelos",
      coverImage: "/uploads/1771431771278-ias_160226.png",
      published: true,
      publishedAt: new Date("2026-02-16T10:00:00.000Z")
    },
    {
      title: "Anthropic impulsa la IA responsable en India desde Bengaluru",
      slug: "anthropic-impulsa-la-ia-responsable-en-india-desde-bengaluru",
      excerpt: "Anthropic expande su presencia a India, abriendo un nuevo centro en Bengaluru enfocado en el desarrollo de IA ética y responsable.",
      content: "Anthropic expande su presencia a India, abriendo un nuevo centro en Bengaluru enfocado en el desarrollo de IA ética y responsable, colaborando con talento local para abordar desafíos globales.",
      category: "Empresas",
      coverImage: "/uploads/1771431928464-ias_170226.png",
      published: true,
      publishedAt: new Date("2026-02-17T10:00:00.000Z")
    },
    {
      title: "Construye sistemas conocimiento AI con RAG multimodal",
      slug: "construye-sistemas-conocimiento-ai-con-rag-multimodal",
      excerpt: "Aprende a integrar RAG (Retrieval-Augmented Generation) con capacidades multimodales para crear sistemas de gestión de conocimiento avanzados.",
      content: "Aprende a integrar RAG (Retrieval-Augmented Generation) con capacidades multimodales para crear sistemas de gestión de conocimiento avanzados. Esta arquitectura permite buscar y sintetizar texto, imágenes y tablas simultáneamente.",
      category: "Tutoriales",
      coverImage: "/uploads/1771434509026-ias_180226.png",
      published: true,
      publishedAt: new Date("2026-02-18T10:00:00.000Z")
    },
    {
      title: "Nuevo Kindle Scribe: Notebook impulsado por Gen AI",
      slug: "nuevo-kindle-scribe-notebook-impulsado-por-gen-ai",
      excerpt: "Amazon actualiza su Kindle Scribe, integrando inteligencia artificial generativa para resumir notas y mejorar la productividad de los usuarios.",
      content: "Amazon actualiza su Kindle Scribe, integrando inteligencia artificial generativa para resumir notas y mejorar la productividad de los usuarios. Esta actualización transforma el e-reader en una verdadera herramienta de trabajo conectada.",
      category: "Hardware",
      coverImage: "/uploads/1771434786060-ias_15022601.png",
      published: true,
      publishedAt: new Date("2026-02-15T10:00:00.000Z")
    },
    {
      title: "Google Research: Enseñando IA a leer mapas",
      slug: "google-research-ensenando-ia-a-leer-mapas",
      excerpt: "Investigadores de Google desarrollan nuevos métodos para que los modelos de IA puedan interpretar información cartográfica compleja.",
      content: "Investigadores de Google desarrollan nuevos métodos para que los modelos de IA puedan interpretar información cartográfica compleja, un paso vital para la robótica autónoma y la planificación urbana inteligente.",
      category: "Investigación",
      coverImage: "/uploads/1772092400731-ias_190226.png",
      published: true,
      publishedAt: new Date("2026-02-19T10:00:00.000Z")
    },
    {
      title: "Gemini 3.1 Pro: IA más inteligente para tareas complejas",
      slug: "gemini-3-1-pro-ia-mas-inteligente-para-tareas-complejas",
      excerpt: "Google lanza la nueva versión de Gemini Pro, destacando mejoras significativas en razonamiento lógico y tareas matemáticas.",
      content: "Google lanza la nueva versión de Gemini Pro, destacando mejoras significativas en razonamiento lógico y tareas matemáticas. Las evaluaciones iniciales sitúan a Gemini 3.1 Pro en la cima de los modelos comerciales actuales.",
      category: "Nuevos Modelos",
      coverImage: "/uploads/1772092497277-ias_200226.png",
      published: true,
      publishedAt: new Date("2026-02-20T10:00:00.000Z")
    },
    {
      title: "Claude Sonnet 4.6 ya disponible: Mejoras en código y contexto",
      slug: "claude-sonnet-4-6-ya-disponible",
      excerpt: "La nueva iteración del modelo Sonnet de Anthropic incrementa su ventana de contexto y refina sus habilidades de programación.",
      content: "La nueva iteración del modelo Sonnet de Anthropic incrementa su ventana de contexto y refina sus habilidades de programación, convirtiéndose en el copiloto ideal para desarrolladores de software.",
      category: "Nuevos Modelos",
      coverImage: "/uploads/1772092624052-ias_210226.png",
      published: true,
      publishedAt: new Date("2026-02-21T10:00:00.000Z")
    },
    {
      title: "Nuevo informe explora cómo IA moldea la confianza digital",
      slug: "nuevo-informe-explora-como-ia-moldea-la-confianza-digital",
      excerpt: "Un estudio exhaustivo analiza el impacto de la inteligencia artificial en la percepción de seguridad y privacidad en línea.",
      content: "Un estudio exhaustivo analiza el impacto de la inteligencia artificial en la percepción de seguridad y privacidad en línea. Las conclusiones subrayan la necesidad de normativas claras para mantener la confianza del usuario.",
      category: "Ética y Sociedad",
      coverImage: "/uploads/1772092727655-ias_220226.png",
      published: true,
      publishedAt: new Date("2026-02-22T10:00:00.000Z")
    },
    {
      title: "Hábitos para mejorar tu fluidez con la IA según Anthropic",
      slug: "habitos-para-mejorar-tu-fluidez-con-la-ia-segun-anthropic",
      excerpt: "Expertos de Anthropic comparten guías prácticas y hábitos diarios para maximizar tu eficiencia al interactuar con modelos de lenguaje grande.",
      content: "Expertos de Anthropic comparten guías prácticas y hábitos diarios para maximizar tu eficiencia al interactuar con modelos de lenguaje grande. Desde el diseño de prompts hasta la evaluación crítica de respuestas, la fluidez con la IA es la habilidad clave de esta década.",
      category: "Educación",
      coverImage: "/uploads/1772092772487-ias_230226.png",
      published: true,
      publishedAt: new Date("2026-02-23T10:00:00.000Z")
    },
    {
      title: "NVIDIA Lleva Ciberseguridad IA a Sistemas Industriales OT",
      slug: "nvidia-lleva-ciberseguridad-ia-a-sistemas-industriales-ot",
      excerpt: "Nvidia anuncia nuevas soluciones de hardware y software orientadas a proteger infraestructuras críticas utilizando inteligencia artificial.",
      content: "Nvidia anuncia nuevas soluciones de hardware y software orientadas a proteger infraestructuras críticas utilizando inteligencia artificial. Esta tecnología promete detectar anomalías en tiempo real en entornos industriales aislados.",
      category: "Hardware",
      coverImage: "/uploads/1772092833229-ias_240226.png",
      published: true,
      publishedAt: new Date("2026-02-24T10:00:00.000Z")
    },
    {
      title: "Opal de Google: crea agentes IA dinámicos sin programar",
      slug: "opal-de-google-crea-agentes-ia-dinamicos-sin-programar",
      excerpt: "Google desvela Opal, una nueva plataforma no-code que permite a los usuarios diseñar y desplegar agentes inteligentes personalizados.",
      content: "Google desvela Opal, una nueva plataforma no-code que permite a los usuarios diseñar y desplegar agentes inteligentes personalizados con acceso a APIs locales y razonamiento avanzado.",
      category: "Plataformas",
      coverImage: "/uploads/1772092942514-ias_250226.png",
      published: true,
      publishedAt: new Date("2026-02-25T10:00:00.000Z")
    }
  ];

  for (const post of recoveredPosts) {
    const exists = await prisma.newsPost.findFirst({
      where: { title: post.title }
    });

    if (!exists) {
      await prisma.newsPost.create({
        data: {
          title: post.title,
          slug: post.slug,
          content: post.content,
          category: post.category,
          coverImage: post.coverImage,
          published: post.published,
          publishedAt: post.publishedAt
        }
      });
      console.log(`- Recovered: ${post.title}`);
    } else {
      await prisma.newsPost.update({
        where: { id: exists.id },
        data: {
          title: post.title,
          slug: post.slug,
          content: post.content,
          category: post.category,
          coverImage: post.coverImage,
          published: post.published,
          publishedAt: post.publishedAt
        }
      });
      console.log(`- Updated existing: ${post.title}`);
    }
  }

  // Delete the automated posts to clean up the timeline
  const deleted = await prisma.newsPost.deleteMany({
    where: {
      category: 'Actualidad IA',
      coverImage: null 
    }
  });
  
  console.log(`Deleted ${deleted.count} automated temporary posts without images.`);
  console.log('Original structural restoration complete.');
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
