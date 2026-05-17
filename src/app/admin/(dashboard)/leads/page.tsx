'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, Calendar, Archive, User, Target, AlertTriangle, TrendingUp, ChevronDown, ChevronUp, Filter, MoreHorizontal, CheckCircle2, Trash2, RotateCcw } from 'lucide-react'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import AdminCard from '@/components/admin/ui/AdminCard'
import AdminStatusBadge from '@/components/admin/ui/AdminStatusBadge'
import AdminFilterBar from '@/components/admin/ui/AdminFilterBar'
import AdminActionMenu from '@/components/admin/ui/AdminActionMenu'
import { cn } from '@/lib/utils'

const STATUS_CONFIG: Record<string, { label: string; type: 'info' | 'success' | 'default' }> = {
    NEW: { label: 'Nuevo', type: 'info' },
    CONTACTED: { label: 'Contactado', type: 'success' },
    ARCHIVED: { label: 'Archivado', type: 'default' },
}

const SOURCE_CONFIG: Record<string, { label: string; color: string }> = {
    CONTACT: { label: 'Contacto', color: 'text-purple-600 bg-purple-50' },
    LEAD_CAPTURE: { label: 'Hoja de Ruta', color: 'text-orange-600 bg-orange-50' },
    DEMO_REQUEST: { label: 'Solicitud Demo', color: 'text-indigo-600 bg-indigo-50' },
    ROADMAP_REQUEST: { label: 'Hoja de Ruta', color: 'text-orange-600 bg-orange-50' },
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

    const filterOptions = [
        { id: 'ALL' as const, label: 'Todos', count: leads.length },
        { id: 'NEW' as const, label: 'Nuevos', count: leads.filter(l => l.status === 'NEW').length },
        { id: 'CONTACTED' as const, label: 'Contactados', count: leads.filter(l => l.status === 'CONTACTED').length },
        { id: 'ARCHIVED' as const, label: 'Archivados', count: leads.filter(l => l.status === 'ARCHIVED').length },
    ]

    return (
        <div className="w-full max-w-full min-w-0 space-y-6 pb-6">
            <AdminToolbar 
                title="Contactos & Leads"
                description="Gestiona las interacciones y oportunidades capturadas desde la web."
                icon={Mail}
            />

            <AdminFilterBar 
                options={filterOptions}
                activeId={filter}
                onChange={setFilter}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <AdminCard glass className="relative overflow-hidden group">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-50 rounded-xl text-blue-600 transition-transform group-hover:scale-110 duration-500">
                            <Mail size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Total Leads</p>
                            <p className="text-xl font-black text-[#1D1D1F]">{leads.length}</p>
                        </div>
                    </div>
                    <TrendingUp className="absolute -right-2 -bottom-2 text-blue-50/50 w-16 h-16 -rotate-12" />
                </AdminCard>

                <AdminCard glass className="relative overflow-hidden group">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-emerald-50 rounded-xl text-emerald-600 transition-transform group-hover:scale-110 duration-500">
                            <Target size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nuevos (Pendientes)</p>
                            <p className="text-xl font-black text-[#1D1D1F]">{leads.filter(l => l.status === 'NEW').length}</p>
                        </div>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    </div>
                </AdminCard>

                <AdminCard glass className="relative overflow-hidden group">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-amber-50 rounded-xl text-amber-600 transition-transform group-hover:scale-110 duration-500">
                            <Phone size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">En Seguimiento</p>
                            <p className="text-xl font-black text-[#1D1D1F]">{leads.filter(l => l.status === 'CONTACTED').length}</p>
                        </div>
                    </div>
                </AdminCard>

                <AdminCard glass className="relative overflow-hidden group">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-purple-50 rounded-xl text-purple-600 transition-transform group-hover:scale-110 duration-500">
                            <Calendar size={18} />
                        </div>
                        <div>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Últimos 7 días</p>
                            <p className="text-xl font-black text-[#1D1D1F]">
                                {leads.filter(l => {
                                    const date = new Date(l.createdAt);
                                    const now = new Date();
                                    const diff = now.getTime() - date.getTime();
                                    return diff < 7 * 24 * 60 * 60 * 1000;
                                }).length}
                            </p>
                        </div>
                    </div>
                </AdminCard>
            </div>

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1D1D1F]"></div>
                </div>
            ) : filteredLeads.length === 0 ? (
                <AdminCard className="p-20 text-center">
                    <Mail className="mx-auto h-12 w-12 text-gray-200 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">No hay mensajes aún</h3>
                    <p className="text-gray-500">Los formularios enviados aparecerán aquí.</p>
                </AdminCard>
            ) : (
                <div className="space-y-4">
                    {filteredLeads.map((lead) => {
                        const isExpanded = expanded === lead.id
                        const sourceInfo = SOURCE_CONFIG[lead.source] || SOURCE_CONFIG['CONTACT']
                        const statusConfig = STATUS_CONFIG[lead.status] || STATUS_CONFIG['NEW']
                        const isLeadCapture = lead.source === 'LEAD_CAPTURE'

                        const actions = [
                            {
                                label: 'Marcar como Contactado',
                                onClick: () => updateStatus(lead.id, 'CONTACTED'),
                                icon: <CheckCircle2 size={14} />,
                                show: lead.status !== 'CONTACTED'
                            },
                            {
                                label: 'Archivar Lead',
                                onClick: () => updateStatus(lead.id, 'ARCHIVED'),
                                icon: <Archive size={14} />,
                                show: lead.status !== 'ARCHIVED',
                                variant: 'danger' as const
                            },
                            {
                                label: 'Restaurar Lead',
                                onClick: () => updateStatus(lead.id, 'NEW'),
                                icon: <RotateCcw size={14} />,
                                show: lead.status === 'ARCHIVED'
                            }
                        ].filter(a => a.show)

                        return (
                            <AdminCard 
                                key={lead.id} 
                                noPadding
                                className={cn(
                                    "transition-all duration-300",
                                    lead.status === 'ARCHIVED' && "opacity-60 grayscale-[0.5]"
                                )}
                            >
                                <div className="p-5 md:p-6">
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-center gap-3 min-w-0">
                                            <div className="h-11 w-11 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 shrink-0">
                                                <User className="text-gray-400" size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <h3 className="text-base font-bold text-[#1D1D1F] tracking-tight truncate">{lead.name}</h3>
                                                <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1">
                                                    <span className="flex items-center text-xs text-gray-500 min-w-0">
                                                        <Mail size={11} className="mr-1 opacity-60 shrink-0" />
                                                        <span className="truncate max-w-[160px] sm:max-w-none">{lead.email}</span>
                                                    </span>
                                                    {lead.phone && (
                                                        <span className="flex items-center text-xs text-gray-500 whitespace-nowrap">
                                                            <Phone size={11} className="mr-1 opacity-60 shrink-0" /> {lead.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col md:flex-row items-end md:items-center gap-3">
                                            <div className="hidden sm:flex items-center gap-2">
                                                <span className={cn(
                                                    "text-[10px] px-2 py-0.5 rounded-md font-bold uppercase tracking-wider",
                                                    sourceInfo.color
                                                )}>
                                                    {sourceInfo.label}
                                                </span>
                                                <AdminStatusBadge 
                                                    label={statusConfig.label} 
                                                    type={statusConfig.type} 
                                                />
                                            </div>
                                            <AdminActionMenu actions={actions} />
                                        </div>
                                    </div>

                                    {/* Mobile labels */}
                                    <div className="flex sm:hidden items-center gap-2 mt-4 flex-wrap">
                                        <span className={cn(
                                            "text-[9px] px-2 py-0.5 rounded-lg font-bold uppercase tracking-widest border",
                                            sourceInfo.color.replace('text-', 'border-').split(' ')[0] + '/20',
                                            sourceInfo.color
                                        )}>
                                            {sourceInfo.label}
                                        </span>
                                        <AdminStatusBadge 
                                            label={statusConfig.label} 
                                            type={statusConfig.type} 
                                        />
                                    </div>

                                    {/* Quick Info Grid */}
                                    {(lead.company || lead.solutionTitle || lead.urgency) && (
                                        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
                                            {lead.company && (
                                                <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Empresa</p>
                                                    <p className="text-[13px] font-bold text-[#1D1D1F] line-clamp-1">{lead.company}</p>
                                                </div>
                                            )}
                                            {lead.solutionTitle && (
                                                <div className="bg-blue-50/50 rounded-xl p-3 border border-blue-100">
                                                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Solución</p>
                                                    <p className="text-[13px] font-bold text-blue-700 line-clamp-1">{lead.solutionTitle}</p>
                                                </div>
                                            )}
                                            {lead.scope && (
                                                <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Ámbito</p>
                                                    <p className="text-[13px] font-bold text-[#1D1D1F]">{lead.scope}</p>
                                                </div>
                                            )}
                                            {lead.urgency && (
                                                <div className="bg-gray-50/50 rounded-xl p-3 border border-gray-100">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Urgencia</p>
                                                    <p className={cn("text-lg font-black leading-none", urgencyColor(lead.urgency))}>
                                                        {lead.urgency}<span className="text-[10px] opacity-40 ml-0.5">/10</span>
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Expand toggle */}
                                    <button
                                        onClick={() => setExpanded(isExpanded ? null : lead.id)}
                                        className="mt-6 w-full py-2.5 bg-gray-50 hover:bg-gray-100 border border-gray-100 rounded-xl flex items-center justify-center gap-2 text-[11px] font-bold text-gray-500 hover:text-[#1D1D1F] transition-all uppercase tracking-widest"
                                    >
                                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        {isExpanded ? 'Ocultar detalle' : 'Ver respuesta completa'}
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-gray-50 bg-gray-50/30 p-5 md:p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
                                        {lead.bottleneck && (
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Análisis de Cuello de Botella</p>
                                                <div className="text-[14px] text-gray-700 bg-white border border-gray-100 rounded-2xl p-4 leading-relaxed shadow-sm">
                                                    {lead.bottleneck}
                                                </div>
                                            </div>
                                        )}
                                        {(lead.desiredResult || lead.message) && (
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                                                    {lead.desiredResult ? 'Objetivos y Resultados' : 'Mensaje del Usuario'}
                                                </p>
                                                <div className="text-[14px] text-gray-700 bg-white border border-gray-100 rounded-2xl p-4 leading-relaxed whitespace-pre-wrap shadow-sm">
                                                    {lead.desiredResult || lead.message}
                                                </div>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-3 pt-2">
                                            {lead.status !== 'CONTACTED' && (
                                                <button
                                                    onClick={() => updateStatus(lead.id, 'CONTACTED')}
                                                    className="px-5 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-md shadow-emerald-100"
                                                >
                                                    Contactado
                                                </button>
                                            )}
                                            {lead.status !== 'ARCHIVED' && (
                                                <button
                                                    onClick={() => updateStatus(lead.id, 'ARCHIVED')}
                                                    className="px-5 py-2 bg-white text-gray-500 rounded-xl text-xs font-bold hover:text-red-500 border border-gray-200 transition-all shadow-sm"
                                                >
                                                    Archivar
                                                </button>
                                            )}
                                            <span className="ml-auto text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                                                Recibido: {new Date(lead.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </AdminCard>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

