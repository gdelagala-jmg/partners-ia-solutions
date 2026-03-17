'use client'

import { useState, useEffect } from 'react'
import { Plus, Link2, Trash2, Edit2, Power, ArrowUpDown } from 'lucide-react'
import AdminTable from '@/components/admin/AdminTable'
import AdminActionMenu from '@/components/admin/AdminActionMenu'
import NavLinkForm from '@/components/admin/NavLinkForm'
import { motion, AnimatePresence } from 'framer-motion'

export default function NavigationPage() {
    const [links, setLinks] = useState<any[]>([])
    const [selectedLocation, setSelectedLocation] = useState('HEADER')
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingLink, setEditingLink] = useState<any>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text })
        setTimeout(() => setMessage(null), 5000)
    }

    const fetchLinks = async () => {
        try {
            const res = await fetch('/api/navigation')
            const data = await res.json()
            if (Array.isArray(data)) {
                setLinks(data)
            } else {
                console.error('Unexpected API response:', data)
                setLinks([])
            }
        } catch (error) {
            console.error('Error fetching navigation links:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchLinks()
    }, [])

    const handleCreate = async (data: any) => {
        try {
            const res = await fetch('/api/navigation', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (res.ok) {
                setIsFormOpen(false)
                fetchLinks()
                showMessage('success', 'Enlace creado correctamente')
            } else {
                showMessage('error', 'Error al crear el enlace')
            }
        } catch (error) {
            console.error('Error creating link:', error)
            showMessage('error', 'Error de red al crear el enlace')
        }
    }

    const handleUpdate = async (data: any) => {
        try {
            const res = await fetch(`/api/navigation/${editingLink.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (res.ok) {
                setEditingLink(null)
                setIsFormOpen(false)
                fetchLinks()
                showMessage('success', 'Enlace actualizado correctamente')
            } else {
                showMessage('error', 'Error al actualizar el enlace')
            }
        } catch (error) {
            console.error('Error updating link:', error)
            showMessage('error', 'Error de red al actualizar el enlace')
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este enlace?')) return
        try {
            const res = await fetch(`/api/navigation/${id}`, { method: 'DELETE' })
            if (res.ok) fetchLinks()
        } catch (error) {
            console.error('Error deleting link:', error)
        }
    }

    const toggleStatus = async (link: any) => {
        try {
            const res = await fetch(`/api/navigation/${link.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...link, active: !link.active }),
            })
            if (res.ok) fetchLinks()
        } catch (error) {
            console.error('Error toggling status:', error)
        }
    }

    const columns = [
        {
            header: 'Orden',
            accessor: 'order',
            render: (val: any) => <span className="font-mono text-gray-400">{val}</span>
        },
        {
            header: 'Nombre',
            accessor: (row: any) => (
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${row.active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-gray-300'}`} />
                    <span className={`font-bold ${row.active ? 'text-gray-900' : 'text-gray-400'}`}>{row.name}</span>
                </div>
            )
        },
        {
            header: 'URL / Ruta',
            accessor: 'href',
            render: (val: any) => <code className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600 font-mono">{val}</code>
        },
        {
            header: '',
            className: 'text-right',
            accessor: (row: any) => (
                <AdminActionMenu
                    actions={[
                        {
                            label: row.active ? 'Desactivar' : 'Activar',
                            icon: Power,
                            onClick: () => toggleStatus(row),
                            variant: row.active ? 'danger' : 'default'
                        },
                        {
                            label: 'Editar',
                            icon: Edit2,
                            onClick: () => {
                                setEditingLink(row)
                                setIsFormOpen(true)
                            }
                        },
                        {
                            label: 'Eliminar',
                            icon: Trash2,
                            onClick: () => handleDelete(row.id),
                            variant: 'danger'
                        }
                    ]}
                />
            )
        }
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black text-gray-900 tracking-tight">Gestión de Navegación</h1>
                    <p className="text-gray-500 mt-1 font-medium">Administra las URLs y menús de la web pública</p>
                </div>
                <button
                    onClick={() => {
                        setEditingLink(null)
                        setIsFormOpen(true)
                    }}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-xl hover:bg-gray-800 transition-all hover:scale-105 shadow-lg font-bold"
                >
                    <Plus size={20} />
                    Nuevo Enlace
                </button>
            </div>

            {message && (
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-4 rounded-xl border flex items-center gap-3 font-bold text-sm ${
                        message.type === 'success' ? 'bg-green-50 border-green-100 text-green-700' : 'bg-red-50 border-red-100 text-red-700'
                    }`}
                >
                    <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                    {message.text}
                </motion.div>
            )}

            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="mb-8"
                    >
                        <NavLinkForm
                            initialData={editingLink}
                            onSubmit={editingLink ? handleUpdate : handleCreate}
                            onCancel={() => {
                                setIsFormOpen(false)
                                setEditingLink(null)
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden">
                {/* Location Filter Tabs */}
                <div className="flex border-b border-gray-100 bg-gray-50/50">
                    {['HEADER', 'FOOTER_EXPLORA', 'FOOTER_SOLUCIONES', 'FOOTER_EMPRESA'].map((loc) => (
                        <button
                            key={loc}
                            onClick={() => setSelectedLocation(loc)}
                            className={`px-6 py-4 text-xs font-bold uppercase tracking-wider transition-all ${
                                selectedLocation === loc 
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-white' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            {loc.replace('FOOTER_', 'FOOTER ').replace('_', ' ')}
                        </button>
                    ))}
                </div>

                <AdminTable
                    data={links.filter(l => l.location === selectedLocation)}
                    columns={columns as any}
                    loading={loading}
                    renderMobileCard={(row: any) => (
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className={`w-3 h-3 rounded-full ${row.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <div>
                                    <h3 className="font-bold text-gray-900">{row.name}</h3>
                                    <p className="text-xs text-gray-400 font-mono">{row.href}</p>
                                </div>
                            </div>
                            <AdminActionMenu
                                actions={[
                                    {
                                        label: row.active ? 'Desactivar' : 'Activar',
                                        icon: Power,
                                        onClick: () => toggleStatus(row),
                                        variant: row.active ? 'danger' : 'default'
                                    },
                                    {
                                        label: 'Editar',
                                        icon: Edit2,
                                        onClick: () => {
                                            setEditingLink(row)
                                            setIsFormOpen(true)
                                        }
                                    },
                                    {
                                        label: 'Eliminar',
                                        icon: Trash2,
                                        onClick: () => handleDelete(row.id),
                                        variant: 'danger'
                                    }
                                ]}
                            />
                        </div>
                    )}
                />
            </div>
        </div>
    )
}
