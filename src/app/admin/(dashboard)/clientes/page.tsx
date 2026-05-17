'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Globe, EyeOff, User, Building, Phone } from 'lucide-react'
import ClientForm from '@/components/admin/ClientForm'
import AdminTable from '@/components/admin/ui/AdminTable'
import AdminActionMenu from '@/components/admin/ui/AdminActionMenu'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import AdminStatusBadge from '@/components/admin/ui/AdminStatusBadge'
import AdminFilterBar from '@/components/admin/ui/AdminFilterBar'

const FILTER_OPTIONS = [
    { id: 'all', label: 'Todos' },
    { id: 'active', label: 'Activos' },
    { id: 'inactive', label: 'Inactivos' }
] as const

type FilterType = typeof FILTER_OPTIONS[number]['id']

export default function ClientsPage() {
    const [clients, setClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentClient, setCurrentClient] = useState<any>(null)
    const [filter, setFilter] = useState<FilterType>('all')

    const fetchClients = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/clients')
            if (res.ok) {
                const data = await res.json()
                setClients(Array.isArray(data) ? data : [])
            }
        } catch (error) {
            console.error('Error fetching clients:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchClients()
    }, [])

    const filteredClients = clients.filter(client => {
        if (filter === 'active') return client.active
        if (filter === 'inactive') return !client.active
        return true
    })

    const handleCreate = () => {
        setCurrentClient(null)
        setIsEditing(true)
    }

    const handleEdit = (client: any) => {
        setCurrentClient(client)
        setIsEditing(true)
    }

    const handleToggleStatus = async (client: any) => {
        try {
            const res = await fetch(`/api/clients/${client.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...client, active: !client.active }),
            })
            if (res.ok) fetchClients()
        } catch (error) {
            console.error('Error toggling status:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este cliente?')) return
        try {
            await fetch(`/api/clients/${id}`, { method: 'DELETE' })
            fetchClients()
        } catch (error) {
            console.error('Error deleting client:', error)
        }
    }

    const handleSubmit = async (data: any) => {
        try {
            const url = currentClient ? `/api/clients/${currentClient.id}` : '/api/clients'
            const method = currentClient ? 'PUT' : 'POST'
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (res.ok) {
                setIsEditing(false)
                fetchClients()
            }
        } catch (error) {
            console.error('Error saving client:', error)
        }
    }

    const columns = [
        {
            header: 'Cliente / Empresa',
            accessor: (client: any) => (
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-gray-50/50 overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center p-1.5 shadow-inner">
                        {client.logoUrl ? (
                            <img className="h-full w-full object-contain" src={client.logoUrl} alt="" />
                        ) : (
                            <Building size={20} className="text-gray-300" />
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-black text-[#1D1D1F] leading-tight">{client.companyName}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{client.taxId || 'SIN CIF'}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Contacto Principal',
            className: 'hidden lg:table-cell',
            accessor: (client: any) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[13px] font-bold text-[#1D1D1F]">
                        <User size={14} className="text-blue-500" />
                        {client.contactName || '---'}
                    </div>
                    {client.contactPhone && (
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                            <Phone size={10} />
                            {client.contactPhone}
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Sector',
            className: 'hidden md:table-cell',
            accessor: (client: any) => (
                <AdminStatusBadge 
                    label={client.sector || 'GENERAL'} 
                    type="info" 
                    dot={false}
                    className="text-[10px]" 
                />
            )
        },
        {
            header: 'Estado',
            accessor: (client: any) => (
                <AdminStatusBadge 
                    label={client.active ? 'Activo' : 'Inactivo'} 
                    type={client.active ? 'success' : 'neutral'}
                />
            )
        },
        {
            header: '',
            className: 'text-right',
            accessor: (client: any) => (
                <AdminActionMenu
                    actions={[
                        { label: client.active ? 'Desactivar' : 'Activar', icon: <EyeOff size={16} />, onClick: () => handleToggleStatus(client) },
                        { label: 'Editar Ficha', icon: <Edit size={16} />, onClick: () => handleEdit(client) },
                        { label: 'Eliminar', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => handleDelete(client.id) },
                    ]}
                />
            )
        }
    ]

    const filterOptions = FILTER_OPTIONS.map(opt => ({
        ...opt,
        count: opt.id === 'all' ? clients.length : clients.filter(c => opt.id === 'active' ? c.active : !c.active).length
    }))

    return (
        <div className="w-full max-w-full min-w-0 space-y-6">
            <AdminToolbar
                title="Cartera de Clientes"
                description="Gestión integral de fichas y relaciones corporativas."
                actions={
                    <div className="flex items-center gap-3">
                        {!isEditing && (
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1D1D1F] text-white font-bold text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200"
                            >
                                <Plus size={14} />
                                <span>Nuevo Cliente</span>
                            </button>
                        )}
                    </div>
                }
            />

            {isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <ClientForm
                        initialData={currentClient}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                <div className="space-y-6">
                    <AdminFilterBar
                        options={filterOptions}
                        activeId={filter}
                        onChange={(id) => setFilter(id as FilterType)}
                    />

                    <AdminTable
                        columns={columns}
                        data={filteredClients}
                        loading={loading}
                        emptyMessage="No hay clientes registrados."
                        renderMobileCard={(client) => (
                            <div className="space-y-5">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="h-14 w-14 rounded-2xl bg-white border border-gray-100 flex items-center justify-center p-2 shadow-sm shrink-0">
                                            {client.logoUrl ? (
                                                <img src={client.logoUrl} className="h-full w-full object-contain" alt="" />
                                            ) : (
                                                <Building size={24} className="text-gray-300" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-[#1D1D1F] leading-tight text-lg truncate">{client.companyName}</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-widest truncate">{client.taxId || 'SIN CIF'}</p>
                                        </div>
                                    </div>
                                    <AdminActionMenu
                                        actions={[
                                            { label: client.active ? 'Desactivar' : 'Activar', icon: <EyeOff size={16} />, onClick: () => handleToggleStatus(client) },
                                            { label: 'Editar', icon: <Edit size={16} />, onClick: () => handleEdit(client) },
                                            { label: 'Eliminar', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => handleDelete(client.id) },
                                        ]}
                                    />
                                </div>
                                
                                <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-50">
                                    <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                                        <p className="text-[9px] text-gray-400 font-black uppercase mb-1 tracking-widest">Contacto</p>
                                        <p className="text-xs font-bold text-[#1D1D1F] truncate">{client.contactName || '---'}</p>
                                    </div>
                                    <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                                        <p className="text-[9px] text-gray-400 font-black uppercase mb-1 tracking-widest">Sector</p>
                                        <p className="text-xs font-bold text-blue-600 truncate">{client.sector || 'General'}</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <AdminStatusBadge 
                                        label={client.active ? 'Activo' : 'Inactivo'} 
                                        type={client.active ? 'success' : 'neutral'}
                                        className="text-[10px]"
                                    />
                                    {client.website && (
                                        <button 
                                            onClick={() => window.open(client.website, '_blank')}
                                            className="text-[11px] font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-3 py-2 rounded-xl transition-all"
                                        >
                                            Ver Web
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    />
                </div>
            )}
        </div>
    )
}
