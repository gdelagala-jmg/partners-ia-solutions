'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useState, useEffect } from 'react'
import { Upload, X, Loader2, Plus, Phone, Linkedin, User, Briefcase, FileText, Settings2, Eye, EyeOff } from 'lucide-react'

const teamMemberSchema = z.object({
    name: z.string().min(1, 'El nombre es obligatorio'),
    phone: z.string().nullable().optional().default(null),
    photoUrl: z.string().nullable().optional().default(null),
    linkedIn: z.string().nullable().optional().default(null),
    role: z.string().nullable().optional().default(null),
    bio: z.string().nullable().optional().default(null),
    order: z.number().default(0),
    showPhoto: z.boolean().default(true),
    showName: z.boolean().default(true),
    customFields: z.string().default('{}'),
})


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
        resolver: zodResolver(teamMemberSchema) as any,

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

    // Initialize custom fields from JSON

    useEffect(() => {
        if (initialData?.customFields) {
            try {
                const parsed = JSON.parse(initialData.customFields);
                const fieldsArary = Object.entries(parsed).map(([key, value]) => ({ key, value: String(value) }));
                setCustomFields(fieldsArary);
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
        // Convert custom fields array back to JSON
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
        <form onSubmit={handleSubmit(handleFormSubmit as any)} className="space-y-6 max-h-[80vh] overflow-y-auto px-1">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Photo Upload */}
                <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 group transition-all hover:border-blue-400 hover:bg-blue-50/30 relative">
                    {/* Photo Visibility Toggle */}
                    <button
                        type="button"
                        onClick={() => setValue('showPhoto', !showPhoto)}
                        className={`absolute top-4 right-4 p-2 rounded-xl border transition-all shadow-sm ${
                            showPhoto 
                                ? 'bg-white text-blue-600 border-blue-100 hover:bg-blue-50' 
                                : 'bg-slate-200 text-slate-500 border-slate-300'
                        }`}
                        title={showPhoto ? "Foto Pública" : "Foto Oculta"}
                    >
                        {showPhoto ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>

                    {photoUrl ? (

                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-white shadow-xl group-hover:scale-105 transition-transform">
                            <img src={photoUrl} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                                type="button" 
                                onClick={() => setValue('photoUrl', '')}
                                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-white"
                            >
                                <X size={24} />
                            </button>
                        </div>
                    ) : (
                        <label className="cursor-pointer flex flex-col items-center group">
                            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 transition-colors shadow-sm">
                                {uploading ? <Loader2 size={32} className="animate-spin" /> : <Upload size={32} />}
                            </div>
                            <span className="mt-4 text-sm font-medium text-slate-500 group-hover:text-blue-600 transition-colors">
                                {uploading ? 'Subiendo...' : 'Subir Foto'}
                            </span>
                            <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
                        </label>
                    )}
                </div>

                {/* Main Info */}
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                <User size={14} className="text-blue-500" /> Nombre Completo
                            </label>
                            <button
                                type="button"
                                onClick={() => setValue('showName', !showName)}
                                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-black border transition-all ${
                                    showName 
                                        ? 'bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100' 
                                        : 'bg-slate-100 text-slate-400 border-slate-200'
                                }`}
                            >
                                {showName ? <Eye size={12} /> : <EyeOff size={12} />}
                                {showName ? 'PÚBLICO' : 'OCULTO'}
                            </button>
                        </div>
                        <input
                            {...register('name')}

                            className="w-full bg-white border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
                            placeholder="Ej: Juan Pérez"
                        />
                        {errors.name && <p className="text-red-500 text-[10px] mt-1">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                            <Briefcase size={14} className="text-indigo-500" /> Cargo / Rol
                        </label>
                        <input
                            {...register('role')}
                            className="w-full bg-white border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all shadow-sm"
                            placeholder="Ej: CEO & Fundador"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                <Phone size={14} className="text-emerald-500" /> Teléfono
                            </label>
                            <input
                                {...register('phone')}
                                className="w-full bg-white border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-emerald-100 focus:border-emerald-500 transition-all shadow-sm"
                                placeholder="+34 ..."
                            />
                        </div>
                        <div>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                                <Linkedin size={14} className="text-blue-600" /> LinkedIn
                            </label>
                            <input
                                {...register('linkedIn')}
                                className="w-full bg-white border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-blue-100 focus:border-blue-600 transition-all shadow-sm"
                                placeholder="https://linkedin.com/in/..."
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Bio */}
            <div>
                <label className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                    <FileText size={14} className="text-purple-500" /> Biografía Corta
                </label>
                <textarea
                    {...register('bio')}
                    rows={3}
                    className="w-full bg-white border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:ring-2 focus:ring-purple-100 focus:border-purple-500 transition-all shadow-sm resize-none"
                    placeholder="Describe brevemente la trayectoria o especialidad..."
                />
            </div>

            {/* Custom Fields Section */}
            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
                        <Settings2 size={16} className="text-slate-500" /> Campos Personalizados
                    </h3>
                    <button
                        type="button"
                        onClick={addCustomField}
                        className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-full text-xs font-bold text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                    >
                        <Plus size={14} /> Añadir Campo
                    </button>
                </div>
                
                <div className="space-y-3">
                    {customFields.length === 0 ? (
                        <p className="text-xs text-slate-400 italic text-center py-4">No hay campos adicionales</p>
                    ) : (
                        customFields.map((field, idx) => (
                            <div key={idx} className="flex gap-2 items-start group">
                                <div className="flex-1 grid grid-cols-2 gap-2">
                                    <input
                                        value={field.key}
                                        onChange={(e) => updateCustomField(idx, e.target.value, field.value)}
                                        placeholder="Nombre (ej: Twitter)"
                                        className="bg-white border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                    />
                                    <input
                                        value={field.value}
                                        onChange={(e) => updateCustomField(idx, field.key, e.target.value)}
                                        placeholder="Valor (ej: @usuario)"
                                        className="bg-white border-slate-200 rounded-lg px-3 py-2 text-xs focus:ring-2 focus:ring-blue-100 focus:border-blue-500"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeCustomField(idx)}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-slate-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 px-6 py-3 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {isSubmitting && <Loader2 size={18} className="animate-spin" />}
                    {initialData ? 'Actualizar Miembro' : 'Añadir Miembro'}
                </button>
            </div>
        </form>
    )
}
