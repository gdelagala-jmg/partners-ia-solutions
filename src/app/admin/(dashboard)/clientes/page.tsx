'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Globe, EyeOff, User, Building, Phone, Mail } from 'lucide-react'
import ClientForm from '@/components/admin/ClientForm'
import AdminTable from '@/components/admin/AdminTable'
import AdminActionMenu from '@/components/admin/AdminActionMenu'

export default function ClientsPage() {
    const [clients, setClients] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentClient, setCurrentClient] = useState<any>(null)

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
            header: 'Cliente / Razón Social',
            accessor: (client: any) => (
                <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-2xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center p-1 shadow-sm">
                        {client.logoUrl ? (
                            <img className="h-full w-full object-contain" src={client.logoUrl} alt="" />
                        ) : (
                            <Building size={24} className="text-gray-300" />
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-black text-gray-900 leading-tight">{client.companyName}</div>
                        <div className="text-[11px] text-gray-400 font-bold uppercase tracking-wider mt-1">{client.taxId || 'SIN CIF'}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Contacto',
            accessor: (client: any) => (
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                        <User size={12} className="text-blue-500" />
                        {client.contactName || 'N/A'}
                    </div>
                    {client.contactPhone && (
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
                            <Phone size={10} />
                            {client.contactPhone}
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Sector / Web',
            accessor: (client: any) => (
                <div className="space-y-1">
                    <div className="inline-flex px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg uppercase tracking-tight">
                        {client.sector || 'GENERAL'}
                    </div>
                    {client.website && (
                        <div className="text-[11px] text-gray-400 hover:text-blue-600 transition-colors">
                            {client.website.replace(/^https?:\/\//, '')}
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Estado',
            accessor: (client: any) => (
                client.active ? (
                    <span className="flex items-center text-green-600 text-[10px] font-black uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse" />
                        Activo
                    </span>
                ) : (
                    <span className="flex items-center text-gray-300 text-[10px] font-black uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-gray-200 mr-2" />
                        Inactivo
                    </span>
                )
            )
        },
        {
            header: '',
            className: 'text-right',
            accessor: (client: any) => (
                <AdminActionMenu
                    actions={[
                        { label: client.active ? 'Desactivar' : 'Activar', icon: client.active ? EyeOff : Globe, onClick: () => handleToggleStatus(client) },
                        { label: 'Editar Ficha', icon: Edit, onClick: () => handleEdit(client) },
                        { label: 'Eliminar', icon: Trash2, variant: 'danger', onClick: () => handleDelete(client.id) },
                    ]}
                />
            )
        }
    ]

    return (
        <div className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Cartera de Clientes</h1>
                    <p className="text-gray-500 mt-2 font-medium">Gestión integral de fichas de clientes y relaciones corporativas.</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-black shadow-xl shadow-blue-100 scale-100 hover:scale-105 active:scale-95"
                    >
                        <Plus size={24} className="mr-2" />
                        Nuevo Cliente
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                    <ClientForm
                        initialData={currentClient}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                <AdminTable
                    columns={columns}
                    data={clients}
                    loading={loading}
                    emptyMessage="No hay clientes registrados en la cartera."
                    renderMobileCard={(client) => (
                        <div className="space-y-5">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="h-14 w-14 rounded-2xl bg-gray-50 overflow-hidden border border-gray-100 flex items-center justify-center p-1 shadow-sm">
                                        {client.logoUrl ? <img src={client.logoUrl} className="h-full w-full object-contain" alt="" /> : <Building size={24} className="text-gray-300" />}
                                    </div>
                                    <div>
                                        <h3 className="font-black text-gray-900 leading-tight">{client.companyName}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-1 tracking-wider">{client.taxId || 'SIN CIF'}</p>
                                    </div>
                                </div>
                                <AdminActionMenu
                                    actions={[
                                        { label: client.active ? 'Desactivar' : 'Activar', icon: client.active ? EyeOff : Globe, onClick: () => handleToggleStatus(client) },
                                        { label: 'Editar', icon: Edit, onClick: () => handleEdit(client) },
                                        { label: 'Eliminar', icon: Trash2, variant: 'danger', onClick: () => handleDelete(client.id) },
                                    ]}
                                />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-50">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Contacto</p>
                                    <p className="text-xs font-bold text-gray-700">{client.contactName || '---'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-black uppercase mb-1">Sector</p>
                                    <p className="text-xs font-bold text-blue-600">{client.sector || 'General'}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                {client.active ? (
                                    <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-black rounded-lg uppercase tracking-wider">Activo</span>
                                ) : (
                                    <span className="px-3 py-1 bg-gray-50 text-gray-400 text-[10px] font-black rounded-lg uppercase tracking-wider">Inactivo</span>
                                )}
                                {client.website && (
                                    <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-[11px] font-bold text-blue-500 hover:underline font-mono">
                                        Visitar Web
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
