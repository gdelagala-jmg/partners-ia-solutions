import { Users } from 'lucide-react'

export default function TeamPage() {
    return (
        <div className="min-h-screen bg-white py-14 lg:py-20">
            <div className="container mx-auto px-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-2xl mb-4 border border-gray-200">
                    <Users className="text-gray-900" size={26} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">Nuestro Equipo</h1>
                <p className="text-base text-gray-600 max-w-xl mx-auto">
                    Conoce a los expertos detrás de nuestras soluciones de IA.
                </p>
                <div className="mt-10 p-8 bg-gray-50 rounded-3xl border border-gray-200 border-dashed">
                    <p className="text-gray-500 text-sm">Próximamente: Perfiles detallados de nuestro equipo.</p>
                </div>
            </div>
        </div>
    )
}
