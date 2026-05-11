'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEffect, useState } from 'react'
import { Upload, X, Globe, User, Landmark, Tag, Palette, Layout, Settings } from 'lucide-react'

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
    'AI', 'Cloud', 'Infrastructure', 'Payments', 'Automation', 
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
    useEffect(() => {
        if (!initialData && nameValue) {
            const slug = nameValue.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
            setValue('slug', slug)
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
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Handshake size={24} />
                </div>
                {initialData ? 'Editar Partner Estratégico' : 'Nuevo Partner Estratégico'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Landmark size={16} className="text-gray-400" />
                                Nombre del Partner *
                            </label>
                            <input
                                {...register('name')}
                                className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium"
                                placeholder="Ej. OpenAI, Google Cloud..."
                            />
                            {errors.name?.message && <p className="text-red-500 text-xs mt-1.5 font-bold">{String(errors.name.message)}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Tag size={16} className="text-gray-400" />
                                Slug (identificador único) *
                            </label>
                            <input
                                {...register('slug')}
                                className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm"
                                placeholder="openai"
                            />
                            {errors.slug?.message && <p className="text-red-500 text-xs mt-1.5 font-bold">{String(errors.slug.message)}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Layout size={16} className="text-gray-400" />
                                    Categoría
                                </label>
                                <select
                                    {...register('category')}
                                    className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Settings size={16} className="text-gray-400" />
                                    Orden
                                </label>
                                <input
                                    type="number"
                                    {...register('displayOrder', { valueAsNumber: true })}
                                    className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Globe size={16} className="text-gray-400" />
                                Website URL
                            </label>
                            <input
                                {...register('websiteUrl')}
                                className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm"
                                placeholder="https://www.partner.com"
                            />
                        </div>

                        <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-100 space-y-4">
                            <h3 className="text-sm font-black text-indigo-900 uppercase tracking-widest">Visibilidad</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" {...register('showInFooter')} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">Mostrar en Footer</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" {...register('showInHomepage')} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">Mostrar en Home</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" {...register('showInSolutions')} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">En Soluciones</span>
                                </label>
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <input type="checkbox" {...register('isFeatured')} className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                    <span className="text-sm font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">Destacado</span>
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Upload size={16} className="text-gray-400" />
                                Logo del Partner
                            </label>

                            <div 
                                className={`relative h-48 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 overflow-hidden ${
                                    dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50'
                                }`}
                                onDragEnter={handleDrag}
                                onDragLeave={handleDrag}
                                onDragOver={handleDrag}
                                onDrop={handleDrop}
                            >
                                {watch('logoUrl') ? (
                                    <>
                                        <img 
                                            src={watch('logoUrl')} 
                                            alt="Preview" 
                                            className="absolute inset-0 w-full h-full object-contain p-4"
                                        />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                            <button 
                                                type="button"
                                                onClick={() => setValue('logoUrl', '')}
                                                className="p-3 bg-red-500 text-white rounded-full hover:scale-110 transition-transform shadow-lg"
                                            >
                                                <X size={20} />
                                            </button>
                                            <label className="p-3 bg-indigo-500 text-white rounded-full hover:scale-110 transition-transform cursor-pointer shadow-lg">
                                                <Upload size={20} />
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 bg-white rounded-2xl shadow-sm">
                                            <Upload className={`w-8 h-8 ${uploading ? 'animate-bounce text-indigo-500' : 'text-gray-300'}`} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-gray-700">{uploading ? 'Subiendo logo...' : 'Arrastra el logo aquí'}</p>
                                            <label className="text-xs text-indigo-600 font-bold hover:underline cursor-pointer">
                                                o haz clic para buscar
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                            </label>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Palette size={16} className="text-gray-400" />
                                Estética del Logo
                            </label>
                            <div className="space-y-4">
                                <select
                                    {...register('logoVariant')}
                                    className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                                >
                                    {LOGO_VARIANTS.map(v => (
                                        <option key={v.value} value={v.value}>{v.label}</option>
                                    ))}
                                </select>
                                
                                <div>
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Color de Marca (HEX)</label>
                                    <div className="flex gap-2">
                                        <input
                                            {...register('brandColor')}
                                            className="flex-1 bg-gray-50 border-gray-200 border rounded-xl px-4 py-2 text-gray-900 focus:outline-none focus:border-indigo-500 transition-all font-mono text-sm"
                                            placeholder="#000000"
                                        />
                                        <div 
                                            className="w-10 h-10 rounded-xl border border-gray-100 shadow-sm"
                                            style={{ backgroundColor: watch('brandColor') || '#eee' }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Tag size={16} className="text-gray-400" />
                                Alt Text (SEO)
                            </label>
                            <input
                                {...register('logoAlt')}
                                className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-indigo-500 transition-all font-medium"
                                placeholder="Descriptivo para buscadores"
                            />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('isActive')}
                                id="isActive"
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                            <label htmlFor="isActive" className="ml-3 text-sm font-bold text-gray-700">Partner Activo</label>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="flex-1 sm:flex-initial px-8 py-3 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition-all font-bold"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || uploading}
                            className="flex-1 sm:flex-initial px-10 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-black shadow-lg shadow-indigo-100 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Partner' : 'Guardar Partner'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
