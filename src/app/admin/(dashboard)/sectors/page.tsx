'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Globe, EyeOff, ExternalLink, Box } from 'lucide-react'
import SectorForm from '@/components/admin/SectorForm'
import AdminTable from '@/components/admin/ui/AdminTable'
import AdminActionMenu from '@/components/admin/ui/AdminActionMenu'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import AdminStatusBadge from '@/components/admin/ui/AdminStatusBadge'

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
                    <div className="h-12 w-12 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100 shadow-inner">
                        {sector.image ? (
                            <img className="h-full w-full object-cover" src={sector.image} alt="" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                <Box size={20} />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="text-[13px] font-black text-[#1D1D1F] leading-tight">{sector.name}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">/{sector.slug}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Enlace',
            className: 'hidden md:table-cell',
            accessor: (sector: any) => (
                sector.externalUrl ? (
                    <a href={sector.externalUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-2.5 py-1 text-[10px] font-black text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors uppercase tracking-wider">
                        Ver Externo <ExternalLink size={12} className="ml-1.5" />
                    </a>
                ) : (
                    <span className="text-gray-300 text-[10px] font-black uppercase tracking-widest">- Sin Link -</span>
                )
            )
        },
        {
            header: 'Estado',
            accessor: (sector: any) => (
                <AdminStatusBadge 
                    label={sector.active ? 'Activo' : 'Inactivo'} 
                    type={sector.active ? 'success' : 'neutral'}
                />
            )
        },
        {
            header: 'Orden',
            className: 'hidden xl:table-cell',
            accessor: (sector: any) => (
                <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black text-blue-600 bg-blue-50/50 border border-blue-100 px-2 py-1 rounded-lg">
                        #{sector.order}
                    </span>
                </div>
            )
        },
        {
            header: 'Soluciones',
            className: 'hidden lg:table-cell',
            accessor: (sector: any) => (
                <div className="flex items-center gap-2">
                    <span className="text-[13px] font-black text-[#1D1D1F]">{sector._count?.solutions || 0}</span>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Items</span>
                </div>
            )
        },
        {
            header: '',
            className: 'text-right',
            accessor: (sector: any) => (
                <AdminActionMenu
                    actions={[
                        { label: sector.active ? 'Desactivar' : 'Activar', icon: <EyeOff size={16} />, onClick: () => handleToggleStatus(sector) },
                        { label: 'Editar Sector', icon: <Edit size={16} />, onClick: () => handleEdit(sector) },
                        { label: 'Eliminar', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => handleDelete(sector.id) },
                    ]}
                />
            )
        }
    ]

    return (
        <div className="w-full max-w-full min-w-0 space-y-6">
            <AdminToolbar
                title="Gestión de Sectores"
                description="Clasifica y organiza el catálogo de soluciones por industria."
                actions={
                    <div className="flex items-center gap-3">
                        {!isEditing && (
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1D1D1F] text-white font-bold text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200"
                            >
                                <Plus size={14} />
                                <span>Nuevo Sector</span>
                            </button>
                        )}
                    </div>
                }
            />

            {isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
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
                    emptyMessage="No hay sectores configurados."
                    renderMobileCard={(sector) => (
                        <div className="space-y-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="h-12 w-12 rounded-2xl bg-white border border-gray-100 overflow-hidden flex items-center justify-center shadow-sm shrink-0">
                                        {sector.image ? (
                                            <img src={sector.image} className="h-full w-full object-cover" alt="" />
                                        ) : (
                                            <Box size={24} className="text-gray-300" />
                                        )}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-[#1D1D1F] leading-tight text-lg truncate">{sector.name}</h3>
                                        <p className="text-[10px] text-gray-400 font-mono mt-1 opacity-60 truncate">/{sector.slug}</p>
                                    </div>
                                </div>
                                <AdminActionMenu
                                    actions={[
                                        { label: sector.active ? 'Desactivar' : 'Activar', icon: <EyeOff size={16} />, onClick: () => handleToggleStatus(sector) },
                                        { label: 'Editar', icon: <Edit size={16} />, onClick: () => handleEdit(sector) },
                                        { label: 'Eliminar', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => handleDelete(sector.id) },
                                    ]}
                                />
                            </div>
                            
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="flex gap-2">
                                    <AdminStatusBadge 
                                        label={sector.active ? 'Activo' : 'Inactivo'} 
                                        type={sector.active ? 'success' : 'neutral'}
                                        className="text-[9px]"
                                    />
                                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">
                                        {sector._count?.solutions || 0} Soluciones
                                    </span>
                                </div>
                                {sector.externalUrl && (
                                    <a href={sector.externalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700 bg-white/60 p-2 rounded-full border border-white shadow-sm transition-all active:scale-90">
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
