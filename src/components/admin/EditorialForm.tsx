'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Save, Calendar, Type, Layout, Flag, StickyNote, Globe, Settings, Link as LinkIcon, CheckCircle2 } from 'lucide-react'
import AdminFormShell from './ui/AdminFormShell'
import AdminCard from './ui/AdminCard'
import { cn } from '@/lib/utils'

const editorialSchema = z.object({
  pageKey: z.string().min(1, 'El identificador de página es obligatorio'),
  sectionKey: z.string().min(1, 'El identificador de sección es obligatorio'),
  badge: z.string().nullable().optional(),
  titleLine1: z.string().nullable().optional(),
  titleLine2: z.string().nullable().optional(),
  subtitle: z.string().nullable().optional(),
  supportText: z.string().nullable().optional(),
  ctaText: z.string().nullable().optional(),
  ctaUrl: z.string().nullable().optional(),
  category: z.string().default('GENERAL'),
  tone: z.string().default('DIRECT'),
  priority: z.coerce.number().default(0),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  isActive: z.boolean().default(true),
  internalNotes: z.string().nullable().optional(),
})

export type EditorialValues = z.infer<typeof editorialSchema>

interface EditorialFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export default function EditorialForm({ initialData, onSubmit, onCancel }: EditorialFormProps) {
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<EditorialValues>({
    resolver: zodResolver(editorialSchema),
    defaultValues: initialData ? {
      ...initialData,
      startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
      endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
    } : {
      pageKey: 'home',
      sectionKey: 'hero',
      category: 'GENERAL',
      tone: 'DIRECT',
      priority: 0,
      isActive: true,
    }
  })

  return (
    <AdminFormShell
      title={initialData ? 'Editar Contenido Editorial' : 'Nuevo Contenido Editorial'}
      description="Gestiona los mensajes estratégicos y secciones dinámicas de la plataforma"
      onCancel={onCancel}
      onSubmit={handleSubmit(onSubmit)}
      isSubmitting={isSubmitting}
      submitLabel={initialData ? 'Guardar Cambios' : 'Publicar Contenido'}
    >
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
        {/* Placement & Status Column */}
        <div className="lg:col-span-1 space-y-6">
          <AdminCard title="Ubicación y Estado" icon={<Layout size={18} className="text-indigo-500" />}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Página de Destino</label>
                <select 
                  {...register('pageKey')}
                  className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-bold text-gray-900 outline-none"
                >
                  <option value="home">Home (Principal)</option>
                  <option value="soluciones">Soluciones</option>
                  <option value="noticias">Noticias</option>
                  <option value="app">App / Dashboard</option>
                  <option value="global">Global (Toda la web)</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Sección Específica</label>
                <select 
                  {...register('sectionKey')}
                  className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-bold text-gray-900 outline-none"
                >
                  <option value="hero">Hero (Principal)</option>
                  <option value="cta-final">CTA Final</option>
                  <option value="floating-banner">Banner Flotante</option>
                  <option value="sidebar">Sidebar</option>
                </select>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between p-4 bg-emerald-50/30 rounded-2xl border border-emerald-100/50 transition-all">
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-emerald-900">Estado Activo</p>
                    <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tight">Visible en producción</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" {...register('isActive')} className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Estrategia" icon={<Flag size={18} className="text-amber-500" />}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Prioridad de Visualización</label>
                <input 
                  type="number"
                  {...register('priority')}
                  className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-amber-50 focus:border-amber-400 transition-all shadow-sm font-bold outline-none"
                />
                <p className="text-[10px] text-gray-400 italic ml-1">Valores altos aparecen primero.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Categoría</label>
                  <select 
                    {...register('category')}
                    className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-3 py-2.5 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all font-bold outline-none"
                  >
                    <option value="GENERAL">General</option>
                    <option value="TECH">Tecnología</option>
                    <option value="BUSINESS">Negocios</option>
                    <option value="HUMAN">Humano</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Tono</label>
                  <select 
                    {...register('tone')}
                    className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-3 py-2.5 text-xs focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all font-bold outline-none"
                  >
                    <option value="DIRECT">Directo</option>
                    <option value="INSPIRATIONAL">Inspiracional</option>
                    <option value="URGENT">Urgente</option>
                  </select>
                </div>
              </div>
            </div>
          </AdminCard>
        </div>

        {/* Content Column */}
        <div className="lg:col-span-2 space-y-6">
          <AdminCard title="Textos y Mensajes" icon={<Type size={18} className="text-indigo-600" />}>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Badge Superior (Opcional)</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none transition-colors group-focus-within:text-indigo-500 text-gray-400">
                    <StickyNote size={16} />
                  </div>
                  <input 
                    {...register('badge')}
                    className="w-full bg-gray-50/50 border-gray-200 border rounded-xl pl-11 pr-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-bold text-indigo-600 placeholder:font-normal outline-none"
                    placeholder="Ej: NUEVO MÉTODO"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2 min-w-0">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Título Línea 1</label>
                  <input 
                    {...register('titleLine1')}
                    className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-3 text-base sm:text-lg font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none truncate"
                    placeholder="Impacto principal..."
                  />
                </div>
                <div className="space-y-2 min-w-0">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Título Línea 2</label>
                  <input 
                    {...register('titleLine2')}
                    className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-3 text-base sm:text-lg font-bold text-gray-900 focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm outline-none truncate"
                    placeholder="Complemento visual..."
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Descripción Principal</label>
                <textarea 
                  {...register('subtitle')}
                  rows={4}
                  className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-3 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm resize-none leading-relaxed outline-none"
                  placeholder="Explica detalladamente el mensaje..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-gray-100">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">Texto del Botón (CTA)</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500">
                      <CheckCircle2 size={16} />
                    </div>
                    <input 
                      {...register('ctaText')}
                      className="w-full bg-gray-50/50 border-gray-200 border rounded-xl pl-11 pr-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-bold text-gray-900 outline-none"
                      placeholder="Ej: Ver Soluciones"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1">URL de Destino</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500">
                      <LinkIcon size={16} />
                    </div>
                    <input 
                      {...register('ctaUrl')}
                      className="w-full bg-gray-50/50 border-gray-200 border rounded-xl pl-11 pr-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all shadow-sm font-mono text-gray-600 outline-none"
                      placeholder="/soluciones"
                    />
                  </div>
                </div>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Vigencia y Control Interno" icon={<Calendar size={18} className="text-gray-400" />}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                      <Calendar size={12} /> Fecha Inicio
                    </label>
                    <input 
                      type="date"
                      {...register('startDate')}
                      className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all outline-none font-bold text-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                      <Calendar size={12} /> Fecha Fin
                    </label>
                    <input 
                      type="date"
                      {...register('endDate')}
                      className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-2 text-sm focus:bg-white focus:ring-4 focus:ring-indigo-50 focus:border-indigo-400 transition-all outline-none font-bold text-gray-700"
                    />
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 italic px-1">Opcional: Define un rango de tiempo para la visibilidad automática del contenido.</p>
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 ml-1 flex items-center gap-2">
                  <StickyNote size={14} className="text-amber-400" /> Notas de Auditoría Interna
                </label>
                <textarea 
                  {...register('internalNotes')}
                  rows={4}
                  className="w-full bg-gray-50/50 border-gray-200 border rounded-xl px-4 py-3 text-xs italic text-gray-600 focus:bg-white focus:ring-4 focus:ring-amber-50/50 focus:border-amber-200 transition-all shadow-inner resize-none outline-none leading-relaxed"
                  placeholder="Instrucciones especiales para el equipo o contexto histórico de este mensaje..."
                />
              </div>
            </div>
          </AdminCard>
        </div>
      </div>
    </AdminFormShell>
  )
}
