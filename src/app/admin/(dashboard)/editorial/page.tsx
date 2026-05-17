'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Globe, EyeOff, Sparkles, Layout, Calendar } from 'lucide-react'
import EditorialForm from '@/components/admin/EditorialForm'
import AdminTable from '@/components/admin/ui/AdminTable'
import AdminActionMenu from '@/components/admin/ui/AdminActionMenu'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import { cn } from '@/lib/utils'

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
            // Wave 5: removed large min-w, let table distribute space naturally
            className: 'max-w-[180px]',
            accessor: (content: any) => (
                <div className="flex items-center gap-2 min-w-0">
                    <div className="hidden lg:flex h-9 w-9 shrink-0 rounded-xl bg-blue-50 items-center justify-center text-blue-500 border border-blue-100 shadow-sm">
                        <Layout size={16} />
                    </div>
                    <div className="min-w-0">
                        <div className="text-[12px] font-bold text-gray-900 capitalize truncate">
                            {content.pageKey} / {content.sectionKey}
                        </div>
                        <div className="text-[10px] text-blue-500 font-medium mt-0.5 truncate">
                            {content.badge || 'Sin badge'}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Título / Líneas',
            className: 'max-w-[200px]',
            accessor: (content: any) => (
                <div className="flex flex-col min-w-0">
                    <div className="text-[13px] font-bold text-gray-900 truncate">{content.titleLine1}</div>
                    <div className="text-[11px] text-gray-400 truncate italic">{content.titleLine2}</div>
                </div>
            )
        },
        {
            header: 'Vigencia',
            // Only show on xl+ to avoid horizontal overflow on md/lg
            className: 'hidden xl:table-cell max-w-[140px]',
            accessor: (content: any) => {
                const now = new Date()
                const start = content.startDate ? new Date(content.startDate) : null
                const end = content.endDate ? new Date(content.endDate) : null
                const isScheduled = start && start > now
                const isExpired = end && end < now

                return (
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center text-[10px] font-medium text-gray-400">
                            <Calendar size={10} className="mr-1 shrink-0" />
                            <span className="truncate">
                                {start ? start.toLocaleDateString() : 'Siempre'} — {end ? end.toLocaleDateString() : '∞'}
                            </span>
                        </div>
                        {isScheduled && <span className="text-[9px] text-amber-500 font-black uppercase tracking-tighter">Programado</span>}
                        {isExpired && <span className="text-[9px] text-red-500 font-black uppercase tracking-tighter">Expirado</span>}
                    </div>
                )
            }
        },
        {
            header: 'Estado',
            className: 'max-w-[120px]',
            accessor: (content: any) => (
                <button
                    onClick={() => handleToggleStatus(content)}
                    className={cn(
                        "flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl transition-all border text-nowrap",
                        content.isActive 
                            ? 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100' 
                            : 'bg-gray-50 text-gray-400 border-gray-100 hover:bg-gray-100'
                    )}
                >
                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${content.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-gray-300'}`} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">
                        {content.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                </button>
            )
        },
        {
            header: '',
            className: 'text-right w-12',
            accessor: (content: any) => (
                <AdminActionMenu
                    actions={[
                        {
                            label: 'Editar',
                            icon: Edit,
                            onClick: () => handleEdit(content)
                        },
                        {
                            label: content.isActive ? 'Desactivar' : 'Activar',
                            icon: content.isActive ? EyeOff : Globe,
                            onClick: () => handleToggleStatus(content)
                        },
                        {
                            label: 'Eliminar',
                            icon: Trash2,
                            onClick: () => handleDelete(content.id),
                            variant: 'danger'
                        }
                    ]}
                />
            )
        }
    ]

    return (
        <div className="w-full max-w-full min-w-0 space-y-8 pb-20">
            <AdminToolbar 
                title="Hero Dinámico"
                description="Gestiona los mensajes, títulos y llamadas a la acción que aparecen en el Hero de la web."
                icon={Sparkles}
                actions={
                    !isEditing && (
                        <button
                            onClick={handleCreate}
                            className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#1D1D1F] text-white rounded-2xl hover:bg-black transition-all font-bold shadow-xl shadow-gray-200 text-sm whitespace-nowrap"
                        >
                            <Plus size={18} className="shrink-0" />
                            <span className="hidden sm:inline">Nuevo Contenido</span>
                            <span className="sm:hidden">Nuevo</span>
                        </button>
                    )
                }
            />

            {isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 w-full max-w-full min-w-0">
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
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100">
                                        <Layout size={18} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-[13px] font-bold text-gray-900 truncate">{content.titleLine1}</h3>
                                        <p className="text-[11px] text-gray-500 truncate uppercase tracking-tight">
                                            {content.pageKey} / {content.sectionKey}
                                        </p>
                                    </div>
                                </div>
                                <AdminActionMenu
                                    actions={[
                                        {
                                            label: 'Editar',
                                            icon: Edit,
                                            onClick: () => handleEdit(content)
                                        },
                                        {
                                            label: content.isActive ? 'Desactivar' : 'Activar',
                                            icon: content.isActive ? EyeOff : Globe,
                                            onClick: () => handleToggleStatus(content)
                                        },
                                        {
                                            label: 'Eliminar',
                                            icon: Trash2,
                                            onClick: () => handleDelete(content.id),
                                            variant: 'danger'
                                        }
                                    ]}
                                />
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100/50">
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border",
                                        content.isActive 
                                            ? "bg-green-50 border-green-200 text-green-600" 
                                            : "bg-gray-50 border-gray-200 text-gray-400"
                                    )}>
                                        {content.isActive ? 'ACTIVO' : 'INACTIVO'}
                                    </div>
                                    {content.startDate && (
                                        <div className="flex items-center gap-1 text-[9px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100 uppercase">
                                            <Calendar size={10} />
                                            PROG.
                                        </div>
                                    )}
                                </div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest italic truncate max-w-[100px]">
                                    {content.badge || 'SIN BADGE'}
                                </div>
                            </div>
                        </div>
                    )}
                />
            )}
        </div>
    )
}
