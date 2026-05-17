'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, LayoutGrid, Edit2, Trash2, EyeOff, ExternalLink, Globe, FileText } from 'lucide-react'
import AppForm from '@/components/admin/AppForm'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import AdminTable from '@/components/admin/ui/AdminTable'
import AdminActionMenu from '@/components/admin/ui/AdminActionMenu'
import AdminStatusBadge from '@/components/admin/ui/AdminStatusBadge'

export default function AppsAdminPage() {
    const [apps, setApps] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingApp, setEditingApp] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const fetchApps = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/apps?includeDrafts=true')
            const data = await res.json()
            if (Array.isArray(data)) setApps(data)
        } catch (error) {
            console.error('Error fetching apps:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApps()
    }, [])

    const handleCreate = () => {
        setEditingApp(null)
        setIsFormOpen(true)
    }

    const handleEdit = (app: any) => {
        setEditingApp(app)
        setIsFormOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta aplicación?')) return
        try {
            const res = await fetch(`/api/apps/${id}`, { method: 'DELETE' })
            if (res.ok) fetchApps()
        } catch (error) {
            console.error('Error deleting app:', error)
        }
    }

    const handleTogglePublication = async (app: any) => {
        try {
            const res = await fetch(`/api/apps/${app.id}`, {
                method: 'PUT',
                body: JSON.stringify({ ...app, published: !app.published }),
            })
            if (res.ok) fetchApps()
        } catch (error) {
            console.error('Error updating app:', error)
        }
    }

    const onSubmit = async (data: any) => {
        try {
            const url = editingApp ? `/api/apps/${editingApp.id}` : '/api/apps'
            const method = editingApp ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await res.json()
            if (res.ok) {
                setIsFormOpen(false)
                fetchApps()
            } else {
                alert(result.error || 'Error al guardar')
            }
        } catch (error) {
            console.error('Error saving app:', error)
            alert('Error al conectar con el servidor')
        }
    }

    const filteredApps = apps.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    const columns = [
        {
            header: 'Aplicación',
            accessor: (app: any) => (
                <div className="flex items-center gap-3 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-indigo-50/50 flex items-center justify-center text-indigo-500 border border-indigo-100 shrink-0 shadow-inner">
                        <LayoutGrid size={20} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                        <div className="text-[13px] font-black text-[#1D1D1F] leading-tight truncate">{app.name}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5 truncate">/{app.slug}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Tipo',
            accessor: (app: any) => (
                <div className="flex items-center gap-2">
                    {app.externalUrl ? (
                        <div className="flex items-center gap-1.5 text-blue-600 bg-blue-50/50 px-2 py-1 rounded-lg border border-blue-100">
                            <Globe size={12} />
                            <span className="text-[10px] font-black uppercase tracking-wider">Web / Externo</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50/50 px-2 py-1 rounded-lg border border-emerald-100">
                            <FileText size={12} />
                            <span className="text-[10px] font-black uppercase tracking-wider">Página Interna</span>
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Estado',
            accessor: (app: any) => (
                <AdminStatusBadge 
                    label={app.published ? 'Publicado' : 'Borrador'} 
                    type={app.published ? 'success' : 'neutral'}
                />
            )
        },
        {
            header: 'Orden',
            accessor: (app: any) => (
                <span className="text-[11px] font-black text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                    #{app.order}
                </span>
            )
        },
        {
            header: '',
            className: 'text-right',
            accessor: (app: any) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => window.open(`/apps/${app.slug}`, '_blank')}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-all active:scale-90"
                        title="Ver en la web"
                    >
                        <ExternalLink size={16} />
                    </button>
                    <AdminActionMenu
                        actions={[
                            { label: app.published ? 'Ocultar' : 'Publicar', icon: <EyeOff size={16} />, onClick: () => handleTogglePublication(app) },
                            { label: 'Editar App', icon: <Edit2 size={16} />, onClick: () => handleEdit(app) },
                            { label: 'Eliminar', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => handleDelete(app.id) },
                        ]}
                    />
                </div>
            )
        }
    ]

    return (
        <div className="w-full max-w-full min-w-0 space-y-6">
            <AdminToolbar
                title="Gestión de Aplicaciones"
                description="Administra landings, integraciones externas y herramientas propias."
                actions={
                    <div className="flex items-center gap-3">
                        {!isFormOpen && (
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-1.5 px-3 sm:px-5 py-2.5 rounded-xl bg-[#1D1D1F] text-white font-bold text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200 whitespace-nowrap"
                            >
                                <Plus size={14} className="shrink-0" />
                                <span className="hidden sm:inline">Nueva Aplicación</span>
                                <span className="sm:hidden">Nueva</span>
                            </button>
                        )}
                    </div>
                }
            />

            {isFormOpen ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-4xl mx-auto">
                    <AppForm
                        initialData={editingApp}
                        onSubmit={onSubmit}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Search Bar */}
                    <div className="relative group min-w-0">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o descripción..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-indigo-50/50 focus:border-indigo-200 outline-none transition-all text-sm font-bold text-[#1D1D1F] shadow-sm"
                        />
                    </div>

                    <AdminTable
                        columns={columns}
                        data={filteredApps}
                        loading={loading}
                        emptyMessage="No hay aplicaciones configuradas."
                        renderMobileCard={(app) => (
                            <div className="space-y-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="h-12 w-12 rounded-2xl bg-white border border-gray-100 overflow-hidden flex items-center justify-center shadow-sm shrink-0">
                                            {app.image ? (
                                                <img src={app.image} className="h-full w-full object-cover" alt="" />
                                            ) : (
                                                <LayoutGrid size={24} className="text-gray-300" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-[#1D1D1F] leading-tight text-lg truncate">{app.name}</h3>
                                            <p className="text-[10px] text-gray-400 font-mono mt-1 opacity-60 truncate">/{app.slug}</p>
                                        </div>
                                    </div>
                                    <AdminActionMenu
                                        actions={[
                                            { label: app.published ? 'Ocultar' : 'Publicar', icon: <EyeOff size={16} />, onClick: () => handleTogglePublication(app) },
                                            { label: 'Editar', icon: <Edit2 size={16} />, onClick: () => handleEdit(app) },
                                            { label: 'Eliminar', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => handleDelete(app.id) },
                                        ]}
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex gap-2">
                                        <AdminStatusBadge 
                                            label={app.published ? 'Publicado' : 'Borrador'} 
                                            type={app.published ? 'success' : 'neutral'}
                                            className="text-[9px]"
                                        />
                                        <div className="flex items-center gap-1.5 text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                                            {app.externalUrl ? <Globe size={10} /> : <FileText size={10} />}
                                            <span className="text-[9px] font-bold uppercase">{app.externalUrl ? 'Web' : 'Página'}</span>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => window.open(`/apps/${app.slug}`, '_blank')}
                                        className="text-blue-500 hover:text-blue-700 bg-white p-2 rounded-full border border-gray-100 shadow-sm"
                                    >
                                        <ExternalLink size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    />
                </div>
            )}
        </div>
    )
}
