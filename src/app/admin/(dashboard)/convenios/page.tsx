'use client'

import { Handshake } from 'lucide-react'

export default function AgreementsPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Convenios y Alianzas</h1>
            <p className="text-gray-500 mb-8">Gestiona las alianzas estratégicas y convenios.</p>

            <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-sm">
                <Handshake className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">En Construcción</h3>
                <p className="text-gray-500">Este módulo estará disponible pronto.</p>
            </div>
        </div>
    )
}
