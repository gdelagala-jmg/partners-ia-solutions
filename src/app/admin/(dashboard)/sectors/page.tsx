'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Globe, EyeOff, ExternalLink, Box } from 'lucide-react'
import SectorForm from '@/components/admin/SectorForm'
import AdminTable from '@/components/admin/AdminTable'
import AdminActionMenu from '@/components/admin/AdminActionMenu'

export default function SectorsPage() {
    const [sectors, setSectors] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentSector, setCurrentSector] = useState<any>(null)

    const fetchSectors = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/sectors')
            if (res.ok) {
                const data = await res.json()
                setSectors(Array.isArray(data) ? data : [])
            }
        } catch (error) {
            console.error('Error fetching sectors:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSectors()
    }, [])

    const handleCreate = () => {
        setCurrentSector(null)
        setIsEditing(true)
    }

    const handleEdit = (sector: any) => {
        setCurrentSector(sector)
        setIsEditing(true)
    }

    const handleToggleStatus = async (sector: any) => {
        try {
            const res = await fetch(`/api/sectors/${sector.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...sector, active: !sector.active }),
            })
            if (res.ok) fetchSectors()
        } catch (error) {
            console.error('Error toggling status:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este sector?')) return
        try {
            await fetch(`/api/sectors/${id}`, { method: 'DELETE' })
            fetchSectors()
        } catch (error) {
            console.error('Error deleting sector:', error)
        }
    }

    const handleSubmit = async (data: any) => {
        try {
            const url = currentSector ? `/api/sectors/${currentSector.id}` : '/api/sectors'
            const method = currentSector ? 'PUT' : 'POST'
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (res.ok) {
                setIsEditing(false)
                fetchSectors()
            }
        } catch (error) {
            console.error('Error saving sector:', error)
        }
    }

    const columns = [
        {
            header: 'Sector',
            accessor: (sector: any) => (
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100">
                        {sector.image ? (
                            <img className="h-full w-full object-cover" src={sector.image} alt="" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Box size={20} />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-900">{sector.name}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">/{sector.slug}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Enlace',
            accessor: (sector: any) => (
                <a href={sector.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                    Visitar <ExternalLink size={12} className="ml-1.5" />
                </a>
            )
        },
        {
            header: 'Estado',
            accessor: (sector: any) => (
                sector.active ? (
                    <span className="flex items-center text-green-600 text-xs font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 animate-pulse" />
                        Activo
                    </span>
                ) : (
                    <span className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2" />
                        Inactivo
                    </span>
                )
            )
        },
        {
            header: 'Orden',
            accessor: (sector: any) => (
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">
                        {sector.order}
                    </span>
                </div>
            )
        },
        {
            header: 'Soluciones',
            accessor: (sector: any) => (
                <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">{sector._count?.solutions || 0}</span>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Items</span>
                </div>
            )
        },
        {
            header: '',
            className: 'text-right',
            accessor: (sector: any) => (
                <AdminActionMenu
                    actions={[
                        { label: sector.active ? 'Desactivar' : 'Activar', icon: sector.active ? EyeOff : Globe, onClick: () => handleToggleStatus(sector) },
                        { label: 'Editar', icon: Edit, onClick: () => handleEdit(sector) },
                        { label: 'Eliminar', icon: Trash2, variant: 'danger', onClick: () => handleDelete(sector.id) },
                    ]}
                />
            )
        }
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Sectores</h1>
                    <p className="text-gray-500 mt-2">Administra los sectores para clasificar soluciones con diseño premium.</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
                    >
                        <Plus size={20} className="mr-2" />
                        Nuevo Sector
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                    <SectorForm
                        initialData={currentSector}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                <AdminTable
                    columns={columns}
                    data={sectors}
                    loading={loading}
                    emptyMessage="No hay sectores configurados en este momento."
                    renderMobileCard={(sector) => (
                        <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-12 w-12 rounded-xl bg-gray-50 overflow-hidden border border-gray-100 flex-shrink-0">
                                        {sector.image ? <img src={sector.image} className="h-full w-full object-cover" alt="" /> : <Box size={24} className="m-3 text-gray-300" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{sector.name}</h3>
                                        <p className="text-xs text-gray-400 font-mono">/{sector.slug}</p>
                                    </div>
                                </div>
                                <AdminActionMenu
                                    actions={[
                                        { label: sector.active ? 'Desactivar' : 'Activar', icon: sector.active ? EyeOff : Globe, onClick: () => handleToggleStatus(sector) },
                                        { label: 'Editar', icon: Edit, onClick: () => handleEdit(sector) },
                                        { label: 'Eliminar', icon: Trash2, variant: 'danger', onClick: () => handleDelete(sector.id) },
                                    ]}
                                />
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="flex gap-2">
                                    {sector.active ? (
                                        <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded uppercase">Activo</span>
                                    ) : (
                                        <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-bold rounded uppercase">Inactivo</span>
                                    )}
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">{sector._count?.solutions || 0} Soluciones</span>
                                </div>
                                {sector.externalUrl && (
                                    <a href={sector.externalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                                        <ExternalLink size={16} />
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                />
            )}
        </div>
    )
}
