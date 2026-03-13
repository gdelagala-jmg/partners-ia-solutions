'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEffect } from 'react'
import { Link2, Hash, Edit3 } from 'lucide-react'

const navLinkSchema = z.object({
    name: z.string().min(2, 'El nombre es obligatorio'),
    href: z.string().min(1, 'La URL es obligatoria'),
    location: z.string().min(1, 'La ubicación es obligatoria'),
    order: z.number().int(),
    active: z.boolean(),
})

type NavLinkFormValues = z.infer<typeof navLinkSchema>

interface NavLinkFormProps {
    initialData?: any
    onSubmit: (data: any) => void
    onCancel: () => void
}

export default function NavLinkForm({ initialData, onSubmit, onCancel }: NavLinkFormProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue } = useForm<NavLinkFormValues>({
        resolver: zodResolver(navLinkSchema),
        defaultValues: {
            name: '',
            href: '/',
            location: 'HEADER',
            order: 0,
            active: true,
            ...initialData
        }
    })

    useEffect(() => {
        if (initialData) {
            Object.keys(initialData).forEach((key) => {
                setValue(key as any, initialData[key])
            })
        }
    }, [initialData, setValue])

    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <Link2 size={24} />
                </div>
                {initialData ? 'Editar Enlace de Navegación' : 'Añadir Nuevo Enlace'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <Edit3 size={16} className="text-gray-400" />
                            Nombre del Enlace *
                        </label>
                        <input
                            {...register('name')}
                            className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                            placeholder="Ej: Inicio, Servicios..."
                        />
                        {errors.name?.message && <p className="text-red-500 text-xs mt-1.5 font-bold">{String(errors.name.message)}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <Link2 size={16} className="text-gray-400" />
                            URL / Href *
                        </label>
                        <input
                            {...register('href')}
                            className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-sm"
                            placeholder="Ej: /servicios, https://..."
                        />
                        {errors.href?.message && <p className="text-red-500 text-xs mt-1.5 font-bold">{String(errors.href.message)}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <Hash size={16} className="text-gray-400" />
                            Ubicación del Menú *
                        </label>
                        <select
                            {...register('location')}
                            className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-all font-medium"
                        >
                            <option value="HEADER">Header Principal</option>
                            <option value="FOOTER_EXPLORA">Footer - Explora</option>
                            <option value="FOOTER_SOLUCIONES">Footer - Soluciones</option>
                            <option value="FOOTER_EMPRESA">Footer - Empresa</option>
                        </select>
                        {errors.location?.message && <p className="text-red-500 text-xs mt-1.5 font-bold">{String(errors.location.message)}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                            <Hash size={16} className="text-gray-400" />
                            Orden de Aparición
                        </label>
                        <input
                            type="number"
                            {...register('order', { valueAsNumber: true })}
                            className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                            placeholder="0"
                        />
                    </div>

                    <div className="flex items-center pt-8">
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('active')}
                                id="active"
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            <span className="ml-3 text-sm font-bold text-gray-700">Enlace Activo</span>
                        </label>
                    </div>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="flex-1 px-8 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all font-bold"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 px-10 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-black shadow-lg disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Enlace' : 'Añadir Enlace'}
                    </button>
                </div>
            </form>
        </div>
    )
}
