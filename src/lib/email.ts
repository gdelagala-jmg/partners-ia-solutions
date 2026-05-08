import nodemailer from 'nodemailer'

export async function getTransporter() {
    const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_PORT, SMTP_SECURE } = process.env

    if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
        console.error('SMTP configuration missing in environment variables')
        return null
    }

    return nodemailer.createTransport({
        host: SMTP_HOST,
        port: Number(SMTP_PORT) || 587,
        secure: SMTP_SECURE === 'true',
        auth: {
            user: SMTP_USER,
            pass: SMTP_PASS,
        },
    })
}

export async function sendEmail({ to, subject, html, text }: { to: string, subject: string, html: string, text?: string }) {
    const transporter = await getTransporter()
    if (!transporter) return { success: false, error: 'Configuración SMTP no encontrada' }

    try {
        const info = await transporter.sendMail({
            from: `"Partners IA Solutions" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
            text: text || 'Por favor, activa el visor HTML para ver este mensaje.'
        })
        return { success: true, messageId: info.messageId }
    } catch (error: any) {
        console.error('Error sending email:', error)
        return { success: false, error: error.message }
    }
}
