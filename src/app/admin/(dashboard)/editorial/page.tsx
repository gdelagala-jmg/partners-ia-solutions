'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Globe, EyeOff, Sparkles, Layout, Calendar, MessageSquare, History } from 'lucide-react'
import EditorialForm from '@/components/admin/EditorialForm'
import AdminTable from '@/components/admin/AdminTable'
import AdminActionMenu from '@/components/admin/AdminActionMenu'

export default function EditorialPage() {
    const [contents, setContents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentContent, setCurrentContent] = useState<any>(null)

    const fetchContents = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/editorial')
            if (res.ok) {
                const data = await res.json()
                setContents(Array.isArray(data) ? data : [])
            }
        } catch (error) {
            console.error('Error fetching editorial contents:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchContents()
    }, [])

    const handleCreate = () => {
        setCurrentContent(null)
        setIsEditing(true)
    }

    const handleEdit = (content: any) => {
        setCurrentContent(content)
        setIsEditing(true)
    }

    const handleToggleStatus = async (content: any) => {
        try {
            const res = await fetch(`/api/admin/editorial?id=${content.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...content, isActive: !content.isActive }),
            })
            if (res.ok) fetchContents()
        } catch (error) {
            console.error('Error toggling status:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este contenido editorial?')) return
        try {
            const res = await fetch(`/api/admin/editorial?id=${id}`, { method: 'DELETE' })
            if (res.ok) fetchContents()
        } catch (error) {
            console.error('Error deleting content:', error)
        }
    }

    const handleSubmit = async (data: any) => {
        try {
            const url = currentContent ? `/api/admin/editorial?id=${currentContent.id}` : '/api/admin/editorial'
            const method = currentContent ? 'PUT' : 'POST'
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (res.ok) {
                setIsEditing(false)
                fetchContents()
            } else {
                const errorData = await res.json()
                alert(`Error: ${errorData.error || 'No se pudo guardar el contenido'}`)
            }
        } catch (error) {
            console.error('Error saving content:', error)
            alert('Error de conexión al intentar guardar')
        }
    }

    const columns = [
        {
            header: 'Ubicación / Badge',
            accessor: (content: any) => (
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <div className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-400 transition-colors">
                            <History size={16} className="rotate-90" />
                        </div>
                        <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                            <Layout size={20} />
                        </div>
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-900 capitalize">
                            {content.pageKey} / {content.sectionKey}
                        </div>
                        <div className="text-xs text-blue-500 font-medium mt-0.5">
                            {content.badge || 'Sin badge'}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Título / Líneas',
            accessor: (content: any) => (
                <div className="max-w-xs">
                    <div className="text-sm font-bold text-gray-900 truncate">{content.titleLine1}</div>
                    <div className="text-xs text-gray-400 truncate italic">{content.titleLine2}</div>
                </div>
            )
        },
        {
            header: 'Atributos',
            accessor: (content: any) => (
                <div className="flex flex-wrap gap-1.5">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded-md uppercase">
                        {content.tone || 'Neutral'}
                    </span>
                    <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-md uppercase">
                        P{content.priority}
                    </span>
                </div>
            )
        },
        {
            header: 'Vigencia',
            accessor: (content: any) => {
                const now = new Date()
                const start = content.startDate ? new Date(content.startDate) : null
                const end = content.endDate ? new Date(content.endDate) : null
                const isScheduled = start && start > now
                const isExpired = end && end < now

                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center text-[10px] font-medium text-gray-400">
                            <Calendar size={10} className="mr-1" />
                            {start ? start.toLocaleDateString() : 'Siempre'} - {end ? end.toLocaleDateString() : '∞'}
                        </div>
                        {isScheduled && <span className="text-[9px] text-amber-500 font-bold uppercase">Programado</span>}
                        {isExpired && <span className="text-[9px] text-red-500 font-bold uppercase">Expirado</span>}
                    </div>
                )
            }
        },
        {
            header: 'Estado',
            accessor: (content: any) => (
                <button
                    onClick={() => handleToggleStatus(content)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${
                        content.isActive 
                            ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                            : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                    }`}
                    title={content.isActive ? 'Click para desactivar' : 'Click para activar'}
                >
                    <div className={`w-2 h-2 rounded-full ${content.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                        {content.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                    {content.isActive ? <EyeOff size={14} className="ml-1 opacity-60" /> : <Globe size={14} className="ml-1 opacity-60" />}
                </button>
            )
        },
        {
            header: 'Acciones',
            className: 'text-right',
            accessor: (content: any) => (
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => handleEdit(content)}
                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                        title="Editar"
                    >
                        <Edit size={18} />
                    </button>
                    <button
                        onClick={() => handleDelete(content.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        title="Eliminar"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            )
        }
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Sparkles className="text-blue-500" size={18} />
                        <span className="text-xs font-bold text-blue-500 uppercase tracking-widest">Editorial Studio</span>
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Hero Dinámico</h1>
                    <p className="text-gray-400 mt-1 font-medium max-w-2xl">
                        Gestiona los mensajes, títulos y llamadas a la acción que aparecen en el Hero de la web.
                    </p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center justify-center px-6 py-3 bg-[#1D1D1F] text-white rounded-2xl hover:bg-black transition-all font-semibold shadow-[0_8px_20_rgba(0,0,0,0.1)]"
                    >
                        <Plus size={20} className="mr-2" />
                        Nuevo Contenido
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                    <EditorialForm
                        initialData={currentContent}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                <AdminTable
                    columns={columns}
                    data={contents}
                    loading={loading}
                    emptyMessage="No hay contenidos editoriales configurados."
                    renderMobileCard={(content) => (
                        <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                                        <Layout size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#1D1D1F]">{content.titleLine1}</h3>
                                        <p className="text-[10px] text-gray-400 font-mono mt-0.5 opacity-60 capitalize">
                                            {content.pageKey} / {content.sectionKey}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => handleEdit(content)}
                                        className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(content.id)}
                                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100/50">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleToggleStatus(content)}
                                        className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                            content.isActive 
                                                ? 'bg-green-50 text-green-600' 
                                                : 'bg-gray-50 text-gray-400'
                                        }`}
                                    >
                                        {content.isActive ? 'Activo' : 'Inactivo'}
                                    </button>
                                    <span className="px-2 py-0.5 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-lg uppercase tracking-wider">P{content.priority}</span>
                                    <span className="px-2 py-0.5 bg-gray-50 text-gray-500 text-[10px] font-bold rounded-lg uppercase tracking-wider">{content.tone}</span>
                                </div>
                            </div>
                        </div>
                    )}
                />
            )}
        </div>
    )
}
