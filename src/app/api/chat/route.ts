import { streamText } from 'ai'
import { google } from '@ai-sdk/google'

// Cambiamos a runtime standard por si hay bloqueos en Edge
export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    // Verificación rápida de la clave (solo para logs de Vercel)
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error('ERROR: GOOGLE_GENERATIVE_AI_API_KEY no configurada en Vercel')
    }

    const result = streamText({
      model: google('gemini-1.5-flash'),
      messages: [
        {
          role: 'system',
          content: `Eres el Asistente Experto de Partners IA Solutions. Tu misión es ayudar al usuario con un tono Apple-style (minimalista y premium). Captura nombre, email y empresa si hay interés.`
        },
        ...messages,
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error('Chat API Error:', error)
    return new Response(JSON.stringify({ error: 'Failed to process chat' }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}
