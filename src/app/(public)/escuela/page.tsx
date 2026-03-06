'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Clock, BarChart, Lock, GraduationCap } from 'lucide-react'
import { motion } from 'framer-motion'

interface Course {
    id: string
    title: string
    description: string
    level: string
    duration: string
    price: string | null
    coverImage: string | null
    published: boolean
}

export default function SchoolPage() {
    const [courses, setCourses] = useState<Course[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                const res = await fetch('/api/courses')
                if (res.ok) {
                    const data = await res.json()
                    setCourses(data.filter((c: Course) => c.published))
                }
            } catch (error) {
                console.error('Error fetching courses:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchCourses()
    }, [])

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="py-10 lg:py-14 bg-gray-50">
                <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white border border-gray-200 text-sm font-medium text-gray-700 mb-5">
                            <GraduationCap size={15} className="mr-2" />
                            Partners IA Academy
                        </div>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 tracking-tight">
                            Domina la <span className="text-blue-500">Inteligencia Artificial</span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
                            Cursos prácticos diseñados para ejecutivos, desarrolladores y equipos que quieren liderar la revolución de la IA.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Courses Grid */}
            <section className="py-10 lg:py-14">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    {loading ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="h-80 bg-gray-100 rounded-2xl animate-pulse" />
                            ))}
                        </div>
                    ) : courses.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-gray-200">
                            <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Próximamente</h3>
                            <p className="text-gray-600 text-sm">Estamos preparando nuevos cursos innovadores.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {courses.map((course, idx) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                    className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:border-gray-300 hover:shadow-xl transition-all flex flex-col"
                                >
                                    {/* Cover Image */}
                                    <div className="h-48 bg-gray-100 relative overflow-hidden">
                                        {course.coverImage ? (
                                            <img
                                                src={course.coverImage}
                                                alt={course.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 text-gray-300">
                                                <GraduationCap size={40} />
                                            </div>
                                        )}
                                        {course.price && (
                                            <div className="absolute top-3 right-3">
                                                <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-black text-white">
                                                    {course.price}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 lg:p-6 flex-1 flex flex-col">
                                        <h2 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-500 transition-colors">
                                            {course.title}
                                        </h2>
                                        <p className="text-gray-600 mb-5 flex-1 leading-relaxed text-sm">
                                            {course.description}
                                        </p>

                                        {/* Meta Info */}
                                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-5 pb-5 border-t border-gray-200 pt-4">
                                            <span className="flex items-center">
                                                <BarChart size={14} className="mr-1.5 text-gray-900" />
                                                {course.level}
                                            </span>
                                            <span className="flex items-center">
                                                <Clock size={14} className="mr-1.5 text-gray-900" />
                                                {course.duration}
                                            </span>
                                        </div>

                                        <button className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 hover:bg-black hover:text-white hover:border-black transition-all font-medium flex items-center justify-center text-sm">
                                            <Lock size={14} className="mr-2" />
                                            Acceso Restringido
                                        </button>
                                        <p className="text-center text-xs text-gray-500 mt-2">
                                            Requiere suscripción corporativa
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
