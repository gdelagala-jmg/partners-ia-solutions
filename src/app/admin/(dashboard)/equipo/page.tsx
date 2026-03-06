'use client'

import { Users } from 'lucide-react'

export default function TeamPage() {
    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestión de Equipo</h1>
            <p className="text-gray-500 mb-8">Administra los miembros del equipo y sus roles.</p>

            <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-sm">
                <Users className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-xl font-bold text-gray-900">En Construcción</h3>
                <p className="text-gray-500">Este módulo estará disponible pronto.</p>
            </div>
        </div>
    )
}
