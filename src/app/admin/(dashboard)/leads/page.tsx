'use client'

import React, { useState, useEffect } from 'react'
import { 
    Mail, Phone, Calendar, Archive, User, Target, 
    TrendingUp, ChevronDown, ChevronUp, CheckCircle2, 
    Trash2, RotateCcw, Zap, Heart, MessageSquare, Building2 
} from 'lucide-react'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import AdminCard from '@/components/admin/ui/AdminCard'
import AdminStatusBadge from '@/components/admin/ui/AdminStatusBadge'
import AdminTable from '@/components/admin/ui/AdminTable'
import AdminActionMenu from '@/components/admin/ui/AdminActionMenu'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<string, { label: string; type: 'info' | 'success' | 'default' }> = {
    NEW: { label: 'Nuevo', type: 'info' },
    CONTACTED: { label: 'Contactado', type: 'success' },
    ARCHIVED: { label: 'Archivado', type: 'default' },
}

const SOURCE_CONFIG: Record<string, { label: string; color: string }> = {
    CONTACT: { label: 'Contacto', color: 'text-purple-600 bg-purple-50/50 border-purple-100/50' },
    LEAD_CAPTURE: { label: 'Hoja de Ruta', color: 'text-orange-600 bg-orange-50/50 border-orange-100/50' },
    DEMO_REQUEST: { label: 'Solicitud Demo', color: 'text-indigo-600 bg-indigo-50/50 border-indigo-100/50' },
    ROADMAP_REQUEST: { label: 'Hoja de Ruta', color: 'text-orange-600 bg-orange-50/50 border-orange-100/50' },
}

const urgencyColor = (v?: number) => {
    if (!v) return 'text-gray-400'
    if (v <= 3) return 'text-emerald-500'
    if (v <= 6) return 'text-amber-500'
    if (v <= 8) return 'text-orange-500'
    return 'text-red-500'
}

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState<string | null>(null)
    const [filter, setFilter] = useState<'ALL' | 'NEW' | 'CONTACTED' | 'ARCHIVED'>('ALL')

    useEffect(() => {
        async function fetchLeads() {
            try {
                const res = await fetch('/api/leads')
                if (res.ok) {
                    const data = await res.json()
                    setLeads(data)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchLeads()
    }, [])

    async function updateStatus(id: string, status: string) {
        try {
            await fetch(`/api/leads/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })
            setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l))
        } catch (e) {
            console.error(e)
        }
    }

    const filteredLeads = filter === 'ALL' ? leads : leads.filter(l => l.status === filter)

    const columns = [
        {
            header: 'Contacto',
            className: 'max-w-[200px]',
            accessor: (lead: any) => (
                <div className="flex items-center gap-3.5 min-w-0">
                    <div className="h-10 w-10 bg-gray-50/50 rounded-xl flex items-center justify-center border border-gray-150 shrink-0 shadow-inner">
                        <User className="text-gray-400" size={16} />
                    </div>
                    <div className="min-w-0">
                        <h4 className="text-[13px] font-bold text-gray-900 truncate leading-tight">{lead.name}</h4>
                        <div className="flex flex-col text-[10px] text-gray-450 mt-1 font-semibold">
                            <span className="truncate max-w-[150px]">{lead.email}</span>
                            {lead.phone && <span className="text-[9px] text-gray-400">{lead.phone}</span>}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Interés / Mensaje',
            className: 'hidden md:table-cell max-w-[280px]',
            accessor: (lead: any) => (
                <div className="space-y-1.5 min-w-0">
                    {lead.solutionTitle ? (
                        <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 text-[9px] font-black bg-blue-50/50 text-blue-600 border border-blue-100/50 rounded-md uppercase tracking-wider block w-fit truncate max-w-[180px]">
                                {lead.solutionTitle}
                            </span>
                            {lead.company && (
                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate max-w-[100px]">
                                    @{lead.company}
                                </span>
                            )}
                        </div>
                    ) : lead.company ? (
                        <div className="flex items-center gap-1.5">
                            <Building2 size={11} className="text-gray-400" />
                            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest truncate max-w-[150px]">
                                {lead.company}
                            </span>
                        </div>
                    ) : null}
                    
                    <p className="text-[12px] text-gray-500 font-medium line-clamp-1 truncate" title={lead.desiredResult || lead.message}>
                        {lead.desiredResult || lead.message || '—'}
                    </p>
                </div>
            )
        },
        {
            header: 'Estado',
            className: 'max-w-[120px]',
            accessor: (lead: any) => {
                const statusConfig = STATUS_CONFIG[lead.status] || STATUS_CONFIG['NEW']
                return (
                    <div className="flex items-center gap-2">
                        <AdminStatusBadge 
                            label={statusConfig.label} 
                            type={statusConfig.type} 
                            className="text-[9px]"
                        />
                        {lead.urgency && lead.urgency >= 8 && (
                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded-md text-[8px] font-black uppercase tracking-wider animate-pulse">
                                <Zap size={8} fill="currentColor" /> HOT
                            </span>
                        )}
                    </div>
                )
            }
        },
        {
            header: 'Origen',
            className: 'hidden lg:table-cell max-w-[120px]',
            accessor: (lead: any) => {
                const sourceInfo = SOURCE_CONFIG[lead.source] || SOURCE_CONFIG['CONTACT']
                return (
                    <span className={cn(
                        "text-[9px] px-2 py-0.5 rounded-md font-black uppercase tracking-widest border block w-fit",
                        sourceInfo.color
                    )}>
                        {sourceInfo.label}
                    </span>
                )
            }
        },
        {
            header: 'Fecha',
            className: 'hidden md:table-cell max-w-[110px]',
            accessor: (lead: any) => (
                <div className="text-[11px] text-gray-650 flex flex-col font-semibold gap-0.5">
                    <span className="text-[#1D1D1F]">
                        {new Date(lead.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">
                        {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            )
        },
        {
            header: '',
            className: 'text-right w-[96px]',
            accessor: (lead: any) => {
                const isExpanded = expanded === lead.id
                const actions = [
                    {
                        label: 'Marcar Contactado',
                        onClick: () => updateStatus(lead.id, 'CONTACTED'),
                        icon: CheckCircle2,
                        show: lead.status !== 'CONTACTED'
                    },
                    {
                        label: 'Archivar Lead',
                        onClick: () => updateStatus(lead.id, 'ARCHIVED'),
                        icon: Archive,
                        show: lead.status !== 'ARCHIVED',
                        variant: 'danger' as const
                    },
                    {
                        label: 'Restaurar Lead',
                        onClick: () => updateStatus(lead.id, 'NEW'),
                        icon: RotateCcw,
                        show: lead.status === 'ARCHIVED'
                    }
                ].filter(a => a.show) as any[]

                return (
                    <div className="flex items-center justify-end gap-1.5">
                        <button
                            onClick={() => setExpanded(isExpanded ? null : lead.id)}
                            className={cn(
                                "p-1.5 rounded-full border transition-all text-gray-450 hover:text-gray-900",
                                isExpanded ? "bg-gray-100 border-gray-250" : "bg-transparent border-transparent hover:border-gray-200"
                            )}
                            title={isExpanded ? "Ocultar detalle" : "Ver detalle"}
                        >
                            {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                        <AdminActionMenu actions={actions} />
                    </div>
                )
            }
        }
    ]

    return (
        <div className="w-full max-w-full min-w-0 space-y-8 pb-20 select-none">
            <AdminToolbar 
                title="Contactos & Leads"
                description="Gestiona las interacciones y oportunidades capturadas desde la web."
                icon={Mail as any}
            />

            {/* Premium Clara Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-2">
                <div className="premium-white-surface p-6 md:p-8 relative overflow-hidden group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-50/50 border border-blue-100/50 rounded-2xl text-blue-600 transition-transform group-hover:scale-105 duration-500">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Leads</p>
                            <p className="text-2xl font-black text-[#1D1D1F] tracking-tighter mt-1">{leads.length}</p>
                        </div>
                    </div>
                    <TrendingUp className="absolute -right-2 -bottom-2 text-blue-50/20 w-16 h-16 -rotate-12" />
                </div>

                <div className="premium-white-surface p-6 md:p-8 relative overflow-hidden group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-50/50 border border-emerald-100/50 rounded-2xl text-emerald-600 transition-transform group-hover:scale-105 duration-500">
                            <Target size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Nuevos</p>
                            <p className="text-2xl font-black text-[#1D1D1F] tracking-tighter mt-1">
                                {leads.filter(l => l.status === 'NEW').length}
                            </p>
                        </div>
                    </div>
                    <div className="absolute top-3 right-3 flex gap-1">
                        <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                </div>

                <div className="premium-white-surface p-6 md:p-8 relative overflow-hidden group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-50/50 border border-amber-100/50 rounded-2xl text-amber-600 transition-transform group-hover:scale-105 duration-500">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">En Seguimiento</p>
                            <p className="text-2xl font-black text-[#1D1D1F] tracking-tighter mt-1">
                                {leads.filter(l => l.status === 'CONTACTED').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="premium-white-surface p-6 md:p-8 relative overflow-hidden group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-50/50 border border-purple-100/50 rounded-2xl text-purple-600 transition-transform group-hover:scale-105 duration-500">
                            <Calendar size={20} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Últimos 7 días</p>
                            <p className="text-2xl font-black text-[#1D1D1F] tracking-tighter mt-1">
                                {leads.filter(l => {
                                    const date = new Date(l.createdAt);
                                    const now = new Date();
                                    const diff = now.getTime() - date.getTime();
                                    return diff < 7 * 24 * 60 * 60 * 1000;
                                }).length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pestañas de Estado & Contenedor de Listado */}
            <div className="space-y-6">
                <div className="flex p-1 bg-gray-100 rounded-xl w-full sm:w-fit overflow-x-auto shadow-inner">
                    {[
                        { id: 'ALL' as const, label: 'Todos', count: leads.length },
                        { id: 'NEW' as const, label: 'Nuevos', count: leads.filter(l => l.status === 'NEW').length },
                        { id: 'CONTACTED' as const, label: 'Contactados', count: leads.filter(l => l.status === 'CONTACTED').length },
                        { id: 'ARCHIVED' as const, label: 'Archivados', count: leads.filter(l => l.status === 'ARCHIVED').length },
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setFilter(t.id)}
                            className={`flex-1 sm:flex-none px-4 py-2 text-[10px] font-bold rounded-lg transition-all whitespace-nowrap ${filter === t.id
                                ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50'
                                : 'text-gray-400 hover:text-gray-700'
                                }`}
                        >
                            {t.label} <span className={`ml-1.5 ${filter === t.id ? 'text-blue-500' : 'opacity-40'}`}>{t.count}</span>
                        </button>
                    ))}
                </div>

                {/* Analytical Table & Mobile Cards fallbacks */}
                <div className="workspace-flat-table-container">
                    <AdminTable 
                        columns={columns}
                        data={filteredLeads}
                        loading={loading}
                        emptyMessage="No hay mensajes o leads calientes registrados todavía."
                        renderMobileCard={(lead) => {
                            const sourceInfo = SOURCE_CONFIG[lead.source] || SOURCE_CONFIG['CONTACT']
                            const statusConfig = STATUS_CONFIG[lead.status] || STATUS_CONFIG['NEW']
                            const isExpanded = expanded === lead.id

                            const actions = [
                                {
                                    label: 'Marcar Contactado',
                                    onClick: () => updateStatus(lead.id, 'CONTACTED'),
                                    icon: CheckCircle2,
                                    show: lead.status !== 'CONTACTED'
                                },
                                {
                                    label: 'Archivar Lead',
                                    onClick: () => updateStatus(lead.id, 'ARCHIVED'),
                                    icon: Archive,
                                    show: lead.status !== 'ARCHIVED',
                                    variant: 'danger' as const
                                },
                                {
                                    label: 'Restaurar Lead',
                                    onClick: () => updateStatus(lead.id, 'NEW'),
                                    icon: RotateCcw,
                                    show: lead.status === 'ARCHIVED'
                                }
                            ].filter(a => a.show) as any[]

                            return (
                                <div className="flex flex-col gap-3.5 text-left">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex gap-3 min-w-0">
                                            <div className="h-10 w-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 shrink-0">
                                                <User className="text-gray-400" size={16} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="font-bold text-gray-900 truncate text-sm">{lead.name}</h3>
                                                <div className="flex flex-col text-[10px] text-gray-400 font-semibold mt-0.5">
                                                    <span className="truncate max-w-[180px]">{lead.email}</span>
                                                    {lead.phone && <span>{lead.phone}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                                onClick={() => setExpanded(isExpanded ? null : lead.id)}
                                                className={cn(
                                                    "p-1.5 rounded-full border transition-all text-gray-450",
                                                    isExpanded ? "bg-gray-100 border-gray-200 text-gray-900" : "bg-transparent border-transparent hover:bg-gray-50"
                                                )}
                                            >
                                                {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                                            </button>
                                            <AdminActionMenu actions={actions} />
                                        </div>
                                    </div>

                                    {/* Badges */}
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={cn(
                                            "text-[9px] px-2 py-0.5 rounded-lg font-black uppercase tracking-widest border",
                                            sourceInfo.color
                                        )}>
                                            {sourceInfo.label}
                                        </span>
                                        <AdminStatusBadge 
                                            label={statusConfig.label} 
                                            type={statusConfig.type} 
                                            className="text-[9px]"
                                        />
                                        {lead.urgency && lead.urgency >= 8 && (
                                            <span className="flex items-center gap-0.5 px-1.5 py-0.5 bg-red-50 text-red-600 border border-red-100 rounded-md text-[8px] font-black uppercase tracking-wider animate-pulse">
                                                <Zap size={8} fill="currentColor" /> HOT
                                            </span>
                                        )}
                                    </div>

                                    {/* Brief summary of company/solution if collapsed */}
                                    {!isExpanded && (lead.company || lead.solutionTitle) && (
                                        <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100 text-[11px] font-semibold text-gray-600">
                                            {lead.company && <span>@{lead.company} </span>}
                                            {lead.solutionTitle && <span className="text-blue-600">({lead.solutionTitle})</span>}
                                            <p className="text-[11px] text-gray-455 line-clamp-1 mt-1 font-medium font-italic">
                                                &ldquo;{lead.desiredResult || lead.message}&rdquo;
                                            </p>
                                        </div>
                                    )}

                                    {/* Expanded Detail Workspace inside mobile card */}
                                    {isExpanded && (
                                        <div className="border-t border-gray-100 pt-3.5 mt-1 space-y-4 animate-in slide-in-from-top-2 duration-300">
                                            {lead.company && (
                                                <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                                                    <Building2 size={11} /> Empresa: <span className="text-gray-900">{lead.company}</span>
                                                </div>
                                            )}
                                            
                                            {lead.bottleneck && (
                                                <div className="bg-gray-50/30 border border-gray-100 rounded-xl p-4">
                                                    <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">Cuello de Botella</span>
                                                    <p className="text-[11px] font-semibold text-gray-700 leading-relaxed">{lead.bottleneck}</p>
                                                </div>
                                            )}

                                            {(lead.desiredResult || lead.message) && (
                                                <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                                                    <span className="block text-[8px] font-black text-gray-400 uppercase tracking-widest mb-1.5">
                                                        {lead.desiredResult ? 'Resultados Deseados' : 'Mensaje'}
                                                    </span>
                                                    <p className="text-[11px] font-semibold text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                        {lead.desiredResult || lead.message}
                                                    </p>
                                                </div>
                                            )}

                                            <div className="flex items-center justify-between text-[8px] font-black text-gray-400 uppercase tracking-wider pt-1.5">
                                                <span>Recibido: {new Date(lead.createdAt).toLocaleDateString()}</span>
                                                {lead.urgency && (
                                                    <span className="flex items-center gap-1">
                                                        Urgencia: <span className={cn("text-xs font-black", urgencyColor(lead.urgency))}>{lead.urgency}/10</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}}
                    />
                </div>
            </div>

                {/* Expanded Detailed Workspace drawer for Desktop & Tablets */}
                {expanded && leads.find(l => l.id === expanded) && (
                    (() => {
                        const lead = leads.find(l => l.id === expanded)
                        return (
                            <div className="premium-white-surface p-6 md:p-8 animate-in slide-in-from-bottom-2 duration-300 space-y-6">
                                <div className="flex items-start justify-between border-b border-gray-50 pb-4">
                                    <div className="flex gap-4">
                                        <div className="h-11 w-11 bg-blue-50/50 rounded-2xl flex items-center justify-center border border-blue-100/50 text-blue-600 shrink-0">
                                            <MessageSquare size={20} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-gray-900">Conversación de Lead de Negocio</h3>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">
                                                Contacto: {lead.name} — {lead.email}
                                            </p>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => setExpanded(null)}
                                        className="px-4 py-2 hover:bg-gray-50 rounded-xl transition-all text-xs font-bold text-gray-500 hover:text-gray-950 border border-gray-150 shadow-sm bg-white"
                                    >
                                        Ocultar Panel Detalle
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Left side - context insights */}
                                    <div className="space-y-6">
                                        {lead.bottleneck && (
                                            <div className="bg-gray-50/30 border border-gray-100 rounded-2xl p-5">
                                                <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-2.5">Cuello de Botella Detectado</span>
                                                <p className="text-[13px] font-bold text-gray-700 leading-relaxed">{lead.bottleneck}</p>
                                            </div>
                                        )}
                                        <div className="flex flex-wrap gap-4 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                            <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl">Recibido: {new Date(lead.createdAt).toLocaleString()}</span>
                                            {lead.urgency && (
                                                <span className="px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-xl flex items-center gap-1">
                                                    Nivel Urgencia: <span className={cn("text-sm font-black", urgencyColor(lead.urgency))}>{lead.urgency}/10</span>
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Right side - message and goals */}
                                    <div className="space-y-6">
                                        {(lead.desiredResult || lead.message) && (
                                            <div className="bg-white border border-gray-150 rounded-2xl p-6 shadow-sm">
                                                <span className="block text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3">
                                                    {lead.desiredResult ? 'Objetivos y Resultados Solicitados' : 'Mensaje del Contacto'}
                                                </span>
                                                <p className="text-[13px] font-semibold text-gray-700 leading-relaxed whitespace-pre-wrap">
                                                    {lead.desiredResult || lead.message}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })()
                )}

            </div>
    )
}
