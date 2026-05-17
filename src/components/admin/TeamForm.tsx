'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState, useEffect } from 'react'
import { Upload, X, Loader2, Plus, Phone, Linkedin, User, Briefcase, FileText, Settings2, Eye, EyeOff, Layout, Settings } from 'lucide-react'
import AdminFormShell from './ui/AdminFormShell'
import AdminCard from './ui/AdminCard'
import { cn } from '@/lib/utils'

const teamMemberSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    phone: z.string().nullable().default(null),
    photoUrl: z.string().nullable().default(null),
    linkedIn: z.string().nullable().default(null),
    role: z.string().nullable().default(null),
    bio: z.string().nullable().default(null),
    order: z.number().default(0),
    showPhoto: z.boolean().default(true),
    showName: z.boolean().default(true),
    customFields: z.string().default('{}'),
}).passthrough()

export type TeamMemberValues = z.infer<typeof teamMemberSchema>

interface CustomField {
    key: string;
    value: string;
}

interface TeamFormProps {
    initialData?: any;
    onSubmit: (data: TeamMemberValues) => void;
    onCancel: () => void;
}

export default function TeamForm({ initialData, onSubmit, onCancel }: TeamFormProps) {
    const [uploading, setUploading] = useState(false)
    const [customFields, setCustomFields] = useState<CustomField[]>([])

    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<TeamMemberValues>({
        resolver: zodResolver(teamMemberSchema),
        defaultValues: initialData ? {
            name: initialData.name || '',
            phone: initialData.phone || null,
            photoUrl: initialData.photoUrl || null,
            linkedIn: initialData.linkedIn || null,
            role: initialData.role || null,
            bio: initialData.bio || null,
            showPhoto: typeof initialData.showPhoto === 'boolean' ? initialData.showPhoto : true,
            showName: typeof initialData.showName === 'boolean' ? initialData.showName : true,
            order: Number(initialData.order) || 0,
            customFields: typeof initialData.customFields === 'string' 
                ? initialData.customFields 
                : JSON.stringify(initialData.customFields || {}),
        } : {
            name: '',
            phone: null,
            photoUrl: null,
            linkedIn: null,
            role: null,
            bio: null,
            showPhoto: true,
            showName: true,
            order: 0,
            customFields: '{}',
        },
    })

    const photoUrl = watch('photoUrl')
    const showPhoto = watch('showPhoto')
    const showName = watch('showName')

    useEffect(() => {
        if (initialData?.customFields) {
            try {
                const parsed = typeof initialData.customFields === 'string' 
                    ? JSON.parse(initialData.customFields)
                    : initialData.customFields;
                const fieldsArray = Object.entries(parsed).map(([key, value]) => ({ key, value: String(value) }));
                setCustomFields(fieldsArray);
            } catch (e) {
                console.error("Error parsing custom fields", e);
            }
        }
    }, [initialData])

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
            setValue('photoUrl', data.url)
        } catch (err: any) {
            alert(err.message || 'Error al subir la imagen')
        } finally {
            setUploading(false)
        }
    }

    const addCustomField = () => {
        setCustomFields([...customFields, { key: '', value: '' }])
    }

    const removeCustomField = (index: number) => {
        setCustomFields(customFields.filter((_, i) => i !== index))
    }

    const updateCustomField = (index: number, key: string, value: string) => {
        const newFields = [...customFields]
        newFields[index] = { key, value }
        setCustomFields(newFields)
    }

    const handleFormSubmit = (data: TeamMemberValues) => {
        const fieldsObj: Record<string, string> = {}
        customFields.forEach(f => {
            if (f.key.trim()) {
                fieldsObj[f.key.trim()] = f.value
            }
        })
        
        onSubmit({
            ...data,
            customFields: JSON.stringify(fieldsObj)
        })
    }

    return (
        <AdminFormShell
            title={initialData ? 'Editar Miembro' : 'Nuevo Miembro'}
            description={initialData ? `Actualiza la información de ${initialData.name}` : 'Añade un nuevo profesional al equipo'}
            onCancel={onCancel}
            formId="team-member-form"
            isSubmitting={isSubmitting}
            submitLabel={initialData ? 'Guardar Cambios' : 'Añadir Miembro'}
        >
            <form id="team-member-form" onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sidebar */}
                <div className="lg:col-span-1 space-y-6">
                    <AdminCard title="Imagen de Perfil" icon={<User size={18} className="text-indigo-500" />}>
                        <div className="flex flex-col items-center">
                            <div className="relative group w-40 h-40">
                                <div className={cn(
                                    "w-full h-full rounded-full overflow-hidden border-4 border-white shadow-xl transition-all relative bg-gray-50 flex items-center justify-center",
                                    !photoUrl && "border-dashed border-gray-200"
                                )}>
                                    {photoUrl ? (
                                        <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="text-gray-300">
                                            {uploading ? <Loader2 size={32} className="animate-spin text-indigo-500" /> : <Upload size={32} />}
                                        </div>
                                    )}
                                    
                                    <label className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white text-[10px] font-black tracking-widest uppercase">
                                        <Upload size={18} className="mb-1" />
                                        {photoUrl ? 'CAMBIAR' : 'SUBIR'}
                                        <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                                    </label>
                                </div>

                                {photoUrl && (
                                    <button 
                                        type="button"
                                        onClick={() => setValue('photoUrl', null)}
                                        className="absolute top-1 right-1 p-1.5 bg-red-500 text-white rounded-full shadow-lg hover:scale-110 transition-transform z-10"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>

                            <div className="mt-8 w-full space-y-4">
                                <div className={cn(
                                    "flex items-center justify-between p-3 rounded-2xl border transition-all",
                                    showPhoto ? "bg-emerald-50/50 border-emerald-100" : "bg-gray-50 border-gray-200"
                                )}>
                                    <div className="space-y-0.5">
                                        <p className={cn("text-xs font-bold", showPhoto ? "text-emerald-900" : "text-gray-900")}>Foto Pública</p>
                                        <p className={cn("text-[10px] font-medium uppercase tracking-tight", showPhoto ? "text-emerald-600" : "text-gray-500")}>
                                            {showPhoto ? 'Visible' : 'Oculta'}
                                        </p>
                                    </div>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input type="checkbox" checked={showPhoto} onChange={() => setValue('showPhoto', !showPhoto)} className="sr-only peer" />
                                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Orden Visual" icon={<Settings size={18} className="text-gray-400" />}>
                        <div className="space-y-2">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Posición en Equipo</label>
                            <input
                                type="number"
                                {...register('order', { valueAsNumber: true })}
                                className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-bold"
                            />
                            <p className="text-[10px] text-gray-400 italic mt-1 ml-1">Valores bajos aparecen al principio.</p>
                        </div>
                    </AdminCard>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <AdminCard title="Perfil Profesional" icon={<Briefcase size={18} className="text-indigo-500" />}>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between mb-1 ml-1">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Nombre Completo *</label>
                                        <button
                                            type="button"
                                            onClick={() => setValue('showName', !showName)}
                                            className={cn(
                                                "text-[9px] font-black px-2 py-0.5 rounded-full border transition-all uppercase tracking-tighter",
                                                showName ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-gray-100 text-gray-400 border-gray-200"
                                            )}
                                        >
                                            {showName ? 'VISIBLE' : 'OCULTO'}
                                        </button>
                                    </div>
                                    <input
                                        {...register('name')}
                                        placeholder="Ej: Juan Pérez"
                                        className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-bold text-gray-900"
                                    />
                                    {errors.name && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{errors.name.message}</p>}
                                </div>

                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Cargo / Rol</label>
                                    <input
                                        {...register('role')}
                                        placeholder="Ej: CEO & Fundador"
                                        className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                        <Phone size={12} className="text-gray-400" /> Teléfono
                                    </label>
                                    <input
                                        {...register('phone')}
                                        placeholder="+34 ..."
                                        className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none font-mono"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                        <Linkedin size={12} className="text-blue-600" /> LinkedIn URL
                                    </label>
                                    <input
                                        {...register('linkedIn')}
                                        placeholder="https://linkedin.com/in/..."
                                        className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-mono text-[11px]"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                    <FileText size={12} className="text-gray-400" /> Biografía
                                </label>
                                <textarea
                                    {...register('bio')}
                                    rows={4}
                                    placeholder="Breve descripción de la trayectoria profesional..."
                                    className="w-full bg-gray-50/50 border-gray-200 border rounded-xl p-4 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm resize-none outline-none leading-relaxed"
                                />
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Redes y Datos Extra" icon={<Plus size={18} className="text-indigo-400" />}>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between mb-2">
                                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Enlaces adicionales (X, Web, etc.)</p>
                                <button
                                    type="button"
                                    onClick={addCustomField}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-[10px] font-black hover:bg-indigo-100 transition-all uppercase tracking-tighter"
                                >
                                    <Plus size={14} /> AÑADIR CAMPO
                                </button>
                            </div>
                            
                            <div className="space-y-3">
                                {customFields.length === 0 ? (
                                    <div className="text-center py-10 border-2 border-dashed border-gray-100 rounded-2xl bg-gray-50/30">
                                        <Settings2 size={24} className="mx-auto mb-2 text-gray-200" />
                                        <p className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Sin campos extra</p>
                                    </div>
                                ) : (
                                    customFields.map((field, idx) => (
                                        <div key={idx} className="flex gap-3 items-start group animate-in fade-in slide-in-from-top-1">
                                            <div className="flex-1 grid grid-cols-2 gap-3 p-3 bg-white rounded-xl border border-gray-200 shadow-sm">
                                                <input
                                                    value={field.key}
                                                    onChange={(e) => updateCustomField(idx, e.target.value, field.value)}
                                                    placeholder="Nombre (ej: Twitter)"
                                                    className="bg-gray-50/50 border-gray-100 border rounded-lg px-3 py-2 text-[11px] font-bold focus:bg-white outline-none"
                                                />
                                                <input
                                                    value={field.value}
                                                    onChange={(e) => updateCustomField(idx, field.key, e.target.value)}
                                                    placeholder="Valor (ej: @usuario)"
                                                    className="bg-gray-50/50 border-gray-100 border rounded-lg px-3 py-2 text-[11px] focus:bg-white outline-none"
                                                />
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => removeCustomField(idx)}
                                                className="mt-2.5 p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </AdminCard>
                </div>
            </div>
            </form>
        </AdminFormShell>
    )
}
