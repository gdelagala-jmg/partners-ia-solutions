'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEffect, useState } from 'react'
import { Upload, X, Globe, Landmark, Tag, Palette, Layout, Settings, Handshake, CheckCircle2, Share2, Eye } from 'lucide-react'
import AdminFormShell from './ui/AdminFormShell'
import AdminCard from './ui/AdminCard'
import { cn } from '@/lib/utils'

const partnerSchema = z.object({
    name: z.string().min(2, 'El nombre es obligatorio'),
    slug: z.string().min(2, 'El slug es obligatorio'),
    logoUrl: z.string().optional().or(z.literal('')),
    logoAlt: z.string().optional().or(z.literal('')),
    websiteUrl: z.string().optional().or(z.literal('')),
    category: z.string().default('Strategic'),
    displayOrder: z.number().default(0),
    isActive: z.boolean().default(true),
    isFeatured: z.boolean().default(false),
    showInFooter: z.boolean().default(true),
    showInHomepage: z.boolean().default(false),
    showInSolutions: z.boolean().default(false),
    brandColor: z.string().optional().or(z.literal('')),
    logoVariant: z.string().default('ORIGINAL'),
})

type PartnerFormValues = z.infer<typeof partnerSchema>

interface StrategicPartnerFormProps {
    initialData?: any
    onSubmit: (data: any) => void
    onCancel: () => void
}

const CATEGORIES = [
    'Partners', 'AI', 'Cloud', 'Infrastructure', 'Payments', 'Automation', 
    'Analytics', 'Security', 'Integrations', 'Communications', 
    'Data', 'Development', 'Strategic'
]

const LOGO_VARIANTS = [
    { value: 'ORIGINAL', label: 'Color Original' },
    { value: 'MONOCHROME', label: 'Monocromo (Gris)' },
    { value: 'INVERTED', label: 'Invertido (Blanco)' },
]

export default function StrategicPartnerForm({ initialData, onSubmit, onCancel }: StrategicPartnerFormProps) {
    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<PartnerFormValues>({
        resolver: zodResolver(partnerSchema),
        defaultValues: {
            name: '',
            slug: '',
            logoUrl: '',
            logoAlt: '',
            websiteUrl: '',
            category: 'Strategic',
            displayOrder: 0,
            isActive: true,
            isFeatured: false,
            showInFooter: true,
            showInHomepage: false,
            showInSolutions: false,
            brandColor: '',
            logoVariant: 'ORIGINAL',
            ...initialData
        }
    })

    const nameValue = watch('name')
    const logoUrl = watch('logoUrl')
    const brandColor = watch('brandColor')
    const isActive = watch('isActive')

    useEffect(() => {
        if (!initialData && nameValue) {
            const slug = nameValue.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)/g, '')
            setValue('slug', slug, { shouldValidate: true })
        }
    }, [nameValue, setValue, initialData])

    const [uploading, setUploading] = useState(false)
    const [dragActive, setDragActive] = useState(false)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return
        uploadFile(file)
    }

    const uploadFile = async (file: File) => {
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
            setValue('logoUrl', data.url)
            if (!watch('logoAlt')) setValue('logoAlt', `Logo de ${watch('name') || 'Partner'}`)
        } catch (error) {
            console.error('Upload error:', error)
            alert('Error al subir el logo')
        } finally {
            setUploading(false)
        }
    }

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") setDragActive(true)
        else if (e.type === "dragleave") setDragActive(false)
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        const file = e.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) uploadFile(file)
    }

    return (
        <AdminFormShell
            title={initialData ? 'Editar Partner' : 'Nuevo Partner'}
            description={initialData ? `Gestión de identidad y presencia para ${initialData.name}` : 'Registra un nuevo socio estratégico en el ecosistema'}
            onCancel={onCancel}
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting || uploading}
            submitLabel={initialData ? 'Guardar Cambios' : 'Registrar Partner'}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <AdminCard title="Identidad Visual" icon={<Palette size={18} className="text-indigo-500" />}>
                        <div className="space-y-6">
                            <div 
                                className={cn(
                                    "relative h-48 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 overflow-hidden bg-gray-50/50",
                                    dragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-200 hover:border-indigo-300 hover:bg-white"
                                )}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                {logoUrl ? (
                                    <>
                                        <img 
                                            src={logoUrl} 
                                            alt="Preview" 
                                            className="absolute inset-0 w-full h-full object-contain p-6"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                                            <button 
                                                type="button"
                                                onClick={() => setValue('logoUrl', '')}
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
                                            <Upload className={cn("w-8 h-8", uploading ? "text-indigo-500" : "text-gray-300")} />
                                        </div>
                                        <label className="cursor-pointer">
                                            <span className="text-[10px] font-black text-indigo-500 uppercase tracking-tighter hover:underline">
                                                {uploading ? 'SUBIENDO...' : 'SUBIR LOGO'}
                                            </span>
                                            <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                                        </label>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Variante Visual</label>
                                    <select
                                        {...register('logoVariant')}
                                        className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-medium outline-none"
                                    >
                                        {LOGO_VARIANTS.map(v => (
                                            <option key={v.value} value={v.value}>{v.label}</option>
                                        ))}
                                    </select>
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Color de Marca</label>
                                    <div className="relative">
                                        <input
                                            {...register('brandColor')}
                                            className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-mono outline-none"
                                            placeholder="#HEX"
                                        />
                                        <div 
                                            className="absolute right-2.5 top-2 w-6 h-6 rounded-lg border border-gray-100 shadow-inner transition-colors"
                                            style={{ backgroundColor: brandColor || '#eee' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Estado Global" icon={<Settings size={18} className="text-gray-400" />}>
                        <div className={cn(
                            "flex items-center justify-between p-4 rounded-2xl border transition-all",
                            isActive ? "bg-emerald-50/50 border-emerald-100" : "bg-gray-50 border-gray-200"
                        )}>
                            <div className="space-y-0.5">
                                <p className={cn("text-xs font-bold", isActive ? "text-emerald-900" : "text-gray-900")}>Partner Activo</p>
                                <p className={cn("text-[10px] font-medium uppercase tracking-tight", isActive ? "text-emerald-600" : "text-gray-500")}>
                                    {isActive ? 'Visible en web' : 'Oculto'}
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" {...register('isActive')} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                        </div>
                    </AdminCard>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <AdminCard title="Información General" icon={<Handshake size={18} className="text-indigo-500" />}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                    <Landmark size={12} className="text-gray-400" /> Nombre Comercial *
                                </label>
                                <input
                                    {...register('name')}
                                    placeholder="Ej. OpenAI, Microsoft, Google Cloud..."
                                    className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-3 text-lg font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none"
                                />
                                {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{String(errors.name.message)}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                        <Tag size={12} className="text-gray-400" /> Slug de URL
                                    </label>
                                    <input
                                        {...register('slug')}
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-mono focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none"
                                        placeholder="openai"
                                    />
                                    {errors.slug && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{String(errors.slug.message)}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                        <Globe size={12} className="text-gray-400" /> Sitio Web
                                    </label>
                                    <input
                                        {...register('websiteUrl')}
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none font-mono"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                        <Layout size={12} className="text-gray-400" /> Clasificación
                                    </label>
                                    <select
                                        {...register('category')}
                                        className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-medium outline-none"
                                    >
                                        {CATEGORIES.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                        <Settings size={12} className="text-gray-400" /> Orden Visual
                                    </label>
                                    <input
                                        type="number"
                                        {...register('displayOrder', { valueAsNumber: true })}
                                        className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none font-bold"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                    <Share2 size={12} className="text-gray-400" /> Texto Alternativo (SEO)
                                </label>
                                <input
                                    {...register('logoAlt')}
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none"
                                    placeholder="Logo de [Nombre Partner]..."
                                />
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Configuración de Visibilidad" icon={<Layout size={18} className="text-indigo-400" />}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                { id: 'showInFooter', label: 'Footer Global', icon: Layout, desc: 'Pie de página' },
                                { id: 'showInHomepage', label: 'Home Showcase', icon: Globe, desc: 'Carrusel de inicio' },
                                { id: 'showInSolutions', label: 'Catálogo Soluciones', icon: Settings, desc: 'Filtros técnicos' },
                                { id: 'isFeatured', label: 'Partner Destacado', icon: Tag, desc: 'Prioridad visual' },
                            ].map((item) => (
                                <label 
                                    key={item.id}
                                    className={cn(
                                        "flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group",
                                        watch(item.id as any) 
                                            ? "bg-indigo-50/50 border-indigo-100 ring-1 ring-indigo-100" 
                                            : "bg-white border-gray-100 hover:border-indigo-100 hover:bg-gray-50/50"
                                    )}
                                >
                                    <div className={cn(
                                        "p-2 rounded-xl border transition-all shadow-sm",
                                        watch(item.id as any) ? "bg-white text-indigo-600 border-indigo-100" : "bg-gray-50 text-gray-300 border-gray-50"
                                    )}>
                                        <item.icon size={20} />
                                    </div>
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-sm font-bold text-gray-900 leading-tight">{item.label}</span>
                                            <input type="checkbox" {...register(item.id as any)} className="sr-only" />
                                            {watch(item.id as any) && <CheckCircle2 size={14} className="text-emerald-500" />}
                                        </div>
                                        <p className="text-[10px] text-gray-500 font-medium uppercase tracking-tight">{item.desc}</p>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </AdminCard>
                </div>
            </div>
        </AdminFormShell>
    )
}
