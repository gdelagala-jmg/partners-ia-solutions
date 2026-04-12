import { streamText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

// Configuración explícita del proveedor
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    const result = streamText({
      model: google('gemini-1.5-flash'), // O google('models/gemini-1.5-flash')
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
