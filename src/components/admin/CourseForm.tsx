'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEffect } from 'react'

const courseSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    slug: z.string().min(1, 'Slug is required'),
    description: z.string().min(1, 'Description is required'),
    level: z.string().min(1, 'Level is required'),
    duration: z.string().min(1, 'Duration is required'),
    price: z.string().optional(),
    coverImage: z.string().optional(),
    published: z.boolean().optional(),
})

type CourseFormValues = z.infer<typeof courseSchema>

export default function CourseForm({ initialData, onSubmit, onCancel }: any) {
    const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<CourseFormValues>({
        resolver: zodResolver(courseSchema),
        defaultValues: initialData || {
            published: false,
        },
    })

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
                    <label className="block text-sm font-medium text-gray-700">Título del Curso</label>
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Nivel</label>
                    <select {...register('level')} className="mt-1 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500">
                        <option value="Principiante">Principiante</option>
                        <option value="Intermedio">Intermedio</option>
                        <option value="Avanzado">Avanzado</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Duración</label>
                    <input
                        {...register('duration')}
                        placeholder="Ej: 4 semanas"
                        className="mt-1 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Precio</label>
                    <input
                        {...register('price')}
                        placeholder="Ej: Gratis / $99"
                        className="mt-1 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700">Portada URL</label>
                <input
                    {...register('coverImage')}
                    className="mt-1 block w-full bg-white border-gray-300 rounded-lg shadow-sm text-gray-900 focus:ring-blue-500 focus:border-blue-500"
                />
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
                    className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    {isSubmitting ? 'Guardando...' : 'Guardar Curso'}
                </button>
            </div>
        </form>
    )
}
