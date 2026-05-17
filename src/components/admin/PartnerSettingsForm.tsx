'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Settings, Layout, Type, Smartphone, Palette, CheckCircle2 } from 'lucide-react'
import AdminFormShell from './ui/AdminFormShell'
import AdminCard from './ui/AdminCard'
import { cn } from '@/lib/utils'

const settingsSchema = z.object({
    sectionTitle: z.string().min(2, 'El título es obligatorio'),
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
    onCancel?: () => void
}

export default function PartnerSettingsForm({ initialData, onSubmit, onCancel }: PartnerSettingsFormProps) {
    const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<SettingsFormValues>({
        resolver: zodResolver(settingsSchema),
        defaultValues: initialData
    })

    return (
        <AdminFormShell
            title="Configuración Visual"
            description="Personaliza la presencia y comportamiento de los partners en la plataforma"
            onCancel={onCancel}
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            submitLabel="Guardar Cambios"
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Text and Content */}
                <div className="lg:col-span-1 space-y-6">
                    <AdminCard title="Contenido Editorial" icon={<Type size={18} className="text-indigo-500" />}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Título de la Sección</label>
                                <input 
                                    {...register('sectionTitle')} 
                                    className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-bold text-gray-900 outline-none"
                                    placeholder="Nuestros Partners"
                                />
                                {errors.sectionTitle && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{String(errors.sectionTitle.message)}</p>}
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Subtítulo Descriptivo</label>
                                <textarea 
                                    {...register('sectionSubtitle')} 
                                    rows={4}
                                    className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none resize-none leading-relaxed"
                                    placeholder="Breve descripción bajo el título..."
                                />
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Ajustes de Motor" icon={<Settings size={18} className="text-gray-400" />}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Items Visibles (Máx)</label>
                                <input 
                                    type="number" 
                                    {...register('maxVisibleItems', { valueAsNumber: true })} 
                                    className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-bold outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Velocidad (ms)</label>
                                <input 
                                    type="number" 
                                    {...register('animationSpeed', { valueAsNumber: true })} 
                                    className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-mono outline-none"
                                />
                                <p className="text-[10px] text-gray-400 italic ml-1 mt-1">Tiempo entre transiciones.</p>
                            </div>
                        </div>
                    </AdminCard>
                </div>

                {/* Layout and Responsive */}
                <div className="lg:col-span-2 space-y-6">
                    <AdminCard title="Diseño y Visualización" icon={<Layout size={18} className="text-indigo-500" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Sistema de Layout</label>
                                <div className="space-y-3">
                                    {[
                                        { id: 'horizontal-logos', label: 'Logos Horizontales', desc: 'Fila continua' },
                                        { id: 'grid', label: 'Cuadrícula Limpia', desc: 'Malla equilibrada' },
                                        { id: 'slider', label: 'Carrusel Automático', desc: 'Movimiento fluido' }
                                    ].map(layout => (
                                        <label 
                                            key={layout.id}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group",
                                                watch('layoutType') === layout.id 
                                                    ? "bg-indigo-50/50 border-indigo-200 ring-1 ring-indigo-200 shadow-sm" 
                                                    : "bg-white border-gray-100 hover:border-gray-200"
                                            )}
                                        >
                                            <div className="flex flex-col">
                                                <span className={cn(
                                                    "text-sm font-bold",
                                                    watch('layoutType') === layout.id ? "text-indigo-900" : "text-gray-700"
                                                )}>{layout.label}</span>
                                                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">{layout.desc}</span>
                                            </div>
                                            <input 
                                                type="radio" 
                                                {...register('layoutType')} 
                                                value={layout.id} 
                                                className="sr-only" 
                                            />
                                            {watch('layoutType') === layout.id && (
                                                <div className="w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center text-white">
                                                    <CheckCircle2 size={14} />
                                                </div>
                                            )}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-4">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 ml-1">Comportamiento & UI</label>
                                
                                <div className="space-y-3">
                                    {[
                                        { id: 'footerEnabled', label: 'Activar en Footer', desc: 'Presencia Global' },
                                        { id: 'mobileStack', label: 'Stack en Móvil', desc: 'Optimización Vertical' },
                                        { id: 'showDividers', label: 'Mostrar Divisores', desc: 'Separación Visual' },
                                        { id: 'showBackground', label: 'Fondo Especial', desc: 'Contraste de Sección' },
                                    ].map((toggle) => (
                                        <label 
                                            key={toggle.id}
                                            className={cn(
                                                "flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer group",
                                                watch(toggle.id as any) 
                                                    ? "bg-emerald-50/30 border-emerald-100" 
                                                    : "bg-gray-50/50 border-gray-100 hover:bg-white hover:border-indigo-100"
                                            )}
                                        >
                                            <div className="space-y-0.5">
                                                <p className={cn(
                                                    "text-sm font-bold",
                                                    watch(toggle.id as any) ? "text-emerald-900" : "text-gray-900"
                                                )}>{toggle.label}</p>
                                                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-tight">{toggle.desc}</p>
                                            </div>
                                            <div className="relative inline-flex items-center cursor-pointer">
                                                <input type="checkbox" {...register(toggle.id as any)} className="sr-only peer" />
                                                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:bg-emerald-500 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all"></div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </AdminCard>
                </div>
            </div>
        </AdminFormShell>
    )
}
