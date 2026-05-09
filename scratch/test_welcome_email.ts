import { sendEmail } from '../src/lib/email'
import { generateWelcomeEmailHtml } from '../src/lib/newsletter-templates'
import * as dotenv from 'dotenv'
import path from 'path'

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

async function main() {
    const targetEmail = 'gdelagala@gmail.com'
    console.log(`Enviando email de bienvenida de prueba a: ${targetEmail}...`)

    const result = await sendEmail({
        to: targetEmail,
        subject: '¡Bienvenido a Partners IA Solutions! (Final)',
        html: generateWelcomeEmailHtml('test-token-123')
    })

    if (result.success) {
        console.log('✅ Email enviado con éxito.')
    } else {
        console.error('❌ Error al enviar el email:', result.error)
    }
}

main().catch(console.error)
