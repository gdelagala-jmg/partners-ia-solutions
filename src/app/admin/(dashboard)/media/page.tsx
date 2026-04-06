'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Globe, EyeOff, Video, Mic, Check, Search } from 'lucide-react'
import MediaForm from '@/components/admin/MediaForm'
import AdminTable from '@/components/admin/AdminTable'
import AdminActionMenu from '@/components/admin/AdminActionMenu'

export default function MediaManagementPage() {
    const [mediaItems, setMediaItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentMedia, setCurrentMedia] = useState<any>(null)
    const [mainChannelHtml, setMainChannelHtml] = useState('')
    const [savingSettings, setSavingSettings] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')

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

    const filteredMedia = mediaItems.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const columns = [
        {
            header: 'Contenido',
            accessor: (item: any) => (
                <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-xl bg-white border border-white shadow-sm flex items-center justify-center`}>
                        {item.type === 'VIDEO' ? <Video size={18} className="text-[#1D1D1F]" /> : <Mic size={18} className="text-[#1D1D1F]" />}
                    </div>
                    <div>
                        <div className="font-bold text-[#1D1D1F] tracking-tight">{item.title}</div>
                        <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-0.5">{item.type}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Estado',
            accessor: (item: any) => (
                item.published ? (
                    <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs">
                        <Globe size={14} />
                        <span>PUBLICADO</span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1.5 text-gray-400 font-bold text-xs uppercase tracking-tighter">
                        <EyeOff size={14} />
                        <span>BORRADOR</span>
                    </div>
                )
            )
        },
        {
            header: '',
            className: 'text-right',
            accessor: (item: any) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => window.open(item.url, '_blank')}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50/50 rounded-xl transition-all"
                        title="Ver publicación"
                    >
                        <Globe size={18} />
                    </button>
                    <AdminActionMenu
                        actions={[
                            {
                                label: 'Editar',
                                icon: Edit,
                                onClick: () => handleEdit(item)
                            },
                            {
                                label: 'Eliminar',
                                icon: Trash2,
                                onClick: () => handleDelete(item.id),
                                variant: 'danger'
                            }
                        ]}
                    />
                </div>
            )
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            {/* Header Section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-white rounded-2xl border border-white shadow-sm flex items-center justify-center text-[#1D1D1F]">
                            <Video size={24} />
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Podcast y Media</h1>
                    </div>
                    <p className="text-gray-400 font-medium italic">Gestión de episodios, videos y contenido multimedia.</p>
                </div>

                {!isEditing && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1D1D1F] text-white font-semibold text-sm shadow-lg hover:bg-black transition-all active:scale-95"
                    >
                        <Plus size={18} />
                        <span>Añadir Multimedia</span>
                    </button>
                )}
            </header>

            {isEditing ? (
                <MediaForm
                    initialData={currentMedia}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <>
                    {/* Canal Principal Config */}
                    <div className="bg-white/60 backdrop-blur-md border border-white rounded-[2rem] p-8 shadow-sm group hover:shadow-xl transition-all duration-500">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-xl font-bold text-[#1D1D1F] tracking-tight">Canal Principal de Podcast</h2>
                                <p className="text-sm text-gray-400 font-medium mt-1">Configura el código embed para la vista general.</p>
                            </div>
                            <button
                                onClick={handleSaveSettings}
                                disabled={savingSettings}
                                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-white text-xs font-bold text-[#1D1D1F] shadow-sm hover:shadow-md transition-all active:scale-95"
                            >
                                <Check size={16} className={savingSettings ? 'animate-pulse' : ''} />
                                <span>{savingSettings ? 'Guardando...' : 'Guardar Cambios'}</span>
                            </button>
                        </div>
                        <textarea
                            value={mainChannelHtml}
                            onChange={(e) => setMainChannelHtml(e.target.value)}
                            className="w-full bg-white/40 backdrop-blur-sm border border-white focus:bg-white rounded-2xl p-5 text-sm font-mono text-gray-600 focus:outline-none transition-all h-32"
                            placeholder="Inserta el <iframe> aquí..."
                        />
                    </div>

                    {/* Episodes List */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-4 md:px-0">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Episodios y Videos</h2>
                            <div className="flex items-center gap-3">
                                <div className="relative group">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" size={14} />
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-9 pr-4 py-1.5 bg-white/60 backdrop-blur-md border border-white rounded-xl text-xs font-bold focus:outline-none focus:bg-white transition-all w-48"
                                    />
                                </div>
                            </div>
                        </div>

                        <AdminTable
                            columns={columns}
                            data={filteredMedia}
                            loading={loading}
                            emptyMessage="No hay contenido multimedia registrado aún."
                            renderMobileCard={(item) => (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-white border border-white shadow-sm flex items-center justify-center">
                                                {item.type === 'VIDEO' ? <Video size={16} /> : <Mic size={16} />}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-[#1D1D1F] tracking-tight">{item.title}</h3>
                                                <div className="text-[10px] uppercase font-bold tracking-widest text-gray-400">{item.type}</div>
                                            </div>
                                        </div>
                                        {getStatusBadge(item.published)}
                                    </div>
                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#1D1D1F]/5">
                                        <button
                                            onClick={() => window.open(item.url, '_blank')}
                                            className="px-3 py-1.5 text-xs font-bold text-blue-600 bg-blue-50 rounded-lg"
                                        >
                                            Ver Link
                                        </button>
                                        <AdminActionMenu
                                            actions={[
                                                { label: 'Editar', icon: Edit, onClick: () => handleEdit(item) },
                                                { label: 'Eliminar', icon: Trash2, onClick: () => handleDelete(item.id), variant: 'danger' }
                                            ]}
                                        />
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </>
            )}
        </div>
    )
}

function getStatusBadge(published: boolean) {
    return published ? (
        <span className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold border border-emerald-100 uppercase tracking-widest">PUBLIK</span>
    ) : (
        <span className="bg-gray-100 text-gray-400 px-3 py-1 rounded-full text-[10px] font-bold border border-gray-200 uppercase tracking-widest">DRAFT</span>
    )
}
