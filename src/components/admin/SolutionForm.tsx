import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEffect, useState } from 'react'
import { Check, Plus, Trash2 } from 'lucide-react'

const solutionSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(1, 'Description is required'),
    type: z.enum(['SOLUTION', 'LAB']),
    multimedia: z.string().optional(),
    functionalDescription: z.string().optional(),
    problemsSolved: z.string().optional(),
    capabilities: z.string().optional(),
    workflowDescription: z.string().optional(),
    ctaUrl: z.string().optional(),
    published: z.boolean().optional(),
    featured: z.boolean().optional(),
    featuredOrder: z.number().optional().nullable(),
    sectorIds: z.array(z.string()).optional(),
    gallery: z.array(z.object({
        url: z.string().min(1, 'URL es obligatoria'),
        alt: z.string().optional(),
        isPrimary: z.boolean().optional(),
    })).optional()
})

type SolutionFormValues = z.infer<typeof solutionSchema>

export default function SolutionForm({ initialData, onSubmit, onCancel }: any) {
    const [sectors, setSectors] = useState<any[]>([])

    const { register, control, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<SolutionFormValues>({
        resolver: zodResolver(solutionSchema),
        defaultValues: initialData ? {
            ...initialData,
            sectorIds: initialData.sectors?.map((i: any) => i.id) || [],
            featured: initialData.featured || false,
            featuredOrder: initialData.featuredOrder || null,
            gallery: initialData.gallery || []
        } : {
            type: 'SOLUTION',
            published: false,
            featured: false,
            featuredOrder: null,
            sectorIds: [],
            gallery: []
        },
    })

    const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({
        control,
        name: "gallery"
    })

    useEffect(() => {
        // Fetch sectors for the selector
        fetch('/api/sectors')
            .then(res => res.json())
            .then(data => setSectors(data))
            .catch(err => console.error(err))
    }, [])

    const selectedSectorIds = watch('sectorIds') || []

    const toggleSector = (id: string) => {
        const current = selectedSectorIds
        const newSelection = current.includes(id)
            ? current.filter(i => i !== id)
            : [...current, id]
        setValue('sectorIds', newSelection)
    }

    // Basic slug generation from title if standard slug is empty
    const handleTitleChange = (e: any) => {
        if (!initialData) {
            const slugVal = e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
            setValue('slug', slugVal)
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

            <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                    {...register('description')}
                    rows={3}
                    className="mt-1 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sectores Relacionados</label>
                <div className="flex flex-wrap gap-2">
                    {sectors.map(sector => {
                        const isSelected = selectedSectorIds.includes(sector.id)
                        return (
                            <button
                                key={sector.id}
                                type="button"
                                onClick={() => toggleSector(sector.id)}
                                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all flex items-center ${isSelected
                                    ? 'bg-blue-600 text-white shadow-md shadow-blue-100'
                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 border border-gray-100'
                                    }`}
                            >
                                {isSelected && <Check size={14} className="mr-1.5 shrink-0" />}
                                <span className="break-words line-clamp-2 text-left">{sector.name}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tipo</label>
                    <select
                        {...register('type')}
                        className="mt-1 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="SOLUTION">Solución Final</option>
                        <option value="LAB">Prototipo LAB</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Multimedia URL (Fallback)</label>
                    <input
                        {...register('multimedia')}
                        placeholder="Ej: /images/visuals/solution.png"
                        className="mt-1 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500 overflow-hidden"
                    />
                    <p className="text-xs text-gray-500 mt-1">Se usará si la galería está vacía.</p>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Galería de Imágenes</h3>
                <div className="space-y-4">
                    {galleryFields.map((field, index) => (
                        <div key={field.id} className="flex flex-col md:flex-row gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 items-start md:items-center">
                            <div className="flex-1 space-y-3 w-full">
                                <div>
                                    <input
                                        {...register(`gallery.${index}.url`)}
                                        placeholder="URL de la imagen"
                                        className="block w-full bg-white border-gray-300 rounded-lg shadow-sm text-sm"
                                    />
                                    {errors?.gallery?.[index]?.url && <p className="text-red-500 text-xs mt-1">{errors.gallery[index]?.url?.message}</p>}
                                </div>
                                <div className="flex items-center gap-4">
                                    <input
                                        {...register(`gallery.${index}.alt`)}
                                        placeholder="Texto alternativo (Alt)"
                                        className="block w-full bg-white border-gray-300 rounded-lg shadow-sm text-sm"
                                    />
                                    <label className="flex items-center gap-2 whitespace-nowrap text-sm text-gray-600">
                                        <input type="checkbox" {...register(`gallery.${index}.isPrimary`)} className="rounded text-blue-600" />
                                        Principal
                                    </label>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeGallery(index)}
                                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => appendGallery({ url: '', alt: '', isPrimary: galleryFields.length === 0 })}
                        className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-4 py-2 rounded-lg transition-colors"
                    >
                        <Plus size={16} className="mr-2" /> Añadir Imagen a la Galería
                    </button>
                </div>
            </div>

            <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Detallada</h3>
                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Descripción Funcional</label>
                        <textarea
                            {...register('functionalDescription')}
                            rows={3}
                            placeholder="Cómo funciona a nivel técnico/operativo..."
                            className="mt-1 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Problemas que Resuelve</label>
                        <textarea
                            {...register('problemsSolved')}
                            rows={3}
                            placeholder="Qué dolores de cabeza elimina esta solución..."
                            className="mt-1 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Capacidades Principales</label>
                        <textarea
                            {...register('capabilities')}
                            rows={3}
                            placeholder="Ej: Análisis en tiempo real, integración con CRMs..."
                            className="mt-1 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Enlace Destino (CTA)</label>
                <input
                    {...register('ctaUrl')}
                    className="mt-1 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                />
            </div>

            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        {...register('published')}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Publicar inmediatamente</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                    <input
                        type="checkbox"
                        {...register('featured')}
                        className="rounded border-gray-300 text-yellow-600 focus:ring-yellow-500"
                    />
                    <span className="text-sm font-medium text-gray-700">⭐ Destacar en Homepage</span>
                </label>
            </div>

            {watch('featured') && (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Orden en Homepage (1-3)</label>
                    <select
                        {...register('featuredOrder', { valueAsNumber: true })}
                        className="mt-1 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="">Seleccionar orden...</option>
                        <option value="1">1 - Primera posición</option>
                        <option value="2">2 - Segunda posición</option>
                        <option value="3">3 - Tercera posición</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-1">Solo 3 soluciones pueden estar destacadas a la vez.</p>
                </div>
            )}

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
                    {isSubmitting ? 'Guardando...' : 'Guardar Solución'}
                </button>
            </div>
        </form>
    )
}
