'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEffect, useState } from 'react'
import { 
    Upload, X, Globe, Tag, FileText, Settings, 
    Image as ImageIcon, ExternalLink, CheckCircle2, 
    ArrowRight, Loader2, AlertCircle 
} from 'lucide-react'
import AdminFormShell from './ui/AdminFormShell'
import AdminCard from './ui/AdminCard'
import { cn } from '@/lib/utils'

// Consolidated abstractions (Wave 6)
import AdminEditorLayout from './ui/AdminEditorLayout'
import StickyActionBar from './ui/StickyActionBar'
import { useFormTelemetry } from '@/hooks/useFormTelemetry'

const sectorSchema = z.object({
    name: z.string().min(2, 'El nombre es obligatorio (mínimo 2 caracteres)'),
    slug: z.string().min(1, 'El slug es obligatorio'),
    image: z.string().min(1, 'La imagen es obligatoria'),
    externalUrl: z.string().min(1, 'La URL de redirección externa es obligatoria'),
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
            slug: '',
            image: '',
            externalUrl: '',
            description: '',
            ...initialData
        }
    })

    const nameVal = watch('name') || ''
    const slugVal = watch('slug') || ''
    const descriptionVal = watch('description') || ''
    const imageVal = watch('image') || ''
    const externalUrlVal = watch('externalUrl') || ''
    const activeVal = watch('active') || false
    const [uploading, setUploading] = useState(false)

    // Auto-generate slug from name during creation
    useEffect(() => {
        if (nameVal && !initialData) {
            const slug = nameVal.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
            setValue('slug', slug, { shouldValidate: true })
        }
    }, [nameVal, initialData, setValue])

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
            setValue('image', data.url, { shouldValidate: true })
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
            alert('La URL externa ingresada no es válida.')
            return
        }
        onSubmit({ ...data, externalUrl: finalUrl })
    }

    // MANDATORY BEHAVIOR FOR VALIDATION FAILURES
    const onError = (formErrors: any) => {
        console.error('Validation errors inside SectorForm:', formErrors)
        
        // Smooth scroll and focus the first invalid element
        setTimeout(() => {
            const firstErrorKey = Object.keys(formErrors)[0]
            if (firstErrorKey) {
                const element = document.getElementsByName(firstErrorKey)[0] || document.getElementById(firstErrorKey)
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
                    element.focus({ preventScroll: true })
                }
            }
        }, 100)
    }

    // Custom Telemetry Matrix for Sector Completeness
    const telemetryMatrix = [
        {
            key: 'name',
            weight: 30,
            label: 'Definir el nombre de sector',
            validate: (val: any) => typeof val === 'string' && val.trim().length >= 2
        },
        {
            key: 'slug',
            weight: 20,
            label: 'Configurar identificador slug',
            validate: (val: any) => typeof val === 'string' && val.trim().length > 0
        },
        {
            key: 'description',
            weight: 20,
            label: 'Añadir breve descripción comercial',
            validate: (val: any) => typeof val === 'string' && val.trim().length > 0
        },
        {
            key: 'image',
            weight: 15,
            label: 'Cargar logotipo / imagen representativa',
            validate: (val: any) => typeof val === 'string' && val.trim().length > 0
        },
        {
            key: 'externalUrl',
            weight: 15,
            label: 'Asignar URL de redirección externa',
            validate: (val: any) => typeof val === 'string' && val.trim().length > 0
        }
    ]

    const { score: sectorScore, pendingSuggestions: pendingDetails } = useFormTelemetry(
        {
            name: nameVal,
            slug: slugVal,
            description: descriptionVal,
            image: imageVal,
            externalUrl: externalUrlVal
        },
        telemetryMatrix
    )

    return (
        <AdminFormShell
            title={initialData ? 'Editar Sector' : 'Nuevo Sector'}
            description="Gestiona las categorías de industria y sus enlaces de redirección."
            actions={<div className="hidden" />}
            footerClassName="hidden"
        >
            <AdminEditorLayout
                telemetry={
                    <div className="premium-white-surface p-6 flex flex-wrap items-center justify-between gap-6 border border-gray-150 rounded-2xl shadow-sm bg-white">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado:</span>
                            {activeVal ? (
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                    Filtro Activo
                                </span>
                            ) : (
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                    Desactivado
                                </span>
                            )}
                        </div>

                        <div className="flex-1 max-w-md flex items-center gap-4">
                            <div className="w-full">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-1.5">
                                    <span className="text-gray-400">Compleción del Sector</span>
                                    <span className={cn(
                                        "text-xs font-black",
                                        sectorScore >= 80 ? "text-emerald-500" : (sectorScore >= 50 ? "text-amber-500" : "text-red-500")
                                    )}>
                                        {sectorScore}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-150 shadow-inner">
                                    <div 
                                        className={cn(
                                            "h-full transition-all duration-500 rounded-full",
                                            sectorScore >= 80 ? "bg-emerald-500" : (sectorScore >= 50 ? "bg-amber-500" : "bg-red-500")
                                        )}
                                        style={{ width: `${sectorScore}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                        
                        {pendingDetails.length > 0 && (
                            <div className="text-[10px] font-bold text-gray-400 italic">
                                Sugerencia: {pendingDetails[0]}
                            </div>
                        )}
                    </div>
                }
                sidebar={
                    <>
                        {/* Tarjeta 1: Estado y Orden visual */}
                        <AdminCard title="Estado y Orden" icon={<Settings className="text-gray-400" size={18} />}>
                            <div className="space-y-6">
                                <div className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                    activeVal ? "bg-emerald-50/50 border-emerald-100" : "bg-gray-50 border-gray-200"
                                )}>
                                    <div className="space-y-0.5">
                                        <p className={cn("text-xs font-bold", activeVal ? "text-emerald-900" : "text-gray-900")}>Sector Activo</p>
                                        <p className={cn("text-[9px] font-bold uppercase tracking-wider", activeVal ? "text-emerald-600" : "text-gray-500")}>
                                            {activeVal ? 'Visible en Filtros' : 'Oculto'}
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer select-none">
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

                        {/* Tarjeta 2: Imagen / Logotipo del Sector */}
                        <AdminCard title="Imagen de Portada" icon={<ImageIcon className="text-indigo-500" size={18} />}>
                            <div className="space-y-4">
                                <div 
                                    className={cn(
                                        "relative aspect-video rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 overflow-hidden bg-gray-50/50",
                                        imageVal ? "border-solid border-gray-100 bg-white" : "border-gray-200 hover:border-indigo-300 hover:bg-white"
                                    )}
                                >
                                    {imageVal ? (
                                        <>
                                            <img src={imageVal} className="absolute inset-0 w-full h-full object-cover" alt="Sector" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                                <button 
                                                    type="button"
                                                    onClick={() => setValue('image', '', { shouldValidate: true })}
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
                                                {uploading ? <Loader2 className="animate-spin text-indigo-500" size={24} /> : <Upload className="w-6 h-6 text-gray-300" />}
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
                    </>
                }
            >
                {/* Tarjeta 1: Identidad del Sector */}
                <AdminCard title="Información del Sector" icon={<Tag className="text-indigo-500" size={18} />}>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Nombre del Sector *</label>
                                <input
                                    {...register('name')}
                                    onChange={(e) => {
                                        register('name').onChange(e)
                                        setValue('name', e.target.value)
                                    }}
                                    placeholder="Ej: Finanzas"
                                    className={cn(
                                        "w-full border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-medium outline-none",
                                        errors.name ? "border-red-300 bg-red-50/10" : "bg-gray-50/50 border-gray-200 text-gray-900"
                                    )}
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
                                    className={cn(
                                        "w-full border rounded-xl px-4 py-2.5 text-sm text-gray-600 outline-none font-mono focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm",
                                        errors.slug ? "border-red-300 bg-red-50/10" : "bg-gray-50/50 border-gray-200 text-gray-500"
                                    )}
                                />
                                {errors.slug && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{errors.slug.message}</p>}
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
                                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none resize-none leading-relaxed"
                            />
                        </div>
                    </div>
                </AdminCard>

                {/* Tarjeta 2: Enlace Externo */}
                <AdminCard title="Redirección Externa" icon={<ExternalLink className="text-indigo-500" size={18} />}>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                <Globe size={12} /> URL de Destino *
                            </label>
                            <input
                                {...register('externalUrl')}
                                placeholder="https://..."
                                className={cn(
                                    "w-full border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none font-mono font-medium",
                                    errors.externalUrl ? "border-red-300 bg-red-50/10" : "bg-gray-50/50 border-gray-200 text-gray-900"
                                )}
                            />
                            <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex items-start gap-3 mt-2">
                                <div className="p-1.5 bg-indigo-100 rounded-lg text-indigo-650 mt-0.5 shrink-0">
                                    <ExternalLink size={14} />
                                </div>
                                <p className="text-[10px] text-indigo-700 leading-relaxed font-semibold">
                                    Al hacer clic en este sector en la plataforma pública, los usuarios serán redirigidos automáticamente a esta dirección. Asegúrate de incluir el protocolo (http/https).
                                </p>
                            </div>
                            {errors.externalUrl && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{errors.externalUrl.message}</p>}
                        </div>
                    </div>
                </AdminCard>
            </AdminEditorLayout>

            {/* Sticky Action Bar */}
            <StickyActionBar
                primaryAction={
                    <button
                        type="button"
                        onClick={handleSubmit(onLocalSubmit, onError)}
                        disabled={isSubmitting || uploading}
                        className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                        <span>{initialData ? 'Guardar Cambios' : 'Crear Sector'}</span>
                    </button>
                }
            >
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 bg-white border border-gray-250 hover:border-gray-300 rounded-xl transition-all shadow-sm"
                >
                    Cancelar
                </button>
            </StickyActionBar>
        </AdminFormShell>
    )
}
