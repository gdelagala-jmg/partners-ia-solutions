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
    CheckCircle2,
    X,
    ChevronDown,
    ChevronUp,
    ChevronLeft,
    ChevronRight,
    AlertCircle,
    Eye,
    Loader2,
    Sparkles,
    Target,
    Shield,
    FileText
} from 'lucide-react'
import AdminFormShell from './ui/AdminFormShell'
import AdminCard from './ui/AdminCard'
import { cn } from '@/lib/utils'

// Consolidated architectural assets (Wave 6)
import AdminEditorLayout from './ui/AdminEditorLayout'
import StickyActionBar from './ui/StickyActionBar'
import FormAccordion from './ui/FormAccordion'
import { useFormTelemetry } from '@/hooks/useFormTelemetry'

const solutionSchema = z.object({
    title: z.string().min(1, 'El título es obligatorio'),
    slug: z.string().min(1, 'El slug es obligatorio'),
    description: z.string().min(1, 'La descripción comercial es obligatoria'),
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
        url: z.string().min(1, 'La URL de la imagen es obligatoria'),
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
    const [showPreview, setShowPreview] = useState(false)
    const [previewImageIdx, setPreviewImageIdx] = useState(0)

    // Option B: Collapsible blocks toggle values
    const [activeBlocks, setActiveBlocks] = useState<Record<string, boolean>>({
        description: true,
        problems: false,
        capabilities: false,
        specs: false,
    })

    const toggleBlock = (key: string) => {
        setActiveBlocks(prev => ({
            ...prev,
            [key]: !prev[key]
        }))
    }

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

    // Watches for telemetry
    const titleVal = watch('title') || ''
    const slugVal = watch('slug') || ''
    const typeVal = watch('type') || 'SOLUTION'
    const descriptionVal = watch('description') || ''
    const problemsVal = watch('problemsSolved') || ''
    const capabilitiesVal = watch('capabilities') || ''
    const functionalVal = watch('functionalDescription') || ''
    const ctaVal = watch('ctaUrl') || ''
    const sectorIdsVal = watch('sectorIds') || []
    const galleryVal = watch('gallery') || []
    const publishedVal = watch('published') || false
    const isFeatured = watch('featured') || false

    const toggleSector = (id: string) => {
        const current = sectorIdsVal
        const newSelection = current.includes(id)
            ? current.filter(i => i !== id)
            : [...current, id]
        setValue('sectorIds', newSelection, { shouldValidate: true })
    }

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!initialData) {
            const generatedSlug = e.target.value
                .toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '')
            setValue('slug', generatedSlug, { shouldValidate: true })
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

    // Dynamic Solution Quality Score Telemetry using our generic useFormTelemetry hook
    const telemetryMatrix = [
        {
            key: 'title',
            weight: 15,
            label: 'Añadir título principal',
            validate: (val: any) => typeof val === 'string' && val.trim().length > 0
        },
        {
            key: 'description',
            weight: 15,
            label: 'Completar la descripción comercial',
            validate: (val: any) => typeof val === 'string' && val.trim().length > 0
        },
        {
            key: 'problemsSolved',
            weight: 15,
            label: 'Completar los problemas que resuelve',
            validate: (val: any) => typeof val === 'string' && val.trim().length > 0
        },
        {
            key: 'capabilities',
            weight: 15,
            label: 'Listar las capacidades clave',
            validate: (val: any) => typeof val === 'string' && val.trim().length > 0
        },
        {
            key: 'functionalDescription',
            weight: 15,
            label: 'Explicar la ingeniería de valor / ventajas',
            validate: (val: any) => typeof val === 'string' && val.trim().length > 0
        },
        {
            key: 'gallery',
            weight: 10,
            label: 'Cargar al menos 1 imagen comercial',
            validate: (val: any) => Array.isArray(val) && val.length > 0 && val.some((img: any) => img.url)
        },
        {
            key: 'sectorIds',
            weight: 10,
            label: 'Clasificar en al menos 1 sector',
            validate: (val: any) => Array.isArray(val) && val.length > 0
        },
        {
            key: 'ctaUrl',
            weight: 5,
            label: 'Añadir enlace de llamada a la acción (CTA)',
            validate: (val: any) => typeof val === 'string' && val.trim().length > 0
        }
    ]

    const { score: solutionScore, pendingSuggestions: pendingDetails } = useFormTelemetry(
        {
            title: titleVal,
            description: descriptionVal,
            problemsSolved: problemsVal,
            capabilities: capabilitiesVal,
            functionalDescription: functionalVal,
            gallery: galleryVal,
            sectorIds: sectorIdsVal,
            ctaUrl: ctaVal
        },
        telemetryMatrix
    )

    // Primary publication states
    const getStatus = () => {
        if (!publishedVal) return 'DRAFT'
        return typeVal === 'SOLUTION' ? 'SOLUTION_LIVE' : 'LAB_LIVE'
    }
    const status = getStatus()

    // Secondary save action as Draft
    const handleSaveAsDraft = () => {
        setValue('published', false)
        handleSubmit(onSubmit, onError)()
    }

    // MANDATORY BEHAVIOR FOR VALIDATION FAILURES
    const onError = (formErrors: any) => {
        console.error('Validation errors found:', formErrors)
        
        // Auto-expand all blocks containing validation issues
        const newActive = { ...activeBlocks }
        let expandedAny = false

        if (formErrors.title || formErrors.slug || formErrors.description) {
            newActive.description = true
            expandedAny = true
        }
        if (formErrors.problemsSolved) {
            newActive.problems = true
            expandedAny = true
        }
        if (formErrors.capabilities) {
            newActive.capabilities = true
            expandedAny = true
        }
        if (formErrors.functionalDescription) {
            newActive.specs = true
            expandedAny = true
        }

        if (expandedAny) {
            setActiveBlocks(newActive)
        }

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

    return (
        <AdminFormShell
            title={initialData ? 'Editar Solución' : 'Nueva Solución'}
            description={initialData ? `ID: ${initialData.id}` : 'Registra un servicio de inteligencia artificial premium'}
            actions={<div className="hidden" />}
            footerClassName="hidden"
        >
            <AdminEditorLayout
                telemetry={
                    <div className="premium-white-surface p-6 flex flex-wrap items-center justify-between gap-6 border border-gray-150 rounded-2xl shadow-sm">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Canal:</span>
                            {status === 'DRAFT' && (
                                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-250 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                    Borrador
                                </span>
                            )}
                            {status === 'SOLUTION_LIVE' && (
                                <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                    Catálogo Live
                                </span>
                            )}
                            {status === 'LAB_LIVE' && (
                                <span className="px-2.5 py-1 bg-purple-50 text-purple-700 border border-purple-100 rounded-lg text-[10px] font-black uppercase tracking-wider animate-pulse">
                                    Prototipo LAB
                                </span>
                            )}
                        </div>

                        <div className="flex-1 max-w-md flex items-center gap-4">
                            <div className="w-full">
                                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-1.5">
                                    <span className="text-gray-400">Completitud Comercial</span>
                                    <span className={cn(
                                        "text-xs font-black",
                                        solutionScore >= 80 ? "text-emerald-500" : (solutionScore >= 50 ? "text-amber-500" : "text-red-500")
                                    )}>
                                        {solutionScore}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden border border-gray-150 shadow-inner">
                                    <div 
                                        className={cn(
                                            "h-full transition-all duration-500 rounded-full",
                                            solutionScore >= 80 ? "bg-emerald-500" : (solutionScore >= 50 ? "bg-amber-500" : "bg-red-500")
                                        )}
                                        style={{ width: `${solutionScore}%` }}
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
                        {/* Tarjeta 1: Estado y Visibilidad */}
                        <AdminCard title="Canales & Estado" icon={<Settings className="text-gray-400" size={18} />}>
                            <div className="space-y-4">
                                <div className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                    publishedVal ? "bg-emerald-50/50 border-emerald-100" : "bg-gray-50 border-gray-200"
                                )}>
                                    <div className="space-y-0.5">
                                        <p className={cn("text-xs font-bold", publishedVal ? "text-emerald-950" : "text-gray-900")}>Visible Online</p>
                                        <p className={cn("text-[9px] font-bold uppercase tracking-wider", publishedVal ? "text-emerald-600" : "text-gray-500")}>
                                            {publishedVal ? 'Publicada en Catálogo' : 'Borrador Privado'}
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer select-none">
                                        <input type="checkbox" {...register('published')} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                    </label>
                                </div>

                                <div className={cn(
                                    "flex items-center justify-between p-4 rounded-2xl border transition-all",
                                    isFeatured ? "bg-amber-50/40 border-amber-100 shadow-xs" : "bg-white border-gray-150"
                                )}>
                                    <div className="flex items-center gap-3">
                                        <div className={cn(
                                            "p-2 rounded-xl transition-all",
                                            isFeatured ? "bg-amber-500 text-white shadow-md shadow-amber-200" : "bg-gray-100 text-gray-400"
                                        )}>
                                            <Star size={16} />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-950">Destacar en Home</p>
                                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Estratégico</p>
                                        </div>
                                    </div>
                                    <input 
                                        type="checkbox" 
                                        {...register('featured')} 
                                        className="w-5 h-5 rounded border-gray-300 text-amber-500 focus:ring-amber-500 transition-all cursor-pointer"
                                    />
                                </div>

                                {isFeatured && (
                                    <div className="animate-in slide-in-from-top-1 duration-200 space-y-2 pt-2">
                                        <label className="block text-[9px] font-bold text-amber-600 uppercase tracking-widest ml-1">Orden de destaque</label>
                                        <div className="relative">
                                            <select
                                                {...register('featuredOrder', { setValueAs: v => v === "" || isNaN(parseInt(v, 10)) ? null : parseInt(v, 10) })}
                                                className="w-full bg-amber-50/50 border border-amber-200 rounded-xl px-3 py-2 text-xs text-amber-900 font-black focus:ring-4 focus:ring-amber-100 outline-none transition-all appearance-none cursor-pointer"
                                            >
                                                <option value="">Automático</option>
                                                <option value="1">1 - Prioridad Máxima</option>
                                                <option value="2">2 - Prioridad Alta</option>
                                                <option value="3">3 - Prioridad Media</option>
                                                <option value="4">4 - Prioridad Baja</option>
                                            </select>
                                            <Layers size={12} className="absolute right-3 top-2.5 text-amber-400 pointer-events-none" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </AdminCard>

                        {/* Tarjeta 2: Conversión y Enlaces */}
                        <AdminCard title="Conversión & Enlaces" icon={<Globe className="text-indigo-600" size={18} />}>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">CTA URL (Llamada Acción)</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                                            <LinkIcon size={12} />
                                        </div>
                                        <input
                                            {...register('ctaUrl')}
                                            placeholder="https://..."
                                            className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-9 pr-4 py-2 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all outline-none font-bold"
                                        />
                                    </div>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Fallback Visual (Local)</label>
                                    <input
                                        {...register('multimedia')}
                                        placeholder="/images/solutions/fallback.jpg"
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-[9px] font-mono text-gray-500 focus:text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all outline-none"
                                    />
                                    <p className="text-[9px] text-gray-400 mt-1 italic px-1 leading-tight">
                                        * Recurso de respaldo si la galería está vacía
                                    </p>
                                </div>
                            </div>
                        </AdminCard>

                        {/* Tarjeta 3: Sectores de Aplicación */}
                        <AdminCard title="Sectores de Aplicación" icon={<Tag className="text-indigo-600" size={18} />}>
                            <div className="space-y-5">
                                <div className="flex flex-wrap gap-1.5">
                                    {sectors.map(sector => {
                                        const isSelected = sectorIdsVal.includes(sector.id)
                                        return (
                                            <button
                                                key={sector.id}
                                                type="button"
                                                onClick={() => toggleSector(sector.id)}
                                                className={cn(
                                                    "px-2.5 py-1.5 rounded-xl text-[9px] font-bold uppercase tracking-wider transition-all border flex items-center gap-1.5 select-none",
                                                    isSelected 
                                                        ? "bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-100" 
                                                        : "bg-gray-50/50 border-gray-150 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 hover:bg-white"
                                                )}
                                            >
                                                {isSelected && <CheckCircle2 size={10} />}
                                                <span>{sector.name}</span>
                                            </button>
                                        )
                                    })}
                                    {sectors.length === 0 && <p className="text-[9px] text-gray-400 italic font-bold">Cargando sectores estratégicos...</p>}
                                </div>

                                <div className="pt-4 border-t border-gray-100 space-y-2">
                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider ml-0.5">Creación Rápida de Sector</p>
                                    <div className="flex gap-2">
                                        <input 
                                            type="text" 
                                            placeholder="Nuevo sector..." 
                                            value={newSectorName}
                                            onChange={(e) => setNewSectorName(e.target.value)}
                                            className="flex-1 bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-2 text-xs outline-none focus:bg-white focus:ring-4 focus:ring-indigo-50 transition-all font-bold placeholder:font-normal"
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
                                            className="px-4 py-2 bg-gray-900 text-white text-[9px] font-bold uppercase rounded-xl hover:bg-black disabled:opacity-50 transition-all shadow-sm tracking-widest shrink-0"
                                        >
                                            {creatingSector ? '...' : 'Añadir'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </AdminCard>
                    </>
                }
            >
                {/* Tarjeta 1: Identidad y Clasificación */}
                <AdminCard title="Identidad de la Solución" icon={<Layers className="text-indigo-600" size={18} />}>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2 space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">
                                    Título Comercial de la Solución
                                </label>
                                <input
                                    {...register('title')}
                                    onChange={(e) => {
                                        register('title').onChange(e)
                                        handleTitleChange(e)
                                    }}
                                    placeholder="Ej: Análisis Predictivo de Ventas con IA"
                                    className={cn(
                                        "w-full border rounded-xl px-4 py-3 text-lg font-black focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none",
                                        errors.title ? "border-red-300 bg-red-50/10" : "bg-gray-50/50 border-gray-200 text-gray-900"
                                    )}
                                />
                                {errors.title && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{errors.title.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                    <LinkIcon size={14} className="text-gray-300" /> Slug (Identificador URL)
                                </label>
                                <input
                                    {...register('slug')}
                                    className={cn(
                                        "w-full border rounded-xl px-4 py-2.5 text-sm font-mono focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none",
                                        errors.slug ? "border-red-300 bg-red-50/10" : "bg-gray-50/50 border-gray-200 text-gray-500"
                                    )}
                                />
                                {errors.slug && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{errors.slug.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                    <Monitor size={14} className="text-gray-300" /> Clasificación del Producto
                                </label>
                                <select
                                    {...register('type')}
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none appearance-none cursor-pointer"
                                >
                                    <option value="SOLUTION">Solución del Catálogo</option>
                                    <option value="LAB">Prototipo LAB / Beta</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </AdminCard>

                {/* Tarjeta 2: Ficha Técnica (Consolidated using generic FormAccordion) */}
                <AdminCard title="Ficha Técnica & Especificaciones" icon={<Zap className="text-indigo-600" size={18} />}>
                    <div className="space-y-4">
                        
                        {/* Bloque 1: Descripción Comercial */}
                        <FormAccordion
                            id="description"
                            title="Descripción Comercial"
                            description="Resumen ejecutivo y propuesta de valor de alto impacto"
                            icon={<FileText size={16} />}
                            isOpen={activeBlocks.description}
                            onToggle={() => toggleBlock('description')}
                            hasError={!!errors.description}
                            isCompleted={descriptionVal.trim().length > 0}
                            required
                        >
                            <textarea
                                {...register('description')}
                                rows={3}
                                placeholder="Breve explicación comercial destinada al cliente final..."
                                className="w-full bg-gray-50/30 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none resize-none leading-relaxed"
                            />
                            {errors.description && <p className="text-red-500 text-[10px] font-bold uppercase italic ml-1">{errors.description.message}</p>}
                        </FormAccordion>

                        {/* Bloque 2: Problemas que Resuelve */}
                        <FormAccordion
                            id="problems"
                            title="Puntos de Dolor Resueltos"
                            description="¿Qué desafíos de negocio optimiza o automatiza?"
                            icon={<Target size={16} />}
                            isOpen={activeBlocks.problems}
                            onToggle={() => toggleBlock('problems')}
                            hasError={!!errors.problemsSolved}
                            isCompleted={problemsVal.trim().length > 0}
                        >
                            <textarea
                                {...register('problemsSolved')}
                                rows={4}
                                placeholder="Enumera los puntos de dolor concretos que soluciona esta IA..."
                                className="w-full bg-gray-50/30 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none resize-none leading-relaxed"
                            />
                        </FormAccordion>

                        {/* Bloque 3: Capacidades Clave */}
                        <FormAccordion
                            id="capabilities"
                            title="Capacidades Core"
                            description="Funcionalidades estrella y ventajas competitivas clave"
                            icon={<Shield size={16} />}
                            isOpen={activeBlocks.capabilities}
                            onToggle={() => toggleBlock('capabilities')}
                            hasError={!!errors.capabilities}
                            isCompleted={capabilitiesVal.trim().length > 0}
                        >
                            <textarea
                                {...register('capabilities')}
                                rows={4}
                                placeholder="Detalla las capacidades y ventajas tecnológicas integradas..."
                                className="w-full bg-gray-50/30 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none resize-none leading-relaxed"
                            />
                        </FormAccordion>

                        {/* Bloque 4: Especificaciones Técnicas */}
                        <FormAccordion
                            id="specs"
                            title="Ingeniería de Valor & Lógica"
                            description="Explicación técnica, integraciones, APIs y backend"
                            icon={<Settings size={16} />}
                            isOpen={activeBlocks.specs}
                            onToggle={() => toggleBlock('specs')}
                            hasError={!!errors.functionalDescription}
                            isCompleted={functionalVal.trim().length > 0}
                        >
                            <textarea
                                {...register('functionalDescription')}
                                rows={4}
                                placeholder="Detalla el flujo lógico de funcionamiento y las tecnologías..."
                                className="w-full bg-gray-50/30 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none resize-none leading-relaxed"
                            />
                        </FormAccordion>

                    </div>
                </AdminCard>

                {/* Tarjeta 3: Galería Multimedia Premium */}
                <AdminCard title="Galería de Imágenes Premium" icon={<ImageIcon className="text-indigo-600" size={18} />}>
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {galleryFields.map((field, index) => (
                                <div key={field.id} className="premium-white-surface p-4 border border-gray-150 rounded-2xl relative flex flex-col gap-4 group hover:shadow-md transition-shadow">
                                    <div className="relative aspect-video rounded-xl bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                                        {watch(`gallery.${index}.url`) ? (
                                            <img src={watch(`gallery.${index}.url`)!} className="w-full h-full object-cover" alt="Preview" />
                                        ) : (
                                            <ImageIcon size={28} className="text-gray-300" />
                                        )}

                                        {uploadingImage === index && (
                                            <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex flex-col items-center justify-center gap-2">
                                                <Loader2 className="animate-spin text-indigo-600" size={24} />
                                                <span className="text-[9px] font-black text-indigo-600 tracking-widest uppercase">Subiendo Imagen</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex gap-2">
                                            <input
                                                {...register(`gallery.${index}.url`)}
                                                placeholder="URL de la imagen o subir..."
                                                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm font-mono text-[10px]"
                                            />
                                            <label className={cn(
                                                "cursor-pointer px-3 py-2 rounded-xl transition-all text-[9px] font-bold flex items-center gap-1.5 uppercase tracking-wider",
                                                uploadingImage === index ? "bg-indigo-50 text-indigo-400" : "bg-indigo-600 text-white hover:bg-indigo-750 shadow-sm"
                                            )}>
                                                <Upload size={12} />
                                                <span>Subir</span>
                                                <input type="file" className="hidden" accept="image/*" onChange={(e) => handleUpload(index, e)} disabled={uploadingImage !== null} />
                                            </label>
                                        </div>

                                        <div className="flex gap-2 items-center justify-between">
                                            <input
                                                {...register(`gallery.${index}.alt`)}
                                                placeholder="Texto alternativo SEO..."
                                                className="flex-1 bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs focus:ring-4 focus:ring-indigo-50 outline-none transition-all shadow-sm"
                                            />
                                            <label className="flex items-center gap-1.5 cursor-pointer px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors shrink-0">
                                                <input type="checkbox" {...register(`gallery.${index}.isPrimary`)} className="rounded text-indigo-600 w-3.5 h-3.5" />
                                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Principal</span>
                                            </label>
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeGallery(index)}
                                        className="absolute top-2 right-2 p-1.5 bg-white/90 hover:bg-red-50 text-gray-400 hover:text-red-500 border border-gray-150 hover:border-red-200 rounded-lg transition-all shadow-sm"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="flex justify-center pt-2">
                            <button
                                type="button"
                                onClick={() => appendGallery({ url: '', alt: '', isPrimary: galleryFields.length === 0 })}
                                className="flex items-center justify-center gap-2.5 px-6 py-4 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-bold text-gray-400 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/10 hover:shadow-xs transition-all uppercase tracking-widest w-full max-w-sm"
                            >
                                <Plus size={14} /> Añadir Imagen a la Galería
                            </button>
                        </div>
                    </div>
                </AdminCard>
            </AdminEditorLayout>

            {/* 3. STICKY ACTION BAR (Consolidated using generic component) */}
            <StickyActionBar
                primaryAction={
                    <button
                        type="button"
                        onClick={handleSubmit(onSubmit, onError)}
                        disabled={isSubmitting || uploadingImage !== null}
                        className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {isSubmitting ? <Loader2 size={12} className="animate-spin" /> : <CheckCircle2 size={12} />}
                        <span>{initialData ? 'Actualizar Solución' : 'Guardar Solución'}</span>
                    </button>
                }
            >
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-900 bg-white border border-gray-250 hover:border-gray-305 rounded-xl transition-all shadow-sm"
                >
                    Cancelar
                </button>
                <button
                    type="button"
                    onClick={handleSaveAsDraft}
                    disabled={isSubmitting || uploadingImage !== null}
                    className="px-4 py-2 text-xs font-bold text-gray-700 bg-white border border-gray-250 hover:border-gray-350 rounded-xl transition-all shadow-sm disabled:opacity-50"
                >
                    Guardar Borrador
                </button>
                <button
                    type="button"
                    onClick={() => {
                        setPreviewImageIdx(0)
                        setShowPreview(true)
                    }}
                    className="px-4 py-2 text-xs font-bold text-indigo-650 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100 rounded-xl transition-all flex items-center gap-1.5"
                >
                    <Eye size={12} />
                    <span>Vista Previa</span>
                </button>
            </StickyActionBar>

            {/* 4. VISUAL LIVE PREVIEW MODAL */}
            {showPreview && (
                <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-in zoom-in-95 duration-200">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-150 flex items-center justify-between bg-gray-50/50 rounded-t-3xl">
                            <div>
                                <h3 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
                                    <Eye size={14} className="text-indigo-600" />
                                    <span>Vista Previa Comercial</span>
                                </h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Así se visualizará en la web pública de cara a los clientes</p>
                            </div>
                            <button
                                onClick={() => setShowPreview(false)}
                                className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-950"
                            >
                                <X size={16} />
                            </button>
                        </div>

                        {/* Public UI Simulation */}
                        <div className="p-8 md:p-12 space-y-12 flex-1 overflow-y-auto select-text bg-white relative">
                            {/* Ambient details */}
                            <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-50/20 rounded-full blur-[140px] pointer-events-none" />
                            <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-50/20 rounded-full blur-[140px] pointer-events-none" />

                            {/* Hero presentation */}
                            <div className="relative flex flex-col items-center text-center max-w-4xl mx-auto space-y-6">
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-650 text-[10px] font-black uppercase tracking-widest">
                                    <Sparkles size={11} className="fill-indigo-500/20" />
                                    <span>{typeVal === 'SOLUTION' ? 'Solución Inteligente' : 'Prototipo LAB / Beta'}</span>
                                </div>

                                <h1 className="text-4xl md:text-6xl font-black text-gray-950 leading-[1.05] tracking-tight Outfit font-black">
                                    {titleVal || 'Título de la Solución'}
                                </h1>

                                {descriptionVal ? (
                                    <p className="text-lg md:text-xl text-gray-500 font-light max-w-2xl leading-relaxed">
                                        {descriptionVal}
                                    </p>
                                ) : (
                                    <p className="text-gray-400 italic text-sm">Completa el bloque de "Descripción Comercial" para previsualizar el resumen del producto.</p>
                                )}
                            </div>

                            {/* Gallery simulation */}
                            <div className="max-w-5xl mx-auto">
                                {galleryVal.length > 0 && galleryVal.some(img => img.url) ? (
                                    <div className="relative aspect-video md:aspect-[21/9] rounded-[2rem] overflow-hidden bg-gray-50 border border-gray-150 shadow-md group/preview">
                                        <img 
                                            src={galleryVal[previewImageIdx]?.url || '/images/placeholder.jpg'} 
                                            alt={galleryVal[previewImageIdx]?.alt || 'Preview image'} 
                                            className="w-full h-full object-cover transition-transform duration-700"
                                        />

                                        {galleryVal.length > 1 && (
                                            <>
                                                <button 
                                                    onClick={() => setPreviewImageIdx(p => p > 0 ? p - 1 : galleryVal.length - 1)}
                                                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/95 hover:bg-white text-gray-800 rounded-full border border-gray-150 opacity-0 group-hover/preview:opacity-100 transition-opacity shadow-lg"
                                                >
                                                    <ChevronLeft size={20} />
                                                </button>
                                                <button 
                                                    onClick={() => setPreviewImageIdx(p => p < galleryVal.length - 1 ? p + 1 : 0)}
                                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/95 hover:bg-white text-gray-800 rounded-full border border-gray-150 opacity-0 group-hover/preview:opacity-100 transition-opacity shadow-lg"
                                                >
                                                    <ChevronRight size={20} />
                                                </button>
                                            </>
                                        )}
                                        
                                        <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5">
                                            {galleryVal.map((_: any, idx: number) => (
                                                <button 
                                                    key={idx}
                                                    onClick={() => setPreviewImageIdx(idx)}
                                                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === previewImageIdx ? 'bg-indigo-650 w-8' : 'bg-black/20 hover:bg-black/45 w-3'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="aspect-video md:aspect-[21/9] rounded-[2rem] border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center gap-2">
                                        <ImageIcon size={32} className="text-gray-300" />
                                        <span className="text-[10px] text-gray-400 uppercase tracking-widest font-black">Sin imágenes en la galería</span>
                                    </div>
                                )}
                            </div>

                            {/* Details columns */}
                            <div className="max-w-5xl mx-auto border-t border-gray-100 pt-10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-10">
                                        {/* Technical Logic */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-extrabold text-gray-950 flex items-center gap-2.5">
                                                <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100/50">
                                                    <Zap size={16} />
                                                </div>
                                                <span>Ingeniería de Valor & Lógica</span>
                                            </h3>
                                            {functionalVal ? (
                                                <p className="text-sm text-gray-550 leading-relaxed font-light whitespace-pre-wrap">{functionalVal}</p>
                                            ) : (
                                                <p className="text-xs text-gray-400 italic leading-relaxed">Completa el bloque de "Ingeniería de Valor" en el formulario para verlo aquí.</p>
                                            )}
                                        </div>

                                        {/* Solved Problems */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-extrabold text-gray-950 flex items-center gap-2.5">
                                                <div className="p-1.5 rounded-lg bg-purple-50 text-purple-650 border border-purple-100/50">
                                                    <Target size={16} />
                                                </div>
                                                <span>Desafíos Resueltos</span>
                                            </h3>
                                            {problemsVal ? (
                                                <p className="text-sm text-gray-550 leading-relaxed font-light whitespace-pre-wrap">{problemsVal}</p>
                                            ) : (
                                                <p className="text-xs text-gray-400 italic leading-relaxed">Completa el bloque de "Puntos de Dolor Resueltos" en el formulario para verlo aquí.</p>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-10">
                                        {/* Capabilities */}
                                        <div className="space-y-4">
                                            <h3 className="text-lg font-extrabold text-gray-950 flex items-center gap-2.5">
                                                <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-650 border border-emerald-100/50">
                                                    <Shield size={16} />
                                                </div>
                                                <span>Capacidades Core</span>
                                            </h3>
                                            {capabilitiesVal ? (
                                                <p className="text-sm text-gray-550 leading-relaxed font-light whitespace-pre-wrap">{capabilitiesVal}</p>
                                            ) : (
                                                <p className="text-xs text-gray-400 italic leading-relaxed">Completa el bloque de "Capacidades Core" en el formulario para verlo aquí.</p>
                                            )}
                                        </div>

                                        {/* CTA Deployment simulation */}
                                        <div className="space-y-6 pt-4">
                                            <div className="p-5 rounded-2xl bg-indigo-50/40 border border-indigo-100/50 space-y-3">
                                                <p className="text-xs font-black text-indigo-950 uppercase tracking-widest">Llamada a la Acción de Enlace</p>
                                                {ctaVal ? (
                                                    <a 
                                                        href={ctaVal} 
                                                        target="_blank" 
                                                        rel="noopener noreferrer" 
                                                        className="w-full relative inline-flex items-center justify-center px-6 py-3 text-xs font-black text-white transition-all rounded-xl overflow-hidden shadow-md"
                                                    >
                                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600 hover:scale-105 transition-transform duration-300" />
                                                        <span className="relative flex items-center gap-1.5">
                                                            <span>Iniciar Despliegue</span>
                                                            <ChevronRight size={14} />
                                                        </span>
                                                    </a>
                                                ) : (
                                                    <p className="text-[10px] text-gray-400 italic leading-tight">Configura la "CTA URL" en el panel lateral para activar el botón de despliegue directo.</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Demo Request form placeholder simulation */}
                            <div className="max-w-4xl mx-auto bg-gray-50 border border-gray-150 rounded-[2rem] p-10 text-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-600 to-blue-600" />
                                <h3 className="text-xl font-black text-gray-950 mb-3 leading-tight font-black">Agenda una Sesión Técnica Estratégica</h3>
                                <p className="text-sm text-gray-500 font-light leading-relaxed max-w-2xl mx-auto mb-6">
                                    Simulación del formulario comercial de leads táctiles para recopilar solicitudes de demostración de {titleVal || 'esta solución'}.
                                </p>
                                <div className="max-w-md mx-auto grid grid-cols-2 gap-3 opacity-60 pointer-events-none">
                                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-400 text-left">Tu nombre</div>
                                    <div className="bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-400 text-left">Tu email</div>
                                    <div className="col-span-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-xs text-gray-400 text-left">Tu empresa</div>
                                    <div className="col-span-2 bg-indigo-600 text-white rounded-xl py-2.5 text-xs font-black uppercase tracking-widest">Solicitar Demo</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminFormShell>
    )
}
