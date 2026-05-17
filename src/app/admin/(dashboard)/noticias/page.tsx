'use client'

import { useState, useEffect } from 'react'
import {
    Plus, Edit, Trash2, Globe, EyeOff, FileArchive, Newspaper,
    Calendar, ExternalLink, RefreshCw, CheckCircle2, AlertCircle,
    Clock, Mail
} from 'lucide-react'
import NewsForm from '@/components/admin/NewsForm'
import ImportModal from '@/components/admin/ImportModal'
import AdminTable from '@/components/admin/ui/AdminTable'
import AdminActionMenu from '@/components/admin/ui/AdminActionMenu'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'

export default function NewsAdminPage() {
    const [posts, setPosts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [showImportModal, setShowImportModal] = useState(false)
    const [currentPost, setCurrentPost] = useState<any>(null)
    const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all')
    const [isSyncing, setIsSyncing] = useState<string | null>(null)

    const filteredPosts = posts.filter(post => {
        if (filter === 'published') return post.published
        if (filter === 'draft') return !post.published
        return true
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
            // Wave 5: no min-w forces — natural flex distribution with truncate
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
                            <Calendar size={10} className="shrink-0" />
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
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
                    <span className="flex items-center text-green-600 text-xs font-medium whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2 shrink-0" />
                        Publicado
                    </span>
                ) : (
                    <span className="flex items-center text-gray-400 text-xs font-medium whitespace-nowrap">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2 shrink-0" />
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
                            { label: post.published ? 'Ocultar' : 'Publicar', icon: post.published ? EyeOff : Globe, onClick: () => handleTogglePublication(post) },
                            ...(post.published ? [
                                {
                                    label: isSyncing === post.id ? 'Sincronizando...' : 'Sincronizar GMB',
                                    icon: RefreshCw,
                                    onClick: () => handleSync(post.id)
                                },
                                { label: 'Generar Newsletter', icon: Mail, onClick: () => handleGenerateNewsletter(post.id) }
                            ] : []),
                            { label: 'Editar', icon: Edit, onClick: () => handleEdit(post) },
                            { label: 'Eliminar', icon: Trash2, variant: 'danger', onClick: () => handleDelete(post.id) },
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
                icon={Newspaper}
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
                    {/* Filter Tabs — w-full on mobile so they don't overflow */}
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

                    <AdminTable
                        columns={columns}
                        data={filteredPosts}
                        loading={loading}
                        emptyMessage="No hay noticias registradas todavía."
                        renderMobileCard={(post) => (
                            <div className="flex items-start justify-between gap-3">
                                <div className="flex gap-3 min-w-0">
                                    <div className="w-11 h-11 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 shrink-0">
                                        {post.coverImage
                                            ? <img src={post.coverImage} className="w-full h-full object-cover rounded-lg" alt="" />
                                            : <Newspaper size={20} />}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate text-sm">{post.title}</h3>
                                        <div className="flex items-center flex-wrap gap-1.5 mt-1">
                                            <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase font-bold tracking-tight shrink-0">
                                                {post.category?.split(',')[0]}
                                            </span>
                                            {post.aiTool && (
                                                <span className="text-[9px] text-purple-400 italic font-medium">#{post.aiTool}</span>
                                            )}
                                            {post.published
                                                ? <span className="text-[9px] text-green-500 font-bold flex items-center gap-0.5 shrink-0"><span className="w-1 h-1 rounded-full bg-green-500 inline-block" /> Publicado</span>
                                                : <span className="text-[9px] text-gray-400 font-bold shrink-0">Borrador</span>
                                            }
                                        </div>
                                        <div className="mt-1.5 text-[9px] text-gray-400 flex items-center gap-1">
                                            <Calendar size={9} className="shrink-0" />
                                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                                            {post.published && post.gmbSyncStatus === 'SUCCESS' && (
                                                <span className="text-green-500 font-bold flex items-center gap-0.5 ml-1">
                                                    <CheckCircle2 size={9} /> GMB
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2 shrink-0">
                                    <AdminActionMenu
                                        actions={[
                                            { label: post.published ? 'Ocultar' : 'Publicar', icon: post.published ? EyeOff : Globe, onClick: () => handleTogglePublication(post) },
                                            ...(post.published ? [
                                                { label: 'Sincronizar GMB', icon: RefreshCw, onClick: () => handleSync(post.id) },
                                                { label: 'Generar Newsletter', icon: Mail, onClick: () => handleGenerateNewsletter(post.id) }
                                            ] : []),
                                            { label: 'Editar', icon: Edit, onClick: () => handleEdit(post) },
                                            { label: 'Eliminar', icon: Trash2, variant: 'danger', onClick: () => handleDelete(post.id) },
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
                        )}
                    />
                </div>
            )}
        </div>
    )
}
