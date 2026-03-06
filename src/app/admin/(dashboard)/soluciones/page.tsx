'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Globe, EyeOff, Puzzle, Star } from 'lucide-react'
import SolutionForm from '@/components/admin/SolutionForm'
import AdminTable from '@/components/admin/AdminTable'
import AdminActionMenu from '@/components/admin/AdminActionMenu'

export default function SolutionsPage() {
    const [solutions, setSolutions] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentSolution, setCurrentSolution] = useState<any>(null)

    const fetchSolutions = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/solutions')
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
            }
        } catch (error) {
            console.error('Error saving solution:', error)
        }
    }

    const columns = [
        {
            header: 'Solución',
            accessor: (solution: any) => (
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-lg bg-gray-50 flex items-center justify-center text-blue-500 border border-gray-100 flex-shrink-0">
                        <Puzzle size={20} />
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-900">{solution.title}</div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">/{solution.slug}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Tipo',
            accessor: (solution: any) => (
                <span className={`px-2.5 py-1 text-[10px] font-bold rounded-lg uppercase tracking-wider ${solution.type === 'SOLUTION' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                    }`}>
                    {solution.type === 'SOLUTION' ? 'Solución' : 'LAB IA'}
                </span>
            )
        },
        {
            header: 'Estado',
            accessor: (solution: any) => (
                solution.published ? (
                    <span className="flex items-center text-green-600 text-xs font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-2" />
                        Publicado
                    </span>
                ) : (
                    <span className="flex items-center text-gray-400 text-xs font-bold uppercase tracking-wider">
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300 mr-2" />
                        Borrador
                    </span>
                )
            )
        },
        {
            header: 'Destacada',
            accessor: (solution: any) => (
                solution.featured ? (
                    <div className="flex items-center text-yellow-600 text-[10px] font-bold uppercase">
                        <Star size={14} className="mr-1.5 fill-yellow-400 text-yellow-400" /> Pos. {solution.featuredOrder || '-'}
                    </div>
                ) : (
                    <span className="text-gray-300 text-xs">-</span>
                )
            )
        },
        {
            header: '',
            className: 'text-right',
            accessor: (solution: any) => (
                <AdminActionMenu
                    actions={[
                        { label: solution.published ? 'Ocultar' : 'Publicar', icon: solution.published ? EyeOff : Globe, onClick: () => handleTogglePublication(solution) },
                        { label: 'Editar', icon: Edit, onClick: () => handleEdit(solution) },
                        { label: 'Eliminar', icon: Trash2, variant: 'danger', onClick: () => handleDelete(solution.id) },
                    ]}
                />
            )
        }
    ]

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Gestión de Soluciones</h1>
                    <p className="text-gray-500 mt-2">Administra los servicios y proyectos de LAB IA con eficiencia.</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-bold shadow-lg shadow-blue-100"
                    >
                        <Plus size={20} className="mr-2" />
                        Nueva Solución
                    </button>
                )}
            </div>

            {isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                    <SolutionForm
                        initialData={currentSolution}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                <AdminTable
                    columns={columns}
                    data={solutions}
                    loading={loading}
                    emptyMessage="No hay soluciones registradas todavía."
                    renderMobileCard={(solution) => (
                        <div className="space-y-4">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100 flex-shrink-0">
                                        <Puzzle size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{solution.title}</h3>
                                        <p className="text-xs text-gray-400 font-mono">/{solution.slug}</p>
                                    </div>
                                </div>
                                <AdminActionMenu
                                    actions={[
                                        { label: solution.published ? 'Ocultar' : 'Publicar', icon: solution.published ? EyeOff : Globe, onClick: () => handleTogglePublication(solution) },
                                        { label: 'Editar', icon: Edit, onClick: () => handleEdit(solution) },
                                        { label: 'Eliminar', icon: Trash2, variant: 'danger', onClick: () => handleDelete(solution.id) },
                                    ]}
                                />
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <div className="flex gap-2">
                                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase ${solution.type === 'SOLUTION' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                                        }`}>
                                        {solution.type === 'SOLUTION' ? 'Solución' : 'LAB IA'}
                                    </span>
                                    {solution.published ? (
                                        <span className="px-2 py-0.5 bg-green-50 text-green-600 text-[10px] font-bold rounded uppercase">Publicado</span>
                                    ) : (
                                        <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[10px] font-bold rounded uppercase">Borrador</span>
                                    )}
                                </div>
                                {solution.featured && (
                                    <span className="text-yellow-500">
                                        <Star size={16} className="fill-yellow-500" />
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                />
            )}
        </div>
    )
}
