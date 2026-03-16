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
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-blue-100 text-blue-600 rounded-2xl">
              <Bot size={28} />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Leads del Asistente</h1>
          </div>
          <p className="text-gray-500 max-w-xl text-lg leading-relaxed">
            Contactos capturados automáticamente a través de las conversaciones del Asistente IA de la web.
          </p>
        </div>

        <div className="relative z-10 w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o empresa..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredLeads.length === 0 ? (
          <div className="col-span-1 xl:col-span-2 text-center py-20 bg-white rounded-3xl border border-gray-100 shadow-sm">
            <Bot className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">Aún no hay leads del Asistente</h3>
            <p className="text-gray-500">Cuando los usuarios interactúen con la IA y dejen sus datos, aparecerán aquí.</p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <div key={lead.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6 sm:p-8 flex flex-col group relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-gray-50 to-white rounded-full blur-2xl -mr-10 -mt-10 opacity-50 pointer-events-none" />
              
              {/* Header Info */}
              <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-6 relative z-10">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">{lead.name}</h2>
                  <div className="flex items-center text-sm text-gray-500 gap-4 mt-2">
                    <span className="flex items-center gap-1.5"><Mail size={14} className="text-gray-400" /> {lead.email}</span>
                    {lead.phone && <span className="flex items-center gap-1.5"><Phone size={14} className="text-gray-400" /> {lead.phone}</span>}
                  </div>
                </div>
                {getStatusBadge(lead.status)}
              </div>

              {/* Chat Summary */}
              <div className="flex-1 space-y-4 mb-6 relative z-10">
                {lead.company && (
                  <div className="flex items-center gap-2 text-sm">
                    <Building2 size={16} className="text-gray-400" />
                    <span className="font-medium text-gray-700">Empresa:</span>
                    <span className="text-gray-600">{lead.company}</span>
                  </div>
                )}
                
                <div>
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <MessageSquare size={16} className="text-blue-500" />
                    Resumen de la Conversación
                  </div>
                  <div className="text-sm text-gray-600 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50 leading-relaxed max-h-40 overflow-y-auto custom-scrollbar">
                    {lead.chatSummary || "No se pudo extraer un resumen."}
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-100 mt-auto relative z-10">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar size={14} />
                  {new Date(lead.createdAt).toLocaleString('es-ES', { 
                    day: '2-digit', month: 'short', year: 'numeric', 
                    hour: '2-digit', minute: '2-digit' 
                  })}
                </div>
                
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    className="text-sm bg-gray-50 border border-gray-200 text-gray-700 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 font-medium"
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                  >
                    <option value="NEW">Marcar: Nuevo</option>
                    <option value="FOLLOWUP">Marcar: En Seguimiento</option>
                    <option value="ENDED">Marcar: Cerrado</option>
                  </select>
                  
                  <a 
                    href={`mailto:${lead.email}?subject=Partners IA Solutions - Contacto Virtual Assistant`}
                    className="p-2.5 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                    title="Enviar Email"
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
