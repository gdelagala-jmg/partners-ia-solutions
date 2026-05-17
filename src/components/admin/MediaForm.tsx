'use client'

import { useState } from 'react'
import AdminCard from './ui/AdminCard'
import { cn } from '@/lib/utils'

interface MediaFormProps {
    initialData?: any
    onSubmit: (data: any) => void
    onCancel: () => void
}

export default function MediaForm({ initialData, onSubmit }: Omit<MediaFormProps, 'onCancel'>) {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        type: initialData?.type || 'VIDEO',
        url: initialData?.url || '',
        embedHtml: initialData?.embedHtml || '',
        thumbnail: initialData?.thumbnail || '',
        published: initialData?.published ?? false,
        order: initialData?.order || 0,
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
    }

    const inputClasses = "w-full bg-gray-50/50 border border-gray-100 focus:bg-white rounded-xl px-4 py-2.5 text-sm font-medium text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all placeholder:text-gray-300"
    const labelClasses = "text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 block"

    return (
        <form id="media-form" onSubmit={handleSubmit} className="space-y-6">
            <AdminCard title="Información General">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className={labelClasses}>Título del Contenido</label>
                        <input
                            type="text"
                            required
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className={inputClasses}
                            placeholder="Ej: Análisis de Tendencias IA 2024"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Tipo de Media</label>
                        <select
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            className={cn(inputClasses, "appearance-none")}
                        >
                            <option value="VIDEO">Video (YouTube/Vimeo)</option>
                            <option value="PODCAST">Podcast (Spotify/RSS)</option>
                        </select>
                    </div>
                </div>
            </AdminCard>

            <AdminCard title="Configuración de Embed">
                <div className="space-y-6">
                    <div className="space-y-1">
                        <label className={labelClasses}>URL de la Publicación</label>
                        <input
                            type="text"
                            value={formData.url}
                            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                            className={inputClasses}
                            placeholder="https://open.spotify.com/..."
                        />
                        <p className="text-[10px] text-gray-400 font-medium italic mt-1.5">Link directo para el botón &quot;Ver publicación&quot;.</p>
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Código HTML (iframe)</label>
                        <textarea
                            value={formData.embedHtml}
                            onChange={(e) => setFormData({ ...formData, embedHtml: e.target.value })}
                            className={cn(inputClasses, "h-32 font-mono text-[13px]")}
                            placeholder="Ej: <iframe src='...' />"
                        />
                        <p className="text-[10px] text-amber-500 font-bold uppercase tracking-wider mt-1.5 flex items-center gap-1">
                            <span>Opcional:</span>
                            <span className="opacity-60 italic normal-case font-medium">Si se usa HTML, se priorizará sobre la URL.</span>
                        </p>
                    </div>
                </div>
            </AdminCard>

            <AdminCard title="Metadatos & Visibilidad">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                        <label className={labelClasses}>Thumbnail URL (Opcional)</label>
                        <input
                            type="text"
                            value={formData.thumbnail}
                            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                            className={inputClasses}
                            placeholder="https://..."
                        />
                    </div>
                    <div className="space-y-1">
                        <label className={labelClasses}>Orden de Visualización</label>
                        <input
                            type="number"
                            value={formData.order}
                            onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                            className={inputClasses}
                        />
                    </div>
                </div>

                <div className="mt-6 flex items-center gap-3 p-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                    <div className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            id="published"
                            checked={formData.published}
                            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                    </div>
                    <label htmlFor="published" className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider">Publicar contenido inmediatamente</label>
                </div>
            </AdminCard>

            {/* Hidden Submit for AdminFormShell integration */}
            <button type="submit" className="hidden" />
        </form>
    )
}
