'use client'

import React, { useState, useEffect } from 'react'
import { Box, Users, Mail, TrendingUp, Settings2, Check, X, Loader2 } from 'lucide-react'
import { DashboardGrid } from '@/components/admin/DashboardGrid'
import { MetricCard, RecentActivity, SystemStatus } from '@/components/admin/DashboardModules'

// Widget definitions to map IDs to components
const WIDGETS: Record<string, { title: string; component: React.ReactNode; className?: string }> = {
    'stats-solutions': {
        title: 'Soluciones',
        component: <MetricCard title="Soluciones Activas" value="12" icon={Box} color="blue" trend="+15%" />,
        className: ''
    },
    'stats-leads': {
        title: 'Leads',
        component: <MetricCard title="Total Leads" value="45" icon={Mail} color="purple" trend="+2.5%" />,
        className: ''
    },
    'stats-team': {
        title: 'Equipo',
        component: <MetricCard title="Miembros Equipo" value="8" icon={Users} color="emerald" />,
        className: ''
    },
    'activity-recent': {
        title: 'Actividad Reciente',
        component: <RecentActivity items={[
            { title: 'Nuevo Lead Recibido', time: 'hace 2 horas', icon: Mail, status: 'Nuevo' },
            { title: 'Noticia Publicada', time: 'hace 5 horas', icon: Box, status: 'IA' },
            { title: 'Actualización Equipo', time: 'ayer', icon: Users, status: 'RRHH' }
        ]} />,
        className: 'md:col-span-2'
    },
    'system-status': {
        title: 'Estado de Sistemas',
        component: <SystemStatus />,
        className: ''
    }
}

const DEFAULT_ORDER = ['stats-solutions', 'stats-leads', 'stats-team', 'activity-recent', 'system-status']

export default function DashboardPage() {
    const [isEditing, setIsEditing] = useState(false)
    const [moduleOrder, setModuleOrder] = useState<string[]>(DEFAULT_ORDER)
    const [loading, setLoading] = useState(true)

    // Load configuration from DB
    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const res = await fetch('/api/admin/dashboard/config')
                const data = await res.json()
                if (data.config && Array.isArray(data.config)) {
                    setModuleOrder(data.config)
                }
            } catch (error) {
                console.error('Failed to load dashboard config:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchConfig()
    }, [])

    const handleSaveOrder = async () => {
        try {
            await fetch('/api/admin/dashboard/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ config: moduleOrder })
            })
            setIsEditing(false)
        } catch (error) {
            console.error('Failed to save order:', error)
            alert('Error al guardar la configuración')
        }
    }

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="animate-spin text-blue-500" size={32} />
                <p className="text-gray-400 font-medium text-sm animate-pulse">Cargando Dashboard Personalizado...</p>
            </div>
        )
    }

    // Map order to actual module objects
    const currentModules = moduleOrder
        .map(id => ({ id, ...WIDGETS[id] }))
        .filter(m => !!m.title)

    return (
        <div className="space-y-6">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
                <div className="animate-in fade-in slide-in-from-left-4 duration-500">
                    <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Panel de Control</h1>
                    <p className="text-gray-400 mt-1 font-medium italic">Gestión inteligente de ecosistema digital.</p>
                </div>

                <div className="flex items-center gap-3 animate-in fade-in slide-in-from-right-4 duration-700">
                    {isEditing ? (
                        <>
                            <button
                                onClick={handleSaveOrder}
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#1D1D1F] text-white font-semibold text-sm shadow-lg hover:bg-black transition-all active:scale-95"
                            >
                                <Check size={18} />
                                <span>Guardar</span>
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white text-gray-500 font-semibold text-sm hover:bg-white transition-all active:scale-95"
                            >
                                <X size={18} />
                                <span>Cancelar</span>
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/60 backdrop-blur-md border border-white text-[#1D1D1F] font-semibold text-sm shadow-sm hover:bg-white transition-all active:scale-95 group"
                        >
                            <Settings2 size={18} className="text-gray-400 group-hover:rotate-90 transition-transform duration-700" />
                            <span>Personalizar</span>
                        </button>
                    )}
                </div>
            </header>

            <div className="pt-2">
                <DashboardGrid
                    initialModules={currentModules}
                    isEditing={isEditing}
                    onOrderChange={setModuleOrder}
                />
            </div>
        </div>
    )
}
