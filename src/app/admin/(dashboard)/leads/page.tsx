'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, Calendar, Archive, User, Target, AlertTriangle, TrendingUp, ChevronDown, ChevronUp, Filter } from 'lucide-react'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    NEW: { label: 'Nuevo', color: 'bg-blue-50/50 text-blue-600 border-blue-100' },
    CONTACTED: { label: 'Contactado', color: 'bg-green-50/50 text-green-600 border-green-100' },
    ARCHIVED: { label: 'Archivado', color: 'bg-gray-100/50 text-gray-500 border-gray-200' },
}

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
    CONTACT: { label: 'Contacto', color: 'bg-purple-50/50 text-purple-600 border-purple-100' },
    LEAD_CAPTURE: { label: 'Hoja de Ruta', color: 'bg-orange-50/50 text-orange-600 border-orange-100' },
}

const urgencyColor = (v?: number) => {
    if (!v) return 'text-gray-400'
    if (v <= 3) return 'text-green-600'
    if (v <= 6) return 'text-yellow-600'
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

    const counts = {
        ALL: leads.length,
        NEW: leads.filter(l => l.status === 'NEW').length,
        CONTACTED: leads.filter(l => l.status === 'CONTACTED').length,
        ARCHIVED: leads.filter(l => l.status === 'ARCHIVED').length,
    }

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Contactos & Leads</h1>
                    <p className="text-gray-400 mt-1 font-medium max-w-xl">Gestiona las interacciones y oportunidades capturadas desde la web.</p>
                </div>
            </header>

            {/* Filter Tabs */}
            <div className="flex gap-2 px-4 md:px-0 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
                {(['ALL', 'NEW', 'CONTACTED', 'ARCHIVED'] as const).map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13px] font-bold transition-all whitespace-nowrap ${filter === s
                            ? 'bg-[#1D1D1F] text-white shadow-lg'
                            : 'bg-white/60 backdrop-blur-md text-gray-500 border border-white hover:bg-white/80'
                            }`}
                    >
                        {s === 'ALL' ? 'Todos' : STATUS_LABELS[s].label}
                        <span className={`text-[10px] px-2 py-0.5 rounded-lg ${filter === s ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                            {counts[s]}
                        </span>
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="text-gray-500">Cargando leads...</div>
            ) : filteredLeads.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-sm">
                    <Mail className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">No hay mensajes aún</h3>
                    <p className="text-gray-500">Los formularios enviados aparecerán aquí.</p>
                </div>
            ) : (
                <div className="grid gap-6 px-4 md:px-0">
                    {filteredLeads.map((lead) => {
                        const isExpanded = expanded === lead.id
                        const sourceInfo = SOURCE_LABELS[lead.source] || SOURCE_LABELS['CONTACT']
                        const statusInfo = STATUS_LABELS[lead.status] || STATUS_LABELS['NEW']
                        const isLeadCapture = lead.source === 'LEAD_CAPTURE'

                        return (
                            <div key={lead.id} className={`bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] transition-all ${lead.status === 'ARCHIVED' ? 'opacity-60 saturate-50' : 'hover:bg-white/90'}`}>
                                {/* Header */}
                                <div className="p-7">
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-14 bg-white rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm shrink-0">
                                                <User className="text-[#1D1D1F]" size={24} />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-[#1D1D1F] tracking-tight">{lead.name}</h3>
                                                <div className="flex items-center flex-wrap gap-4 mt-1.5">
                                                    <span className="flex items-center text-xs text-gray-400 font-medium tracking-tight">
                                                        <Mail size={13} className="mr-2 opacity-50" /> {lead.email}
                                                    </span>
                                                    {lead.phone && (
                                                        <span className="flex items-center text-xs text-gray-400 font-medium tracking-tight">
                                                            <Phone size={13} className="mr-2 opacity-50" /> {lead.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-3 text-right">
                                            <div className="flex items-center gap-2">
                                                <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider border border-white shadow-sm ${sourceInfo.color}`}>
                                                    {sourceInfo.label}
                                                </span>
                                                <span className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider border border-white shadow-sm ${statusInfo.color}`}>
                                                    {statusInfo.label}
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center">
                                                {new Date(lead.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Lead capture quick preview */}
                                    {isLeadCapture && (
                                        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {lead.scope && (
                                                <div className="bg-white/40 border border-white rounded-2xl p-4 shadow-sm">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Ámbito</p>
                                                    <p className="text-[13px] font-bold text-[#1D1D1F]">{lead.scope}</p>
                                                </div>
                                            )}
                                            {lead.urgency && (
                                                <div className="bg-white/40 border border-white rounded-2xl p-4 shadow-sm">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Urgencia</p>
                                                    <p className={`text-lg font-black ${urgencyColor(lead.urgency)}`}>
                                                        {lead.urgency}<span className="text-[10px] opacity-40 ml-0.5">/10</span>
                                                    </p>
                                                </div>
                                            )}
                                            {lead.bottleneck && (
                                                <div className="bg-white/40 border border-white rounded-2xl p-4 shadow-sm col-span-2 md:col-span-1">
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Cuello de botella</p>
                                                    <p className="text-[13px] font-bold text-[#1D1D1F] line-clamp-1">{lead.bottleneck}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Expand toggle */}
                                    <button
                                        onClick={() => setExpanded(isExpanded ? null : lead.id)}
                                        className="mt-6 w-full py-2 bg-white/50 border border-white rounded-xl flex items-center justify-center gap-2 text-[11px] font-bold text-gray-400 hover:text-[#1D1D1F] hover:bg-white transition-all uppercase tracking-widest"
                                    >
                                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        {isExpanded ? 'Ocultar detalle' : 'Explorar respuesta completa'}
                                    </button>
                                </div>

                                {isExpanded && (
                                    <div className="border-t border-white bg-white/30 p-7 space-y-6">
                                        {lead.bottleneck && (
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">Análisis de Cuello de Botella</p>
                                                <p className="text-[14px] text-gray-700 bg-white/60 backdrop-blur-sm border border-white rounded-2xl p-5 leading-relaxed shadow-sm">{lead.bottleneck}</p>
                                            </div>
                                        )}
                                        {(lead.desiredResult || lead.message) && (
                                            <div>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2.5">
                                                    {lead.desiredResult ? 'Objetivos y Resultados' : 'Mensaje del Usuario'}
                                                </p>
                                                <p className="text-[14px] text-gray-700 bg-white/60 backdrop-blur-sm border border-white rounded-2xl p-5 leading-relaxed whitespace-pre-wrap shadow-sm">
                                                    {lead.desiredResult || lead.message}
                                                </p>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-4 pt-2">
                                            {lead.status !== 'CONTACTED' && (
                                                <button
                                                    onClick={() => updateStatus(lead.id, 'CONTACTED')}
                                                    className="px-6 py-2.5 bg-green-500 text-white rounded-xl text-xs font-bold hover:bg-green-600 transition-all shadow-md shadow-green-100"
                                                >
                                                    Marcar como Contactado
                                                </button>
                                            )}
                                            {lead.status !== 'ARCHIVED' && (
                                                <button
                                                    onClick={() => updateStatus(lead.id, 'ARCHIVED')}
                                                    className="px-6 py-2.5 bg-white text-gray-400 rounded-xl text-xs font-bold hover:text-gray-900 border border-gray-100 transition-all shadow-sm"
                                                >
                                                    Archivar Lead
                                                </button>
                                            )}
                                            {lead.status === 'ARCHIVED' && (
                                                <button
                                                    onClick={() => updateStatus(lead.id, 'NEW')}
                                                    className="px-6 py-2.5 bg-[#1D1D1F] text-white rounded-xl text-xs font-bold hover:bg-black transition-all"
                                                >
                                                    Restaurar Lead
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
