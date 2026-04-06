'use client'

import { Award } from 'lucide-react'
import PageBadge from '@/components/ui/PageBadge'
import { motion } from 'framer-motion'

export default function SuccessStoriesPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="py-8 lg:py-8 bg-gray-50 border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-5 md:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <PageBadge text="Impacto Real y Resultados" icon={<Award size={14} className="text-blue-500" />} />
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 tracking-tight">
                            Casos de <span className="text-blue-500">Éxito</span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
                            Descubre cómo hemos transformado procesos de negocio y optimizado la eficiencia operativa mediante soluciones personalizadas de Inteligencia Artificial.
                        </p>
                    </motion.div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
                <div className="mt-8 p-12 bg-white rounded-3xl border border-gray-200 border-dashed text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl mb-6 border border-gray-200">
                        <Award className="text-gray-900" size={32} />
                    </div>
                    <p className="text-gray-500 text-lg">Próximamente: Historias detalladas de éxito y testimonios de nuestros partners.</p>
                </div>
            </main>
        </div>
    )
}
