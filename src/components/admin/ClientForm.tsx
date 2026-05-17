'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEffect, useState } from 'react'
import { Upload, X, Globe, Phone, User, Landmark, MapPin, Tag, ShieldCheck, Image as ImageIcon, Settings, CheckCircle2 } from 'lucide-react'
import AdminFormShell from './ui/AdminFormShell'
import AdminCard from './ui/AdminCard'
import { cn } from '@/lib/utils'

const clientSchema = z.object({
    companyName: z.string().min(2, 'La razón social es obligatoria'),
    taxId: z.string().optional().or(z.literal('')),
    address: z.string().optional().or(z.literal('')),
    website: z.string().optional().or(z.literal('')),
    sector: z.string().optional().or(z.literal('')),
    contactName: z.string().optional().or(z.literal('')),
    contactPhone: z.string().optional().or(z.literal('')),
    logoUrl: z.string().optional().or(z.literal('')),
    active: z.boolean(),
})

type ClientFormValues = z.infer<typeof clientSchema>

interface ClientFormProps {
    initialData?: any
    onSubmit: (data: any) => void
    onCancel: () => void
}

export default function ClientForm({ initialData, onSubmit, onCancel }: ClientFormProps) {
    const [uploading, setUploading] = useState(false)

    const { register, handleSubmit, formState: { errors, isSubmitting }, setValue, watch } = useForm<ClientFormValues>({
        resolver: zodResolver(clientSchema),
        defaultValues: {
            companyName: '',
            taxId: '',
            address: '',
            website: '',
            sector: '',
            contactName: '',
            contactPhone: '',
            logoUrl: '',
            active: true,
            ...initialData
        }
    })

    const logoUrl = watch('logoUrl')
    const active = watch('active')

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
            setValue('logoUrl', data.url)
        } catch (error) {
            alert('Error al subir el logo')
        } finally {
            setUploading(false)
        }
    }

    return (
        <AdminFormShell
            title={initialData ? 'Editar Cliente' : 'Nuevo Cliente'}
            description="Gestiona la información corporativa y de contacto de tus clientes."
            onSubmit={handleSubmit(onSubmit)}
            onCancel={onCancel}
            isSubmitting={isSubmitting}
            submitLabel={initialData ? 'Guardar Cambios' : 'Crear Cliente'}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <AdminCard title="Información Corporativa" icon={<Landmark className="text-indigo-500" size={18} />}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Razón Social *</label>
                                <input
                                    {...register('companyName')}
                                    placeholder="Nombre oficial de la empresa"
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-medium"
                                />
                                {errors.companyName && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{errors.companyName.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                        <Tag size={12} /> CIF / NIF
                                    </label>
                                    <input
                                        {...register('taxId')}
                                        placeholder="Ej: B12345678"
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none uppercase font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                        <Globe size={12} /> Sector
                                    </label>
                                    <input
                                        {...register('sector')}
                                        placeholder="Ej: Finanzas, Salud..."
                                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                    <MapPin size={12} /> Dirección
                                </label>
                                <input
                                    {...register('address')}
                                    placeholder="Calle, Número, Ciudad, CP"
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                    <Globe size={12} /> Sitio Web
                                </label>
                                <input
                                    {...register('website')}
                                    placeholder="https://www.empresa.com"
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none font-mono"
                                />
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Contacto Principal" icon={<User className="text-indigo-500" size={18} />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Persona de Contacto</label>
                                <input
                                    {...register('contactName')}
                                    placeholder="Nombre completo"
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                    <Phone size={12} /> Teléfono
                                </label>
                                <input
                                    {...register('contactPhone')}
                                    placeholder="+34 000 000 000"
                                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none font-mono"
                                />
                            </div>
                        </div>
                    </AdminCard>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <AdminCard title="Estado del Cliente" icon={<Settings className="text-gray-400" size={18} />}>
                        <div className={cn(
                            "flex items-center justify-between p-4 rounded-2xl border transition-all",
                            active ? "bg-emerald-50/50 border-emerald-100" : "bg-gray-50 border-gray-200"
                        )}>
                            <div className="space-y-0.5">
                                <p className={cn("text-xs font-bold", active ? "text-emerald-900" : "text-gray-900")}>Cliente Activo</p>
                                <p className={cn("text-[10px] font-medium uppercase tracking-tight", active ? "text-emerald-600" : "text-gray-500")}>
                                    {active ? 'Relación vigente' : 'Inactivo'}
                                </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input type="checkbox" {...register('active')} className="sr-only peer" />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                            </label>
                        </div>
                    </AdminCard>

                    <AdminCard title="Identidad Visual" icon={<ImageIcon className="text-indigo-500" size={18} />}>
                        <div className="space-y-4">
                            <div 
                                className={cn(
                                    "relative aspect-square rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 overflow-hidden bg-gray-50/50",
                                    logoUrl ? "border-solid border-gray-100 bg-white" : "border-gray-200 hover:border-indigo-300 hover:bg-white"
                                )}
                            >
                                {logoUrl ? (
                                    <>
                                        <img src={logoUrl} className="absolute inset-0 w-full h-full object-contain p-6" alt="Logo Cliente" />
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
                                            <Upload className={cn("w-6 h-6", uploading ? "text-indigo-500" : "text-gray-300")} />
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
                            <input {...register('logoUrl')} type="hidden" />
                            <p className="text-[9px] text-gray-400 text-center uppercase tracking-wider font-bold">
                                Preferiblemente PNG o SVG con fondo transparente
                            </p>
                        </div>
                    </AdminCard>
                </div>
            </div>
        </AdminFormShell>
    )
}
