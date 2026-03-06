'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Globe, EyeOff, BookOpen } from 'lucide-react'
import CourseForm from '@/components/admin/CourseForm'

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

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-white">Academia IA</h1>
                    <p className="text-gray-400 mt-2">Gestiona los cursos y programas educativos.</p>
                </div>
                {!isEditing && (
                    <button
                        onClick={handleCreate}
                        className="flex items-center px-4 py-2 bg-cyan-500 text-black rounded-lg hover:bg-cyan-400 transition-colors font-medium shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                    >
                        <Plus size={20} className="mr-2" />
                        Nuevo Curso
                    </button>
                )}
            </div>

            {isEditing ? (
                <CourseForm
                    initialData={currentCourse}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsEditing(false)}
                />
            ) : (
                <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden shadow-lg">
                    {loading ? (
                        <div className="p-8 text-center text-gray-400">Cargando cursos...</div>
                    ) : courses.length === 0 ? (
                        <div className="p-8 text-center text-gray-400">No hay cursos registrados.</div>
                    ) : (

                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-800">
                                <thead className="bg-gray-950">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Curso</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Nivel / Duración</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Precio</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Estado</th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Acciones</th>
                                    </tr>
                                </thead >
                                <tbody className="divide-y divide-gray-800">
                                    {courses.map((course) => (
                                        <tr key={course.id} className="hover:bg-gray-800/50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0 bg-gray-800 rounded flex items-center justify-center mr-4">
                                                        <BookOpen size={20} className="text-cyan-500" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-medium text-white">{course.title}</div>
                                                        <div className="text-xs text-gray-500">/{course.slug}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-300">{course.level}</div>
                                                <div className="text-xs text-gray-500">{course.duration}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-cyan-400 font-medium">
                                                {course.price || 'Gratis'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                {course.published ? (
                                                    <div className="flex items-center text-green-400 text-sm">
                                                        <Globe size={16} className="mr-1" /> Publicado
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center text-gray-500 text-sm">
                                                        <EyeOff size={16} className="mr-1" /> Borrador
                                                    </div>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleEdit(course)}
                                                    className="text-cyan-400 hover:text-cyan-300 mr-4"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(course.id)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table >
                        </div >
                    )
                    }
                </div >
            )}
        </div >
    )
}
