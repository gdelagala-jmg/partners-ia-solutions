'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, Save, X, Calendar, Type, Layout, Flag, StickyNote } from 'lucide-react'

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
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<EditorialValues>({
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-h-[85vh] overflow-y-auto px-2 custom-scrollbar pb-6">
      {/* Configuration Group */}
      <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
        <h3 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <Layout size={14} className="text-blue-500" /> Configuración de Ubicación
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 ml-1">PÁGINA (PAGÉ KEY)</label>
            <select 
              {...register('pageKey')}
              className="w-full bg-white border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="home">Home (Principal)</option>
              <option value="soluciones">Soluciones</option>
              <option value="noticias">Noticias</option>
              <option value="app">App / Dashboard</option>
              <option value="global">Global (Toda la web)</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 ml-1">SECCIÓN (SECTION KEY)</label>
            <select 
              {...register('sectionKey')}
              className="w-full bg-white border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="hero">Hero (Principal)</option>
              <option value="cta-final">CTA Final</option>
              <option value="floating-banner">Banner Flotante</option>
              <option value="sidebar">Sidebar</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content Group */}
      <div className="space-y-4">
        <h3 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <Type size={14} className="text-indigo-500" /> Contenido Visual
        </h3>
        
        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1.5 ml-1">BADGE (EJ: "NUEVO", "RELEVANTE")</label>
          <input 
            {...register('badge')}
            className="w-full bg-white border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
            placeholder="Texto pequeño superior..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 ml-1">TÍTULO LÍNEA 1</label>
            <input 
              {...register('titleLine1')}
              className="w-full bg-white border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Primera parte del título..."
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 ml-1">TÍTULO LÍNEA 2</label>
            <input 
              {...register('titleLine2')}
              className="w-full bg-white border-slate-200 rounded-xl px-4 py-2.5 text-sm font-bold focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Segunda parte del título..."
            />
          </div>
        </div>

        <div>
          <label className="block text-[11px] font-bold text-slate-400 mb-1.5 ml-1">SUBTÍTULO / DESCRIPCIÓN</label>
          <textarea 
            {...register('subtitle')}
            rows={3}
            className="w-full bg-white border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 transition-all resize-none"
            placeholder="Explicación detallada del mensaje..."
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 ml-1">TEXTO CTA (BOTÓN)</label>
            <input 
              {...register('ctaText')}
              className="w-full bg-white border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Ej: Empezar Ahora"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 ml-1">URL CTA</label>
            <input 
              {...register('ctaUrl')}
              className="w-full bg-white border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
              placeholder="Ej: /contacto o https://..."
            />
          </div>
        </div>
      </div>

      {/* Attributes & Strategy Group */}
      <div className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100 space-y-4">
        <h3 className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <Flag size={14} className="text-emerald-500" /> Atributos y Estrategia
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 ml-1">CATEGORÍA</label>
            <select 
              {...register('category')}
              className="w-full bg-white border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="GENERAL">General</option>
              <option value="TECH">Tecnología</option>
              <option value="BUSINESS">Negocios</option>
              <option value="HUMAN">Humano</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 ml-1">TONO</label>
            <select 
              {...register('tone')}
              className="w-full bg-white border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-100 transition-all"
            >
              <option value="DIRECT">Directo</option>
              <option value="INSPIRATIONAL">Inspiracional</option>
              <option value="URGENT">Urgente</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-bold text-slate-400 mb-1.5 ml-1">PRIORIDAD (MAYOR = 1º)</label>
            <input 
              type="number"
              {...register('priority')}
              className="w-full bg-white border-slate-200 rounded-xl px-3 py-2 text-xs focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mb-1.5 ml-1">
              <Calendar size={12} /> FECHA INICIO (OPCIONAL)
            </label>
            <input 
              type="date"
              {...register('startDate')}
              className="w-full bg-white border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
          <div>
            <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 mb-1.5 ml-1">
              <Calendar size={12} /> FECHA FIN (OPCIONAL)
            </label>
            <input 
              type="date"
              {...register('endDate')}
              className="w-full bg-white border-slate-200 rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Internal Notes */}
      <div className="space-y-2">
        <label className="flex items-center gap-2 text-[11px] font-bold text-slate-400 uppercase tracking-widest ml-1">
          <StickyNote size={14} className="text-amber-500" /> Notas Internas (Solo Admin)
        </label>
        <textarea 
          {...register('internalNotes')}
          rows={2}
          className="w-full bg-slate-50/50 border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-amber-100 transition-all resize-none italic"
          placeholder="Ej: Solo para conferencias de IA..."
        />
      </div>

      {/* Status Toggle */}
      <div className="flex items-center justify-between p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50">
        <div className="space-y-0.5">
          <p className="text-sm font-bold text-blue-900">Estado del Contenido</p>
          <p className="text-[10px] text-blue-600 font-medium uppercase tracking-tight">Si está desactivado, nunca se mostrará en la web</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" {...register('isActive')} className="sr-only peer" />
          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Form Actions */}
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
          {isSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
          {initialData ? 'Guardar Cambios' : 'Publicar Contenido'}
        </button>
      </div>
    </form>
  )
}
