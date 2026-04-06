import { OpenAIStream, StreamingTextResponse } from 'ai'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const runtime = 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    stream: true,
    messages: [
      {
        role: 'system',
        content: `Eres el Asistente Experto de Partners IA Solutions. Tu misión es ayudar a los visitantes a entender cómo la IA puede transformar sus negocios.
        
        Sigue estas directrices:
        1. Sé profesional, innovador y muy servicial. Utiliza un tono "Apple-style": claro, minimalista y directo.
        2. Si el usuario muestra interés en servicios específicos (Agentes IA, RAG, Automatización), explícales el valor añadido de Partners IA.
        3. MUY IMPORTANTE: Tu objetivo secundario es capturar leads. Si la conversación es productiva, pide amablemente su Nombre, Email y Empresa para que un experto humano pueda darle una consultoría personalizada de 15 min.
        4. No inventes datos. Si no sabes algo sobre la empresa, invita al usuario a agendar una llamada.
        5. Habla siempre en español de España (tú).`
      },
      ...messages,
    ],
  })

  const stream = OpenAIStream(response)
  return new StreamingTextResponse(stream)
}
