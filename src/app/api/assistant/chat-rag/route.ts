/**
 * Assistant Chat API — RAG-Enhanced (PARALLEL / TEST)
 * POST /api/assistant/chat-rag
 * 
 * This is the RAG-enhanced version running alongside the original.
 * Once validated, it will replace /api/assistant/chat.
 * 
 * Flow:
 * 1. Receive user message
 * 2. Search knowledge base for relevant context
 * 3. Inject context into system prompt
 * 4. Generate grounded response with Gemini
 * 5. Return response + sources used + debug info
 */

import { generateText, tool } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'
import { searchKnowledge, RetrievalResult } from '@/lib/knowledge/retriever'

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

export const runtime = 'nodejs'

function buildSystemPrompt(context: RetrievalResult[]): string {
  const basePrompt = `Eres el Asistente Experto de Partners IA Solutions. Tu misión es ayudar al usuario con un tono profesional, premium y minimalista (estilo Apple).

═══════════════════════════════════════════════
REGLAS ESTRICTAS DE CONOCIMIENTO (OBLIGATORIAS):
═══════════════════════════════════════════════

1. SOLO responde usando la información del CONTEXTO DE KNOWLEDGE BASE proporcionado abajo.
2. Si la respuesta NO está en el contexto, responde exactamente: "No tengo información suficiente en la base de conocimiento para responder con precisión. ¿Te gustaría que te ponga en contacto con nuestro equipo para una respuesta detallada?"
3. NUNCA inventes datos, precios, estadísticas, nombres de productos o características que NO estén explícitamente en el contexto.
4. Si una pregunta es parcialmente respondible, responde lo que puedas del contexto e indica qué parte requiere consulta adicional.
5. Cuando cites información, hazlo de forma natural sin decir "según el contexto" ni "según mi base de conocimiento".
6. Si notas interés real en implementar IA, desarrollar software a medida, o si el usuario pide contacto, DEBES USAR la herramienta "mostrar_formulario_contacto".
7. Responde siempre en español salvo que el usuario escriba en otro idioma.

═══════════════════════════════════════════════
CONTEXTO DE KNOWLEDGE BASE:
═══════════════════════════════════════════════
`

  if (context.length === 0) {
    return basePrompt + '\n[No se encontró contexto relevante para esta consulta]\n'
  }

  const contextBlocks = context.map((c, i) => {
    return `--- Fuente ${i + 1} [${c.content_type}] (relevancia: ${(c.similarity * 100).toFixed(0)}%) ---
Título: ${c.title}
URL: ${c.source_url}
Contenido: ${c.chunk_text}
`
  })

  return basePrompt + contextBlocks.join('\n') + '\n═══════════════════════════════════════════════\n'
}

export async function POST(req: Request) {
  try {
    const { messages, debug } = await req.json()

    // Extract the latest user message for RAG search
    const lastUserMessage = [...messages].reverse().find((m: any) => m.role === 'user')
    const userQuery = lastUserMessage?.content || ''

    // ── RAG: Search knowledge base ──
    let ragContext: RetrievalResult[] = []
    let ragSearchTime = 0
    let ragError: string | null = null

    if (userQuery && process.env.NEON_DATABASE_URL) {
      try {
        const searchResult = await searchKnowledge(userQuery, {
          topK: 5,
          minSimilarity: 0.25,
        })
        ragContext = searchResult.results
        ragSearchTime = searchResult.search_time_ms
      } catch (err: any) {
        console.error('RAG search error (non-fatal):', err.message)
        ragError = err.message
        // Continue without RAG — graceful degradation
      }
    }

    // ── Build grounded system prompt ──
    const systemPrompt = buildSystemPrompt(ragContext)

    const result = await generateText({
      model: google('gemini-2.5-flash'),
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages,
      ],
      tools: {
        mostrar_formulario_contacto: tool({
          description:
            'Muestra un formulario de contacto profesional para capturar los datos del lead (nombre, email, empresa). Úsalo cuando el cliente demuestre interés comercial o pida contacto.',
          parameters: z.object({
            motivo: z.string().describe('Breve motivo de por qué mostramos el formulario basado en la charla.'),
            prioridad: z.enum(['Alta', 'Media', 'Baja']).optional(),
          }),
          execute: async ({ motivo }) => {
            return { ui_type: 'contact_form', motivo }
          },
        }),
      },
    })

    // ── Build response ──
    const response: Record<string, any> = {
      text: result.text,
      toolCalls: result.toolCalls,
    }

    // Always include RAG metadata for transparency
    response.rag = {
      sources: ragContext.map((c) => ({
        title: c.title,
        type: c.content_type,
        source: c.source,
        url: c.source_url,
        similarity: c.similarity,
      })),
      search_time_ms: ragSearchTime,
      chunks_used: ragContext.length,
    }

    // Debug mode: include full chunk text for inspection
    if (debug === true) {
      response.rag_debug = {
        query: userQuery,
        chunks: ragContext.map((c) => ({
          title: c.title,
          content_type: c.content_type,
          source: c.source,
          source_url: c.source_url,
          similarity: c.similarity,
          chunk_text: c.chunk_text,
        })),
      }
    }

    if (ragError) {
      response.rag_error = ragError
    }

    return Response.json(response)
  } catch (error: any) {
    console.error('Chat RAG API Error:', error)
    return Response.json(
      { error: 'Failed to process chat', details: error.message },
      { status: 500 }
    )
  }
}
