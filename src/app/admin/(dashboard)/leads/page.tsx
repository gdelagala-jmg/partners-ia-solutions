'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, Calendar, Archive, User } from 'lucide-react'

export default function LeadsPage() {
    const [leads, setLeads] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Note: In a real app we would have a dedicated API route for GET leads
        // For now we will mock or implement a GET route.
        // Let's implement a GET route in api/leads/route.ts quickly or reuse api/contact? 
        // Usually api/contact is POST only. Let's assume we need a new route or update existing.
        // I will fetch from a new endpoint /api/leads which I will create next.
        async function fetchLeads() {
            try {
                const res = await fetch('/api/leads')
                if (res.ok) {
                    const data = await res.json()
                    setLeads(data)
                }
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }
        fetchLeads()
    }, [])

    return (
        <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mensajes Recibidos</h1>
            <p className="text-gray-500 mb-8">Gestiona los contactos que han llegado a través del formulario web.</p>

            {loading ? (
                <div className="text-gray-500">Cargando leads...</div>
            ) : leads.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-xl p-12 text-center shadow-sm">
                    <Mail className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                    <h3 className="text-xl font-bold text-gray-900">No hay mensajes aún</h3>
                    <p className="text-gray-500">Los formularios enviados aparecerán aquí.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {leads.map((lead) => (
                        <div key={lead.id} className="bg-white border border-gray-200 rounded-xl p-6 hover:border-blue-300 transition-all group shadow-sm">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center">
                                    <div className="h-10 w-10 bg-blue-50 rounded-full flex items-center justify-center mr-3 border border-blue-100">
                                        <User className="text-blue-600" size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-lg">{lead.name}</h3>
                                        <div className="flex items-center text-sm text-gray-500 space-x-3">
                                            <span className="flex items-center bg-gray-50 px-2 py-0.5 rounded text-xs border border-gray-100">
                                                <Mail size={12} className="mr-1" /> {lead.email}
                                            </span>
                                            {lead.phone && (
                                                <span className="flex items-center bg-gray-50 px-2 py-0.5 rounded text-xs border border-gray-100">
                                                    <Phone size={12} className="mr-1" /> {lead.phone}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500 flex items-center bg-gray-50 px-3 py-1 rounded-full border border-gray-200">
                                    <Calendar size={12} className="mr-1" />
                                    {new Date(lead.createdAt).toLocaleDateString()} {new Date(lead.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 text-gray-700 text-sm whitespace-pre-wrap">
                                {lead.message}
                            </div>

                            <div className="mt-4 flex justify-end">
                                <button className="text-xs text-gray-500 hover:text-gray-900 flex items-center transition-colors">
                                    <Archive size={14} className="mr-1" /> Archivar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
