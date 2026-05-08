import { z } from 'zod'

export const leadFormSchema = z.object({
    name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
    email: z.string().email('Introduce un email válido'),
    phone: z.string().min(9, 'Introduce un teléfono válido').optional().or(z.literal('')),
    company: z.string().optional().or(z.literal('')),
    message: z.string().min(5, 'El mensaje es demasiado corto').optional().or(z.literal('')),
    consent: z.boolean().refine(val => val === true, {
        message: 'Debes aceptar la política de privacidad'
    })
})

export type LeadFormData = z.infer<typeof leadFormSchema>
