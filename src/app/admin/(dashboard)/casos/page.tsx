'use client'

import { Trophy } from 'lucide-react'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'

export default function SuccessCasesPage() {
    return (
        <div className="w-full max-w-full min-w-0 space-y-8">
            <AdminToolbar 
                title="Casos de Éxito"
                description="Gestiona los testimonios y casos de éxito de clientes."
                icon={Trophy}
            />

            <div className="mx-4 md:mx-0">
                <div className="bg-white/60 backdrop-blur-md border border-white rounded-[2.5rem] p-16 text-center shadow-sm">
                    <div className="w-20 h-20 bg-gray-50 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-gray-100">
                        <Trophy className="h-10 w-10 text-gray-300" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 tracking-tight">Módulo en Desarrollo</h3>
                    <p className="text-gray-500 mt-2 font-medium">Este apartado estará disponible próximamente en el ecosistema administrativo.</p>
                </div>
            </div>
        </div>
    )
}
