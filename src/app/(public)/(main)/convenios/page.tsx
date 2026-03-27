'use client'

import PageBadge from '@/components/ui/PageBadge'
import { Handshake } from 'lucide-react'

export default function AgreementsPage() {
    return (
        <div className="min-h-screen bg-white">
            <main className="max-w-7xl mx-auto px-6 py-8 lg:px-8">
                <div className="flex justify-center">
                    <PageBadge text="Alianzas" />
                </div>
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl mb-6 border border-gray-200">
                        <Handshake className="text-gray-900" size={32} />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Convenios</h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Alianzas estratégicas para impulsar la adopción de IA.
                    </p>
                </div>
                <div className="mt-16 p-12 bg-gray-50 rounded-3xl border border-gray-200 border-dashed">
                    <p className="text-gray-500">Próximamente: Información sobre nuestros partners y convenios.</p>
                </div>
            </main>
        </div>
    )
}
