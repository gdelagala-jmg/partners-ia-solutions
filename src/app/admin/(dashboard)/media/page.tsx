'use client'

import React, { useState, useEffect } from 'react'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import AdminCard from '@/components/admin/ui/AdminCard'
import AdminActionMenu from '@/components/admin/ui/AdminActionMenu'
import AdminFormShell from '@/components/admin/ui/AdminFormShell'
import MediaForm from '@/components/admin/MediaForm'
import AdminTable from '@/components/admin/ui/AdminTable'
import { Plus, Video, Mic, Globe, Search, Trash2 } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function MediaManagementPage() {
    const [search, setSearch] = useState('')
    const [mediaItems, setMediaItems] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)

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

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este recurso?')) return
        try {
            const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
            if (res.ok) fetchMedia()
        } catch (error) {
            console.error('Error deleting media:', error)
        }
    }

    useEffect(() => {
        fetchMedia()
    }, [])

    const filteredItems = mediaItems.filter(item => 
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.url.toLowerCase().includes(search.toLowerCase())
    )

    const columns = [
        {
            header: 'Recurso',
            className: 'max-w-[220px]',
            accessor: (item: any) => (
                <div className="flex items-center gap-3 min-w-0">
                    <div className="hidden sm:flex w-9 h-9 bg-gray-100 rounded-lg items-center justify-center text-gray-400 group-hover:bg-white group-hover:shadow-sm transition-all shrink-0">
                        {item.type?.toUpperCase() === 'VIDEO' ? <Video size={16} /> : <Mic size={16} />}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-[#1D1D1F] truncate text-sm">{item.title}</span>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">{item.type}</span>
                    </div>
                </div>
            )
        },
        {
            header: 'URL / Origen',
            className: 'hidden lg:table-cell max-w-[240px]',
            accessor: (item: any) => (
                <div className="flex items-center gap-2 text-gray-400 font-mono text-[11px] min-w-0">
                    <Globe size={12} className="shrink-0" />
                    <span className="truncate">{item.url}</span>
                </div>
            )
        },
        {
            header: '',
            className: 'text-right w-12',
            accessor: (item: any) => (
                <AdminActionMenu 
                    actions={[
                        {
                            label: 'Eliminar',
                            icon: Trash2,
                            onClick: () => handleDelete(item.id),
                            variant: 'danger'
                        }
                    ]}
                />
            )
        }
    ]

    if (isFormOpen) {
        return (
            <AdminFormShell
                title="Añadir Recurso Media"
                onCancel={() => setIsFormOpen(false)}
            >
                <MediaForm 
                    onSubmit={async (data) => {
                        try {
                            const res = await fetch('/api/media', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify(data),
                            })
                            if (res.ok) {
                                setIsFormOpen(false)
                                fetchMedia()
                            }
                        } catch (error) {
                            console.error('Error saving media:', error)
                        }
                    }}
                    onCancel={() => setIsFormOpen(false)}
                />
            </AdminFormShell>
        )
    }

    return (
        <div className="w-full max-w-full min-w-0 flex flex-col space-y-6">
            <AdminToolbar 
                title="Podcast y Media"
                description="Gestión de contenidos audiovisuales y podcasts."
                icon={Video}
                actions={
                    <button
                        onClick={() => setIsFormOpen(true)}
                        className="flex items-center gap-2 px-4 sm:px-5 py-2.5 bg-[#1D1D1F] text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg active:scale-95 whitespace-nowrap"
                    >
                        <Plus size={18} className="shrink-0" />
                        <span className="hidden sm:inline">Añadir Contenido</span>
                        <span className="sm:hidden">Nuevo</span>
                    </button>
                }
            />

            {/* Wave 5: admin-safe-container wraps the card to enforce overflow-x:hidden */}
            <div className="admin-safe-container">
                <AdminCard>
                    {/* Search bar — min-w-0 prevents input from expanding the container */}
                    <div className="flex items-center mb-6 min-w-0">
                        <div className="relative w-full max-w-sm min-w-0">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 shrink-0" size={16} />
                            <input 
                                type="text" 
                                placeholder="Buscar recurso..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full min-w-0 pl-10 pr-4 py-2 bg-gray-50/50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition-all outline-none"
                            />
                        </div>
                    </div>

                    <AdminTable
                        columns={columns}
                        data={filteredItems}
                        loading={loading}
                        emptyMessage="No se encontraron recursos media."
                        renderMobileCard={(item) => (
                            <div className="space-y-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-9 h-9 shrink-0 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                            {item.type?.toUpperCase() === 'VIDEO' ? <Video size={16} /> : <Mic size={16} />}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="text-sm font-bold text-[#1D1D1F] truncate">{item.title}</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.type}</p>
                                        </div>
                                    </div>
                                    <AdminActionMenu 
                                        actions={[
                                            {
                                                label: 'Eliminar',
                                                icon: Trash2,
                                                onClick: () => handleDelete(item.id),
                                                variant: 'danger'
                                            }
                                        ]}
                                    />
                                </div>
                                <div className="pt-3 border-t border-gray-100/50">
                                    <div className="flex items-center gap-2 text-gray-400 font-mono text-[10px] min-w-0">
                                        <Globe size={12} className="shrink-0" />
                                        <span className="truncate">{item.url}</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                </AdminCard>
            </div>
        </div>
    )
}
