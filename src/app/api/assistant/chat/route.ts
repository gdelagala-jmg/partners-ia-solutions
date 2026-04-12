import { generateText, tool } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { z } from 'zod'

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
          content: `Eres el Asistente Experto de Partners IA Solutions. Tu misión es ayudar al usuario con un tono Apple-style (minimalista y premium). 
          Si notas interés real en implementar IA, desarrollar software a medida, o si el usuario pide contacto, DEBES USAR la herramienta "proponer_reunion" para enviar una tarjeta interactiva, y añadir un mensaje corto invitándole a elegir un horario.`
        },
        ...messages,
      ],
      tools: {
        proponer_reunion: tool({
          description: 'Muestra una tarjeta interactiva tipo calendario (UI Tool) para que el cliente agende una videollamada con un experto de Partners IA. Úsalo si el cliente pide contacto, precios, o detalla un proyecto.',
          parameters: z.object({
            contexto: z.string().describe('Breve contexto de por qué estamos ofreciendo la reunión basado en lo que ha dicho el cliente.'),
            tipo_servicio: z.enum(['Agentes IA', 'Automatización', 'Desarrollo a Medida', 'Consultoría General']).describe('El servicio que mejor encaja con la necesidad del cliente.')
          }),
          execute: async ({ contexto, tipo_servicio }) => {
            // El backend no ejecuta nada real aquí, simplemente devuelve los datos
            // que luego el frontend usará para renderizar la tarjeta interactiva.
            return { ui_type: 'calendar_card', contexto, tipo_servicio };
          }
        })
      }
    })

    return Response.json({ text: result.text, toolCalls: result.toolCalls })
  } catch (error: any) {
    console.error('Chat API Error:', error)
    return Response.json({ error: 'Failed to process chat', details: error.message }, { status: 500 })
  }
}
