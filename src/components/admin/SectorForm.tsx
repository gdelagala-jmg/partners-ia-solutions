import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEffect, useState } from 'react'

const sectorSchema = z.object({
    name: z.string().min(2, 'El nombre es obligatorio'),
    slug: z.string().optional(),
    image: z.string().min(1, 'La imagen es obligatoria'),
    externalUrl: z.string().min(1, 'URL externa es obligatoria'),
    description: z.string().optional(),
    order: z.coerce.number().default(0),
    active: z.boolean().default(true),
})

type SectorFormValues = z.infer<typeof sectorSchema>

interface SectorFormProps {
    initialData?: any
    onSubmit: (data: any) => void
    onCancel: () => void
}

export default function SectorForm({ initialData, onSubmit, onCancel }: SectorFormProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<any>({
        resolver: zodResolver(sectorSchema) as any,
        defaultValues: {
            active: true,
            order: 0,
        }
    })

    useEffect(() => {
        if (initialData) {
            setValue('name', initialData.name)
            setValue('slug', initialData.slug)
            setValue('image', initialData.image)
            setValue('externalUrl', initialData.externalUrl)
            setValue('description', initialData.description || '')
            setValue('order', initialData.order)
            setValue('active', initialData.active)
        }
    }, [initialData, setValue])

    // Auto-generate slug from name
    const nameValue = watch('name')
    useEffect(() => {
        if (nameValue && !initialData) {
            const slug = nameValue.toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
            setValue('slug', slug)
        }
    }, [nameValue, initialData, setValue])

    const [uploading, setUploading] = useState(false)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) throw new Error('Upload failed')

            const data = await res.json()
            setValue('image', data.url)
        } catch (error) {
            console.error('Upload error:', error)
            alert('Error al subir la imagen')
        } finally {
            setUploading(false)
        }
    }

    const onLocalSubmit = (data: SectorFormValues) => {
        // Handle URL transformation here
        let finalUrl = data.externalUrl
        if (finalUrl && !finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
            finalUrl = `https://${finalUrl}`
        }

        // Basic URL validation
        try {
            new URL(finalUrl)
        } catch (e) {
            alert('URL externa no es válida. Debe ser una dirección web válida.')
            return
        }

        onSubmit({
            ...data,
            externalUrl: finalUrl
        })
    }

    return (
        <div className="bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
                {initialData ? 'Editar Sector' : 'Nuevo Sector'}
            </h2>

            <form onSubmit={handleSubmit(onLocalSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                        <input
                            {...register('name')}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                            placeholder="Ej. Finanzas"
                        />
                        {errors.name?.message && <p className="text-red-500 text-xs mt-1">{String(errors.name.message)}</p>}
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                        <input
                            {...register('slug')}
                            className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500"
                            placeholder="ej. finanzas"
                        />
                    </div>

                    {/* Imagen URL & Upload */}
                    <div className="md:col-span-2 space-y-3">
                        <label className="block text-sm font-medium text-gray-700">Imagen</label>

                        <div className="flex items-center space-x-4">
                            <label className="cursor-pointer bg-blue-50 hover:bg-blue-100 text-blue-600 border border-blue-200 px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center">
                                <span>{uploading ? 'Subiendo...' : 'Subir Imagen'}</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileUpload}
                                    disabled={uploading}
                                />
                            </label>
                            <span className="text-gray-500 text-xs">o ingresa URL manualmente:</span>
                        </div>

                        <input
                            {...register('image')}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500"
                            placeholder="https://..."
                        />
                        {errors.image?.message && <p className="text-red-500 text-xs mt-1">{String(errors.image.message)}</p>}

                        {watch('image') && (
                            <div className="mt-2 w-full h-40 bg-gray-50 rounded-lg overflow-hidden border border-gray-200 relative">
                                <img
                                    src={watch('image')}
                                    alt="Preview"
                                    className="w-full h-full object-cover opacity-90"
                                    onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x400?text=Error+de+Imagen')}
                                />
                            </div>
                        )}
                    </div>

                    {/* External URL */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">URL Externa *</label>
                        <input
                            {...register('externalUrl')}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500"
                            placeholder="https://partnersiasolutions.com/finanzas"
                        />
                        <p className="text-xs text-gray-500 mt-1">Enlace al que se redirigirá al hacer clic.</p>
                        {errors.externalUrl?.message && <p className="text-red-500 text-xs mt-1">{String(errors.externalUrl.message)}</p>}
                    </div>

                    {/* Descripción */}
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (Opcional)</label>
                        <textarea
                            {...register('description')}
                            rows={3}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Orden */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                        <input
                            type="number"
                            {...register('order')}
                            className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Active Checkbox */}
                    <div className="flex items-center mt-6">
                        <input
                            type="checkbox"
                            {...register('active')}
                            id="active"
                            className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label htmlFor="active" className="ml-2 text-sm text-gray-700">Activo (Visible en web)</label>
                    </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
                    >
                        {isSubmitting ? 'Guardando...' : 'Guardar Sector'}
                    </button>
                </div>
            </form>
        </div>
    )
}
