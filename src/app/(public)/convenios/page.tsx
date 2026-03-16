import { Handshake } from 'lucide-react'

export default function AgreementsPage() {
    return (
        <div className="min-h-screen bg-white py-8 lg:py-32">
            <div className="container mx-auto px-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl mb-6 border border-gray-200">
                    <Handshake className="text-gray-900" size={32} />
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Convenios</h1>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Alianzas estratégicas para impulsar la adopción de IA.
                </p>
                <div className="mt-16 p-12 bg-gray-50 rounded-3xl border border-gray-200 border-dashed">
                    <p className="text-gray-500">Próximamente: Información sobre nuestros partners y convenios.</p>
                </div>
            </div>
        </div>
    )
}
