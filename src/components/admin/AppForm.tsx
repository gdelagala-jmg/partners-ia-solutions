'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState, useEffect } from 'react'
import { Upload, X, Loader2, Link as LinkIcon, Globe, FileText, LayoutGrid, Settings, Eye, CheckCircle2 } from 'lucide-react'
import dynamic from 'next/dynamic'
import AdminFormShell from './ui/AdminFormShell'
import AdminCard from './ui/AdminCard'
import { cn } from '@/lib/utils'

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

type AppFormValues = z.infer<typeof appSchema>

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
    const published = watch('published')

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
        <AdminFormShell
            title={initialData ? 'Editar Aplicación' : 'Nueva Aplicación'}
            description="Configura el acceso y la presencia visual de tu aplicación."
            onSubmit={handleSubmit(onSubmit)}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            submitLabel={initialData ? 'Guardar Cambios' : 'Crear Aplicación'}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Columna Principal */}
                <div className="lg:col-span-2 space-y-6">
                    <AdminCard title="Detalles de la Aplicación" icon={<LayoutGrid className="text-indigo-500" size={18} />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Nombre</label>
                                <input
                                    {...register('name')}
                                    onChange={(e) => { register('name').onChange(e); handleTitleChange(e) }}
                                    placeholder="Ej: Asistente Virtual Pro"
                                    className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-medium"
                                />
                                {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Slug / URL</label>
                                <div className="flex items-center group">
                                    <div className="bg-gray-100 border border-r-0 border-gray-200 rounded-l-xl px-3 py-2.5 text-[10px] text-gray-400 font-mono flex items-center gap-1.5">
                                        <Globe size={12} />
                                        <span>/apps/</span>
                                    </div>
                                    <input
                                        {...register('slug')}
                                        className="flex-1 bg-gray-50/50 border border-gray-200 rounded-r-xl px-4 py-2.5 text-sm text-gray-600 outline-none font-mono focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm"
                                    />
                                </div>
                                {errors.slug && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{errors.slug.message}</p>}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Descripción Corta</label>
                            <textarea
                                {...register('description')}
                                rows={3}
                                placeholder="Resumen rápido de la utilidad de la app..."
                                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none resize-none"
                            />
                        </div>
                    </AdminCard>

                    <AdminCard title="Landing Page (Contenido Propio)" icon={<FileText className="text-indigo-500" size={18} />} contentClassName="p-0">
                        <div className="min-h-[400px] prose-sm max-w-none">
                            <ReactQuill
                                theme="snow"
                                value={watch('content') || ''}
                                onChange={(val) => setValue('content', val)}
                                className="h-full border-none"
                                style={{ minHeight: '350px' }}
                            />
                        </div>
                        <div className="p-4 bg-amber-50/30 border-t border-amber-100/50 flex items-start gap-3">
                            <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600 mt-0.5">
                                <Settings size={14} />
                            </div>
                            <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
                                <span className="font-bold uppercase block mb-0.5">Nota de Visualización:</span>
                                Este contenido solo se mostrará si no se define una "URL Externa". Úsalo para crear una landing page interna dentro del ecosistema.
                            </p>
                        </div>
                    </AdminCard>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <AdminCard title="Estado y Acceso" icon={<Settings className="text-gray-400" size={18} />}>
                        <div className="space-y-6">
                            {/* Toggle de Publicación */}
                            <div className={cn(
                                "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                published ? "bg-emerald-50/50 border-emerald-100" : "bg-gray-50 border-gray-200"
                            )}>
                                <div className="space-y-0.5">
                                    <p className={cn("text-xs font-bold", published ? "text-emerald-900" : "text-gray-900")}>Visible en Apps</p>
                                    <p className={cn("text-[10px] font-medium uppercase tracking-tight", published ? "text-emerald-600" : "text-gray-500")}>
                                        {published ? 'Aplicación activa' : 'Acceso restringido'}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" {...register('published')} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                    <Globe size={14} /> URL Externa (Opcional)
                                </label>
                                <input
                                    {...register('externalUrl')}
                                    placeholder="https://app.tusitio.com"
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none font-medium"
                                />
                                <p className="text-[10px] text-gray-400 leading-tight italic px-1">
                                    Si se rellena, el botón de "Abrir App" llevará a esta URL externa.
                                </p>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                            <LayoutGrid size={14} className="text-gray-400" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Orden de Lista</span>
                                    </div>
                                    <input
                                        type="number"
                                        {...register('order', { valueAsNumber: true })}
                                        className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm text-center font-bold outline-none focus:ring-2 focus:ring-indigo-50 focus:border-indigo-400 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Imagen / Icono" icon={<ImageIcon className="text-indigo-500" size={18} />}>
                        <div className="space-y-4">
                            <div 
                                className={cn(
                                    "relative aspect-square rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 overflow-hidden bg-gray-50/50",
                                    imageUrl ? "border-solid border-gray-100 bg-white" : "border-gray-200 hover:border-indigo-300 hover:bg-white"
                                )}
                            >
                                {imageUrl ? (
                                    <>
                                        <img src={imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Icon" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button 
                                                type="button"
                                                onClick={() => setValue('image', null)}
                                                className="p-2.5 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform shadow-lg"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="flex flex-col items-center gap-2 px-4 text-center">
                                        <div className={cn(
                                            "p-4 rounded-2xl transition-all bg-white shadow-sm",
                                            uploading ? "animate-pulse" : ""
                                        )}>
                                            <Upload className={cn("w-6 h-6", uploading ? "text-indigo-500" : "text-gray-300")} />
                                        </div>
                                        <label className="cursor-pointer">
                                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter hover:underline">
                                                {uploading ? 'SUBIENDO...' : 'SUBIR ICONO'}
                                            </span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                                        </label>
                                    </div>
                                )}
                            </div>
                            
                            {/* Preview Card */}
                            <div className="pt-2">
                                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3 ml-1">Previsualización de Card</label>
                                <div className="aspect-[4/3] rounded-2xl bg-gray-900 overflow-hidden relative group shadow-lg">
                                    {imageUrl ? (
                                        <img src={imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" alt="Preview" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-700 uppercase font-black text-xl italic tracking-tighter bg-gray-800">
                                            Preview
                                        </div>
                                    )}
                                    <div className="absolute inset-0 p-4 flex flex-col justify-end bg-gradient-to-t from-black/90 via-black/40 to-transparent">
                                        <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-1 flex items-center gap-1.5">
                                            <Sparkles size={10} /> App
                                        </p>
                                        <h4 className="text-white font-bold text-sm truncate leading-tight">{watch('name') || 'Nombre de la App'}</h4>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AdminCard>
                </div>
            </div>
        </AdminFormShell>
    )
}
