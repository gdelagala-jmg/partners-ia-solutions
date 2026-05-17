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
    Calendar,
    Bot,
    Loader2,
    Users
} from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import AdminTable from '@/components/admin/ui/AdminTable'
import AdminActionMenu from '@/components/admin/ui/AdminActionMenu'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'

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
            className: 'max-w-[240px]',
            accessor: (c: any) => (
                <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100 shadow-sm shrink-0">
                        <Mail size={20} />
                    </div>
                    <div className="min-w-0 flex-1">
                        <div className="text-[13px] font-bold text-gray-900 truncate" title={c.title}>{c.title}</div>
                        <div className="text-[11px] text-gray-400 truncate mt-0.5">{c.subject}</div>
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
                    SENDING: { label: 'Enviando...', color: 'bg-amber-50 text-amber-600', icon: Loader2 },
                    SENT: { label: 'Enviada', color: 'bg-green-50 text-green-600', icon: CheckCircle2 },
                    FAILED: { label: 'Error', color: 'bg-red-50 text-red-600', icon: AlertCircle },
                    ARCHIVED: { label: 'Archivada', color: 'bg-gray-50 text-gray-400', icon: Archive },
                }
                const config = statusMap[c.status] || statusMap.DRAFT
                const Icon = config.icon

                return (
                    <div className="space-y-1">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.color.replace('bg-', 'border-').split(' ')[0] + '/20'} ${config.color}`}>
                            <Icon size={12} className={c.status === 'SENDING' ? 'animate-spin' : ''} />
                            {config.label}
                        </span>
                        {c.status === 'SCHEDULED' && c.scheduledFor && (
                            <div className="text-[9px] text-blue-400 font-bold ml-1">
                                {format(new Date(c.scheduledFor), "HH:mm 'del' d MMM", { locale: es })}
                            </div>
                        )}
                    </div>
                )
            }
        },
        {
            header: 'Origen',
            className: 'hidden lg:table-cell',
            accessor: (c: any) => (
                <div className="flex items-center gap-2">
                    {c.autoGenerated ? (
                        <span className="flex items-center gap-1 text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100">
                            <Bot size={12} />
                            AUTO
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-[10px] font-black text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">
                            <Users size={12} />
                            MANUAL
                        </span>
                    )}
                </div>
            )
        },
        {
            header: 'Métricas',
            className: 'hidden xl:table-cell',
            accessor: (c: any) => (
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter leading-none">Vistas</span>
                        <span className="text-[13px] font-black text-blue-600 mt-1">
                            {c._count?.opens || 0}
                        </span>
                    </div>
                    <div className="flex flex-col border-l border-gray-100 pl-4">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-tighter leading-none">Clicks</span>
                        <span className="text-[13px] font-black text-purple-600 mt-1">
                            {c._count?.clicks || 0}
                        </span>
                    </div>
                </div>
            )
        },
        {
            header: '',
            className: 'text-right',
            accessor: (c: any) => (
                <AdminActionMenu
                    actions={[
                        {
                            label: 'Editar',
                            icon: Edit3,
                            onClick: () => router.push(`/admin/newsletter/editor/${c.id}`)
                        },
                        {
                            label: 'Duplicar',
                            icon: Copy,
                            onClick: () => handleDuplicate(c.id)
                        },
                        {
                            label: 'Eliminar',
                            icon: Trash2,
                            onClick: () => handleDelete(c.id),
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
                title="Campañas"
                description="Gestión y seguimiento de boletines enviados a tu audiencia."
                icon={Send}
                actions={
                    <button
                        onClick={handleCreate}
                        className="flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#1D1D1F] text-white rounded-2xl hover:bg-black transition-all font-bold shadow-xl shadow-gray-200 text-sm whitespace-nowrap"
                    >
                        <Plus size={18} className="shrink-0" />
                        <span className="hidden sm:inline">Nueva Campaña</span>
                        <span className="sm:hidden">Nueva</span>
                    </button>
                }
            />

            <div className="relative group w-full max-w-md min-w-0">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Search size={18} />
                </div>
                <input
                    type="text"
                    placeholder="Buscar campañas..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-medium shadow-sm"
                />
            </div>

            <AdminTable
                columns={columns}
                data={filteredCampaigns}
                loading={loading}
                emptyMessage="No se encontraron campañas."
                renderMobileCard={(c) => {
                    const statusMap: any = {
                        DRAFT: { label: 'Borrador', color: 'bg-gray-100 text-gray-600', icon: FileText },
                        SCHEDULED: { label: 'Programada', color: 'bg-blue-50 text-blue-600', icon: Clock },
                        SENDING: { label: 'Enviando...', color: 'bg-amber-50 text-amber-600', icon: Loader2 },
                        SENT: { label: 'Enviada', color: 'bg-green-50 text-green-600', icon: CheckCircle2 },
                        FAILED: { label: 'Error', color: 'bg-red-50 text-red-600', icon: AlertCircle },
                        ARCHIVED: { label: 'Archivada', color: 'bg-gray-50 text-gray-400', icon: Archive },
                    }
                    const config = statusMap[c.status] || statusMap.DRAFT
                    const StatusIcon = config.icon

                    return (
                        <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                                        <Mail size={20} />
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="text-[13px] font-bold text-gray-900 truncate">{c.title}</h3>
                                        <p className="text-[11px] text-gray-500 truncate">{c.subject}</p>
                                    </div>
                                </div>
                                <AdminActionMenu
                                    actions={[
                                        {
                                            label: 'Editar',
                                            icon: Edit3,
                                            onClick: () => router.push(`/admin/newsletter/editor/${c.id}`)
                                        },
                                        {
                                            label: 'Duplicar',
                                            icon: Copy,
                                            onClick: () => handleDuplicate(c.id)
                                        },
                                        {
                                            label: 'Eliminar',
                                            icon: Trash2,
                                            onClick: () => handleDelete(c.id),
                                            variant: 'danger'
                                        }
                                    ]}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3 pt-2">
                                <div className="p-3 bg-white/50 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Vistas</p>
                                    <p className="text-base font-black text-blue-600 mt-0.5">{c._count?.opens || 0}</p>
                                </div>
                                <div className="p-3 bg-white/50 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Clicks</p>
                                    <p className="text-base font-black text-purple-600 mt-0.5">{c._count?.clicks || 0}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-gray-100/50">
                                <div className="flex items-center gap-2">
                                    <div className={cn(
                                        "inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-wider border",
                                        config.color.replace('bg-', 'border-').split(' ')[0] + '/20',
                                        config.color
                                    )}>
                                        <StatusIcon size={10} className={c.status === 'SENDING' ? 'animate-spin' : ''} />
                                        {config.label}
                                    </div>
                                    {c.autoGenerated && (
                                        <span className="flex items-center gap-1 text-[9px] font-black text-purple-600 bg-purple-50 px-2 py-0.5 rounded-lg border border-purple-100 uppercase">
                                            <Bot size={10} />
                                            AUTO
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <Calendar size={10} />
                                    <span className="text-[10px] font-bold uppercase">
                                        {format(new Date(c.updatedAt), 'dd MMM', { locale: es })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )
                }}
            />
        </div>
    )
}
