'use client'

import { useState, useEffect } from 'react'
import { Bot, Mail, Phone, Building2, Calendar, Search, ExternalLink, MessageSquare, TrendingUp, AlertTriangle, Heart, Zap, Sparkles, Power, ShieldCheck, ShieldAlert } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface AssistantLead {
  id: string
  name: string
  email: string
  phone: string | null
  company: string | null
  chatSummary: string | null
  sentiment: string | null
  priority: string | null
  insights: string | null
  status: string
  createdAt: string
}

export default function AssistantLeadsPage() {
  const [leads, setLeads] = useState<AssistantLead[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isAssistantActive, setIsAssistantActive] = useState(true)
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)

  useEffect(() => {
    fetchLeads()
    fetchAssistantStatus()
  }, [])

  const fetchAssistantStatus = async () => {
    try {
      const res = await fetch('/api/admin/settings/assistant')
      if (res.ok) {
        const data = await res.json()
        setIsAssistantActive(data.active)
      }
    } catch (error) {
      console.error('Failed to fetch assistant status:', error)
    }
  }

  const toggleAssistant = async () => {
    setIsUpdatingStatus(true)
    try {
      const nextStatus = !isAssistantActive
      const res = await fetch('/api/admin/settings/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: nextStatus })
      })
      if (res.ok) {
        setIsAssistantActive(nextStatus)
      }
    } catch (error) {
      console.error('Failed to toggle assistant:', error)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

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
        return <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-[10px] font-bold border border-blue-100 uppercase tracking-wider">NUEVO</span>
      case 'FOLLOWUP':
        return <span className="bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-[10px] font-bold border border-amber-100 uppercase tracking-wider">SEGUIMIENTO</span>
      case 'ENDED':
        return <span className="bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold border border-green-100 uppercase tracking-wider">CERRADO</span>
      default:
        return <span className="bg-gray-50 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold border border-gray-100 uppercase tracking-wider">{status}</span>
    }
  }

  const getPriorityBadge = (priority: string | null) => {
    switch (priority) {
      case 'TOP':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-red-50 text-red-600 rounded-full border border-red-100 text-[10px] font-black animate-pulse uppercase tracking-widest">
            <Zap size={10} fill="currentColor" />
            Prioridad Máxima
          </div>
        )
      case 'MEDIUM':
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full border border-blue-100 text-[10px] font-bold uppercase tracking-widest">
            <TrendingUp size={10} />
            Media
          </div>
        )
      default:
        return (
          <div className="flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-400 rounded-full border border-gray-100 text-[10px] font-bold uppercase tracking-widest">
            Baja
          </div>
        )
    }
  }

  const getSentimentIndicator = (sentiment: string | null) => {
    switch (sentiment) {
      case 'POSITIVE':
        return <Heart size={18} className="text-pink-500 fill-pink-500" />
      case 'NEGATIVE':
        return <AlertTriangle size={18} className="text-red-500" />
      default:
        return <Sparkles size={18} className="text-blue-400" />
    }
  }

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 pb-12">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white shadow-xl shadow-gray-200/50 rounded-xl flex items-center justify-center border border-gray-100 relative">
             <Bot size={22} className="text-black" />
             <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-black">Asistente AI</h1>
            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest opacity-70">Leads & Conversaciones</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* AI Assistant Toggle */}
          <div className="flex items-center gap-3 bg-white/60 backdrop-blur-md border border-white px-4 py-1.5 rounded-xl shadow-sm">
            <div className="flex flex-col">
              <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Estado Sistema</span>
              <span className={`text-[10px] font-black uppercase tracking-tight ${isAssistantActive ? 'text-green-500' : 'text-gray-400'}`}>
                {isAssistantActive ? 'En Línea' : 'Desconectado'}
              </span>
            </div>
            <button
              onClick={toggleAssistant}
              disabled={isUpdatingStatus}
              className={`relative w-12 h-6 rounded-full transition-all duration-500 flex items-center px-1 ${
                isAssistantActive 
                  ? 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                  : 'bg-gray-200'
              } ${isUpdatingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}`}
            >
              <motion.div
                animate={{ x: isAssistantActive ? 24 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-4 h-4 bg-white rounded-full shadow-sm flex items-center justify-center"
              >
                <Power size={10} className={isAssistantActive ? 'text-green-500' : 'text-gray-400'} />
              </motion.div>
            </button>
          </div>

          <div className="relative w-full md:w-64 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={16} />
            <input
              type="text"
              placeholder="Filtrar leads..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white/60 backdrop-blur-md border border-white rounded-xl focus:outline-none focus:bg-white transition-all text-[13px] font-bold shadow-sm shadow-gray-100"
            />
          </div>
        </div>
      </header>

      {/* Leads Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 px-4">
        {filteredLeads.length === 0 ? (
          <div className="col-span-full py-20 bg-white/60 backdrop-blur-md border border-white rounded-[2rem] text-center shadow-xl shadow-gray-200/50">
            <Bot className="w-12 h-12 text-gray-200 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-black tracking-tight mb-1">Sin nuevos contactos</h3>
            <p className="text-xs text-gray-400 font-medium tracking-tight">El asistente está esperando nuevas interacciones.</p>
          </div>
        ) : (
          filteredLeads.map((lead) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              key={lead.id} 
              className={`group bg-white/60 backdrop-blur-md border ${lead.priority === 'TOP' ? 'border-red-200 bg-red-50/5' : 'border-white'} rounded-2xl p-5 flex flex-col hover:bg-white transition-all duration-400 shadow-xl shadow-gray-200/30 relative overflow-hidden`}
            >
              <div className="flex justify-between items-start mb-5 relative z-10">
                <div className="flex gap-3.5">
                   <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 group-hover:bg-black group-hover:text-white transition-all overflow-hidden shrink-0 shadow-sm">
                      {getSentimentIndicator(lead.sentiment)}
                   </div>
                   <div className="space-y-0.5">
                      <div className="flex items-center gap-2.5">
                        <h2 className="text-xl font-bold text-black tracking-tight">{lead.name}</h2>
                        {getPriorityBadge(lead.priority)}
                      </div>
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11px] font-bold text-gray-400 tracking-tight">
                        <span className="flex items-center gap-1.5"><Mail size={10} className="text-blue-500" /> {lead.email}</span>
                        {lead.phone && <span className="flex items-center gap-1.5"><Phone size={10} className="text-green-500" /> {lead.phone}</span>}
                      </div>
                   </div>
                </div>
                {getStatusBadge(lead.status)}
              </div>

              <div className="flex-1 space-y-4 mb-5 relative z-10">
                {lead.company && (
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black text-white hover:bg-gray-800 transition-all self-start shrink-0 cursor-default shadow-md shadow-gray-200">
                    <Building2 size={13} />
                    <span className="text-[9px] font-black uppercase tracking-[0.1em]">{lead.company}</span>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Business Insights */}
                  <div className="bg-black/5 rounded-xl border border-black/5 p-4 group-hover:bg-white transition-all border-dashed">
                    <div className="flex items-center gap-2 text-[9px] font-black text-black uppercase tracking-[0.15em] mb-2.5">
                      <TrendingUp size={12} className="text-red-500" />
                      Insights Clave
                    </div>
                    <p className="text-[12px] text-gray-700 leading-snug font-bold tracking-tight">
                      {lead.insights || "Analizando puntos clave..."}
                    </p>
                  </div>

                  {/* Conversation Summary */}
                  <div className="bg-white rounded-xl border border-gray-100 p-4 group-hover:shadow-md transition-all">
                    <div className="flex items-center gap-2 text-[9px] font-black text-gray-400 uppercase tracking-[0.15em] mb-2.5">
                      <MessageSquare size={12} className="text-blue-500" />
                      Resumen Chat
                    </div>
                    <p className="text-[11px] text-gray-500 leading-snug font-medium italic">
                      "{lead.chatSummary || "Sin resumen disponible."}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto relative z-10">
                <div className="flex items-center gap-1.5 text-[9px] font-black text-gray-300 uppercase tracking-[0.1em]">
                  <Calendar size={10} />
                  {new Date(lead.createdAt).toLocaleString('es-ES', { 
                    day: '2-digit', month: 'short', year: '2-digit', 
                    hour: '2-digit', minute: '2-digit' 
                  })}
                </div>
                
                <div className="flex items-center gap-2">
                  <select
                    className="text-[10px] font-black bg-white border border-gray-100 text-black rounded-lg px-3 py-2 focus:outline-none cursor-pointer hover:bg-gray-50 transition-all shadow-sm uppercase tracking-wider"
                    value={lead.status}
                    onChange={(e) => updateStatus(lead.id, e.target.value)}
                  >
                    <option value="NEW">NUEVO</option>
                    <option value="FOLLOWUP">SEGUIMIENTO</option>
                    <option value="ENDED">CERRADO</option>
                  </select>
                  
                  <a 
                    href={`mailto:${lead.email}?subject=Partners IA Solutions - Contacto`}
                    className="w-9 h-9 bg-black text-white rounded-lg hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center justify-center active:scale-90"
                  >
                    <ExternalLink size={16} />
                  </a>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  )
}
