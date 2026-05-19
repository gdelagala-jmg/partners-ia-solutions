'use client'

import { useState, useEffect } from 'react'
import {
    Plus, Edit, Trash2, Globe, EyeOff, FileArchive, Newspaper,
    Calendar, ExternalLink, RefreshCw, CheckCircle2, AlertCircle,
    Clock, Mail, Image as ImageIcon, ImageOff, Search, X, Filter
} from 'lucide-react'
import NewsForm from '@/components/admin/NewsForm'
import ImportModal from '@/components/admin/ImportModal'
import AdminTable from '@/components/admin/ui/AdminTable'
import AdminActionMenu from '@/components/admin/ui/AdminActionMenu'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import VisualArchiveSettingsCard from '@/components/admin/VisualArchiveSettingsCard'

export default function NewsAdminPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [showImportModal, setShowImportModal] = useState(false)
    const [currentPost, setCurrentPost] = useState<any>(null)
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
    const [isSyncing, setIsSyncing] = useState<string | null>(null)

    // Nuevas variables de estado para filtrado premium y ordenación
    const [searchQuery, setSearchQuery] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [dateField, setDateField] = useState<'createdAt' | 'publishedAt' | 'updatedAt'>('createdAt')
    const [activeShortcut, setActiveShortcut] = useState<string>('')
    const [sortByOrder, setSortByOrder] = useState<'recent' | 'oldest'>('recent')
    const [imageFilter, setImageFilter] = useState<'all' | 'with' | 'without'>('all')

    // Lógica para formatear fecha a formato de entrada input type="date"
    const getFormattedDate = (date: Date) => {
        const yyyy = date.getFullYear()
        const mm = String(date.getMonth() + 1).padStart(2, '0')
        const dd = String(date.getDate()).padStart(2, '0')
        return `${yyyy}-${mm}-${dd}`
    }

    // Lógica para asignar rangos de fecha rápidos
    const setQuickRange = (rangeType: 'today' | '7days' | '30days' | 'thisMonth' | 'prevMonth' | 'all') => {
        const now = new Date()
        if (rangeType === 'today') {
            const todayStr = getFormattedDate(now)
            setStartDate(todayStr)
            setEndDate(todayStr)
        } else if (rangeType === '7days') {
            const past = new Date()
            past.setDate(now.getDate() - 7)
            setStartDate(getFormattedDate(past))
            setEndDate(getFormattedDate(now))
        } else if (rangeType === '30days') {
            const past = new Date()
            past.setDate(now.getDate() - 30)
            setStartDate(getFormattedDate(past))
            setEndDate(getFormattedDate(now))
        } else if (rangeType === 'thisMonth') {
            const firstDay = new Date(now.getFullYear(), now.getMonth(), 1)
            const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
            setStartDate(getFormattedDate(firstDay))
            setEndDate(getFormattedDate(lastDay))
        } else if (rangeType === 'prevMonth') {
            const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1)
            const lastDay = new Date(now.getFullYear(), now.getMonth(), 0)
            setStartDate(getFormattedDate(firstDay))
            setEndDate(getFormattedDate(lastDay))
        } else if (rangeType === 'all') {
            setStartDate('')
            setEndDate('')
        }
    }

    const handleClearAllFilters = () => {
        setSearchQuery('')
        setStartDate('')
        setEndDate('')
        setActiveShortcut('')
        setSortByOrder('recent')
        setImageFilter('all')
    }

    const filteredPosts = posts.filter(post => {
        // 1. Filtro por Estado (Tab select: 'all', 'published', 'draft')
        if (filter === 'published') {
            if (!post.published) return false
        } else if (filter === 'draft') {
            if (post.published) return false
        }

        // 2. Búsqueda por Texto (título, contenido, categoría)
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase()
            const matchesTitle = post.title?.toLowerCase().includes(query)
            const matchesContent = post.content?.toLowerCase().includes(query)
            const matchesCategory = post.category?.toLowerCase().includes(query)
            if (!matchesTitle && !matchesContent && !matchesCategory) return false
        }

        // 3. Filtro por Rango de Fecha
        const dateVal = post[dateField]
        if (startDate || endDate) {
            if (!dateVal) return false
            const postDate = new Date(dateVal)
            
            if (startDate) {
                const start = new Date(startDate)
                start.setHours(0, 0, 0, 0)
                if (postDate < start) return false
            }
            if (endDate) {
                const end = new Date(endDate)
                end.setHours(23, 59, 59, 999)
                if (postDate > end) return false
            }
        }

        // 4. Filtro por Presencia de Imagen (Todas, Con imagen, Sin imagen)
        if (imageFilter === 'with') {
            if (!post.coverImage) return false
        } else if (imageFilter === 'without') {
            if (post.coverImage) return false
        }

        return true
    })

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        const dateA = a[dateField] ? new Date(a[dateField]).getTime() : 0
        const dateB = b[dateField] ? new Date(b[dateField]).getTime() : 0
        
        if (sortByOrder === 'recent') {
            return dateB - dateA
        } else {
            return dateA - dateB
        }
    })

    const fetchPosts = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/news?includeDrafts=true')
            if (res.ok) {
                const data = await res.json()
                setPosts(Array.isArray(data) ? data : [])
            }
        } catch (error) {
            console.error('Error fetching news:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchPosts() }, [])

    const handleCreate = () => { setCurrentPost(null); setIsEditing(true) }
    const handleEdit = (post: any) => { setCurrentPost(post); setIsEditing(true) }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta noticia?')) return
        try {
            await fetch(`/api/news/${id}`, { method: 'DELETE' })
            fetchPosts()
        } catch (error) {
            console.error('Error deleting post:', error)
        }
    }

    const handleTogglePublication = async (post: any) => {
        try {
            const res = await fetch(`/api/news/${post.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ published: !post.published, publishedAt: !post.published ? new Date() : null }),
            })
            if (res.ok) fetchPosts()
        } catch (error) {
            console.error('Error updating status:', error)
        }
    }

    const handleSync = async (id: string) => {
        setIsSyncing(id)
        try {
            const res = await fetch(`/api/news/${id}/sync`, { method: 'POST' })
            if (res.ok) {
                alert('Noticia enviada a Make correctamente (Google Business)')
            } else {
                const err = await res.json()
                alert(`Error al sincronizar: ${err.error || 'Desconocido'}`)
            }
        } catch (error) {
            console.error('Error syncing:', error)
            alert('Error de conexión al sincronizar')
        } finally {
            setIsSyncing(null)
            fetchPosts()
        }
    }

    const handleGenerateNewsletter = async (postId: string) => {
        try {
            const res = await fetch('/api/admin/newsletter/generate-manual', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId }),
            })
            const data = await res.json()
            if (res.ok) alert(data.message)
            else alert(`Error: ${data.error || 'Desconocido'}`)
        } catch (error) {
            console.error('Error generating newsletter:', error)
            alert('Error de conexión al generar newsletter')
        }
    }

    const handleSyncAll = async () => {
        const publishedPosts = posts.filter(p => p.published)
        if (publishedPosts.length === 0) { alert('No hay noticias publicadas para sincronizar.'); return }
        if (!confirm(`Se enviarán ${publishedPosts.length} noticias a Google Business Profile una por una. ¿Deseas continuar?`)) return

        setIsSyncing('all')
        let successCount = 0; let errorCount = 0

        for (const post of publishedPosts) {
            try {
                const res = await fetch(`/api/news/${post.id}/sync`, { method: 'POST' })
                if (res.ok) successCount++; else errorCount++
            } catch { errorCount++ }
        }

        setIsSyncing(null)
        alert(`Sincronización terminada.\n✅ Éxito: ${successCount}\n❌ Error: ${errorCount}`)
        fetchPosts()
    }

    const handleSubmit = async (data: any) => {
        try {
            const url = currentPost ? `/api/news/${currentPost.id}` : '/api/news'
            const method = currentPost ? 'PUT' : 'POST'
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (res.ok) {
                setIsEditing(false)
                fetchPosts()
            } else {
                const contentType = res.headers.get('content-type')
                if (contentType?.includes('application/json')) {
                    const errData = await res.json()
                    alert(`Error al guardar: ${errData.error || 'Desconocido'}`)
                } else {
                    const errorText = await res.text()
                    console.error('Server error (non-JSON):', errorText)
                    alert('Error en el servidor. Es posible que tu sesión haya caducado.')
                }
            }
        } catch (error: any) {
            console.error('Error saving post:', error)
            alert(`Error de red: ${error.message}`)
        }
    }

    const columns = [
        {
            header: 'Noticia',
            className: 'max-w-[220px]',
            accessor: (post: any) => (
                <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 overflow-hidden shrink-0">
                        {post.coverImage
                            ? <img src={post.coverImage} className="w-full h-full object-cover" alt="" />
                            : <Newspaper size={18} />}
                    </div>
                    <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate text-[13px]" title={post.title}>{post.title}</div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1 mt-0.5">
                            {post.coverImage ? (
                                <span className="flex items-center gap-0.5 text-blue-500 font-medium">
                                    <ImageIcon size={10} /> Con imagen
                                </span>
                            ) : (
                                <span className="flex items-center gap-0.5 text-gray-400">
                                    <ImageOff size={10} /> Sin imagen
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Creación',
            className: 'hidden md:table-cell max-w-[130px]',
            accessor: (post: any) => (
                <div className="text-xs text-gray-600 flex flex-col">
                    <span className="font-medium">{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">
                        {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            )
        },
        {
            header: 'Publicación',
            className: 'hidden md:table-cell max-w-[130px]',
            accessor: (post: any) => (
                post.published ? (
                    <div className="text-xs text-gray-600 flex flex-col">
                        <span className="font-medium">{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : '—'}</span>
                        <span className="text-[10px] text-gray-400 mt-0.5">
                            {post.publishedAt ? new Date(post.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                    </div>
                ) : (
                    <span className="text-xs text-gray-300 italic">No publicado</span>
                )
            )
        },
        {
            header: 'Clasificación',
            className: 'hidden lg:table-cell max-w-[160px]',
            accessor: (post: any) => (
                <div className="space-y-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-full uppercase tracking-wider block w-fit">
                        {post.category?.split(',')[0]}
                    </span>
                    <div className="flex gap-1 flex-wrap max-w-[140px]">
                        {post.aiType && <span className="text-[10px] text-gray-400 italic truncate">#{post.aiType}</span>}
                        {post.aiTool && <span className="text-[10px] text-purple-400 italic font-medium truncate">#{post.aiTool}</span>}
                        {post.tags && post.tags.split(',').slice(0, 2).map((tag: string) => (
                            <span key={tag} className="text-[10px] text-blue-400 truncate">#{tag.trim()}</span>
                        ))}
                    </div>
                </div>
            )
        },
        {
            header: 'Estado',
            className: 'max-w-[120px]',
            accessor: (post: any) => (
                post.published ? (
                    <span className="flex items-center text-green-600 text-xs font-semibold whitespace-nowrap bg-green-50 px-2.5 py-1 rounded-full w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5 shrink-0" />
                        Publicado
                    </span>
                ) : (
                    <span className="flex items-center text-gray-500 text-xs font-semibold whitespace-nowrap bg-gray-100 px-2.5 py-1 rounded-full w-fit">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-400 mr-1.5 shrink-0" />
                        Borrador
                    </span>
                )
            )
        },
        {
            header: 'Google Business',
            className: 'hidden xl:table-cell max-w-[130px]',
            accessor: (post: any) => {
                if (!post.published) return <span className="text-gray-300 text-[10px]">—</span>
                const status = post.gmbSyncStatus || 'PENDING'
                switch (status) {
                    case 'SUCCESS':
                        return (
                            <div className="flex items-center text-green-500 gap-1.5">
                                <CheckCircle2 size={14} className="shrink-0" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">OK</span>
                            </div>
                        )
                    case 'ERROR':
                        return (
                            <div className="flex items-center text-red-500 gap-1.5">
                                <AlertCircle size={14} className="shrink-0" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Error</span>
                            </div>
                        )
                    case 'SYNCING':
                        return (
                            <div className="flex items-center text-blue-500 gap-1.5">
                                <RefreshCw size={14} className="animate-spin shrink-0" />
                                <span className="text-[10px] font-bold uppercase">Sync</span>
                            </div>
                        )
                    default:
                        return (
                            <div className="flex items-center text-gray-400 gap-1.5">
                                <Clock size={14} className="shrink-0" />
                                <span className="text-[10px] font-bold uppercase opacity-60">Pend.</span>
                            </div>
                        )
                }
            }
        },
        {
            header: '',
            className: 'text-right w-[72px]',
            accessor: (post: any) => (
                <div className="flex items-center justify-end gap-1.5">
                    {post.published && (
                        <a
                            href={`/noticias/${post.slug || post.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50/50 rounded-full transition-all"
                            title="Ver publicación"
                        >
                            <ExternalLink size={16} />
                        </a>
                    )}
                    <AdminActionMenu
                        actions={[
                            { label: post.published ? 'Ocultar' : 'Publicar', icon: (post.published ? EyeOff : Globe) as any, onClick: () => handleTogglePublication(post) },
                            ...(post.published ? [
                                {
                                    label: isSyncing === post.id ? 'Sincronizando...' : 'Sincronizar GMB',
                                    icon: RefreshCw as any,
                                    onClick: () => handleSync(post.id)
                                },
                                { label: 'Generar Newsletter', icon: Mail as any, onClick: () => handleGenerateNewsletter(post.id) }
                            ] : []),
                            { label: 'Editar', icon: Edit as any, onClick: () => handleEdit(post) },
                            { label: 'Eliminar', icon: Trash2 as any, variant: 'danger', onClick: () => handleDelete(post.id) },
                        ]}
                    />
                </div>
            )
        }
    ]

    return (
        // Wave 5: outer wrapper enforces horizontal containment
        <div className="w-full max-w-full min-w-0 space-y-6 pb-20">
            {showImportModal && (
                <ImportModal
                    onClose={() => setShowImportModal(false)}
                    onSuccess={() => { fetchPosts(); setShowImportModal(false) }}
                />
            )}

            <AdminToolbar
                title="Noticias & Blog"
                description="Gestión editorial inteligente y contenido global."
                icon={Newspaper as any}
                actions={
                    !isEditing && (
                        <div className="flex items-center gap-2">
                            {/* Wave 5: all buttons text-abbrev on mobile, flex-none to avoid stretching */}
                            <button
                                onClick={handleSyncAll}
                                disabled={isSyncing === 'all'}
                                className="flex items-center gap-1.5 px-3 sm:px-5 py-2.5 bg-blue-50/50 text-blue-600 rounded-2xl hover:bg-blue-100/50 transition-all font-semibold border border-blue-200/50 shadow-sm disabled:opacity-50 text-sm whitespace-nowrap"
                            >
                                <RefreshCw size={16} className={`shrink-0 ${isSyncing === 'all' ? 'animate-spin' : ''}`} />
                                <span className="hidden sm:inline">{isSyncing === 'all' ? 'Sincronizando...' : 'Sincronizar Todo'}</span>
                                <span className="sm:hidden">Sync</span>
                            </button>
                            <button
                                onClick={() => setShowImportModal(true)}
                                className="flex items-center gap-1.5 px-3 sm:px-5 py-2.5 bg-white/60 backdrop-blur-md text-[#1D1D1F] rounded-2xl hover:bg-white/80 transition-all font-semibold border border-white/40 shadow-sm text-sm whitespace-nowrap"
                            >
                                <FileArchive size={16} className="text-gray-400 shrink-0" />
                                <span className="hidden sm:inline">Importar</span>
                            </button>
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-1.5 px-4 sm:px-6 py-2.5 bg-[#1D1D1F] text-white rounded-2xl hover:bg-black transition-all font-semibold shadow-lg text-sm whitespace-nowrap"
                            >
                                <Plus size={16} className="shrink-0" />
                                <span className="hidden sm:inline">Nueva Noticia</span>
                                <span className="sm:hidden">Nueva</span>
                            </button>
                        </div>
                    )
                }
            />

            {isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full max-w-full min-w-0">
                    <NewsForm
                        initialData={currentPost}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Tarjeta de Configuración del Modo Archivo Visual */}
                    <VisualArchiveSettingsCard />

                    {/* Filtros de Pestañas & Buscador Premium */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            {/* Pestañas de Estado */}
                            <div className="flex p-1.5 bg-gray-200/40 backdrop-blur-sm rounded-2xl w-full sm:w-fit overflow-x-auto">
                                {[
                                    { id: 'all', label: 'Todas', count: posts.length },
                                    { id: 'published', label: 'Publicadas', count: posts.filter(p => p.published).length },
                                    { id: 'draft', label: 'Ocultas', count: posts.filter(p => !p.published).length }
                                ].map(t => (
                                    <button
                                        key={t.id}
                                        onClick={() => setFilter(t.id as any)}
                                        className={`flex-1 sm:flex-none px-4 sm:px-5 py-2 text-[11px] font-bold rounded-xl transition-all whitespace-nowrap ${filter === t.id
                                            ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                                            : 'text-gray-400 hover:text-gray-900'
                                            }`}
                                    >
                                        {t.label} <span className={`ml-1.5 ${filter === t.id ? 'text-blue-500' : 'opacity-40'}`}>{t.count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Panel de Filtros Premium (Buscador, Fecha tipo, Desde, Hasta) */}
                        <div className="bg-white/80 backdrop-blur-md border border-gray-200/60 rounded-3xl p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                                {/* Búsqueda por Texto */}
                                <div className="relative">
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Buscar artículo</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            placeholder="Título, contenido o categoría..."
                                            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200/80 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400 text-gray-900"
                                        />
                                        <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
                                        {searchQuery && (
                                            <button
                                                onClick={() => setSearchQuery('')}
                                                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Campo de Fecha */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Filtrar por tipo de fecha</label>
                                    <select
                                        value={dateField}
                                        onChange={(e) => setDateField(e.target.value as any)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200/80 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800 font-medium"
                                    >
                                        <option value="createdAt">Fecha de creación</option>
                                        <option value="publishedAt">Fecha de publicación</option>
                                        <option value="updatedAt">Última actualización</option>
                                    </select>
                                </div>

                                {/* Presencia de Imagen */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Filtro de imagen</label>
                                    <div className="flex p-1 bg-gray-50 border border-gray-200/80 rounded-2xl w-full items-center justify-between">
                                        {[
                                            { id: 'all', label: 'Todas' },
                                            { id: 'with', label: 'Con imagen' },
                                            { id: 'without', label: 'Sin imagen' }
                                        ].map(opt => (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => setImageFilter(opt.id as any)}
                                                className={`flex-1 py-2 text-[10px] font-bold rounded-xl transition-all whitespace-nowrap ${
                                                    imageFilter === opt.id
                                                        ? 'bg-white text-blue-600 shadow-[0_2px_8px_rgba(0,0,0,0.08)] border border-gray-200/30'
                                                        : 'text-gray-400 hover:text-gray-700'
                                                }`}
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Fecha Desde */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Fecha Desde</label>
                                    <input
                                        type="date"
                                        value={startDate}
                                        onChange={(e) => {
                                            setStartDate(e.target.value)
                                            setActiveShortcut('')
                                        }}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200/80 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800 font-medium"
                                    />
                                </div>

                                {/* Fecha Hasta */}
                                <div>
                                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Fecha Hasta</label>
                                    <input
                                        type="date"
                                        value={endDate}
                                        onChange={(e) => {
                                            setEndDate(e.target.value)
                                            setActiveShortcut('')
                                        }}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200/80 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800 font-medium"
                                    />
                                </div>
                            </div>

                            {/* Accesos Rápidos & Orden */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 pt-4 border-t border-gray-100">
                                {/* Accesos Rápidos */}
                                <div className="space-y-2">
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Accesos rápidos</span>
                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            { id: 'today', label: 'Hoy' },
                                            { id: '7days', label: 'Últimos 7 días' },
                                            { id: '30days', label: 'Últimos 30 días' },
                                            { id: 'thisMonth', label: 'Este mes' },
                                            { id: 'prevMonth', label: 'Mes anterior' },
                                            { id: 'all', label: 'Todo' },
                                        ].map((shortcut) => (
                                            <button
                                                key={shortcut.id}
                                                type="button"
                                                onClick={() => {
                                                    setActiveShortcut(shortcut.id)
                                                    setQuickRange(shortcut.id as any)
                                                }}
                                                className={`px-3 py-1.5 text-[10px] font-bold rounded-xl transition-all border ${
                                                    activeShortcut === shortcut.id
                                                        ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                                                        : 'bg-white border-gray-200/80 text-gray-500 hover:bg-gray-50 hover:text-gray-800'
                                                }`}
                                            >
                                                {shortcut.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Ordenación & Limpieza */}
                                <div className="flex items-end gap-3 self-start lg:self-center">
                                    <div className="space-y-1">
                                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Orden</span>
                                        <select
                                            value={sortByOrder}
                                            onChange={(e) => setSortByOrder(e.target.value as any)}
                                            className="px-4 py-2.5 bg-gray-50 border border-gray-200/80 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-800 font-semibold"
                                        >
                                            <option value="recent">Más recientes primero</option>
                                            <option value="oldest">Más antiguos primero</option>
                                        </select>
                                    </div>

                                    {(searchQuery || startDate || endDate || activeShortcut || imageFilter !== 'all') && (
                                        <button
                                            type="button"
                                            onClick={handleClearAllFilters}
                                            className="flex items-center gap-1.5 px-4 py-2.5 bg-red-50 text-red-600 hover:bg-red-100 transition-all text-sm font-semibold rounded-2xl shadow-sm border border-red-100"
                                        >
                                            <X size={14} />
                                            Limpiar
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <AdminTable
                        columns={columns}
                        data={sortedPosts}
                        loading={loading}
                        emptyMessage="No hay noticias registradas todavía."
                        renderMobileCard={(post) => (
                            <div className="flex flex-col gap-3.5 p-1 text-left">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex gap-3 min-w-0">
                                        <div className="w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 shrink-0 overflow-hidden">
                                            {post.coverImage
                                                ? <img src={post.coverImage} className="w-full h-full object-cover rounded-lg" alt="" />
                                                : <Newspaper size={20} />}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-gray-900 truncate text-sm" title={post.title}>{post.title}</h3>
                                            <div className="flex items-center flex-wrap gap-1.5 mt-1">
                                                <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase font-bold tracking-tight shrink-0">
                                                    {post.category?.split(',')[0]}
                                                </span>
                                                {post.aiTool && (
                                                    <span className="text-[9px] text-purple-400 italic font-medium">#{post.aiTool}</span>
                                                )}
                                                {post.published
                                                    ? <span className="text-[9px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded font-bold flex items-center gap-0.5 shrink-0"><span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" /> Publicado</span>
                                                    : <span className="text-[9px] bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded font-bold shrink-0">Borrador</span>
                                                }
                                                {post.coverImage ? (
                                                    <span className="text-[9px] bg-blue-50/50 text-blue-500 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 shrink-0">
                                                        <ImageIcon size={9} /> Con imagen
                                                    </span>
                                                ) : (
                                                    <span className="text-[9px] bg-gray-50 text-gray-400 px-1.5 py-0.5 rounded font-medium flex items-center gap-0.5 shrink-0">
                                                        <ImageOff size={9} /> Sin imagen
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        <AdminActionMenu
                                            actions={[
                                                { label: post.published ? 'Ocultar' : 'Publicar', icon: (post.published ? EyeOff : Globe) as any, onClick: () => handleTogglePublication(post) },
                                                ...(post.published ? [
                                                    { label: 'Sincronizar GMB', icon: RefreshCw as any, onClick: () => handleSync(post.id) },
                                                    { label: 'Generar Newsletter', icon: Mail as any, onClick: () => handleGenerateNewsletter(post.id) }
                                                ] : []),
                                                { label: 'Editar', icon: Edit as any, onClick: () => handleEdit(post) },
                                                { label: 'Eliminar', icon: Trash2 as any, variant: 'danger', onClick: () => handleDelete(post.id) },
                                            ]}
                                        />
                                        {post.published && (
                                            <a
                                                href={`/noticias/${post.slug || post.id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-1.5 bg-white/60 text-[#1D1D1F] rounded-full border border-white shadow-sm"
                                            >
                                                <ExternalLink size={14} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 pt-2.5 border-t border-gray-100 text-[10px] text-gray-500">
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 uppercase font-semibold tracking-wider text-[8px]">Creación</span>
                                        <span className="font-medium mt-0.5 text-gray-700">
                                            {new Date(post.createdAt).toLocaleDateString()} {new Date(post.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-gray-400 uppercase font-semibold tracking-wider text-[8px]">Publicación</span>
                                        <span className="font-medium mt-0.5 text-gray-700">
                                            {post.publishedAt 
                                                ? `${new Date(post.publishedAt).toLocaleDateString()} ${new Date(post.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
                                                : 'No publicado'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                </div>
            )}
        </div>
    )
}
