'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Settings, Save, Layout, Type, MousePointer2, Smartphone } from 'lucide-react'

const settingsSchema = z.object({
    sectionTitle: z.string().min(2),
    sectionSubtitle: z.string().optional().or(z.literal('')),
    layoutType: z.string(),
    maxVisibleItems: z.number().min(1).max(20),
    autoplay: z.boolean(),
    animationSpeed: z.number().min(500).max(10000),
    showDividers: z.boolean(),
    showBackground: z.boolean(),
    backgroundStyle: z.string(),
    mobileStack: z.boolean(),
    footerEnabled: z.boolean(),
})

type SettingsFormValues = z.infer<typeof settingsSchema>

interface PartnerSettingsFormProps {
    initialData: any
    onSubmit: (data: any) => void
}

export default function PartnerSettingsForm({ initialData, onSubmit }: PartnerSettingsFormProps) {
    const { register, handleSubmit, formState: { isSubmitting } } = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: initialData
    })

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-8">
            <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Settings size={20} className="text-indigo-500" />
                    Configuración Visual de la Sección
                </h3>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all font-bold shadow-sm disabled:opacity-50"
                >
                    <Save size={18} />
                    {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Type size={14} /> Textos Principales
                    </h4>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Título de la Sección</label>
                        <input {...register('sectionTitle')} className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Subtítulo (opcional)</label>
                        <input {...register('sectionSubtitle')} className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Layout size={14} /> Layout y Estilo
                    </h4>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Tipo de Diseño</label>
                        <select {...register('layoutType')} className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm">
                            <option value="horizontal-logos">Logos Horizontales</option>
                            <option value="grid">Cuadrícula Limpia</option>
                            <option value="slider">Carrusel Automático</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <label className="text-sm font-bold text-gray-700">Mostrar Divisores</label>
                        <input type="checkbox" {...register('showDividers')} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <label className="text-sm font-bold text-gray-700">Fondo Especial</label>
                        <input type="checkbox" {...register('showBackground')} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                    </div>
                </div>

                <div className="space-y-4">
                    <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Smartphone size={14} /> Comportamiento
                    </h4>
                    <div className="flex items-center justify-between py-2">
                        <label className="text-sm font-bold text-gray-700">Activar en Footer</label>
                        <input type="checkbox" {...register('footerEnabled')} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                    </div>
                    <div className="flex items-center justify-between py-2">
                        <label className="text-sm font-bold text-gray-700">Stack en Móvil</label>
                        <input type="checkbox" {...register('mobileStack')} className="w-4 h-4 rounded border-gray-300 text-indigo-600" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Máximo de Items Visibles</label>
                        <input type="number" {...register('maxVisibleItems', { valueAsNumber: true })} className="w-full bg-gray-50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm" />
                    </div>
                </div>
            </div>
        </form>
    )
}
