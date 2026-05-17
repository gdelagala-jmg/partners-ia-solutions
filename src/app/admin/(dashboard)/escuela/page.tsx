'use client'

import { useState, useEffect } from 'react'
import CourseForm from '@/components/admin/CourseForm'
import AdminTable from '@/components/admin/ui/AdminTable'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import AdminStatusBadge from '@/components/admin/ui/AdminStatusBadge'
import AdminActionMenu from '@/components/admin/ui/AdminActionMenu'
import { Plus, Edit, Trash2, BookOpen } from 'lucide-react'

export default function CoursesAdminPage() {
    const [courses, setCourses] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentCourse, setCurrentCourse] = useState<any>(null)

    const fetchCourses = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/courses')
            const data = await res.json()
            setCourses(data)
        } catch (error) {
            console.error('Error fetching courses:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCourses()
    }, [])

    const handleCreate = () => {
        setCurrentCourse(null)
        setIsEditing(true)
    }

    const handleEdit = (course: any) => {
        setCurrentCourse(course)
        setIsEditing(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este curso?')) return

        try {
            await fetch(`/api/courses/${id}`, { method: 'DELETE' })
            fetchCourses()
        } catch (error) {
            console.error('Error deleting course:', error)
        }
    }

    const handleSubmit = async (data: any) => {
        try {
            const url = currentCourse ? `/api/courses/${currentCourse.id}` : '/api/courses'
            const method = currentCourse ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (res.ok) {
                setIsEditing(false)
                fetchCourses()
            } else {
                alert('Error saving course')
            }
        } catch (error) {
            console.error('Error saving course:', error)
        }
    }

    const columns = [
        {
            header: 'Curso',
            accessor: (course: any) => (
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 shrink-0 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center">
                        <BookOpen size={18} className="text-blue-500" />
                    </div>
                    <div className="min-w-0">
                        <div className="text-sm font-black text-[#1D1D1F] truncate pr-4">{course.title}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-0.5">{course.slug}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Nivel / Duración',
            className: 'hidden md:table-cell',
            accessor: (course: any) => (
                <div className="space-y-0.5">
                    <div className="text-[11px] font-black text-gray-600 uppercase tracking-tight">{course.level}</div>
                    <div className="text-[10px] text-gray-400 font-medium">{course.duration}</div>
                </div>
            )
        },
        {
            header: 'Precio',
            className: 'hidden sm:table-cell',
            accessor: (course: any) => (
                <span className="text-xs font-black text-blue-600 bg-blue-50/50 px-2.5 py-1 rounded-lg border border-blue-100">
                    {course.price || 'Gratis'}
                </span>
            )
        },
        {
            header: 'Estado',
            className: 'hidden lg:table-cell',
            accessor: (course: any) => (
                <AdminStatusBadge 
                    label={course.published ? 'Publicado' : 'Borrador'} 
                    type={course.published ? 'success' : 'neutral'}
                />
            )
        },
        {
            header: '',
            className: 'text-right',
            accessor: (course: any) => (
                <AdminActionMenu
                    actions={[
                        { label: 'Editar', icon: <Edit size={16} />, onClick: () => handleEdit(course) },
                        { label: 'Eliminar', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => handleDelete(course.id) },
                    ]}
                />
            )
        }
    ]

    return (
        <div className="space-y-6">
            <AdminToolbar
                title="Academia IA"
                description="Gestiona los cursos y programas educativos."
                actions={
                    <button
                        onClick={handleCreate}
                        className="px-5 py-2.5 rounded-xl bg-[#1D1D1F] text-white font-bold text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-lg"
                    >
                        <Plus size={14} className="mr-2 inline-block" />
                        <span>Nuevo Curso</span>
                    </button>
                }
            />

            {isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <CourseForm
                        initialData={currentCourse}
                        onSubmit={handleSubmit}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                <AdminTable
                    columns={columns}
                    data={courses}
                    loading={loading}
                    emptyMessage="No hay cursos registrados."
                    renderMobileCard={(course) => (
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
                                        <BookOpen size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#1D1D1F] leading-tight">{course.title}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">{course.level}</p>
                                    </div>
                                </div>
                                <AdminActionMenu
                                    actions={[
                                        { label: 'Editar', icon: <Edit size={16} />, onClick: () => handleEdit(course) },
                                        { label: 'Eliminar', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => handleDelete(course.id) },
                                    ]}
                                />
                            </div>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                                <AdminStatusBadge 
                                    label={course.published ? 'Publicado' : 'Borrador'} 
                                    type={course.published ? 'success' : 'neutral'}
                                    className="text-[10px]"
                                />
                                <span className="text-xs font-black text-blue-600">
                                    {course.price || 'Gratis'}
                                </span>
                            </div>
                        </div>
                    )}
                />
            )}
        </div>
    )
}
