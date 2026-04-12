'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Globe, EyeOff, Tag, FileArchive, Newspaper, Calendar, ExternalLink, RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react'
import NewsForm from '@/components/admin/NewsForm'
import ImportModal from '@/components/admin/ImportModal'
import AdminTable from '@/components/admin/AdminTable'
import AdminActionMenu from '@/components/admin/AdminActionMenu'

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

    useEffect(() => {
        fetchPosts()
    }, [])

    const handleCreate = () => {
        setCurrentPost(null)
        setIsEditing(true)
    }

    const handleEdit = (post: any) => {
        setCurrentPost(post)
        setIsEditing(true)
    }

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

    const handleSyncAll = async () => {
        const publishedPosts = posts.filter(p => p.published)
        if (publishedPosts.length === 0) {
            alert('No hay noticias publicadas para sincronizar.')
            return
        }

        if (!confirm(`Se enviarán ${publishedPosts.length} noticias a Google Business Profile una por una. ¿Deseas continuar?`)) return
        
        setIsSyncing('all')
        let successCount = 0
        let errorCount = 0

        for (let i = 0; i < publishedPosts.length; i++) {
            const post = publishedPosts[i]
            try {
                // Actualizamos el estado para mostrar progreso (opcional, usando el id para feedback visual en la tabla)
                const res = await fetch(`/api/news/${post.id}/sync`, { method: 'POST' })
                if (res.ok) {
                    successCount++
                } else {
                    errorCount++
                }
            } catch (error) {
                console.error(`Error syncing post ${post.id}:`, error)
                errorCount++
            }
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
                if (contentType && contentType.includes('application/json')) {
                    const errData = await res.json()
                    alert(`Error al guardar: ${errData.error || 'Desconocido'}`)
                } else {
                    const errorText = await res.text()
                    console.error('Server error (non-JSON):', errorText)
                    alert('Error en el servidor. Es posible que tu sesión haya caducado. Por favor, refresca la página (F5) e intenta de nuevo.')
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
            accessor: (post: any) => (
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400 overflow-hidden flex-shrink-0">
                        {post.coverImage ? (
                            <img src={post.coverImage} className="w-full h-full object-cover" alt="" />
                        ) : (
                            <Newspaper size={18} />
                        )}
                    </div>
                    <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate max-w-[200px]" title={post.title}>{post.title}</div>
                        <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                            <Calendar size={10} />
                            {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Clasificación',
            accessor: (post: any) => (
                <div className="space-y-1">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-blue-50 text-blue-600 rounded-full uppercase tracking-wider block w-fit">
                        {post.category?.split(',')[0]}
                    </span>
                    <div className="flex gap-1 flex-wrap max-w-[150px]">
                        {post.aiType && <span className="text-[10px] text-gray-400 italic">#{post.aiType}</span>}
                        {post.aiTool && <span className="text-[10px] text-purple-400 italic font-medium">#{post.aiTool}</span>}
                        {post.tags && post.tags.split(',').slice(0, 3).map((tag: string) => (
                            <span key={tag} className="text-[10px] text-blue-400">#{tag.trim()}</span>
                        ))}
                    </div>
                </div>
            )
        },
        {
            header: 'Estado',
            accessor: (post: any) => (
                post.published ? (
                    <span className="flex items-center text-green-600 text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                        Publicado
                    </span>
                ) : (
                    <span className="flex items-center text-gray-400 text-xs font-medium">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2" />
                        Borrador
                    </span>
                )
            )
        },
        {
            header: 'Google Business',
            accessor: (post: any) => {
                if (!post.published) return <span className="text-gray-300 text-[10px]">—</span>;
                
                const status = post.gmbSyncStatus || 'PENDING';
                
                switch (status) {
                    case 'SUCCESS':
                        return (
                            <div className="flex items-center text-green-500 gap-1.5" title={`Sincronizado el ${post.gmbLastSync ? new Date(post.gmbLastSync).toLocaleString() : 'recientemente'}`}>
                                <CheckCircle2 size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">OK</span>
                            </div>
                        );
                    case 'ERROR':
                        return (
                            <div className="flex items-center text-red-500 gap-1.5 cursor-help" title={post.gmbErrorMessage || 'Error desconocido'}>
                                <AlertCircle size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Error</span>
                            </div>
                        );
                    case 'SYNCING':
                        return (
                            <div className="flex items-center text-blue-500 gap-1.5">
                                <RefreshCw size={14} className="animate-spin" />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Procesando</span>
                            </div>
                        );
                    default:
                        return (
                            <div className="flex items-center text-gray-400 gap-1.5">
                                <Clock size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider italic opacity-60">Pendiente</span>
                            </div>
                        );
                }
            }
        },
        {
            header: '',
            className: 'text-right',
            accessor: (post: any) => (
                <div className="flex items-center justify-end gap-2">
                    {post.published && (
                        <a
                            href={`/noticias/${post.slug || post.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50/50 rounded-full transition-all"
                            title="Ver publicación"
                        >
                            <ExternalLink size={18} />
                        </a>
                    )}
                    <AdminActionMenu
                        actions={[
                            { label: post.published ? 'Ocultar' : 'Publicar', icon: post.published ? EyeOff : Globe, onClick: () => handleTogglePublication(post) },
                            ...(post.published ? [{ 
                                label: isSyncing === post.id ? 'Sincronizando...' : 'Sincronizar Google Business', 
                                icon: RefreshCw, 
                                onClick: () => handleSync(post.id) 
                            }] : []),
                            { label: 'Editar', icon: Edit, onClick: () => handleEdit(post) },
                            { label: 'Eliminar', icon: Trash2, variant: 'danger', onClick: () => handleDelete(post.id) },
                        ]}
                    />
                </div>
            )
        }
    ]

    return (
        <div className="space-y-6">
            {showImportModal && (
                <ImportModal
                    onClose={() => setShowImportModal(false)}
                    onSuccess={() => { fetchPosts(); setShowImportModal(false); }}
                />
            )}

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-4 md:px-0">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Noticias & Blog</h1>
                    <p className="text-gray-400 mt-1 font-medium">Gestión editorial inteligente y contenido global.</p>
                </div>
                {!isEditing && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleSyncAll}
                            disabled={isSyncing === 'all'}
                            className="flex-1 sm:flex-none flex items-center justify-center px-5 py-2.5 bg-blue-50/50 text-blue-600 rounded-2xl hover:bg-blue-100/50 transition-all font-semibold border border-blue-200/50 shadow-sm disabled:opacity-50"
                        >
                            <RefreshCw size={18} className={`mr-2 ${isSyncing === 'all' ? 'animate-spin' : ''}`} />
                            {isSyncing === 'all' ? 'Sincronizando...' : 'Sincronizar Todo'}
                        </button>
                        <button
                            onClick={() => setShowImportModal(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center px-5 py-2.5 bg-white/60 backdrop-blur-md text-[#1D1D1F] rounded-2xl hover:bg-white/80 transition-all font-semibold border border-white/40 shadow-[0_4px_12px_rgba(0,0,0,0.03)]"
                        >
                            <FileArchive size={18} className="mr-2 text-gray-400" />
                            Importar
                        </button>
                        <button
                            onClick={handleCreate}
                            className="flex-1 sm:flex-none flex items-center justify-center px-6 py-2.5 bg-[#1D1D1F] text-white rounded-2xl hover:bg-black transition-all font-semibold shadow-[0_8px_20px_rgba(0,0,0,0.1)]"
                        >
                            <Plus size={18} className="mr-2" />
                            Nueva Noticia
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <NewsForm
                        initialData={currentPost}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Filter Tabs */}
                    <div className="flex p-1.5 bg-gray-200/40 backdrop-blur-sm rounded-2xl w-fit">
                        {[
                            { id: 'all', label: 'Todas', count: posts.length },
                            { id: 'published', label: 'Publicadas', count: posts.filter(p => p.published).length },
                            { id: 'draft', label: 'Ocultas', count: posts.filter(p => !p.published).length }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setFilter(t.id as any)}
                                className={`px-5 py-2 text-[11px] font-bold rounded-xl transition-all ${filter === t.id
                                    ? 'bg-white text-[#1D1D1F] shadow-[0_2px_8px_rgba(0,0,0,0.08)]'
                                    : 'text-gray-450 hover:text-gray-900'
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
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4 min-w-0">
                                    <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center text-gray-300 flex-shrink-0">
                                        {post.coverImage ? <img src={post.coverImage} className="w-full h-full object-cover" alt="" /> : <Newspaper size={20} />}
                                    </div>
                                    <div className="min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate pr-2">{post.title}</h3>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded uppercase font-bold tracking-tight">
                                                {post.category?.split(',')[0]}
                                            </span>
                                            {post.aiTool && (
                                                <span className="text-[10px] text-purple-400 italic font-medium truncate max-w-[80px]">
                                                    #{post.aiTool}
                                                </span>
                                            )}
                                            {post.tags && (
                                                <span className="text-[10px] text-gray-400 italic truncate max-w-[100px]">
                                                    #{post.tags.split(',')[0]}
                                                </span>
                                            )}
                                            <span className="text-[10px] text-gray-400 ml-auto text-right">
                                                {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        {post.published && (
                                            <div className="mt-2">
                                                {post.gmbSyncStatus === 'SUCCESS' ? (
                                                    <span className="text-[10px] text-green-500 font-bold flex items-center">
                                                        <CheckCircle2 size={10} className="mr-1" /> GMB OK
                                                    </span>
                                                ) : post.gmbSyncStatus === 'ERROR' ? (
                                                    <span className="text-[10px] text-red-500 font-bold flex items-center">
                                                        <AlertCircle size={10} className="mr-1" /> GMB ERROR
                                                    </span>
                                                ) : post.gmbSyncStatus === 'SYNCING' ? (
                                                    <span className="text-[10px] text-blue-500 font-bold flex items-center">
                                                        <RefreshCw size={10} className="mr-1 animate-spin" /> GMB SYNCING
                                                    </span>
                                                ) : (
                                                    <span className="text-[10px] text-gray-400 italic flex items-center">
                                                        <Clock size={10} className="mr-1" /> GMB PENDIENTE
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-3">
                                    <AdminActionMenu
                                        actions={[
                                            { label: post.published ? 'Ocultar' : 'Publicar', icon: post.published ? EyeOff : Globe, onClick: () => handleTogglePublication(post) },
                                            ...(post.published ? [{ 
                                                label: isSyncing === post.id ? 'Sincronizando...' : 'Sincronizar Google Business', 
                                                icon: RefreshCw, 
                                                onClick: () => handleSync(post.id) 
                                            }] : []),
                                            { label: 'Editar', icon: Edit, onClick: () => handleEdit(post) },
                                            { label: 'Eliminar', icon: Trash2, variant: 'danger', onClick: () => handleDelete(post.id) },
                                        ]}
                                    />
                                    {post.published && (
                                        <a
                                            href={`/noticias/${post.slug || post.id}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2 bg-white/60 text-[#1D1D1F] rounded-full border border-white shadow-sm"
                                        >
                                            <ExternalLink size={16} />
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
