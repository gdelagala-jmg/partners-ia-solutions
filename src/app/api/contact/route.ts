import { NextResponse } from 'next/server'
import nodemailer from 'nodemailer'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, phone, message } = body

        // 1. Save to Database
        const lead = await prisma.lead.create({
            data: {
                name,
                email,
                phone,
                message,
            },
        })

        // 2. Send Email
        // Only try to send if SMTP vars are present, otherwise log meaningful warning
        if (process.env.SMTP_HOST && process.env.SMTP_USER) {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 587,
                secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
            })

            await transporter.sendMail({
                from: `"Partners IA System" <${process.env.SMTP_USER}>`,
                to: 'info@partnersiasolutions.com',
                subject: `Nuevo Lead: ${name}`,
                text: `
            Nuevo contacto recibido:
            Nombre: ${name}
            Email: ${email}
            Teléfono: ${phone || 'N/A'}
            Mensaje: ${message}
          `,
                html: `
            <h2>Nuevo contacto recibido</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Teléfono:</strong> ${phone || 'N/A'}</p>
            <p><strong>Mensaje:</strong></p>
            <blockquote style="background: #f9f9f9; padding: 10px; border-left: 5px solid #ccc;">${message}</blockquote>
          `,
            })
            console.log('Email sent successfully for lead:', lead.id)
        } else {
            console.warn('SMTP configuration missing. Email was NOT sent for lead:', lead.id)
        }

        return NextResponse.json(lead)
    } catch (error) {
        console.error('Error processing contact form:', error)
        return NextResponse.json({ error: 'Error processing request' }, { status: 500 })
    }
}
