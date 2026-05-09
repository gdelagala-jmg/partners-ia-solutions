/**
 * Content Extractor
 * Reads content from Prisma DB and static sources,
 * cleans it and produces structured chunks for embedding.
 */

import prisma from '@/lib/prisma'

export interface ContentChunk {
  content_type: string
  source: string
  source_id: string
  source_slug: string
  source_url: string
  title: string
  chunk_text: string
  chunk_index: number
  metadata: Record<string, unknown>
}

// ────────────────────────────────────────────────
// HTML / Markdown Cleaner
// ────────────────────────────────────────────────

function cleanHtml(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

function splitTextIntoChunks(text: string, maxChars = 1500): string[] {
  if (text.length <= maxChars) return [text]

  const sentences = text.split(/(?<=[.!?])\s+/)
  const chunks: string[] = []
  let current = ''

  for (const sentence of sentences) {
    if ((current + ' ' + sentence).length > maxChars && current.length > 0) {
      chunks.push(current.trim())
      current = sentence
    } else {
      current = current ? current + ' ' + sentence : sentence
    }
  }
  if (current.trim()) chunks.push(current.trim())
  return chunks
}

// ────────────────────────────────────────────────
// SOLUTIONS Extractor
// ────────────────────────────────────────────────

export async function extractSolutions(): Promise<ContentChunk[]> {
  const solutions = await prisma.solution.findMany({
    where: { published: true },
    include: { sectors: true },
  })

  const chunks: ContentChunk[] = []

  for (const sol of solutions) {
    const sectorNames = sol.sectors.map((s) => s.name).join(', ')
    const baseUrl = `/soluciones`

    // Chunk 1: Overview (title + description + sectors)
    const overviewText = [
      `Solución: ${sol.title}`,
      `Tipo: ${sol.type}`,
      sectorNames ? `Sectores: ${sectorNames}` : '',
      `Descripción: ${cleanHtml(sol.description)}`,
      sol.tags ? `Tags: ${sol.tags}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    chunks.push({
      content_type: 'solution',
      source: 'website',
      source_id: sol.id,
      source_slug: sol.slug,
      source_url: baseUrl,
      title: sol.title,
      chunk_text: overviewText,
      chunk_index: 0,
      metadata: { type: sol.type, sectors: sectorNames, tags: sol.tags },
    })

    // Chunk 2: Long description (if exists)
    if (sol.longDescription) {
      const longDesc = cleanHtml(sol.longDescription)
      const textChunks = splitTextIntoChunks(longDesc)
      textChunks.forEach((text, i) => {
        chunks.push({
          content_type: 'solution',
          source: 'website',
          source_id: sol.id,
          source_slug: sol.slug,
          source_url: baseUrl,
          title: `${sol.title} - Descripción detallada`,
          chunk_text: `${sol.title}: ${text}`,
          chunk_index: 1 + i,
          metadata: { section: 'longDescription' },
        })
      })
    }

    // Chunk 3: Functional description
    if (sol.functionalDescription) {
      chunks.push({
        content_type: 'solution',
        source: 'website',
        source_id: sol.id,
        source_slug: sol.slug,
        source_url: baseUrl,
        title: `${sol.title} - Funcionalidades`,
        chunk_text: `Funcionalidades de ${sol.title}: ${cleanHtml(sol.functionalDescription)}`,
        chunk_index: 10,
        metadata: { section: 'functionalDescription' },
      })
    }

    // Chunk 4: Problems solved
    if (sol.problemsSolved) {
      chunks.push({
        content_type: 'solution',
        source: 'website',
        source_id: sol.id,
        source_slug: sol.slug,
        source_url: baseUrl,
        title: `${sol.title} - Problemas que resuelve`,
        chunk_text: `Problemas que resuelve ${sol.title}: ${cleanHtml(sol.problemsSolved)}`,
        chunk_index: 11,
        metadata: { section: 'problemsSolved' },
      })
    }

    // Chunk 5: Capabilities
    if (sol.capabilities) {
      chunks.push({
        content_type: 'solution',
        source: 'website',
        source_id: sol.id,
        source_slug: sol.slug,
        source_url: baseUrl,
        title: `${sol.title} - Capacidades`,
        chunk_text: `Capacidades de ${sol.title}: ${cleanHtml(sol.capabilities)}`,
        chunk_index: 12,
        metadata: { section: 'capabilities' },
      })
    }

    // Chunk 6: Workflow
    if (sol.workflowDescription) {
      chunks.push({
        content_type: 'solution',
        source: 'website',
        source_id: sol.id,
        source_slug: sol.slug,
        source_url: baseUrl,
        title: `${sol.title} - Flujo de trabajo`,
        chunk_text: `Flujo de trabajo de ${sol.title}: ${cleanHtml(sol.workflowDescription)}`,
        chunk_index: 13,
        metadata: { section: 'workflowDescription' },
      })
    }
  }

  return chunks
}

// ────────────────────────────────────────────────
// FAQ Extractor (Static from code)
// ────────────────────────────────────────────────

const FAQ_DATA = [
  {
    category: 'General',
    items: [
      {
        question: '¿Qué es Partners IA Solutions?',
        answer:
          'Somos una consultora tecnológica especializada en el diseño y despliegue de Ecosistemas de IA. No solo vendemos software; construimos arquitecturas inteligentes (Agentes, RAG y Automatizaciones) que se integran en el ADN de tu empresa para escalar operaciones y reducir costes.',
      },
      {
        question: '¿Cómo ayudáis a las empresas?',
        answer:
          'Transformamos cuellos de botella operativos en ventajas competitivas. Desde la automatización de la atención al cliente con agentes autónomos hasta la gestión del conocimiento interno con sistemas RAG, permitimos que tu equipo se centre en tareas de alto valor mientras la IA gestiona la ejecución técnica.',
      },
    ],
  },
  {
    category: 'Tecnología y Soluciones',
    items: [
      {
        question: '¿Qué es un Ecosistema de Agentes de IA?',
        answer:
          'Es una red de asistentes inteligentes autónomos que colaboran entre sí para cumplir objetivos complejos. Pueden investigar, redactar, analizar datos o gestionar leads sin intervención humana constante, funcionando las 24 horas del día.',
      },
      {
        question: '¿Qué significa RAG (Retrieval-Augmented Generation)?',
        answer:
          'Es una tecnología que permite a la IA responder preguntas basándose exclusivamente en tus propios documentos, bases de datos y manuales. Esto elimina las "alucinaciones" de la IA y garantiza respuestas precisas, privadas y actualizadas con la información de tu negocio.',
      },
      {
        question: '¿Desarrolláis soluciones a medida?',
        answer:
          'Sí. Todas nuestras implementaciones son personalizadas. Realizamos una auditoría inicial para entender tus procesos y diseñamos la arquitectura de IA que mejor se adapte a tus necesidades específicas y a los sistemas que ya utilizas.',
      },
    ],
  },
  {
    category: 'Sectores y Aplicación',
    items: [
      {
        question: '¿En qué sectores tenéis experiencia?',
        answer:
          'Trabajamos con sectores donde el volumen de información y la necesidad de eficiencia son críticos: Inmobiliario (Real Estate), Legal, Financiero, Logística y Educación (E-learning). Cada sector recibe una capa de IA entrenada específicamente en su terminología y retos.',
      },
      {
        question: '¿Mi empresa es demasiado pequeña para usar IA?',
        answer:
          'En absoluto. La IA es el gran igualador. Permite que empresas pequeñas operen con la eficiencia de corporaciones multinacionales. Tenemos soluciones escalables que crecen con tu negocio.',
      },
    ],
  },
  {
    category: 'Seguridad y Privacidad',
    items: [
      {
        question: '¿Están mis datos seguros?',
        answer:
          'La privacidad es nuestro pilar fundamental. Implementamos soluciones que cumplen estrictamente con la RGPD. Tus datos corporativos se utilizan para entrenar o contextualizar tus propios modelos y nunca se comparten ni se usan para entrenar IAs públicas de terceros.',
      },
      {
        question: '¿Dónde se alojan los sistemas de IA?',
        answer:
          'Dependiendo de las necesidades de seguridad, podemos desplegar soluciones en nubes seguras (Vercel, AWS, Azure) o incluso en infraestructuras locales si el cliente requiere un control total sobre el entorno.',
      },
    ],
  },
  {
    category: 'Proceso y Contacto',
    items: [
      {
        question: '¿Cuál es el primer paso para trabajar juntos?',
        answer:
          'Todo empieza con una Consultoría Estratégica. Analizamos tu arquitectura actual, detectamos ineficiencias monetizables y te presentamos un Roadmap de IA con el ROI estimado. No implementamos por implementar; implementamos para rentabilizar.',
      },
      {
        question: '¿Ofrecéis soporte post-implementación?',
        answer:
          'Sí. Acompañamos a nuestros partners en la fase de adopción, optimización de prompts y mantenimiento técnico. La IA evoluciona cada semana, y nosotros nos encargamos de que tu sistema nunca se quede atrás.',
      },
    ],
  },
]

export function extractFAQ(): ContentChunk[] {
  const chunks: ContentChunk[] = []
  let idx = 0

  for (const category of FAQ_DATA) {
    for (const item of category.items) {
      chunks.push({
        content_type: 'faq',
        source: 'website',
        source_id: `faq-${idx}`,
        source_slug: 'faq',
        source_url: '/faq',
        title: item.question,
        chunk_text: `Pregunta: ${item.question}\nRespuesta: ${item.answer}`,
        chunk_index: idx,
        metadata: { category: category.category },
      })
      idx++
    }
  }

  return chunks
}

// ────────────────────────────────────────────────
// SAVEFUEL Extractor (Static commercial content)
// ────────────────────────────────────────────────

const SAVEFUEL_CONTENT = [
  {
    title: 'SaveFuel - Qué es',
    text: 'SaveFuel es una aplicación de ahorro en combustible basada en IA que ayuda a conductores y flotas a reducir su gasto en gasolina y diésel. Utiliza inteligencia artificial para localizar las gasolineras más baratas en tiempo real, optimizar rutas y calcular el ahorro real por cada repostaje. Disponible en España y con planes de expansión internacional.',
  },
  {
    title: 'SaveFuel - Características principales',
    text: 'SaveFuel ofrece: búsqueda inteligente de gasolineras por precio y ubicación, comparación de precios en tiempo real, cálculo de ahorro por repostaje, historial de repostajes, alertas de precios, optimización de rutas para flotas, dashboard de analytics de consumo, y compatibilidad con vehículos diésel y gasolina.',
  },
  {
    title: 'SaveFuel - Usuarios objetivo',
    text: 'SaveFuel está diseñado para: conductores particulares que quieren ahorrar en combustible, flotas de transporte y logística, empresas con vehículos comerciales, autónomos con vehículo propio, y familias que buscan reducir el gasto mensual en gasolina.',
  },
  {
    title: 'SaveFuel - Tecnología',
    text: 'SaveFuel utiliza tecnologías avanzadas: IA para predicción de precios de combustible, geolocalización inteligente, APIs de datos de estaciones de servicio en tiempo real, algoritmos de optimización de rutas, y machine learning para patrones de consumo personalizados.',
  },
  {
    title: 'SaveFuel - Disponibilidad',
    text: 'SaveFuel está disponible actualmente en España con cobertura de todas las estaciones de servicio del país. La aplicación tiene planes de expansión a Portugal, Francia, Italia y otros países europeos. Se puede acceder desde la web en la sección /apps/savefuel del sitio de Partners IA Solutions.',
  },
]

export function extractSaveFuel(): ContentChunk[] {
  return SAVEFUEL_CONTENT.map((item, idx) => ({
    content_type: 'app/product',
    source: 'savefuel',
    source_id: `savefuel-${idx}`,
    source_slug: 'savefuel',
    source_url: '/apps/savefuel',
    title: item.title,
    chunk_text: item.text,
    chunk_index: idx,
    metadata: { product: 'SaveFuel' },
  }))
}

// ────────────────────────────────────────────────
// COMMERCIAL CONTENT Extractor (About company)
// ────────────────────────────────────────────────

const COMMERCIAL_CONTENT = [
  {
    title: 'Partners IA Solutions - Sobre nosotros',
    text: 'Partners IA Solutions es una consultora tecnológica especializada en el diseño y despliegue de Ecosistemas de Inteligencia Artificial para empresas. Nuestro equipo combina visión estratégica, ingeniería de soluciones, innovación digital, consultoría de negocio y estrategia comercial para aterrizar la IA en resultados reales y medibles.',
  },
  {
    title: 'Partners IA Solutions - Servicios',
    text: 'Ofrecemos: Consultoría Estratégica de IA (auditoría y roadmap), diseño e implementación de Agentes Autónomos de IA, sistemas RAG (Retrieval-Augmented Generation) para gestión del conocimiento, automatización de procesos con IA, desarrollo de aplicaciones web inteligentes, y formación corporativa en IA (Academy).',
  },
  {
    title: 'Partners IA Solutions - Propuesta de valor',
    text: 'Nuestra propuesta de valor: No predecimos el futuro de la IA, lo construimos para tu empresa. Unimos visión estratégica, ingeniería y marketing para aterrizar la inteligencia artificial en resultados reales. Implementamos soluciones que impactan en la cuenta de resultados desde el primer día, con realismo tecnológico y sin humo.',
  },
  {
    title: 'Partners IA Solutions - Contacto',
    text: 'Para contactar con Partners IA Solutions puedes: visitar la página de contacto en /contacto, solicitar una demo de nuestras soluciones, agendar una consultoría estratégica gratuita, o escribir por WhatsApp. Estamos ubicados en España y trabajamos con empresas de toda Europa.',
  },
]

export function extractCommercial(): ContentChunk[] {
  return COMMERCIAL_CONTENT.map((item, idx) => ({
    content_type: 'commercial',
    source: 'website',
    source_id: `commercial-${idx}`,
    source_slug: 'about',
    source_url: '/',
    title: item.title,
    chunk_text: item.text,
    chunk_index: idx,
    metadata: { section: 'company_info' },
  }))
}
