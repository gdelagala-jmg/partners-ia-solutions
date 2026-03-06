'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState } from 'react'
import { Calendar, Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'

const newsSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    content: z.string().min(1, 'Content is required'),
    category: z.string().min(1, 'Category is required'),
    aiType: z.string().optional(),
    businessArea: z.string().optional(),
    sector: z.string().optional(),
    profession: z.string().optional(),
    coverImage: z.string().optional(),
    published: z.boolean().optional(),
    publishedAt: z.string().optional().nullable(),
})

type NewsFormValues = z.infer<typeof newsSchema>

// Predefined options for select inputs
const aiTypes = ['Generative AI', 'Machine Learning', 'NLP', 'Computer Vision', 'Robotics']
const businessAreas = ['Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Technology']
const sectors = ['Banking', 'Pharma', 'Universities', 'Ecommerce', 'Automotive', 'Software']
const professions = ['Executives', 'Developers', 'Marketers', 'Doctors', 'Teachers', 'Designers']

export default function NewsForm({ initialData, onSubmit, onCancel }: any) {
    const [uploading, setUploading] = useState(false)

    // Format initial date for datetime-local input (YYYY-MM-DDThh:mm)
    const formatDateForInput = (dateString: string | Date | null) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toISOString().slice(0, 16)
    }

    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<NewsFormValues>({
        resolver: zodResolver(newsSchema),
        defaultValues: initialData ? {
            ...initialData,
            publishedAt: formatDateForInput(initialData.publishedAt),
        } : {
            category: 'Noticia',
            published: false,
            publishedAt: null,
        },
    })

    const coverImageUrl = watch('coverImage')

    // Basic slug generation
    const handleTitleChange = (e: any) => {
        if (!initialData) {
            const slugVal = e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            setValue('slug', slugVal)
        }
    }

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
            setValue('coverImage', data.url)
        } catch (error) {
            console.error('Error uploading image:', error)
            alert('Error al subir la imagen')
        } finally {
            setUploading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Título</label>
                    <input
                        {...register('title')}
                        onChange={(e) => {
                            register('title').onChange(e)
                            handleTitleChange(e)
                        }}
                        className="mt-1 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Slug (URL)</label>
                    <input
                        {...register('slug')}
                        className="mt-1 block w-full bg-gray-50 border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {errors.slug && <p className="text-red-500 text-xs mt-1">{errors.slug.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Categoría Principal</label>
                    <select {...register('category')} className="mt-1 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500">
                        <option value="Noticia">Noticia</option>
                        <option value="Análisis">Análisis</option>
                        <option value="Tutorial">Tutorial</option>
                        <option value="Caso de Estudio">Caso de Estudio</option>
                    </select>

                    <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Publicación</label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Calendar className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="datetime-local"
                                {...register('publishedAt')}
                                className="pl-10 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Dejar en blanco para usar la fecha actual al publicar.</p>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Imagen Destacada</label>

                    <div className="space-y-3">
                        {/* URL Input */}
                        <div className="flex gap-2">
                            <input
                                {...register('coverImage')}
                                placeholder="https://..."
                                className="block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        {/* File Upload */}
                        <div className="flex items-center gap-2">
                            <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 border border-gray-300">
                                {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
                                {uploading ? 'Subiendo...' : 'Subir imagen'}
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </label>
                            <span className="text-xs text-gray-500">o arrastra un archivo aquí</span>
                        </div>

                        {/* Preview */}
                        {coverImageUrl && (
                            <div className="relative w-full h-40 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 group">
                                <img
                                    src={coverImageUrl}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=Error+Loading+Image')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setValue('coverImage', '')}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                <div>
                    <label className="block text-xs font-medium text-blue-600 mb-2 uppercase">Tipo de IA</label>
                    <select {...register('aiType')} className="block w-full text-sm bg-white border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500">
                        <option value="">Seleccionar...</option>
                        {aiTypes.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-blue-600 mb-2 uppercase">Área Negocio</label>
                    <select {...register('businessArea')} className="block w-full text-sm bg-white border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500">
                        <option value="">Seleccionar...</option>
                        {businessAreas.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-blue-600 mb-2 uppercase">Sector</label>
                    <select {...register('sector')} className="block w-full text-sm bg-white border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500">
                        <option value="">Seleccionar...</option>
                        {sectors.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-xs font-medium text-blue-600 mb-2 uppercase">Profesión</label>
                    <select {...register('profession')} className="block w-full text-sm bg-white border-gray-300 rounded-lg text-gray-900 focus:ring-blue-500">
                        <option value="">Seleccionar...</option>
                        {professions.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Contenido</label>
                <textarea
                    {...register('content')}
                    rows={6}
                    className="mt-1 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                />
                {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content.message}</p>}
            </div>

            <div className="flex items-center">
                <input
                    type="checkbox"
                    id="published"
                    {...register('published')}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded bg-white"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                    Publicar inmediatamente
                </label>
            </div>

            <div className="flex justify-end space-x-3">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar Noticia'}
                </button>
            </div>
        </form>
    )
}
