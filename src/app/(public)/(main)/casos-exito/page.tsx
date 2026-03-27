'use client'

import { Award } from 'lucide-react'
import PageBadge from '@/components/ui/PageBadge'

export default function SuccessStoriesPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="py-8 lg:py-8 container mx-auto px-6 text-center">
                <PageBadge text="Impacto Real y Resultados" />
                <div className="flex justify-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl mb-6 border border-gray-200">
                        <Award className="text-gray-900" size={32} />
                    </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Casos de Éxito</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Descubre cómo hemos transformado empresas con Inteligencia Artificial.
                </p>
                <div className="mt-16 p-12 bg-gray-50 rounded-3xl border border-gray-200 border-dashed">
                    <p className="text-gray-500">Próximamente: Historias detalladas de nuestros clientes.</p>
                </div>
            </div>
        </div>
    )
}
