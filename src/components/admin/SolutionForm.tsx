'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEffect, useState } from 'react'
import { 
    Check, 
    Plus, 
    Trash2, 
    Layout, 
    Settings, 
    Image as ImageIcon, 
    Briefcase, 
    HelpCircle, 
    Rocket, 
    Globe, 
    Link as LinkIcon,
    Layers,
    Tag,
    Star,
    Monitor,
    Zap,
    Upload,
    CheckCircle2
} from 'lucide-react'
import AdminFormShell from './ui/AdminFormShell'
import AdminCard from './ui/AdminCard'
import { cn } from '@/lib/utils'

const solutionSchema = z.object({
    title: z.string().min(1, 'El título es obligatorio'),
    slug: z.string().min(1, 'El slug es obligatorio'),
    description: z.string().min(1, 'La descripción es obligatoria'),
    type: z.enum(['SOLUTION', 'LAB']),
    multimedia: z.string().optional().nullable(),
    functionalDescription: z.string().optional().nullable(),
    problemsSolved: z.string().optional().nullable(),
    capabilities: z.string().optional().nullable(),
    workflowDescription: z.string().optional().nullable(),
    ctaUrl: z.string().optional().nullable(),
    published: z.boolean().optional(),
    featured: z.boolean().optional(),
    featuredOrder: z.number().optional().nullable(),
    sectorIds: z.array(z.string()).optional(),
    gallery: z.array(z.object({
        url: z.string().min(1, 'URL es obligatoria'),
        alt: z.string().optional().nullable(),
        isPrimary: z.boolean().optional(),
    })).optional()
})

type SolutionFormValues = z.infer<typeof solutionSchema>

export default function SolutionForm({ initialData, onSubmit, onCancel }: any) {
    const [sectors, setSectors] = useState<any[]>([])
    const [uploadingImage, setUploadingImage] = useState<number | null>(null)
    const [newSectorName, setNewSectorName] = useState('')
    const [creatingSector, setCreatingSector] = useState(false)

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
        fetch('/api/sectors')
            .then(res => res.json())
            .then(data => setSectors(data))
            .catch(err => console.error(err))
    }, [])

    const selectedSectorIds = watch('sectorIds') || []
    const isFeatured = watch('featured')
    const published = watch('published')

    const toggleSector = (id: string) => {
        const current = selectedSectorIds
        const newSelection = current.includes(id)
            ? current.filter(i => i !== id)
            : [...current, id]
        setValue('sectorIds', newSelection, { shouldValidate: true })
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!initialData) {
            const slugVal = e.target.value
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
            setValue('slug', slugVal)
        }
    }

    const handleUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploadingImage(index)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })
            const data = await res.json()
            if (data.url) {
                setValue(`gallery.${index}.url`, data.url, { shouldValidate: true })
            } else {
                alert(data.error || 'Error al subir la imagen')
            }
        } catch (error) {
            alert('Error de conexión al subir la imagen')
        } finally {
            setUploadingImage(null)
        }
    }

    const handleCreateSector = async () => {
        if (!newSectorName.trim()) return
        setCreatingSector(true)
        try {
            const res = await fetch('/api/sectors', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: newSectorName, 
                    image: '/images/sectors/default.svg',
                    externalUrl: '#'
                })
            })
            if (res.ok) {
                const newSector = await res.json()
                setSectors([...sectors, newSector])
                const current = watch('sectorIds') || []
                setValue('sectorIds', [...current, newSector.id], { shouldValidate: true })
                setNewSectorName('')
            } else {
                alert('Error al crear sector.')
            }
        } catch (error) {
            alert('Error de conexión.')
        } finally {
            setCreatingSector(false)
        }
    }

    return (
        <AdminFormShell
            title={initialData ? 'Editar Solución' : 'Nueva Solución'}
            description={initialData ? `Optimizando detalles técnicos para ${initialData.title}` : 'Registra una nueva capacidad tecnológica en el catálogo'}
            onCancel={onCancel}
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            submitLabel={initialData ? 'Actualizar Solución' : 'Crear Solución'}
        >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Main Content Area - 8 Columns */}
                <div className="lg:col-span-8 space-y-6">
                    <AdminCard 
                        title="Identidad y Contenido" 
                        icon={<Layers className="text-indigo-600" size={18} />}
                    >
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2 space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">
                                        Título de la Solución Tecnológica
                                    </label>
                                    <input
                                        {...register('title')}
                                        onChange={(e) => {
                                            register('title').onChange(e)
                                            handleTitleChange(e)
                                        }}
                                        placeholder="Ej: Análisis Predictivo de Ventas"
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-lg font-black text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none"
                                    />
                                    {errors.title && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{errors.title.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                        <LinkIcon size={14} className="text-gray-300" /> Slug (Identificador URL)
                                    </label>
                                    <input
                                        {...register('slug')}
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono text-gray-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none"
                                    />
                                    {errors.slug && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{errors.slug.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                        <Monitor size={14} className="text-gray-300" /> Clasificación
                                    </label>
                                    <div className="relative group">
                                        <select
                                            {...register('type')}
                                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none appearance-none cursor-pointer"
                                        >
                                            <option value="SOLUTION">Solución Final</option>
                                            <option value="LAB">Prototipo LAB</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">
                                    Resumen Comercial y Valor de Mercado
                                </label>
                                <textarea
                                    {...register('description')}
                                    rows={3}
                                    placeholder="Breve explicación del valor de mercado..."
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none resize-none leading-relaxed"
                                />
                                {errors.description && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{errors.description.message}</p>}
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard 
                        title="Especificaciones de Valor" 
                        icon={<Zap className="text-indigo-600" size={18} />}
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                    <Settings size={14} className="text-gray-300" /> Descripción Técnica y Funcional
                                </label>
                                <textarea
                                    {...register('functionalDescription')}
                                    rows={4}
                                    placeholder="Explica la lógica técnica e integración..."
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none resize-none leading-relaxed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                    <HelpCircle size={14} className="text-gray-300" /> Problemas que Resuelve
                                </label>
                                <textarea
                                    {...register('problemsSolved')}
                                    rows={6}
                                    placeholder="Enumera los puntos de dolor específicos..."
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none resize-none leading-relaxed"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                    <Rocket size={14} className="text-gray-300" /> Capacidades Clave
                                </label>
                                <textarea
                                    {...register('capabilities')}
                                    rows={6}
                                    placeholder="Ventajas competitivas y funcionalidades estrella..."
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none resize-none leading-relaxed"
                                />
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard 
                        title="Galería Visual de la Solución" 
                        icon={<ImageIcon className="text-indigo-600" size={18} />}
                        noPadding
                    >
                        <div className="divide-y divide-gray-100">
                            {galleryFields.map((field, index) => (
                                <div key={field.id} className="p-5 flex flex-col sm:flex-row gap-6 items-start group hover:bg-gray-50/50 transition-colors">
                                    <div className="w-24 h-24 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 shadow-inner flex items-center justify-center group-hover:border-indigo-200 transition-colors">
                                        {watch(`gallery.${index}.url`) ? (
                                            <img src={watch(`gallery.${index}.url`)!} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <ImageIcon size={24} className="text-gray-300" />
                                        )}
                                    </div>
                                    <div className="flex-1 space-y-4 w-full">
                                        <div className="flex flex-col sm:flex-row gap-2">
                                            <div className="relative flex-1">
                                                <input
                                                    {...register(`gallery.${index}.url`)}
                                                    placeholder="URL de la imagen o subir..."
                                                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm font-mono"
                                                />
                                            </div>
                                            <label className={cn(
                                                "cursor-pointer px-4 py-2.5 rounded-xl transition-all text-[10px] font-bold whitespace-nowrap flex items-center justify-center gap-2 uppercase tracking-widest",
                                                uploadingImage === index ? "bg-indigo-100 text-indigo-400 animate-pulse" : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm"
                                            )}>
                                                {uploadingImage === index ? 'SUBIENDO' : <><Upload size={14} /> SUBIR</>}
                                                <input type="file" className="hidden" onChange={(e) => handleUpload(index, e)} disabled={uploadingImage === index} />
                                            </label>
                                        </div>
                                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                                            <input
                                                {...register(`gallery.${index}.alt`)}
                                                placeholder="Texto alternativo (SEO)..."
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
                                            />
                                            <label className="flex items-center gap-2 cursor-pointer px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors w-full sm:w-auto justify-center">
                                                <input type="checkbox" {...register(`gallery.${index}.isPrimary`)} className="rounded text-indigo-600 w-4 h-4" />
                                                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Principal</span>
                                            </label>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => removeGallery(index)}
                                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm hover:shadow-md self-end sm:self-start"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-center">
                            <button
                                type="button"
                                onClick={() => appendGallery({ url: '', alt: '', isPrimary: galleryFields.length === 0 })}
                                className="flex items-center justify-center gap-3 px-6 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-bold text-gray-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-white hover:shadow-sm transition-all uppercase tracking-[0.2em] w-full max-w-md"
                            >
                                <Plus size={16} /> Añadir nueva imagen a la galería
                            </button>
                        </div>
                    </AdminCard>
                </div>

                {/* Sidebar - 4 Columns */}
                <div className="lg:col-span-4 space-y-6">
                    <AdminCard title="Estado y Visibilidad" icon={<Settings className="text-gray-400" size={18} />}>
                        <div className="space-y-4">
                            <div className={cn(
                                "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                published ? "bg-emerald-50/50 border-emerald-100" : "bg-gray-50 border-gray-200"
                            )}>
                                <div className="space-y-0.5">
                                    <p className={cn("text-xs font-bold", published ? "text-emerald-900" : "text-gray-900")}>Visible Online</p>
                                    <p className={cn("text-[10px] font-bold uppercase tracking-tight", published ? "text-emerald-600" : "text-gray-500")}>
                                        {published ? 'Solución Publicada' : 'Modo Borrador'}
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input type="checkbox" {...register('published')} className="sr-only peer" />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>

                            <div className={cn(
                                "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                isFeatured ? "bg-amber-50/50 border-amber-100 shadow-sm" : "bg-white border-gray-100"
                            )}>
                                <div className="space-y-0.5 flex items-center gap-3">
                                    <div className={cn(
                                        "p-2.5 rounded-xl transition-all",
                                        isFeatured ? "bg-amber-500 text-white shadow-md shadow-amber-200" : "bg-gray-100 text-gray-400"
                                    )}>
                                        <Star size={18} />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-gray-900">Destacar en Home</p>
                                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight italic">Estratégico</p>
                                    </div>
                                </div>
                                <input 
                                    type="checkbox" 
                                    {...register('featured')} 
                                    className="w-6 h-6 rounded-lg border-gray-300 text-amber-500 focus:ring-amber-500 transition-all cursor-pointer"
                                />
                            </div>

                            {isFeatured && (
                                <div className="animate-in slide-in-from-top-1 duration-200 space-y-2 pt-2">
                                    <label className="block text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1 ml-1">Orden de Destaque Prioritario</label>
                                    <div className="relative">
                                        <select
                                            {...register('featuredOrder', { setValueAs: v => v === "" || isNaN(parseInt(v, 10)) ? null : parseInt(v, 10) })}
                                            className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-4 py-2.5 text-sm text-amber-900 font-black focus:ring-4 focus:ring-amber-100 outline-none transition-all appearance-none cursor-pointer"
                                        >
                                            <option value="">Automático</option>
                                            <option value="1">1 - Prioridad Máxima</option>
                                            <option value="2">2 - Prioridad Alta</option>
                                            <option value="3">3 - Prioridad Media</option>
                                            <option value="4">4 - Prioridad Baja</option>
                                        </select>
                                        <Layers size={14} className="absolute right-4 top-3 text-amber-400 pointer-events-none" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </AdminCard>

                    <AdminCard title="Conversión y Enlaces" icon={<Globe className="text-indigo-600" size={18} />}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Call to Action (Botón Directo)</label>
                                <div className="relative group">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500">
                                        <LinkIcon size={14} />
                                    </div>
                                    <input
                                        {...register('ctaUrl')}
                                        placeholder="https://..."
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none font-bold"
                                    />
                                </div>
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Multimedia de Respaldo (Local)</label>
                                <input
                                    {...register('multimedia')}
                                    placeholder="/images/visuals/fallback.jpg"
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-[10px] font-mono text-gray-500 focus:text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all shadow-sm outline-none"
                                />
                                <p className="text-[9px] text-gray-400 mt-2 italic px-1 leading-tight">
                                    * Este recurso visual se usará como alternativa si la galería principal no contiene imágenes válidas.
                                </p>
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Sectores de Aplicación" icon={<Tag className="text-indigo-600" size={18} />}>
                        <div className="space-y-6">
                            <div className="flex flex-wrap gap-2">
                                {sectors.map(sector => {
                                    const isSelected = selectedSectorIds.includes(sector.id)
                                    return (
                                        <button
                                            key={sector.id}
                                            type="button"
                                            onClick={() => toggleSector(sector.id)}
                                            className={cn(
                                                "px-3 py-2 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border flex items-center gap-2 group",
                                                isSelected 
                                                    ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" 
                                                    : "bg-gray-50/50 border-gray-100 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-white"
                                            )}
                                        >
                                            {isSelected && <CheckCircle2 size={12} />}
                                            {sector.name}
                                        </button>
                                    )
                                })}
                                {sectors.length === 0 && <p className="text-[10px] text-gray-400 italic font-bold">Cargando sectores estratégicos...</p>}
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        placeholder="Nuevo sector..." 
                                        value={newSectorName}
                                        onChange={(e) => setNewSectorName(e.target.value)}
                                        className="flex-1 bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all font-bold placeholder:font-normal"
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                handleCreateSector()
                                            }
                                        }}
                                    />
                                    <button 
                                        type="button"
                                        onClick={handleCreateSector}
                                        disabled={creatingSector || !newSectorName.trim()}
                                        className="px-5 py-2.5 bg-gray-900 text-white text-[10px] font-bold uppercase rounded-xl hover:bg-black disabled:opacity-50 transition-all shadow-sm tracking-widest"
                                    >
                                        {creatingSector ? '...' : 'Añadir'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </AdminCard>
                </div>
            </div>
        </AdminFormShell>
    )
}
