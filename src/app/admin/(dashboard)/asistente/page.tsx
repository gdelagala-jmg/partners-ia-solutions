'use client'

import { useState, useEffect } from 'react'
import { Bot, Mail, Phone, Building2, Calendar, Search, ExternalLink, MessageSquare } from 'lucide-react'

interface AssistantLead {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  chatSummary: string | null
  status: string
  createdAt: string
}

export default function AssistantLeadsPage() {
  const [leads, setLeads] = useState<AssistantLead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      const res = await fetch('/api/admin/assistant-leads')
      if (res.ok) {
        const data = await res.json()
        setLeads(data)
      }
    } catch (error) {
      console.error('Failed to fetch assistant leads:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch('/api/admin/assistant-leads', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })
      if (res.ok) {
        setLeads(leads.map(lead => lead.id === id ? { ...lead, status: newStatus } : lead))
      }
    } catch (error) {
      console.error('Failed to update status:', error)
    }
  }

  const filteredLeads = leads.filter(lead => 
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (lead.company && lead.company.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'NEW':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200 shadow-sm">NUEVO</span>
      case 'FOLLOWUP':
        return <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-full text-xs font-semibold border border-amber-200 shadow-sm">EN SEGUIMIENTO</span>
      case 'ENDED':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold border border-green-200 shadow-sm">CERRADO</span>
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-semibold border border-gray-200">{status}</span>
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white rounded-2xl border border-white shadow-sm flex items-center justify-center">
              <Bot size={24} className="text-[#1D1D1F]" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Leads del Asistente</h1>
          </div>
          <p className="text-gray-400 font-medium italic">Conversaciones inteligentes capturadas por tu IA.</p>
        </div>

        <div className="relative w-full md:w-80 shadow-sm group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" size={18} />
          <input
            type="text"
            placeholder="Filtrar por nombre o empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white/60 backdrop-blur-md border border-white rounded-2xl focus:outline-none focus:bg-white transition-all text-sm font-medium"
          />
        </div>
      </header>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredLeads.length === 0 ? (
          <div className="col-span-full py-24 bg-white/60 backdrop-blur-md border border-white rounded-3xl text-center">
            <Bot className="w-16 h-16 text-gray-200 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-[#1D1D1F] mb-1">Sin nuevos contactos</h3>
            <p className="text-gray-400 font-medium">El asistente está esperando nuevas interacciones.</p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div 
              key={lead.id} 
              className="group bg-white/60 backdrop-blur-md border border-white rounded-3xl p-6 sm:p-8 flex flex-col hover:bg-white transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold text-[#1D1D1F] tracking-tight">{lead.name}</h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm font-medium text-gray-400">
                    <span className="flex items-center gap-1.5"><Mail size={14} /> {lead.email}</span>
                    {lead.phone && <span className="flex items-center gap-1.5"><Phone size={14} /> {lead.phone}</span>}
                  </div>
                </div>
                {getStatusBadge(lead.status)}
              </div>

              <div className="flex-1 space-y-6 mb-8 mt-2">
                {lead.company && (
                  <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-[#1D1D1F]/5 border border-[#1D1D1F]/5 self-start shrink-0">
                    <Building2 size={16} className="text-[#1D1D1F]" />
                    <span className="text-xs font-bold text-[#1D1D1F] uppercase tracking-wider">{lead.company}</span>
                  </div>
                )}
                
                <div className="bg-white/40 rounded-2xl border border-white p-5 group-hover:bg-white/80 transition-colors">
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">
                    <MessageSquare size={14} className="text-blue-500" />
                    Insights de la Conversación
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed font-medium italic">
                    "{lead.chatSummary || "No se pudo extraer un resumen detallado de esta sesión."}"
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-[#1D1D1F]/5 mt-auto">
                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-300 uppercase tracking-tighter">
                  <Calendar size={12} />
                  {new Date(lead.createdAt).toLocaleString('es-ES', { 
                    day: '2-digit', month: 'short', year: 'numeric', 
                    hour: '2-digit', minute: '2-digit' 
                  })}
                </div>
                
                <div className="flex items-center gap-3">
                  <select
                    className="text-xs font-bold bg-white/80 border border-white text-[#1D1D1F] rounded-xl px-3 py-2 focus:outline-none cursor-pointer hover:bg-white transition-all shadow-sm"
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                  >
                    <option value="NEW">NUEVO</option>
                    <option value="FOLLOWUP">SEGUIMIENTO</option>
                    <option value="ENDED">CERRADO</option>
                  </select>
                  
                  <a 
                    href={`mailto:${lead.email}?subject=Partners IA Solutions - Contacto Virtual Assistant`}
                    className="p-2.5 bg-[#1D1D1F] text-white rounded-xl hover:bg-black transition-all shadow-sm active:scale-95"
                    title="Contactar vía Email"
                  >
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
