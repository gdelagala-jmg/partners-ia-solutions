import Link from 'next/link'
import { ArrowDown, Building2 } from 'lucide-react'
import PageBadge from '@/components/ui/PageBadge'

export default function EmpresasHero() {
    return (
        <section className="relative overflow-hidden bg-white border-b border-gray-100 pt-10 pb-16 md:pt-6 md:pb-24">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 -translate-y-12 translate-x-1/3">
                <div className="w-96 h-96 bg-blue-50/50 rounded-full blur-3xl" />
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center pt-6 md:pt-5">
                <PageBadge text="Soluciones B2B" icon={<Building2 size={14} className="text-blue-600" />} />
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 mb-6">
                    Soluciones de Inteligencia Artificial <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">para optimizar tu empresa</span>
                </h1>
                
                <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
                    No vendemos herramientas genéricas. Diseñamos e implementamos soluciones a medida para automatizar procesos, analizar datos y potenciar la productividad de tu equipo con IA.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <Link href="#diagnostico" className="px-8 py-4 bg-gray-900 text-white rounded-xl font-medium hover:bg-gray-800 transition-all shadow-sm hover:shadow-md w-full sm:w-auto flex items-center justify-center group">
                        Solicitar Diagnóstico
                        <ArrowDown size={18} className="ml-2 group-hover:translate-y-1 transition-transform" />
                    </Link>
                    <Link href="#soluciones" className="px-8 py-4 bg-white text-gray-700 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-all w-full sm:w-auto text-center">
                        Ver Soluciones
                    </Link>
                </div>
            </div>
        </section>
    )
}
