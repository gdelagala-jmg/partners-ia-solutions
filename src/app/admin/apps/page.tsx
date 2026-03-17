'use client'

import { useEffect, useState } from 'react'
import { Plus, Search, LayoutGrid, Edit2, Trash2, Eye, EyeOff, ExternalLink, Loader2, MoreVertical, Layout, Globe, FileText, ChevronRight } from 'lucide-react'
import AppForm from '@/components/admin/AppForm'
import { motion, AnimatePresence } from 'framer-motion'

export default function AppsAdminPage() {
    const [apps, setApps] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isFormOpen, setIsFormOpen] = useState(false)
    const [editingApp, setEditingApp] = useState<any>(null)
    const [searchQuery, setSearchQuery] = useState('')

    const fetchApps = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/apps?includeDrafts=true')
            const data = await res.json()
            if (Array.isArray(data)) setApps(data)
        } catch (error) {
            console.error('Error fetching apps:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchApps()
    }, [])

    const handleCreate = () => {
        setEditingApp(null)
        setIsFormOpen(true)
    }

    const handleEdit = (app: any) => {
        setEditingApp(app)
        setIsFormOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar esta aplicación?')) return
        try {
            const res = await fetch(`/api/apps/${id}`, { method: 'DELETE' })
            if (res.ok) fetchApps()
        } catch (error) {
            console.error('Error deleting app:', error)
        }
    }

    const handleTogglePublication = async (app: any) => {
        try {
            const res = await fetch(`/api/apps/${app.id}`, {
                method: 'PUT',
                body: JSON.stringify({ ...app, published: !app.published }),
            })
            if (res.ok) fetchApps()
        } catch (error) {
            console.error('Error updating app:', error)
        }
    }

    const onSubmit = async (data: any) => {
        try {
            const url = editingApp ? `/api/apps/${editingApp.id}` : '/api/apps'
            const method = editingApp ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            const result = await res.json()
            if (res.ok) {
                setIsFormOpen(false)
                fetchApps()
            } else {
                alert(result.error || 'Error al guardar')
            }
        } catch (error) {
            console.error('Error saving app:', error)
            alert('Error al conectar con el servidor')
        }
    }

    const filteredApps = apps.filter(app => 
        app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="p-4 md:p-8 space-y-8 bg-gray-50/50 min-h-screen">
            {/* Header section */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
                <div>
                    <h1 className="text-3xl md:text-4xl font-black text-gray-900 flex items-center gap-3 tracking-tighter">
                        <div className="p-2.5 bg-blue-600 rounded-2xl shadow-lg shadow-blue-100 hidden sm:block">
                            <LayoutGrid size={28} className="text-white" />
                        </div>
                        Gestión de Aplicaciones
                    </h1>
                    <p className="text-gray-500 mt-2 font-medium flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                        Configura landing pages, integraciones externas y herramientas propias.
                    </p>
                </div>
                
                <button
                    onClick={handleCreate}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3.5 rounded-2xl font-black transition-all hover:scale-[1.03] active:scale-95 shadow-xl shadow-blue-100 group"
                >
                    <Plus size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                    Nueva aplicación
                </button>
            </header>

            <AnimatePresence>
                {isFormOpen ? (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="max-w-4xl mx-auto"
                    >
                        <AppForm
                            initialData={editingApp}
                            onSubmit={onSubmit}
                            onCancel={() => setIsFormOpen(false)}
                        />
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {/* Search and Filters */}
                        <div className="flex flex-col md:flex-row items-center gap-4 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm ring-4 ring-gray-100/30">
                            <div className="relative flex-1 group w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <input
                                    type="text"
                                    placeholder="Buscar por nombre o descripción..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-500 outline-none transition-all text-sm font-medium text-gray-900"
                                />
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-widest whitespace-nowrap">
                                <Layout size={14} /> {apps.length} Total
                            </div>
                        </div>

                        {/* Apps List / Grid */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-[250px] bg-white border border-gray-100 rounded-3xl animate-pulse ring-4 ring-gray-50" />
                                ))}
                            </div>
                        ) : filteredApps.length === 0 ? (
                            <div className="text-center py-24 bg-white rounded-[40px] border-2 border-dashed border-gray-100 shadow-inner group">
                                <div className="p-6 bg-gray-50 rounded-full inline-block mb-6 group-hover:scale-110 transition-transform duration-500">
                                    <LayoutGrid size={48} className="text-gray-300" />
                                </div>
                                <h3 className="text-2xl font-black text-gray-900 tracking-tight">Sin aplicaciones todavía</h3>
                                <p className="text-gray-500 mt-2 max-w-xs mx-auto font-medium">Empieza creando tu primera aplicación para mostrarla en el portal.</p>
                                <button
                                    onClick={handleCreate}
                                    className="mt-8 px-8 py-3 bg-gray-900 text-white rounded-2xl font-bold hover:bg-black transition-all hover:shadow-xl active:scale-95"
                                >
                                    ¡Empezar ahora!
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredApps.map((app, idx) => (
                                    <motion.div
                                        key={app.id}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="group bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-200 transition-all duration-500 flex flex-col overflow-hidden relative"
                                    >
                                        {/* Status Badge */}
                                        <div className="absolute top-5 left-5 z-20">
                                            <button 
                                                onClick={(e) => { e.stopPropagation(); handleTogglePublication(app); }}
                                                className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter flex items-center gap-1.5 backdrop-blur-md transition-all ${
                                                    app.published 
                                                        ? 'bg-green-100/90 text-green-700' 
                                                        : 'bg-amber-100/90 text-amber-700'
                                                }`}
                                            >
                                                <div className={`w-1.5 h-1.5 rounded-full ${app.published ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`} />
                                                {app.published ? 'Publicado' : 'Oculto'}
                                            </button>
                                        </div>

                                        {/* Image Header */}
                                        <div className="relative h-48 w-full overflow-hidden bg-gray-50 p-2">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                                            <div className="w-full h-full rounded-[2rem] overflow-hidden border border-gray-100/50">
                                                <img 
                                                    src={app.image || '/logo-ias.png'} 
                                                    alt={app.name} 
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                    onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/400x200?text=App')}
                                                />
                                            </div>
                                            
                                            {/* Quick Actions Hover */}
                                            <div className="absolute bottom-5 right-5 left-5 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 z-20 flex gap-2">
                                                <button 
                                                    onClick={() => handleEdit(app)}
                                                    className="flex-1 bg-white hover:bg-blue-600 hover:text-white text-gray-900 py-2.5 rounded-xl text-xs font-black shadow-xl transition-all flex items-center justify-center gap-2"
                                                >
                                                    <Edit2 size={14} /> Editar
                                                </button>
                                                <a 
                                                    href={`/apps/${app.slug}`} 
                                                    target="_blank"
                                                    className="p-2.5 bg-white hover:bg-gray-900 hover:text-white text-gray-900 rounded-xl shadow-xl transition-all"
                                                >
                                                    <ExternalLink size={16} />
                                                </a>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6 pt-4 flex-1 flex flex-col">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="space-y-1">
                                                    <h3 className="font-black text-xl text-gray-900 leading-none group-hover:text-blue-600 transition-colors">
                                                        {app.name}
                                                    </h3>
                                                    <p className="text-[11px] font-mono text-gray-400">/apps/{app.slug}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {app.externalUrl ? (
                                                        <Globe size={14} className="text-blue-400" title="Integración Externa" />
                                                    ) : (
                                                        <FileText size={14} className="text-amber-400" title="Landing Page Propia" />
                                                    )}
                                                </div>
                                            </div>

                                            <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed mb-6 flex-1">
                                                {app.description || 'Sin descripción.'}
                                            </p>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                                <div className="text-[10px] font-black uppercase text-gray-400 tracking-widest bg-gray-50 px-2 py-1 rounded">
                                                    Orden #{app.order}
                                                </div>
                                                <button 
                                                    onClick={() => handleDelete(app.id)}
                                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
