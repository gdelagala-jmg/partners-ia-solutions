'use client'

import React, { useState, useEffect } from 'react'
import { Sparkles, Loader2, Check } from 'lucide-react'
import Link from 'next/link'

// ============================================
// TYPES & INTERFACES FOR TYPE SAFETY
// ============================================

interface Lead {
    id: string
    name: string
    company: string | null
    source: string
    urgency: number | null
    status: string
    createdAt: string
    desiredResult: string | null
    bottleneck: string | null
}

interface NewsPost {
    id: string
    title: string
    published: boolean
    category: string
    aiType: string | null
    aiTool: string | null
    createdAt: string
}

interface Solution {
    id: string
    title: string
    published: boolean
    featured: boolean
    description: string
    multimedia: string | null
    sectors: { id: string; name: string }[]
}

interface Client {
    id: string
    companyName: string
    sector: string | null
    active: boolean
    project: string | null
    nextAction: string | null
    createdAt: string
}

interface PriorityItem {
    tag: string
    title: string
    description: string
    action: React.ReactNode
}

// ============================================
// DEFAULT REALISTIC MOCK DATA (GRACEFUL FALLBACKS)
// ============================================

const DEFAULT_MOCK_LEADS: Lead[] = [
    {
        id: 'mock-lead-1',
        name: 'Andrés Gómez',
        company: 'RAG Solutions',
        source: 'CONTACT',
        urgency: 9,
        status: 'NEW',
        createdAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // Hace 2m
        desiredResult: 'Integración de RAG para mejorar búsqueda interna corporativa',
        bottleneck: 'Búsqueda de información desestructurada lenta'
    },
    {
        id: 'mock-lead-2',
        name: 'Sofía Silva',
        company: 'IA Academy',
        source: 'ASSISTANT_CHAT',
        urgency: 6,
        status: 'NEW',
        createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(), // Hace 1h
        desiredResult: 'Inscripción automatizada en programas ejecutivos de IA',
        bottleneck: 'Falta de automatización en el onboarding'
    }
]

const DEFAULT_MOCK_NEWS: NewsPost[] = [
    {
        id: 'mock-news-1',
        title: 'El futuro de las pymes con RAG de Datos',
        published: false,
        category: 'Tecnología',
        aiType: 'RAG',
        aiTool: 'Postgres',
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'mock-news-2',
        title: 'Cómo integrar Postgres en Next.js App Router',
        published: false,
        category: 'Tutorial',
        aiType: 'Database',
        aiTool: 'Next.js',
        createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString()
    }
]

const DEFAULT_MOCK_SOLUTIONS: Solution[] = [
    {
        id: 'mock-sol-1',
        title: 'Asistente Legal Inteligente V3',
        published: false,
        featured: false,
        description: 'Modelo entrenado para revisión automática de contratos.',
        multimedia: null,
        sectors: [] // Sin sector asignado
    },
    {
        id: 'mock-sol-2',
        title: 'Automatización RAG Seguros',
        published: false,
        featured: true,
        description: 'Optimización de pólizas mediante búsqueda semántica avanzada.',
        multimedia: '/images/solutions/rag-seguros.png',
        sectors: [] // Sin sector asignado
    }
]

const DEFAULT_MOCK_CLIENTS: Client[] = [
    {
        id: 'mock-client-1',
        companyName: 'Retail Corp',
        sector: 'Retail',
        active: true,
        project: 'Integración de Base de Datos RAG',
        nextAction: 'Ajuste Fino de RAG',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 'mock-client-2',
        companyName: 'Global Logística',
        sector: 'Logística',
        active: true,
        project: 'Ajuste Fino de Modelo LLM',
        nextAction: 'Testeo de Pipelines',
        createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    }
]

export default function WorkspacePage() {
    const [loading, setLoading] = useState(true)
    const [isClient, setIsClient] = useState(false)
    const [actionFeedback, setActionFeedback] = useState<string | null>(null)

    // Data lists
    const [leads, setLeads] = useState<Lead[]>([])
    const [news, setNews] = useState<NewsPost[]>([])
    const [solutions, setSolutions] = useState<Solution[]>([])
    const [clients, setClients] = useState<Client[]>([])

    // Load data from actual backend APIs
    useEffect(() => {
        setIsClient(true)
        async function loadWorkspaceData() {
            try {
                const [leadsRes, newsRes, solutionsRes, clientsRes] = await Promise.all([
                    fetch('/api/leads').then(res => res.ok ? res.json() : []),
                    fetch('/api/news?includeDrafts=true').then(res => res.ok ? res.json() : []),
                    fetch('/api/solutions?admin=true').then(res => res.ok ? res.json() : []),
                    fetch('/api/clients').then(res => res.ok ? res.json() : [])
                ])

                // Populate lists - if empty database, fallback elegantly to mock items
                setLeads(Array.isArray(leadsRes) && leadsRes.length > 0 ? leadsRes : DEFAULT_MOCK_LEADS)
                setNews(Array.isArray(newsRes) && newsRes.length > 0 ? newsRes : DEFAULT_MOCK_NEWS)
                setSolutions(Array.isArray(solutionsRes) && solutionsRes.length > 0 ? solutionsRes : DEFAULT_MOCK_SOLUTIONS)
                setClients(Array.isArray(clientsRes) && clientsRes.length > 0 ? clientsRes : DEFAULT_MOCK_CLIENTS)

            } catch (e) {
                console.error('Error fetching workspace real data:', e)
                // Fallback completely in case of connection error
                setLeads(DEFAULT_MOCK_LEADS)
                setNews(DEFAULT_MOCK_NEWS)
                setSolutions(DEFAULT_MOCK_SOLUTIONS)
                setClients(DEFAULT_MOCK_CLIENTS)
            } finally {
                setLoading(false)
            }
        }

        loadWorkspaceData()
    }, [])

    // Fade out feedback message after 3.5 seconds
    useEffect(() => {
        if (actionFeedback) {
            const timer = setTimeout(() => {
                setActionFeedback(null)
            }, 3500)
            return () => clearTimeout(timer)
        }
    }, [actionFeedback])

    // ============================================
    // OPERATIONAL WORKSPACE ACTIONS
    // ============================================

    // Action: Mark lead as Contacted (Real PUT/PATCH call + local state update)
    const handleMarkContacted = async (leadId: string) => {
        try {
            const isMock = leadId.startsWith('mock-')
            if (!isMock) {
                await fetch(`/api/leads/${leadId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ status: 'CONTACTED' }),
                })
            }
            
            const targetLead = leads.find(l => l.id === leadId)
            setLeads(prev => prev.filter(l => l.id !== leadId))
            setActionFeedback(`Lead "${targetLead?.name || 'Prospecto'}" marcado como contactado.`)
        } catch (e) {
            console.error('Error marking lead as contacted:', e)
            setActionFeedback('Error al actualizar el lead.')
        }
    }

    // Action: Publish news directly from workspace (Real PUT/PATCH call + local state update)
    const handlePublishNews = async (newsId: string) => {
        try {
            const isMock = newsId.startsWith('mock-')
            const targetPost = news.find(n => n.id === newsId)
            if (!isMock && targetPost) {
                await fetch(`/api/news/${newsId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        ...targetPost, 
                        published: true, 
                        publishedAt: new Date().toISOString() 
                    }),
                })
            }
            
            setNews(prev => prev.map(n => n.id === newsId ? { ...n, published: true } : n))
            setActionFeedback(`Noticia "${targetPost?.title || 'Artículo'}" publicada con éxito.`)
        } catch (e) {
            console.error('Error publishing news:', e)
            setActionFeedback('Error al publicar la noticia.')
        }
    }

    // Helper: Compute time elapsed since creation
    const formatTimeAgo = (dateString: string) => {
        try {
            const date = new Date(dateString)
            const now = new Date()
            const diffMs = now.getTime() - date.getTime()
            const diffMin = Math.floor(diffMs / (1000 * 60))
            const diffHrs = Math.floor(diffMs / (1000 * 60 * 60))
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

            if (diffMin < 1) return 'ahora mismo'
            if (diffMin < 60) return `hace ${diffMin}m`
            if (diffHrs < 24) return `hace ${diffHrs}h`
            return `hace ${diffDays}d`
        } catch (e) {
            return 'hace poco'
        }
    }

    if (!isClient) {
        return null
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
                <Loader2 className="animate-spin text-purple-600" size={24} />
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest animate-pulse">
                    Cargando Mesa de Mando...
                </p>
            </div>
        )
    }

    // ============================================
    // DATA FILTERING & COUNT COMPUTATION
    // ============================================
    const pendingLeads = leads.filter(l => l.status === 'NEW')
    const pendingNews = news.filter(n => !n.published)
    // Solutions that are missing a sector, missing a cover image, or not published
    const incompleteSolutions = solutions.filter(s => (!s.sectors || s.sectors.length === 0) || !s.multimedia || !s.published)
    const activeClients = clients.filter(c => c.active)

    const pendingLeadsCount = pendingLeads.length
    const pendingNewsCount = pendingNews.length
    const incompleteSolutionsCount = incompleteSolutions.length
    const activeClientsCount = activeClients.length

    // ============================================
    // IA PRIORITY DECISIONS (MAX 3 ACTIONS)
    // ============================================
    const priorityItems: PriorityItem[] = []

    // 1. Priority Lead (Highest Urgency status NEW)
    const priorityLead = pendingLeads.length > 0
        ? [...pendingLeads].sort((a, b) => (b.urgency || 0) - (a.urgency || 0))[0]
        : null

    if (priorityLead) {
        priorityItems.push({
            tag: 'Lead Prioritario',
            title: priorityLead.name,
            description: `${priorityLead.company || 'Particular'} • Intención: ${priorityLead.urgency || 5}/10 • ${formatTimeAgo(priorityLead.createdAt)}`,
            action: (
                <div className="flex items-center gap-3">
                    <Link 
                        href={`/admin/asistente?chat=${priorityLead.id}`}
                        className="text-[9px] font-black uppercase tracking-wider text-purple-600 hover:text-purple-800 transition-colors"
                    >
                        Ver Chat
                    </Link>
                    <span className="text-gray-200">|</span>
                    <button
                        onClick={() => handleMarkContacted(priorityLead.id)}
                        className="text-[9px] font-black uppercase tracking-wider text-emerald-600 hover:text-emerald-800 transition-colors"
                    >
                        Contactado
                    </button>
                </div>
            )
        })
    }

    // 2. Priority News draft
    const priorityNewsItem = pendingNews.length > 0 ? pendingNews[0] : null
    if (priorityNewsItem) {
        priorityItems.push({
            tag: 'Noticia Lista',
            title: priorityNewsItem.title,
            description: `Categoría: ${priorityNewsItem.category || 'General'} • Borrador listo para producción`,
            action: (
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handlePublishNews(priorityNewsItem.id)}
                        className="text-[9px] font-black uppercase tracking-wider text-purple-600 hover:text-purple-800 transition-colors"
                    >
                        Publicar
                    </button>
                    <span className="text-gray-200">|</span>
                    <Link 
                        href="/admin/noticias"
                        className="text-[9px] font-black uppercase tracking-wider text-gray-500 hover:text-gray-900 transition-colors"
                    >
                        Editar
                    </Link>
                </div>
            )
        })
    }

    // 3. Priority Incomplete Solution
    const prioritySolutionItem = incompleteSolutions.length > 0 ? incompleteSolutions[0] : null
    if (prioritySolutionItem) {
        const missing: string[] = []
        if (!prioritySolutionItem.sectors || prioritySolutionItem.sectors.length === 0) missing.push('Sin sector')
        if (!prioritySolutionItem.multimedia) missing.push('Sin imagen')
        if (!prioritySolutionItem.published) missing.push('No publicada')

        priorityItems.push({
            tag: 'Solución Incompleta',
            title: prioritySolutionItem.title,
            description: `${missing.join(', ')} • Requiere actualización`,
            action: (
                <Link
                    href="/admin/soluciones"
                    className="text-[9px] font-black uppercase tracking-wider text-purple-600 hover:text-purple-800 transition-colors"
                >
                    Completar
                </Link>
            )
        })
    }

    return (
        <div className="w-full max-w-full min-w-0 space-y-10 pb-16 select-none relative animate-in fade-in duration-500 bg-white">
            
            {/* FLOATING ACTION FEEDBACK */}
            {actionFeedback && (
                <div className="fixed top-6 right-6 z-50 bg-gray-900 text-white text-[10px] font-bold uppercase tracking-wider py-2.5 px-4 rounded-lg shadow-md flex items-center gap-2.5 animate-in slide-in-from-top-4 duration-300">
                    <Check size={12} className="text-emerald-400" />
                    <span>{actionFeedback}</span>
                </div>
            )}

            {/* Header Section */}
            <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-100">
                <div>
                    <h1 className="text-xl font-bold text-gray-950 tracking-tight">Mi Espacio de Trabajo</h1>
                    <p className="text-[11px] text-gray-500 font-medium mt-0.5">Mesa de mando ejecutiva</p>
                </div>
                <div className="flex items-center gap-1.5 self-start sm:self-auto py-1 px-2.5 bg-emerald-50 rounded-full border border-emerald-100/30">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">Sincronizado</span>
                </div>
            </header>

            {/* 1. HOY — Resumen Superior Compacto (Flat, Borderless Row) */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 py-2 text-[10px] text-gray-500 font-bold uppercase tracking-wider border-b border-gray-100">
                <div className="flex items-center gap-2">
                    <span className="text-gray-400">Leads pendientes:</span>
                    <span className="text-gray-900 text-[11px] font-extrabold">{pendingLeadsCount}</span>
                </div>
                <span className="text-gray-250 hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400">Noticias pendientes:</span>
                    <span className="text-gray-900 text-[11px] font-extrabold">{pendingNewsCount}</span>
                </div>
                <span className="text-gray-250 hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400">Soluciones a corregir:</span>
                    <span className="text-gray-900 text-[11px] font-extrabold">{incompleteSolutionsCount}</span>
                </div>
                <span className="text-gray-250 hidden sm:inline">•</span>
                <div className="flex items-center gap-2">
                    <span className="text-gray-400">Clientes activos:</span>
                    <span className="text-gray-900 text-[11px] font-extrabold">{activeClientsCount}</span>
                </div>
            </div>

            {/* 2. PRIORIDADES IA */}
            {priorityItems.length > 0 && (
                <section className="space-y-3">
                    <div className="flex items-center gap-2 text-purple-600">
                        <Sparkles size={13} />
                        <h2 className="text-[10px] font-black uppercase tracking-widest">Prioridades IA</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {priorityItems.map((item, idx) => (
                            <div key={idx} className="border border-purple-100/70 bg-purple-50/15 p-4 rounded-xl flex flex-col justify-between gap-3">
                                <div className="space-y-1">
                                    <span className="text-[8px] font-extrabold uppercase tracking-widest text-purple-600 block">{item.tag}</span>
                                    <h3 className="text-[11.5px] font-bold text-gray-950 leading-snug">{item.title}</h3>
                                    <p className="text-[10px] text-gray-500 font-medium leading-normal">{item.description}</p>
                                </div>
                                <div className="pt-1">{item.action}</div>
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {/* 3. LEADS PRIORITARIOS */}
            <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Leads Prioritarios</h2>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        {pendingLeads.length} Pendiente{pendingLeads.length !== 1 ? 's' : ''}
                    </span>
                </div>
                {pendingLeads.length === 0 ? (
                    <p className="text-[10px] text-gray-400 py-1 font-medium">Bandeja de leads limpia.</p>
                ) : (
                    <div className="divide-y divide-gray-150/40">
                        {pendingLeads.map(lead => (
                            <div key={lead.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-2 text-[11px] hover:bg-gray-50/30 px-2 rounded-md transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${lead.urgency && lead.urgency >= 7 ? 'bg-red-500' : 'bg-gray-300'}`} />
                                    <div className="min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-950">{lead.name}</span>
                                            <span className="text-gray-300 font-normal">|</span>
                                            <span className="text-gray-500 font-semibold">{lead.company || 'Particular'}</span>
                                        </div>
                                        {lead.desiredResult && (
                                            <p className="text-[10px] text-gray-450 truncate max-w-xl font-medium mt-0.5">{lead.desiredResult}</p>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 text-gray-400 text-[10px] pl-4 sm:pl-0">
                                    <span className="font-medium">{formatTimeAgo(lead.createdAt)}</span>
                                    <span className="text-gray-200">|</span>
                                    <Link 
                                        href={`/admin/asistente?chat=${lead.id}`} 
                                        className="text-blue-600 hover:text-blue-800 font-black uppercase tracking-wider text-[9px] transition-colors"
                                    >
                                        Ver Chat
                                    </Link>
                                    <span className="text-gray-255">•</span>
                                    <button
                                        onClick={() => handleMarkContacted(lead.id)}
                                        className="text-emerald-600 hover:text-emerald-850 font-black uppercase tracking-wider text-[9px] transition-colors"
                                    >
                                        Contactado
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* 4. NOTICIAS PENDIENTES */}
            <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Noticias Pendientes</h2>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        {pendingNews.length} Borrador{pendingNews.length !== 1 ? 'es' : ''}
                    </span>
                </div>
                {pendingNews.length === 0 ? (
                    <p className="text-[10px] text-gray-400 py-1 font-medium">No hay borradores pendientes.</p>
                ) : (
                    <div className="divide-y divide-gray-150/40">
                        {pendingNews.map(post => (
                            <div key={post.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-2 text-[11px] hover:bg-gray-50/30 px-2 rounded-md transition-colors">
                                <div className="flex items-center gap-3 min-w-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                                    <div className="min-w-0">
                                        <span className="font-bold text-gray-950">{post.title}</span>
                                        <span className="text-gray-400 font-semibold text-[10px] block mt-0.5">{post.category || 'General'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0 text-gray-400 text-[10px] pl-4 sm:pl-0">
                                    <span className="font-medium">{formatTimeAgo(post.createdAt)}</span>
                                    <span className="text-gray-200">|</span>
                                    <button
                                        onClick={() => handlePublishNews(post.id)}
                                        className="text-blue-600 hover:text-blue-800 font-black uppercase tracking-wider text-[9px] transition-colors"
                                    >
                                        Publicar
                                    </button>
                                    <span className="text-gray-255">•</span>
                                    <Link 
                                        href="/admin/noticias" 
                                        className="text-gray-500 hover:text-gray-900 font-black uppercase tracking-wider text-[9px] transition-colors"
                                    >
                                        Editar
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* 5. SOLUCIONES A CORREGIR */}
            <section className="space-y-3">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Soluciones a Corregir</h2>
                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                        {incompleteSolutions.length} Incompleta{incompleteSolutions.length !== 1 ? 's' : ''}
                    </span>
                </div>
                {incompleteSolutions.length === 0 ? (
                    <p className="text-[10px] text-gray-400 py-1 font-medium">Catálogo de soluciones sin observaciones.</p>
                ) : (
                    <div className="divide-y divide-gray-150/40">
                        {incompleteSolutions.map(sol => {
                            const missing: string[] = []
                            if (!sol.sectors || sol.sectors.length === 0) missing.push('Sin sector')
                            if (!sol.multimedia) missing.push('Sin imagen')
                            if (!sol.published) missing.push('No publicada')

                            return (
                                <div key={sol.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-2.5 gap-2 text-[11px] hover:bg-gray-50/30 px-2 rounded-md transition-colors">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                        <div className="min-w-0">
                                            <span className="font-bold text-gray-950">{sol.title}</span>
                                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                                {missing.map((m, i) => (
                                                    <span key={i} className="text-[8px] font-extrabold uppercase tracking-wide bg-red-50 text-red-600 px-1.5 py-0.5 rounded border border-red-100/10">
                                                        {m}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 shrink-0 text-gray-400 text-[10px] pl-4 sm:pl-0">
                                        <Link 
                                            href="/admin/soluciones" 
                                            className="text-blue-600 hover:text-blue-800 font-black uppercase tracking-wider text-[9px] transition-colors"
                                        >
                                            Asignar Sector
                                        </Link>
                                        <span className="text-gray-255">•</span>
                                        <Link 
                                            href="/admin/soluciones" 
                                            className="text-gray-500 hover:text-gray-900 font-black uppercase tracking-wider text-[9px] transition-colors"
                                        >
                                            Completar
                                        </Link>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </section>

            {/* 6. CLIENTES / PROYECTOS (Bottom Grid, No Fixed 70/30 Column) */}
            <section className="space-y-4 pt-4">
                <div className="border-b border-gray-100 pb-2">
                    <h2 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Clientes & Proyectos Activos</h2>
                </div>
                {clients.length === 0 ? (
                    <p className="text-[10px] text-gray-400 py-1 font-medium">No hay proyectos activos registrados.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {clients.map(client => (
                            <div key={client.id} className="border border-gray-100 p-3.5 rounded-xl space-y-3 bg-gray-50/20 hover:border-gray-250 transition-colors">
                                <div className="flex items-center justify-between min-w-0 gap-2">
                                    <span className="font-bold text-gray-950 text-[11px] truncate">{client.companyName}</span>
                                    {client.active ? (
                                        <span className="text-[7px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-100/10 tracking-widest uppercase shrink-0">
                                            Activo
                                        </span>
                                    ) : (
                                        <span className="text-[7px] font-black text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100/10 tracking-widest uppercase shrink-0">
                                            Inactivo
                                        </span>
                                    )}
                                </div>
                                <div className="text-[10px] text-gray-500 font-medium leading-normal">
                                    <span className="text-[7.5px] font-extrabold text-gray-400 uppercase tracking-widest block mb-0.5">Integración</span>
                                    <p className="truncate text-gray-800">{client.project || `Servicios de IA (${client.sector || 'General'})`}</p>
                                </div>
                                {client.nextAction && (
                                    <div className="flex items-center gap-1.5 text-[8.5px] font-bold text-emerald-600 bg-emerald-50/40 px-2 py-0.8 rounded border border-emerald-100/15">
                                        <span className="w-1 h-1 rounded-full bg-emerald-500 shrink-0" />
                                        <span className="uppercase tracking-wider truncate">{client.nextAction}</span>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    )
}
