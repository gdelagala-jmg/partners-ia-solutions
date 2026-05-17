'use client'

import React, { useState, useEffect } from 'react'
import { Box, Users, Mail, Settings2, Check, X, Loader2, Save, XCircle } from 'lucide-react'
import { DashboardGrid } from '@/components/admin/DashboardGrid'
import { MetricCard, RecentActivity, SystemStatus } from '@/components/admin/DashboardModules'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import AdminActionMenu from '@/components/admin/ui/AdminActionMenu'

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
                <p className="text-gray-400 font-bold text-[10px] uppercase tracking-[0.3em] animate-pulse">
                    Sincronizando Ecosistema...
                </p>
            </div>
        )
    }

    // Map order to actual module objects
    const currentModules = moduleOrder
        .map(id => ({ id, ...WIDGETS[id] }))
        .filter(m => !!m.title)

    // Define actions for AdminActionMenu
    const menuActions = [
        {
            label: isEditing ? 'Guardar Cambios' : 'Personalizar Grid',
            icon: isEditing ? <Save size={16} /> : <Settings2 size={16} />,
            onClick: isEditing ? handleSaveOrder : () => setIsEditing(true)
        },
        ...(isEditing ? [{
            label: 'Cancelar Edición',
            icon: <XCircle size={16} />,
            onClick: () => setIsEditing(false),
            variant: 'danger' as const
        }] : [])
    ]

    return (
        <div className="w-full max-w-full min-w-0 space-y-2">
            <AdminToolbar
                title="Panel de Control"
                description="Gestión inteligente de ecosistema digital."
                actions={
                    <div className="flex items-center gap-2">
                        {/* Primary action always visible */}
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1D1D1F] text-white font-bold text-[11px] uppercase tracking-widest hover:bg-black transition-all active:scale-95 shadow-lg shadow-gray-200"
                            >
                                <Settings2 size={14} />
                                <span>Personalizar</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleSaveOrder}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-[11px] uppercase tracking-widest hover:bg-blue-700 transition-all active:scale-95 shadow-lg shadow-blue-100"
                            >
                                <Check size={14} />
                                <span>Guardar</span>
                            </button>
                        )}

                        {/* Action menu for mobile and secondary actions */}
                        <AdminActionMenu actions={menuActions} direction="horizontal" />
                    </div>
                }
            />

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

