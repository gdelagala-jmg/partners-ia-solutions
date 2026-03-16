import { FlaskConical } from 'lucide-react'

export default function LabPage() {
    return (
        <div className="min-h-screen bg-white py-8 lg:py-8">
            <div className="container mx-auto px-6 text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-50 rounded-2xl mb-4 border border-gray-200">
                    <FlaskConical className="text-gray-900" size={26} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3 tracking-tight">LAB IA</h1>
                <p className="text-base text-gray-600 max-w-xl mx-auto">
                    Nuestro espacio de experimentación e innovación en Inteligencia Artificial.
                </p>
                <div className="mt-10 p-8 bg-gray-50 rounded-3xl border border-gray-200 border-dashed">
                    <p className="text-gray-500 text-sm">Próximamente: Proyectos experimentales y demos.</p>
                </div>
            </div>
        </div>
    )
}
