import { generateText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

// Configuración explícita del proveedor
const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
})

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()
    
    const result = await generateText({
      model: google('gemini-2.5-flash'),
      messages: [
        {
          role: 'system',
          content: `Eres el Asistente Experto de Partners IA Solutions. Tu misión es ayudar al usuario con un tono Apple-style (minimalista y premium). Captura nombre, email y empresa si hay interés.`
        },
        ...messages,
      ],
    })

    return Response.json({ text: result.text })
  } catch (error: any) {
    console.error('Chat API Error:', error)
    return Response.json({ error: 'Failed to process chat', details: error.message }, { status: 500 })
  }
}
