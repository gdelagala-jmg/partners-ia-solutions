'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState, useEffect } from 'react'
import { Upload, X, Loader2, Link as LinkIcon, Globe, FileText, LayoutGrid } from 'lucide-react'
import dynamic from 'next/dynamic'

const ReactQuill = dynamic(() => import('react-quill-new'), {
    ssr: false,
    loading: () => <div className="h-48 bg-gray-50 border border-gray-200 rounded-lg animate-pulse" />,
})

const appSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    slug: z.string().min(1, 'El slug es obligatorio'),
    description: z.string().optional().nullable(),
    image: z.string().optional().nullable(),
    externalUrl: z.string().optional().nullable(),
    content: z.string().optional().nullable(),
    published: z.boolean().optional(),
    order: z.number().default(0),
})

type AppFormValues = any

export default function AppForm({ initialData, onSubmit, onCancel }: any) {
    const [uploading, setUploading] = useState(false)

    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<AppFormValues>({
        resolver: zodResolver(appSchema),
        defaultValues: initialData ? {
            ...initialData,
            order: Number(initialData.order || 0),
        } : {
            name: '',
            slug: '',
            published: false,
            order: 0,
        },
    })

    const imageUrl = watch('image')

    const handleTitleChange = (e: any) => {
        if (!initialData) {
            const slugVal = e.target.value.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/ /g, '-').replace(/[^\w-]+/g, '')
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
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error || 'Upload failed')
            setValue('image', data.url)
        } catch (err: any) {
            alert(err.message || 'Error al subir la imagen')
        } finally {
            setUploading(false)
        }
    }

    // Inject quill css
    useEffect(() => {
        const id = 'quill-css'
        if (!document.getElementById(id)) {
            const link = document.createElement('link')
            link.id = id
            link.rel = 'stylesheet'
            link.href = 'https://cdn.quilljs.com/1.3.7/quill.snow.css'
            document.head.appendChild(link)
        }
    }, [])

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 border-b border-gray-50 pb-6 mb-6">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <LayoutGrid size={24} />
                </div>
                <div>
                    <h2 className="text-xl font-bold text-gray-900">Configuración de la Aplicación</h2>
                    <p className="text-sm text-gray-500">Define los detalles básicos y la visibilidad de tu app.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nombre de la App</label>
                    <input
                        {...register('name')}
                        onChange={(e) => { register('name').onChange(e); handleTitleChange(e) }}
                        placeholder="Ej: Chatbot Avanzado"
                        className="block w-full bg-white border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-sm"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1.5 ml-1">{(errors.name as any).message}</p>}
                </div>
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Slug / URL amigable</label>
                    <div className="relative">
                        <span className="absolute left-4 inset-y-0 flex items-center text-gray-400 text-sm">/apps/</span>
                        <input
                            {...register('slug')}
                            className="block w-full bg-gray-50 border-gray-300 rounded-xl pl-16 pr-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                        />
                    </div>
                    {errors.slug && <p className="text-red-500 text-xs mt-1.5 ml-1">{(errors.slug as any).message}</p>}
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Descripción Corta</label>
                <textarea
                    {...register('description')}
                    rows={2}
                    placeholder="Breve explicación de lo que hace la aplicación..."
                    className="block w-full bg-white border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-sm"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Globe size={16} className="text-blue-500" /> Integración Externa (URL)
                    </label>
                    <input
                        {...register('externalUrl')}
                        placeholder="https://tu-app-externa.com"
                        className="block w-full bg-white border-gray-300 rounded-xl px-4 py-3 text-gray-900 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none shadow-sm"
                    />
                    <p className="text-[11px] text-gray-500 mt-2 ml-1 italic">
                        * Si incluyes una URL, la app abrirá esta web (o la integrará). Si la dejas vacía, se usará la Landing Page propia creada abajo.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        <Upload size={16} className="text-blue-500" /> Icono o Imagen de Portada
                    </label>
                    <div className="flex items-center gap-4">
                        <label className="flex-1 cursor-pointer bg-gray-50 hover:bg-gray-100 text-gray-600 border-2 border-dashed border-gray-200 px-4 py-3 rounded-xl transition-all flex items-center justify-center gap-2 group">
                            {uploading ? (
                                <Loader2 size={18} className="animate-spin text-blue-500" />
                            ) : (
                                <Upload size={18} className="group-hover:text-blue-500 transition-colors" />
                            )}
                            <span className="text-sm font-medium">{uploading ? 'Subiendo...' : 'Subir Imagen'}</span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                        </label>
                        {imageUrl && (
                            <div className="h-14 w-14 rounded-xl border border-gray-200 overflow-hidden bg-white shadow-sm shrink-0">
                                <img src={imageUrl} alt="Port" className="h-full w-full object-cover" />
                            </div>
                        )}
                    </div>
                    <input {...register('image')} type="hidden" />
                </div>
            </div>

            <div className="space-y-3">
                <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <FileText size={16} className="text-blue-500" /> Contenido de la Landing Page Propia
                </label>
                <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
                    <ReactQuill
                        theme="snow"
                        value={watch('content') || ''}
                        onChange={(val) => setValue('content', val)}
                        style={{ height: '300px', background: 'white' }}
                    />
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-6 mt-6 border-t border-gray-50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3 bg-gray-50 px-4 py-2 rounded-xl border border-gray-100">
                        <input
                            type="checkbox"
                            id="published"
                            {...register('published')}
                            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer transition-all"
                        />
                        <label htmlFor="published" className="text-sm font-bold text-gray-700 cursor-pointer">
                            Visible / Activa
                        </label>
                    </div>

                    <div className="flex items-center gap-3">
                        <label className="text-sm font-bold text-gray-700">Orden:</label>
                        <input
                            type="number"
                            {...register('order', { valueAsNumber: true })}
                            className="w-16 bg-white border-gray-300 rounded-lg px-2 py-1 text-center text-sm font-bold focus:ring-blue-500 outline-none"
                        />
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-6 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-black shadow-lg shadow-blue-100 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:pointer-events-none"
                    >
                        {isSubmitting ? (
                            <span className="flex items-center gap-2">
                                <Loader2 size={16} className="animate-spin" />
                                Guardando...
                            </span>
                        ) : (
                            'Guardar Aplicación'
                        )}
                    </button>
                </div>
            </div>
        </form>
    )
}
