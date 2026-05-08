'use client'

import { useState, useEffect } from 'react'
import { 
    Plus, 
    Mail, 
    Send, 
    Clock, 
    FileText, 
    Archive, 
    Copy, 
    Trash2, 
    Edit3, 
    MoreVertical,
    AlertCircle,
    CheckCircle2,
    Search,
    ChevronRight,
    Calendar
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import AdminTable from '@/components/admin/AdminTable'
import AdminActionMenu from '@/components/admin/AdminActionMenu'
import { useRouter } from 'next/navigation'

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const router = useRouter()

    const fetchCampaigns = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/newsletter/campaigns')
            if (res.ok) {
                const data = await res.json()
                setCampaigns(data)
            }
        } catch (error) {
            console.error('Error fetching campaigns:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCampaigns()
    }, [])

    const handleCreate = async () => {
        const title = prompt('Título interno de la campaña:')
        if (!title) return
        const subject = prompt('Asunto del email:')
        if (!subject) return

        try {
            const res = await fetch('/api/admin/newsletter/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, subject })
            })
            if (res.ok) {
                const newCampaign = await res.json()
                router.push(`/admin/newsletter/editor/${newCampaign.id}`)
            }
        } catch (error) {
            console.error('Error creating campaign:', error)
        }
    }

    const handleDuplicate = async (id: string) => {
        try {
            const res = await fetch(`/api/admin/newsletter/campaigns/${id}/duplicate`, {
                method: 'POST'
            })
            if (res.ok) fetchCampaigns()
        } catch (error) {
            console.error('Error duplicating campaign:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta campaña?')) return
        try {
            const res = await fetch(`/api/admin/newsletter/campaigns/${id}`, {
                method: 'DELETE'
            })
            if (res.ok) fetchCampaigns()
        } catch (error) {
            console.error('Error deleting campaign:', error)
        }
    }

    const filteredCampaigns = campaigns.filter(c => 
        c.title.toLowerCase().includes(search.toLowerCase()) || 
        c.subject.toLowerCase().includes(search.toLowerCase())
    )

    const columns = [
        {
            header: 'Campaña / Asunto',
            accessor: (c: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
                        <FileText size={20} />
                    </div>
                    <div className="min-w-0">
                        <div className="font-bold text-[#1D1D1F] truncate" title={c.title}>{c.title}</div>
                        <div className="text-xs text-gray-400 truncate max-w-[250px]">{c.subject}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Estado',
            accessor: (c: any) => {
                const statusMap: any = {
                    DRAFT: { label: 'Borrador', color: 'bg-gray-100 text-gray-600', icon: FileText },
                    SCHEDULED: { label: 'Programada', color: 'bg-blue-50 text-blue-600', icon: Clock },
                    SENT: { label: 'Enviada', color: 'bg-green-50 text-green-600', icon: CheckCircle2 },
                    FAILED: { label: 'Error', color: 'bg-red-50 text-red-600', icon: AlertCircle },
                    ARCHIVED: { label: 'Archivada', color: 'bg-gray-50 text-gray-400', icon: Archive },
                }
                const config = statusMap[c.status] || statusMap.DRAFT
                const Icon = config.icon

                return (
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.color}`}>
                        <Icon size={12} />
                        {config.label}
                    </span>
                )
            }
        },
        {
            header: 'Última Edición',
            accessor: (c: any) => (
                <div className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Calendar size={14} className="text-gray-300" />
                    {format(new Date(c.updatedAt), "d 'de' MMMM", { locale: es })}
                </div>
            )
        },
        {
            header: '',
            className: 'text-right',
            accessor: (c: any) => (
                <div className="flex items-center justify-end gap-2">
                    <button 
                        onClick={() => router.push(`/admin/newsletter/editor/${c.id}`)}
                        className="p-2 text-gray-400 hover:text-[#1D1D1F] hover:bg-gray-100 rounded-full transition-all"
                        title="Editar"
                    >
                        <Edit3 size={18} />
                    </button>
                    <AdminActionMenu
                        actions={[
                            { label: 'Duplicar', icon: Copy, onClick: () => handleDuplicate(c.id) },
                            { label: 'Archivar', icon: Archive, onClick: () => {} }, // TODO
                            { label: 'Eliminar', icon: Trash2, variant: 'danger', onClick: () => handleDelete(c.id) },
                        ]}
                    />
                </div>
            )
        }
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-4 md:px-0">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Campañas</h1>
                    <p className="text-gray-400 mt-1 font-medium">Crea y gestiona tus envíos editoriales.</p>
                </div>
                <button
                    onClick={handleCreate}
                    className="flex items-center justify-center px-6 py-2.5 bg-[#1D1D1F] text-white rounded-2xl hover:bg-black transition-all font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.1)]"
                >
                    <Plus size={18} className="mr-2" />
                    Nueva Campaña
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar campaña o asunto..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                    />
                </div>
            </div>

            <AdminTable
                columns={columns}
                data={filteredCampaigns}
                loading={loading}
                emptyMessage="No hay campañas creadas todavía."
                renderMobileCard={(c) => (
                    <div className="flex items-start justify-between" onClick={() => router.push(`/admin/newsletter/editor/${c.id}`)}>
                        <div className="flex gap-4 min-w-0">
                            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 flex-shrink-0">
                                <FileText size={20} />
                            </div>
                            <div className="min-w-0">
                                <h3 className="font-bold text-gray-900 truncate pr-2">{c.title}</h3>
                                <p className="text-xs text-gray-400 truncate mt-0.5">{c.subject}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-[10px] text-gray-400 font-medium">
                                        {format(new Date(c.updatedAt), 'd MMM')}
                                    </span>
                                    <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                        c.status === 'SENT' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-600'
                                    }`}>
                                        {c.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <ChevronRight size={18} className="text-gray-300 mt-1" />
                    </div>
                )}
            />
        </div>
    )
}
