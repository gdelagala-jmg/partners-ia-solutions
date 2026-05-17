'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEffect, useState } from 'react'
import { Upload, X, Globe, Tag, FileText, Settings, Image as ImageIcon, ExternalLink, CheckCircle2 } from 'lucide-react'
import AdminFormShell from './ui/AdminFormShell'
import AdminCard from './ui/AdminCard'
import { cn } from '@/lib/utils'

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
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<SectorFormValues>({
        resolver: zodResolver(sectorSchema),
        defaultValues: {
            active: true,
            order: 0,
            ...initialData
        }
    })

    const imageUrl = watch('image')
    const active = watch('active')
    const [uploading, setUploading] = useState(false)

    // Auto-generate slug from name
    const nameValue = watch('name')
    useEffect(() => {
        if (nameValue && !initialData) {
            const slug = nameValue.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
            setValue('slug', slug)
        }
    }, [nameValue, initialData, setValue])

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)
        try {
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            if (!res.ok) throw new Error('Upload failed')
            const data = await res.json()
            setValue('image', data.url)
        } catch (error) {
            alert('Error al subir la imagen')
        } finally {
            setUploading(false)
        }
    }

    const onLocalSubmit = (data: SectorFormValues) => {
        let finalUrl = data.externalUrl
        if (finalUrl && !finalUrl.startsWith('http://') && !finalUrl.startsWith('https://')) {
            finalUrl = `https://${finalUrl}`
        }
        try {
            new URL(finalUrl)
        } catch (e) {
            alert('URL externa no es válida.')
            return
        }
        onSubmit({ ...data, externalUrl: finalUrl })
    }

    return (
        <AdminFormShell
            title={initialData ? 'Editar Sector' : 'Nuevo Sector'}
            description="Gestiona las categorías de industria y sus enlaces de redirección."
            onSubmit={handleSubmit(onLocalSubmit)}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            submitLabel={initialData ? 'Guardar Cambios' : 'Crear Sector'}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <AdminCard title="Información del Sector" icon={<Tag className="text-indigo-500" size={18} />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Nombre del Sector *</label>
                                <input
                                    {...register('name')}
                                    placeholder="Ej: Finanzas"
                                    className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-medium"
                                />
                                {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                    <Globe size={12} /> Slug (URL)
                                </label>
                                <input
                                    {...register('slug')}
                                    placeholder="ej-finanzas"
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none font-mono focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                <FileText size={12} /> Descripción (Opcional)
                            </label>
                            <textarea
                                {...register('description')}
                                rows={4}
                                placeholder="Breve descripción del impacto de la IA en este sector..."
                                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none resize-none"
                            />
                        </div>
                    </AdminCard>

                    <AdminCard title="Redirección Externa" icon={<ExternalLink className="text-indigo-500" size={18} />}>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                    <Globe size={12} /> URL de Destino *
                                </label>
                                <input
                                    {...register('externalUrl')}
                                    placeholder="https://..."
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none font-mono font-medium"
                                />
                                <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start gap-3 mt-2">
                                    <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-600 mt-0.5">
                                        <ExternalLink size={14} />
                                    </div>
                                    <p className="text-[10px] text-indigo-700 leading-relaxed font-medium">
                                        Al hacer clic en este sector en la plataforma pública, los usuarios serán redirigidos automáticamente a esta dirección. Asegúrate de incluir el protocolo (http/https).
                                    </p>
                                </div>
                                {errors.externalUrl && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{errors.externalUrl.message}</p>}
                            </div>
                        </div>
                    </AdminCard>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <AdminCard title="Estado y Orden" icon={<Settings className="text-gray-400" size={18} />}>
                        <div className="space-y-6">
                            <div className={cn(
                                "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                active ? "bg-emerald-50/50 border-emerald-100" : "bg-gray-50 border-gray-200"
                            )}>
                                <div className="space-y-0.5">
                                    <p className={cn("text-xs font-bold", active ? "text-emerald-900" : "text-gray-900")}>Sector Activo</p>
                                    <p className={cn("text-[10px] font-medium uppercase tracking-tight", active ? "text-emerald-600" : "text-gray-500")}>
                                        {active ? 'Visible en filtros' : 'Oculto'}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" {...register('active')} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <div className="flex items-center justify-between p-3 rounded-xl bg-gray-50/50 border border-gray-100">
                                    <div className="flex items-center gap-2">
                                        <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                            <Settings size={14} className="text-gray-400" />
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Orden Visual</span>
                                    </div>
                                    <input
                                        type="number"
                                        {...register('order')}
                                        className="w-16 bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm text-center font-bold outline-none focus:ring-2 focus:ring-indigo-50 focus:border-indigo-400 transition-all"
                                    />
                                </div>
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Imagen de Portada" icon={<ImageIcon className="text-indigo-500" size={18} />}>
                        <div className="space-y-4">
                            <div 
                                className={cn(
                                    "relative aspect-video rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 overflow-hidden bg-gray-50/50",
                                    imageUrl ? "border-solid border-gray-100 bg-white" : "border-gray-200 hover:border-indigo-300 hover:bg-white"
                                )}
                            >
                                {imageUrl ? (
                                    <>
                                        <img src={imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Sector" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button 
                                                type="button"
                                                onClick={() => setValue('image', '')}
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
                                                {uploading ? 'SUBIENDO...' : 'SUBIR IMAGEN'}
                                            </span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                        </label>
                                    </div>
                                )}
                            </div>
                            <input {...register('image')} type="hidden" />
                            {errors.image && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic text-center">{errors.image.message}</p>}
                        </div>
                    </AdminCard>
                </div>
            </div>
        </AdminFormShell>
    )
}
