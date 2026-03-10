'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, Calendar, Archive, User, Target, AlertTriangle, TrendingUp, ChevronDown, ChevronUp, Filter } from 'lucide-react'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
    NEW: { label: 'Nuevo', color: 'bg-blue-50 text-blue-700 border-blue-200' },
    CONTACTED: { label: 'Contactado', color: 'bg-green-50 text-green-700 border-green-200' },
    ARCHIVED: { label: 'Archivado', color: 'bg-gray-100 text-gray-500 border-gray-200' },
}

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
    CONTACT: { label: 'Formulario Contacto', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    LEAD_CAPTURE: { label: 'Hoja de Ruta', color: 'bg-orange-50 text-orange-700 border-orange-200' },
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
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Contactos & Leads</h1>
            <p className="text-gray-500 mb-6">Gestiona todos los formularios recibidos desde el sitio web.</p>

            {/* Filter Tabs */}
            <div className="flex gap-2 mb-6 flex-wrap">
                {(['ALL', 'NEW', 'CONTACTED', 'ARCHIVED'] as const).map(s => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-all ${filter === s
                            ? 'bg-black text-white border-black'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                            }`}
                    >
                        {s === 'ALL' ? 'Todos' : STATUS_LABELS[s].label}
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${filter === s ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'}`}>
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
                <div className="grid gap-4">
                    {filteredLeads.map((lead) => {
                        const isExpanded = expanded === lead.id
                        const sourceInfo = SOURCE_LABELS[lead.source] || SOURCE_LABELS['CONTACT']
                        const statusInfo = STATUS_LABELS[lead.status] || STATUS_LABELS['NEW']
                        const isLeadCapture = lead.source === 'LEAD_CAPTURE'

                        return (
                            <div key={lead.id} className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all ${lead.status === 'ARCHIVED' ? 'opacity-60' : 'hover:border-blue-200'}`}>
                                {/* Header */}
                                <div className="p-5 lg:p-6">
                                    <div className="flex items-start justify-between gap-4 flex-wrap">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center border border-blue-100 flex-shrink-0">
                                                <User className="text-blue-600" size={20} />
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-base">{lead.name}</h3>
                                                <div className="flex items-center flex-wrap gap-2 mt-0.5">
                                                    <span className="flex items-center text-xs text-gray-500">
                                                        <Mail size={11} className="mr-1" /> {lead.email}
                                                    </span>
                                                    {lead.phone && (
                                                        <span className="flex items-center text-xs text-gray-500">
                                                            <Phone size={11} className="mr-1" /> {lead.phone}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${sourceInfo.color}`}>
                                                {sourceInfo.label}
                                            </span>
                                            <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${statusInfo.color}`}>
                                                {statusInfo.label}
                                            </span>
                                            <span className="text-xs text-gray-400 flex items-center">
                                                <Calendar size={11} className="mr-1" />
                                                {new Date(lead.createdAt).toLocaleDateString('es-ES')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Lead capture quick preview */}
                                    {isLeadCapture && (
                                        <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-3">
                                            {lead.scope && (
                                                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                                                    <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
                                                        <Target size={10} /> Ámbito
                                                    </p>
                                                    <p className="text-xs font-semibold text-gray-800">{lead.scope}</p>
                                                </div>
                                            )}
                                            {lead.urgency && (
                                                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3">
                                                    <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
                                                        <AlertTriangle size={10} /> Urgencia
                                                    </p>
                                                    <p className={`text-sm font-bold ${urgencyColor(lead.urgency)}`}>
                                                        {lead.urgency}/10
                                                    </p>
                                                </div>
                                            )}
                                            {lead.bottleneck && (
                                                <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 col-span-2 md:col-span-1">
                                                    <p className="text-xs text-gray-400 mb-0.5 flex items-center gap-1">
                                                        <TrendingUp size={10} /> Cuello de botella
                                                    </p>
                                                    <p className="text-xs font-medium text-gray-700 line-clamp-1">{lead.bottleneck}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Expand toggle */}
                                    <button
                                        onClick={() => setExpanded(isExpanded ? null : lead.id)}
                                        className="mt-4 flex items-center gap-1 text-xs text-gray-400 hover:text-gray-700 transition-colors font-medium"
                                    >
                                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        {isExpanded ? 'Ocultar detalle' : 'Ver detalle completo'}
                                    </button>
                                </div>

                                {/* Expanded content */}
                                {isExpanded && (
                                    <div className="border-t border-gray-100 bg-gray-50 p-5 lg:p-6 space-y-4">
                                        {lead.bottleneck && (
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Cuello de botella</p>
                                                <p className="text-sm text-gray-700 bg-white border border-gray-100 rounded-lg p-3">{lead.bottleneck}</p>
                                            </div>
                                        )}
                                        {(lead.desiredResult || lead.message) && (
                                            <div>
                                                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                                                    {lead.desiredResult ? 'Resultado deseado' : 'Mensaje'}
                                                </p>
                                                <p className="text-sm text-gray-700 bg-white border border-gray-100 rounded-lg p-3 whitespace-pre-wrap">
                                                    {lead.desiredResult || lead.message}
                                                </p>
                                            </div>
                                        )}

                                        {/* Actions */}
                                        <div className="flex items-center gap-3 pt-2">
                                            {lead.status !== 'CONTACTED' && (
                                                <button
                                                    onClick={() => updateStatus(lead.id, 'CONTACTED')}
                                                    className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium transition-colors"
                                                >
                                                    Marcar como Contactado
                                                </button>
                                            )}
                                            {lead.status !== 'ARCHIVED' && (
                                                <button
                                                    onClick={() => updateStatus(lead.id, 'ARCHIVED')}
                                                    className="text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 transition-colors border border-gray-200 hover:border-gray-300 px-3 py-1.5 rounded-lg"
                                                >
                                                    <Archive size={12} /> Archivar
                                                </button>
                                            )}
                                            {lead.status === 'ARCHIVED' && (
                                                <button
                                                    onClick={() => updateStatus(lead.id, 'NEW')}
                                                    className="text-xs text-blue-500 hover:text-blue-700 transition-colors font-medium"
                                                >
                                                    Restaurar
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
