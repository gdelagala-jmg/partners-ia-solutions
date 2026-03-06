'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Globe, EyeOff, Tag, FileArchive, Newspaper, Calendar } from 'lucide-react'
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
            }
        } catch (error) {
            console.error('Error saving post:', error)
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
                        {post.category}
                    </span>
                    <div className="flex gap-1 flex-wrap">
                        {post.aiType && <span className="text-[10px] text-gray-400 italic">#{post.aiType}</span>}
                        {post.sector && <span className="text-[10px] text-gray-400 italic">#{post.sector}</span>}
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
            header: '',
            className: 'text-right',
            accessor: (post: any) => (
                <AdminActionMenu
                    actions={[
                        { label: post.published ? 'Ocultar' : 'Publicar', icon: post.published ? EyeOff : Globe, onClick: () => handleTogglePublication(post) },
                        { label: 'Editar', icon: Edit, onClick: () => handleEdit(post) },
                        { label: 'Eliminar', icon: Trash2, variant: 'danger', onClick: () => handleDelete(post.id) },
                    ]}
                />
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

            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Noticias & Blog</h1>
                    <p className="text-gray-500 mt-2">Gestiona el contenido inteligente del portal.</p>
                </div>
                {!isEditing && (
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowImportModal(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-medium border border-gray-100 shadow-sm"
                        >
                            <FileArchive size={18} className="mr-2 text-gray-400" />
                            Importar
                        </button>
                        <button
                            onClick={handleCreate}
                            className="flex-1 sm:flex-none flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-lg shadow-blue-100"
                        >
                            <Plus size={18} className="mr-2" />
                            Nueva
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
                    <div className="flex p-1 bg-gray-100/50 rounded-xl w-fit">
                        {[
                            { id: 'all', label: 'Todas', count: posts.length },
                            { id: 'published', label: 'Publicadas', count: posts.filter(p => p.published).length },
                            { id: 'draft', label: 'Ocultas', count: posts.filter(p => !p.published).length }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setFilter(t.id as any)}
                                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${filter === t.id
                                    ? 'bg-white text-blue-600 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-900'
                                    }`}
                            >
                                {t.label} <span className="ml-1 opacity-50">{t.count}</span>
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
                                                {post.category}
                                            </span>
                                            <span className="text-[10px] text-gray-400">
                                                {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="mt-2 text-xs">
                                            {post.published ? (
                                                <span className="text-green-600 font-medium flex items-center">
                                                    <span className="w-1 h-1 rounded-full bg-green-500 mr-1.5" /> Publicada
                                                </span>
                                            ) : (
                                                <span className="text-gray-400 font-medium flex items-center">
                                                    <span className="w-1 h-1 rounded-full bg-gray-300 mr-1.5" /> Borrador
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <AdminActionMenu
                                    actions={[
                                        { label: post.published ? 'Ocultar' : 'Publicar', icon: post.published ? EyeOff : Globe, onClick: () => handleTogglePublication(post) },
                                        { label: 'Editar', icon: Edit, onClick: () => handleEdit(post) },
                                        { label: 'Eliminar', icon: Trash2, variant: 'danger', onClick: () => handleDelete(post.id) },
                                    ]}
                                />
                            </div>
                        )}
                    />
                </div>
            )}
        </div>
    )
}
