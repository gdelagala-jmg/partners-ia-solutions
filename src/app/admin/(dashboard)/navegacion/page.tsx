'use client'

import { useState, useEffect } from 'react'
import { Plus, Link2, Trash2, Edit2, Power, ArrowUpDown, GripVertical, Check, X as CloseIcon } from 'lucide-react'
import AdminTable from '@/components/admin/AdminTable'
import AdminActionMenu from '@/components/admin/AdminActionMenu'
import NavLinkForm from '@/components/admin/NavLinkForm'
import { motion, AnimatePresence, Reorder } from 'framer-motion'

export default function NavigationPage() {
    const [links, setLinks] = useState<any[]>([])
    const [selectedLocation, setSelectedLocation] = useState('HEADER')
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingLink, setEditingLink] = useState<any>(null)
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
    const [isReorderMode, setIsReorderMode] = useState(false)
    const [reorderList, setReorderList] = useState<any[]>([])

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

    useEffect(() => {
        if (isReorderMode) {
            setReorderList(links.filter(l => l.location === selectedLocation))
        }
    }, [links, selectedLocation, isReorderMode])

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

    const handleSaveReorder = async () => {
        setLoading(true)
        try {
            const orders = reorderList.map((item, index) => ({
                id: item.id,
                order: index + 1
            }))

            const res = await fetch('/api/navigation/reorder', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orders }),
            })

            if (res.ok) {
                showMessage('success', 'Orden guardado correctamente')
                setIsReorderMode(false)
                fetchLinks()
            } else {
                showMessage('error', 'Error al guardar el nuevo orden')
            }
        } catch (error) {
            console.error('Error saving reorder:', error)
            showMessage('error', 'Error de red al guardar el orden')
        } finally {
            setLoading(false)
        }
    }

    const columns = [
        {
            header: 'Pos.',
            accessor: 'order',
            render: (val: any) => <span className="font-mono text-gray-400 font-bold">#{val}</span>
        },
        {
            header: 'Nombre',
            accessor: (row: any) => (
                <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${row.active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]' : 'bg-gray-300'}`} />
                    <span className={`font-bold tracking-tight ${row.active ? 'text-gray-900' : 'text-gray-400'}`}>{row.name}</span>
                </div>
            )
        },
        {
            header: 'Enlace',
            accessor: 'href',
            render: (val: any) => <code className="text-[11px] bg-gray-100/50 px-2.5 py-1 rounded-lg text-gray-500 font-mono border border-gray-100">{val}</code>
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
        <div className="space-y-8 pb-20">
            {/* Header section with Apple style */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
                <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white shadow-2xl shadow-gray-200 rounded-2xl flex items-center justify-center border border-gray-100">
                        <Link2 size={26} className="text-black" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Menús del Sitio</h1>
                        <p className="text-gray-500 font-medium">Gestiona la arquitectura de navegación</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {!isReorderMode && (
                        <button
                            onClick={() => setIsReorderMode(true)}
                            className="bg-white/60 backdrop-blur-md border border-white h-12 px-6 rounded-2xl flex items-center gap-2 hover:bg-white/80 transition-all font-bold text-gray-900 shadow-sm shadow-gray-100/50"
                        >
                            <ArrowUpDown size={18} />
                            <span>Reordenar</span>
                        </button>
                    )}
                    <button
                        onClick={() => {
                            setEditingLink(null)
                            setIsFormOpen(true)
                        }}
                        className="bg-black h-12 px-8 rounded-2xl flex items-center gap-2 hover:bg-gray-800 transition-all font-bold text-white shadow-xl shadow-gray-200"
                    >
                        <Plus size={20} />
                        <span>Nuevo Enlace</span>
                    </button>
                </div>
            </div>

            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mx-4 p-4 rounded-2xl border flex items-center gap-3 font-bold text-sm ${
                        message.type === 'success' ? 'bg-green-50/50 border-green-100 text-green-700' : 'bg-red-50/50 border-red-100 text-red-700'
                    }`}
                >
                    <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`} />
                    {message.text}
                </motion.div>
            )}

            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        className="px-4"
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

            <div className="mx-4">
                <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden">
                    {/* Location Filter Tabs - Custom Style */}
                    <div className="flex bg-gray-50/30 p-3 gap-2 overflow-x-auto no-scrollbar">
                        {['HEADER', 'FOOTER_EXPLORA', 'FOOTER_SOLUCIONES', 'FOOTER_EMPRESA'].map((loc) => (
                            <button
                                key={loc}
                                disabled={isReorderMode}
                                onClick={() => setSelectedLocation(loc)}
                                className={`px-6 py-2.5 text-sm font-bold whitespace-nowrap transition-all rounded-xl ${
                                    selectedLocation === loc 
                                    ? 'text-white bg-black shadow-lg shadow-gray-200' 
                                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/60 disabled:opacity-30'
                                }`}
                            >
                                {loc.replace('FOOTER_', ' ').replace('_', ' ')}
                            </button>
                        ))}
                    </div>

                    {isReorderMode ? (
                        <div className="p-8 space-y-6">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">Organización Visual</h3>
                                    <p className="text-gray-500 font-medium">Arrastra para priorizar los accesos en el {selectedLocation.toLowerCase()}</p>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setIsReorderMode(false)}
                                        className="h-11 px-6 text-sm font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors flex items-center gap-2 border border-gray-100"
                                    >
                                        <CloseIcon size={18} />
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleSaveReorder}
                                        className="h-11 px-8 text-sm font-bold text-white bg-black hover:bg-gray-800 rounded-xl transition-all flex items-center gap-2 shadow-xl shadow-gray-200"
                                    >
                                        <Check size={18} />
                                        Confirmar Orden
                                    </button>
                                </div>
                            </div>

                            <Reorder.Group axis="y" values={reorderList} onReorder={setReorderList} className="space-y-3 max-w-3xl">
                                {reorderList.map((item) => (
                                    <Reorder.Item
                                        key={item.id}
                                        value={item}
                                        className="bg-white/80 backdrop-blur-md border border-white p-5 rounded-2xl shadow-sm flex items-center justify-between cursor-grab active:cursor-grabbing hover:border-gray-200 transition-all group"
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white transition-all">
                                                <GripVertical size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-900 tracking-tight text-lg">{item.name}</p>
                                                <div className="flex items-center gap-2 mt-0.5">
                                                    <Link2 size={12} className="text-gray-400" />
                                                    <span className="text-xs text-gray-400 font-mono">{item.href}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="px-4 py-1.5 bg-gray-100/50 text-[11px] font-bold text-gray-500 rounded-full border border-gray-100">
                                            POSICIÓN {item.order}
                                        </div>
                                    </Reorder.Item>
                                ))}
                            </Reorder.Group>
                        </div>
                    ) : (
                        <AdminTable
                            data={links.filter(l => l.location === selectedLocation)}
                            columns={columns as any}
                            loading={loading}
                            renderMobileCard={(row: any) => (
                                <div className="flex items-center justify-between p-1">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-3 h-3 rounded-full ${row.active ? 'bg-green-500' : 'bg-gray-300'}`} />
                                        <div>
                                            <h3 className="font-bold text-gray-900 tracking-tight">{row.name}</h3>
                                            <p className="text-[11px] text-gray-400 font-mono mt-0.5">{row.href}</p>
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
                    )}
                </div>
            </div>
        </div>
    )
}
