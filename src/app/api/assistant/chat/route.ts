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
          Si notas interés real en implementar IA, desarrollar software a medida, o si el usuario pide contacto, DEBES USAR la herramienta "mostrar_formulario_contacto" para que el usuario pueda dejarnos sus datos. No uses enlaces externos para agendar.`
        },
        ...messages,
      ],
      tools: {
        mostrar_formulario_contacto: tool({
          description: 'Muestra un formulario de contacto profesional para capturar los datos del lead (nombre, email, empresa). Úsalo cuando el cliente demuestre interés comercial o pida contacto.',
          parameters: z.object({
            motivo: z.string().describe('Breve motivo de por qué mostramos el formulario basado en la charla.'),
            prioridad: z.enum(['Alta', 'Media', 'Baja']).optional()
          }),
          execute: async ({ motivo }) => {
            return { ui_type: 'contact_form', motivo };
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
