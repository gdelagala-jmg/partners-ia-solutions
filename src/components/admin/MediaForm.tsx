'use client'

import { useState } from 'react'

interface MediaFormProps {
    initialData?: any
    onSubmit: (data: any) => void
    onCancel: () => void
}

export default function MediaForm({ initialData, onSubmit, onCancel }: MediaFormProps) {
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

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 p-6 rounded-xl space-y-4 shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Título</label>
                    <input
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Ej: Introducción a la IA"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Tipo</label>
                    <select
                        value={formData.type}
                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="VIDEO">Video</option>
                        <option value="PODCAST">Podcast</option>
                    </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">URL (YouTube Embed / Spotify Embed)</label>
                    <input
                        type="text"
                        value={formData.url}
                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://..."
                    />
                    <p className="text-xs text-gray-500">Link de 'Embed' provisto por la plataforma.</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                    <label className="text-sm font-medium text-gray-700">Código HTML (Embed)</label>
                    <textarea
                        value={formData.embedHtml}
                        onChange={(e) => setFormData({ ...formData, embedHtml: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                        placeholder="Ej: <iframe ...></iframe>"
                    />
                    <p className="text-xs text-gray-500">Opcional. Si se usa código HTML, se ignorará el campo URL de arriba.</p>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Thumbnail (URL opcional)</label>
                    <input
                        type="text"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://..."
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Orden</label>
                    <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div className="flex items-center space-x-2 pt-2">
                <input
                    type="checkbox"
                    id="published"
                    checked={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-700">Publicado</label>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white text-sm font-bold rounded-lg hover:bg-blue-500 transition-colors shadow-sm"
                >
                    {initialData ? 'Actualizar' : 'Guardar'}
                </button>
            </div>
        </form>
    )
}
