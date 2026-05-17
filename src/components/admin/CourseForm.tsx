'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import AdminFormShell from './ui/AdminFormShell'
import AdminCard from './ui/AdminCard'
import { BookOpen, Clock, Tag, Image as ImageIcon, Globe, DollarSign, BarChart, ExternalLink, Sparkles } from 'lucide-react'

const courseSchema = z.object({
    title: z.string().min(1, 'El título es obligatorio'),
    slug: z.string().min(1, 'El slug es obligatorio'),
    description: z.string().min(1, 'La descripción es obligatoria'),
    level: z.string().min(1, 'El nivel es obligatorio'),
    duration: z.string().min(1, 'La duración es obligatoria'),
    price: z.string().optional(),
    coverImage: z.string().optional(),
    published: z.boolean().optional(),
})

type CourseFormValues = z.infer<typeof courseSchema>

export default function CourseForm({ initialData, onSubmit, onCancel }: any) {
    const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm<CourseFormValues>({
        resolver: zodResolver(courseSchema),
        defaultValues: initialData || {
            published: false,
            level: 'Principiante',
        },
    })

    const handleTitleChange = (e: any) => {
        if (!initialData) {
            const slugVal = e.target.value.toLowerCase()
                .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
                .replace(/ /g, '-').replace(/[^\w-]+/g, '')
            setValue('slug', slugVal)
        }
    }

    const coverImageUrl = watch('coverImage')

    return (
        <AdminFormShell
            title={initialData ? 'Editar Curso' : 'Nuevo Programa'}
            description={initialData ? `Configuración del programa formativo ID: ${initialData.id}` : 'Diseña y lanza un nuevo programa educativo de IA'}
            onCancel={onCancel}
            onSubmit={handleSubmit(onSubmit)}
            isSubmitting={isSubmitting}
            submitLabel={initialData ? 'Guardar Cambios' : 'Lanzar Curso'}
        >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Column */}
                <div className="lg:col-span-2 space-y-6">
                    <AdminCard title="Contenido Principal" icon={<BookOpen size={18} className="text-indigo-500" />}>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Título del Programa Formativo</label>
                                <input
                                    {...register('title')}
                                    onChange={(e) => {
                                        register('title').onChange(e);
                                        handleTitleChange(e);
                                    }}
                                    placeholder="Ej: Master en IA Generativa..."
                                    className="block w-full bg-gray-50/50 border-gray-200 border rounded-2xl text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 shadow-sm transition-all h-14 px-5 text-xl font-black placeholder:text-gray-300 outline-none"
                                />
                                {errors.title && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{errors.title.message}</p>}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Slug (URL del curso)</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                                            <Globe size={14} />
                                        </div>
                                        <input
                                            {...register('slug')}
                                            placeholder="master-ia-generativa"
                                            className="block w-full bg-gray-50/50 border-gray-200 border rounded-xl text-gray-500 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 shadow-sm transition-all h-11 px-4 pl-10 font-mono text-xs outline-none"
                                        />
                                    </div>
                                    {errors.slug && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{errors.slug.message}</p>}
                                </div>
                                
                                <div className="space-y-2">
                                    <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Nivel de Dificultad</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500">
                                            <BarChart size={14} />
                                        </div>
                                        <select 
                                            {...register('level')} 
                                            className="block w-full bg-gray-50/50 border-gray-200 border rounded-xl text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 shadow-sm transition-all h-11 px-4 appearance-none font-bold text-sm outline-none"
                                        >
                                            <option value="Principiante">Principiante</option>
                                            <option value="Intermedio">Intermedio</option>
                                            <option value="Avanzado">Avanzado</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Descripción del Programa</label>
                                <textarea
                                    {...register('description')}
                                    rows={6}
                                    placeholder="Describe el valor diferencial de este curso..."
                                    className="block w-full bg-gray-50/50 border-gray-200 border rounded-2xl text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 shadow-sm transition-all p-5 text-sm leading-relaxed resize-none outline-none"
                                />
                                {errors.description && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{errors.description.message}</p>}
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Logística y Pricing" icon={<Tag size={18} className="text-indigo-500" />}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                    <Clock size={14} className="text-gray-400" /> Duración Estimada
                                </label>
                                <input
                                    {...register('duration')}
                                    placeholder="Ej: 4 semanas / 20 horas"
                                    className="block w-full bg-gray-50/50 border-gray-200 border rounded-xl text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 shadow-sm transition-all h-11 px-4 text-sm font-bold outline-none"
                                />
                                {errors.duration && <p className="text-red-500 text-[10px] font-bold mt-1 uppercase italic ml-1">{errors.duration.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                                    <DollarSign size={14} className="text-gray-400" /> Precio de Venta
                                </label>
                                <input
                                    {...register('price')}
                                    placeholder="Ej: Gratis / 199€"
                                    className="block w-full bg-gray-50/50 border-gray-200 border rounded-xl text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 shadow-sm transition-all h-11 px-4 text-sm font-bold text-emerald-600 outline-none"
                                />
                            </div>
                        </div>
                    </AdminCard>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    <AdminCard title="Estado y Visibilidad" icon={<Sparkles size={18} className="text-emerald-500" />}>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/50 transition-all hover:bg-emerald-50/50">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-emerald-900">Estado Publicado</p>
                                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Visible en la Escuela</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        {...register('published')} 
                                        className="sr-only peer" 
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                                </label>
                            </div>
                            
                            <div className="p-4 bg-gray-50/50 rounded-2xl border border-gray-200 border-dashed">
                                <div className="flex items-center gap-2 text-gray-400 mb-2">
                                    <ExternalLink size={14} />
                                    <p className="text-[10px] font-bold uppercase tracking-widest">Previsualización URL</p>
                                </div>
                                <p className="text-[10px] text-gray-500 italic leading-relaxed">
                                    El curso aparecerá en la sección de formación con la ruta: 
                                    <span className="block mt-1 font-mono text-indigo-600 font-bold">/escuela/{watch('slug') || '...'}</span>
                                </p>
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="Identidad Visual" icon={<ImageIcon size={18} className="text-indigo-400" />}>
                        <div className="space-y-6">
                            <div className="relative aspect-[16/10] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/50 flex flex-col items-center justify-center gap-2 overflow-hidden group hover:border-indigo-400 hover:bg-indigo-50/30 transition-all shadow-inner">
                                {coverImageUrl ? (
                                    <>
                                        <img src={coverImageUrl} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <p className="text-white text-xs font-bold px-3 py-1.5 bg-white/10 rounded-full border border-white/20 uppercase tracking-widest">Cambiar Imagen</p>
                                        </div>
                                    </>
                                ) : (
                                    <div className="text-center p-6">
                                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                                            <ImageIcon size={24} className="text-gray-300" />
                                        </div>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Esperando Portada</p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="space-y-2">
                                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">URL de Portada Principal</label>
                                <input
                                    {...register('coverImage')}
                                    placeholder="https://..."
                                    className="block w-full bg-gray-50/50 border-gray-200 border rounded-xl text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 shadow-sm transition-all h-10 px-4 text-[10px] font-mono border-dashed outline-none"
                                />
                            </div>
                        </div>
                    </AdminCard>
                </div>
            </div>
        </AdminFormShell>
    )
}
