'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Globe, EyeOff, Video, Mic } from 'lucide-react'
import MediaForm from '@/components/admin/MediaForm'

export default function MediaManagementPage() {
    const [mediaItems, setMediaItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentMedia, setCurrentMedia] = useState<any>(null)
    const [mainChannelHtml, setMainChannelHtml] = useState('')
    const [savingSettings, setSavingSettings] = useState(false)

    const fetchMedia = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/media')
            if (res.ok) {
                const data = await res.json()
                setMediaItems(data)
            }
        } catch (error) {
            console.error('Error fetching media:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMedia()
        fetchSettings()
    }, [])

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/settings?key=main_podcast_channel')
            if (res.ok) {
                const data = await res.json()
                setMainChannelHtml(data.value || '')
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        }
    }

    const handleSaveSettings = async () => {
        setSavingSettings(true)
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'main_podcast_channel', value: mainChannelHtml })
            })
            if (res.ok) {
                alert('Configuración guardada')
            }
        } catch (error) {
            console.error('Error saving settings:', error)
        } finally {
            setSavingSettings(false)
        }
    }

    const handleCreate = () => {
        setCurrentMedia(null)
        setIsEditing(true)
    }

    const handleEdit = (media: any) => {
        setCurrentMedia(media)
        setIsEditing(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este elemento?')) return

        try {
            await fetch(`/api/media/${id}`, { method: 'DELETE' })
            fetchMedia()
        } catch (error) {
            console.error('Error deleting media:', error)
        }
    }

    const handleSubmit = async (data: any) => {
        try {
            const url = currentMedia ? `/api/media/${currentMedia.id}` : '/api/media'
            const method = currentMedia ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                setIsEditing(false)
                fetchMedia()
            } else {
                alert('Error al guardar')
            }
        } catch (error) {
            console.error('Error saving media:', error)
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestión de Podcast y Videos</h1>
                    <p className="text-gray-500 mt-2">Gestiona el canal principal y los episodios individuales.</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium shadow-sm"
                    >
                        <Plus size={20} className="mr-2" />
                        Añadir Episodio/Video
                    </button>
                )}
            </div>

            {!isEditing && (
                <div className="mb-10 p-6 bg-white border border-gray-100 rounded-xl space-y-4 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900">Sección Principal (Canal de Podcast)</h2>
                    <p className="text-sm text-gray-500">Inserta el código HTML/Embed de tu canal principal (ej. widget de Spotify for Podcasters).</p>
                    <textarea
                        value={mainChannelHtml}
                        onChange={(e) => setMainChannelHtml(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32 font-mono text-sm"
                        placeholder="<iframe ...></iframe>"
                    />
                    <div className="flex justify-end">
                        <button
                            onClick={handleSaveSettings}
                            disabled={savingSettings}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg transition-colors text-sm font-medium"
                        >
                            {savingSettings ? 'Guardando...' : 'Guardar Canal Principal'}
                        </button>
                    </div>
                </div>
            )}

            {isEditing ? (
                <MediaForm
                    initialData={currentMedia}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">Cargando contenido...</div>
                    ) : mediaItems.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No hay contenido registrado.</div>
                    ) : (

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-800">
                                <thead className="bg-gray-950">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Título</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Tipo</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead >
                                <tbody className="divide-y divide-gray-800">
                                    {mediaItems.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-white">{item.title}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 inline-flex items-center text-xs leading-5 font-semibold rounded-full ${item.type === 'VIDEO' ? 'bg-indigo-900 text-indigo-200' : 'bg-green-900 text-green-200'
                                                    }`}>
                                                    {item.type === 'VIDEO' ? <Video size={14} className="mr-1" /> : <Mic size={14} className="mr-1" />}
                                                    {item.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {item.published ? (
                                                    <div className="flex items-center text-green-400 text-sm">
                                                        <Globe size={16} className="mr-1" /> Publicado
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-gray-500 text-sm">
                                                        <EyeOff size={16} className="mr-1" /> Borrador
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(item)}
                                                    className="text-cyan-400 hover:text-cyan-300 mr-4"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table >
                        </div >
                    )
                    }
                </div >
            )}
        </div >
    )
}
