'use client'

import { Handshake } from 'lucide-react'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import AdminCard from '@/components/admin/ui/AdminCard'

export default function AgreementsPage() {
    return (
        <div className="space-y-6">
            <AdminToolbar
                title="Convenios y Alianzas"
                description="Gestiona las alianzas estratégicas y convenios del ecosistema."
            />

            <AdminCard className="p-20 text-center flex flex-col items-center justify-center border-dashed border-2">
                <div className="h-20 w-20 rounded-[2rem] bg-gray-50 flex items-center justify-center mb-6 shadow-inner border border-gray-100">
                    <Handshake className="h-10 w-10 text-gray-300" />
                </div>
                <h3 className="text-xl font-black text-[#1D1D1F] tracking-tight mb-2">
                    Módulo en Construcción
                </h3>
                <p className="text-gray-400 font-medium text-sm max-w-xs mx-auto">
                    Estamos diseñando una experiencia de gestión de convenios enterprise-grade. Estará disponible en la próxima wave.
                </p>
                <div className="mt-10 flex gap-2">
                    <div className="h-1.5 w-8 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]" />
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-200" />
                    <div className="h-1.5 w-1.5 rounded-full bg-gray-200" />
                </div>
            </AdminCard>
        </div>
    )
}
