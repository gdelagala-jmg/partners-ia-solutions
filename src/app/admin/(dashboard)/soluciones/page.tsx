'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Globe, EyeOff, Puzzle, Star, ExternalLink } from 'lucide-react'
import SolutionForm from '@/components/admin/SolutionForm'
import AdminTable from '@/components/admin/ui/AdminTable'
import AdminActionMenu from '@/components/admin/ui/AdminActionMenu'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import AdminStatusBadge from '@/components/admin/ui/AdminStatusBadge'
import AdminFilterBar from '@/components/admin/ui/AdminFilterBar'

const FILTER_OPTIONS = [
    { id: 'all', label: 'Todos' },
    { id: 'SOLUTION', label: 'Soluciones' },
    { id: 'LAB', label: 'Labs IA' }
] as const

type FilterType = typeof FILTER_OPTIONS[number]['id']

export default function SolutionsPage() {
    const [solutions, setSolutions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentSolution, setCurrentSolution] = useState<any>(null)
    const [filter, setFilter] = useState<FilterType>('all')

    const fetchSolutions = async () => {
        setLoading(true)
        try {
            const res = await fetch(`/api/solutions?admin=true&t=${Date.now()}`, { cache: 'no-store' })
            if (res.ok) {
                const data = await res.json()
                setSolutions(Array.isArray(data) ? data : [])
            }
        } catch (error) {
            console.error('Error fetching solutions:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSolutions()
    }, [])

    const filteredSolutions = solutions.filter(s => {
        if (filter === 'all') return true
        return s.type === filter
    })

    const handleCreate = () => {
        setCurrentSolution(null)
        setIsEditing(true)
    }

    const handleEdit = (solution: any) => {
        setCurrentSolution(solution)
        setIsEditing(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta solución?')) return
        try {
            await fetch(`/api/solutions/${id}`, { method: 'DELETE' })
            fetchSolutions()
        } catch (error) {
            console.error('Error deleting solution:', error)
        }
    }

    const handleTogglePublication = async (solution: any) => {
        try {
            const res = await fetch(`/api/solutions/${solution.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...solution, published: !solution.published }),
            })
            if (res.ok) fetchSolutions()
        } catch (error) {
            console.error('Error toggling status:', error)
        }
    }

    const handleSubmit = async (data: any) => {
        try {
            const url = currentSolution ? `/api/solutions/${currentSolution.id}` : '/api/solutions'
            const method = currentSolution ? 'PUT' : 'POST'
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (res.ok) {
                setIsEditing(false)
                fetchSolutions()
            } else {
                const errData = await res.json()
                alert(`Error al guardar: ${errData.error || errData.details || JSON.stringify(errData)}`)
            }
        } catch (error) {
            console.error('Error saving solution:', error)
            alert('Error de conexión al guardar')
        }
    }

    const columns = [
        {
            header: 'Solución',
            accessor: (solution: any) => (
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-blue-50/50 flex items-center justify-center text-blue-500 border border-blue-100 flex-shrink-0 shadow-inner">
                        <Puzzle size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <div className="text-[13px] font-black text-[#1D1D1F] leading-tight">{solution.title}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">/{solution.slug}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Tipo',
            className: 'hidden md:table-cell',
            accessor: (solution: any) => (
                <AdminStatusBadge 
                    label={solution.type === 'SOLUTION' ? 'Solución' : 'LAB IA'} 
                    type={solution.type === 'SOLUTION' ? 'info' : 'warning'}
                    dot={false}
                    className="text-[10px]"
                />
            )
        },
        {
            header: 'Estado',
            accessor: (solution: any) => (
                <AdminStatusBadge 
                    label={solution.published ? 'Publicado' : 'Borrador'} 
                    type={solution.published ? 'success' : 'neutral'}
                />
            )
        },
        {
            header: 'Destacada',
            className: 'hidden xl:table-cell',
            accessor: (solution: any) => (
                solution.featured ? (
                    <div className="flex items-center text-amber-600 text-[10px] font-black uppercase tracking-wider">
                        <Star size={14} className="mr-1.5 fill-amber-400 text-amber-400" /> Pos. {solution.featuredOrder || '-'}
                    </div>
                ) : (
                    <span className="text-gray-300 text-[10px] font-black">-</span>
                )
            )
        },
        {
            header: '',
            className: 'text-right',
            accessor: (solution: any) => (
                <div className="flex items-center justify-end gap-2">
                    {solution.published && (
                        <button
                            onClick={() => window.open(`/soluciones/${solution.slug}`, '_blank')}
                            className="p-2 text-gray-400 hover:text-blue-600 transition-all active:scale-90"
                            title="Ver publicación"
                        >
                            <ExternalLink size={16} />
                        </button>
                    )}
                    <AdminActionMenu
                        actions={[
                            { label: solution.published ? 'Ocultar' : 'Publicar', icon: <EyeOff size={16} />, onClick: () => handleTogglePublication(solution) },
                            { label: 'Editar Ficha', icon: <Edit size={16} />, onClick: () => handleEdit(solution) },
                            { label: 'Eliminar', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => handleDelete(solution.id) },
                        ]}
                    />
                </div>
            )
        }
    ]

    const filterOptions = FILTER_OPTIONS.map(opt => ({
        ...opt,
        count: opt.id === 'all' ? solutions.length : solutions.filter(s => s.type === opt.id).length
    }))

    return (
        <div className="w-full max-w-full min-w-0 space-y-6">
            <AdminToolbar
                title="Gestión de Soluciones"
                description="Catálogo estratégico de servicios y proyectos LAB IA."
                actions={
                    <div className="flex items-center gap-3">
                        {!isEditing && (
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1D1D1F] text-white font-bold text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200"
                            >
                                <Plus size={14} />
                                <span>Nueva Solución</span>
                            </button>
                        )}
                    </div>
                }
            />

            {isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <SolutionForm
                        initialData={currentSolution}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                <div className="space-y-6">
                    <AdminFilterBar
                        options={filterOptions}
                        activeId={filter}
                        onChange={(id) => setFilter(id as FilterType)}
                    />

                    <AdminTable
                        columns={columns}
                        data={filteredSolutions}
                        loading={loading}
                        emptyMessage="No hay soluciones registradas."
                        renderMobileCard={(solution) => (
                            <div className="space-y-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="h-12 w-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                                            <Puzzle size={24} strokeWidth={2.5} />
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-[#1D1D1F] leading-tight text-lg truncate">{solution.title}</h3>
                                            <p className="text-[10px] text-gray-400 font-mono mt-1 opacity-60 truncate">/{solution.slug}</p>
                                        </div>
                                    </div>
                                    <AdminActionMenu
                                        actions={[
                                            { label: solution.published ? 'Ocultar' : 'Publicar', icon: <EyeOff size={16} />, onClick: () => handleTogglePublication(solution) },
                                            { label: 'Editar', icon: <Edit size={16} />, onClick: () => handleEdit(solution) },
                                            { label: 'Eliminar', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => handleDelete(solution.id) },
                                        ]}
                                    />
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                    <div className="flex gap-2">
                                        <AdminStatusBadge 
                                            label={solution.type === 'SOLUTION' ? 'Solución' : 'LAB IA'} 
                                            type={solution.type === 'SOLUTION' ? 'info' : 'warning'}
                                            dot={false}
                                            className="text-[9px]"
                                        />
                                        <AdminStatusBadge 
                                            label={solution.published ? 'Publicado' : 'Borrador'} 
                                            type={solution.published ? 'success' : 'neutral'}
                                            className="text-[9px]"
                                        />
                                    </div>
                                    {solution.featured && (
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star size={14} className="fill-amber-500" />
                                            <span className="text-[9px] font-black uppercase">Destacada</span>
                                        </div>
                                    )}
                                </div>
                                {solution.published && (
                                    <button 
                                        onClick={() => window.open(`/soluciones/${solution.slug}`, '_blank')}
                                        className="w-full py-2.5 bg-gray-50 text-[#1D1D1F] text-[11px] font-black uppercase tracking-widest rounded-xl border border-gray-100 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ExternalLink size={14} />
                                        Explorar Solución
                                    </button>
                                )}
                            </div>
                        )}
                    />
                </div>
            )}
        </div>
    )
}
