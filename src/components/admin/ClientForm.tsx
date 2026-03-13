'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { useEffect, useState } from 'react'
import { Upload, X, Globe, Phone, User, Landmark, MapPin, Tag } from 'lucide-react'

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

    useEffect(() => {
        if (initialData) {
            Object.keys(initialData).forEach((key) => {
                setValue(key as any, initialData[key])
            })
        }
    }, [initialData, setValue])

    const [uploading, setUploading] = useState(false)

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

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
        } catch (error) {
            console.error('Upload error:', error)
            alert('Error al subir el logo')
        } finally {
            setUploading(false)
        }
    }

    const [dragActive, setDragActive] = useState(false)

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true)
        } else if (e.type === "dragleave") {
            setDragActive(false)
        }
    }

    const handleDrop = async (e: React.DragEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        
        const file = e.dataTransfer.files?.[0]
        if (file && file.type.startsWith('image/')) {
            setUploading(true)
            const formData = new FormData()
            formData.append('file', file)
            try {
                const res = await fetch('/api/upload', { method: 'POST', body: formData })
                if (res.ok) {
                    const data = await res.json()
                    setValue('logoUrl', data.url)
                }
            } catch (error) {
                console.error('Upload error:', error)
            } finally {
                setUploading(false)
            }
        }
    }

    return (
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-100/50">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                    <User size={24} />
                </div>
                {initialData ? 'Editar Ficha de Cliente' : 'Alta de Nuevo Cliente'}
            </h2>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Left Column: Essential Info */}
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Landmark size={16} className="text-gray-400" />
                                Razón Social *
                            </label>
                            <input
                                {...register('companyName')}
                                className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-medium"
                                placeholder="Nombre oficial de la empresa"
                            />
                            {errors.companyName?.message && <p className="text-red-500 text-xs mt-1.5 font-bold">{String(errors.companyName.message)}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Tag size={16} className="text-gray-400" />
                                    CIF / NIF
                                </label>
                                <input
                                    {...register('taxId')}
                                    className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                                    placeholder="B12345678"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                    <Globe size={16} className="text-gray-400" />
                                    Sector
                                </label>
                                <input
                                    {...register('sector')}
                                    className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                                    placeholder="Ej. Finanzas, Salud..."
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin size={16} className="text-gray-400" />
                                Dirección
                            </label>
                            <input
                                {...register('address')}
                                className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                                placeholder="Calle, Número, Ciudad"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Globe size={16} className="text-gray-400" />
                                Web
                            </label>
                            <input
                                {...register('website')}
                                className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-blue-500 transition-all font-mono text-sm"
                                placeholder="https://www.cliente.com"
                            />
                        </div>
                    </div>

                    {/* Right Column: Contact & Logo */}
                    <div className="space-y-6">
                        <div className="bg-blue-50/50 p-6 rounded-2xl border border-blue-100 space-y-4">
                            <h3 className="text-sm font-black text-blue-900 uppercase tracking-widest">Información de Contacto</h3>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Persona de contacto</label>
                                <input
                                    {...register('contactName')}
                                    className="w-full bg-white border-gray-200 border rounded-xl px-4 py-2.5 text-gray-900 focus:outline-none focus:border-blue-500 transition-all"
                                    placeholder="Nombre completo"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Teléfono</label>
                                <div className="relative">
                                    <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input
                                        {...register('contactPhone')}
                                        className="w-full bg-white border-gray-200 border rounded-xl pl-11 pr-4 py-2.5 text-gray-900 focus:outline-none focus:border-blue-500 transition-all font-mono"
                                        placeholder="+34 600 000 000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                                <Landmark size={16} className="text-gray-400" />
                                Logo Corporativo
                            </label>

                            <div 
                                className={`relative h-48 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 overflow-hidden ${
                                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-gray-50'
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
                                            <label className="p-3 bg-blue-500 text-white rounded-full hover:scale-110 transition-transform cursor-pointer shadow-lg">
                                                <Upload size={20} />
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                            </label>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="p-4 bg-white rounded-2xl shadow-sm">
                                            <Upload className={`w-8 h-8 ${uploading ? 'animate-bounce text-blue-500' : 'text-gray-300'}`} />
                                        </div>
                                        <div className="text-center">
                                            <p className="text-sm font-bold text-gray-700">{uploading ? 'Subiendo logo...' : 'Arrastra el logo aquí'}</p>
                                            <label className="text-xs text-blue-600 font-bold hover:underline cursor-pointer">
                                                o haz clic para buscar
                                                <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                            </label>
                                        </div>
                                    </>
                                )}
                            </div>
                            <input type="hidden" {...register('logoUrl')} />
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-8 border-t border-gray-100">
                    <div className="flex items-center gap-3">
                        <div className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                {...register('active')}
                                id="active"
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"></div>
                            <label htmlFor="active" className="ml-3 text-sm font-bold text-gray-700">Cliente Activo</label>
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
                            className="flex-1 sm:flex-initial px-10 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-black shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? 'Guardando...' : initialData ? 'Actualizar Ficha' : 'Dar de Alta'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
