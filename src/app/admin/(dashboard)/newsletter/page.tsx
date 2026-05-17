'use client'

import { useState, useEffect } from 'react'
import { 
    Users, 
    UserCheck, 
    UserMinus, 
    UserPlus, 
    Mail, 
    Search, 
    Download, 
    Filter, 
    CheckCircle, 
    XCircle,
    Calendar,
    Globe,
    ShieldCheck,
    UserX,
    User
} from 'lucide-react'
import AdminTable from '@/components/admin/ui/AdminTable'
import AdminActionMenu from '@/components/admin/ui/AdminActionMenu'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import AdminStatusBadge from '@/components/admin/ui/AdminStatusBadge'
import AdminCard from '@/components/admin/ui/AdminCard'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function NewsletterAdminPage() {
    const [subscribers, setSubscribers] = useState<any[]>([])
    const [stats, setStats] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [filterStatus, setFilterStatus] = useState<'all' | 'true' | 'false'>('all')

    const fetchSubscribers = async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            if (search) params.append('email', search)
            if (filterStatus !== 'all') params.append('active', filterStatus)
            
            const res = await fetch(`/api/admin/newsletter/subscribers?${params.toString()}`)
            if (res.ok) {
                const data = await res.json()
                setSubscribers(data.subscribers)
                setStats(data.stats)
            }
        } catch (error) {
            console.error('Error fetching subscribers:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchSubscribers()
        }, 300)
        return () => clearTimeout(timer)
    }, [search, filterStatus])

    const handleToggleStatus = async (subscriber: any) => {
        try {
            const res = await fetch('/api/admin/newsletter/subscribers', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: subscriber.id,
                    isActive: !subscriber.isActive
                })
            })
            if (res.ok) {
                fetchSubscribers()
            }
        } catch (error) {
            console.error('Error toggling status:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este suscriptor permanentemente?')) return
        try {
            const res = await fetch(`/api/admin/newsletter/subscribers?id=${id}`, {
                method: 'DELETE'
            })
            if (res.ok) {
                fetchSubscribers()
            }
        } catch (error) {
            console.error('Error deleting subscriber:', error)
        }
    }

    const handleExportCSV = () => {
        if (subscribers.length === 0) return

        const headers = ['Email', 'Estado', 'Fecha Registro', 'Origen', 'Consentimiento RGPD', 'Fecha Consentimiento']
        const csvContent = [
            headers.join(','),
            ...subscribers.map(s => [
                s.email,
                s.isActive ? 'Activo' : 'Inactivo',
                format(new Date(s.createdAt), 'yyyy-MM-dd HH:mm:ss'),
                s.sourceUrl || 'N/A',
                s.consentGranted ? 'SÍ' : 'NO',
                s.consentDate ? format(new Date(s.consentDate), 'yyyy-MM-dd HH:mm:ss') : 'N/A'
            ].map(val => `"${val}"`).join(','))
        ].join('\n')

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', `subscriptores_newsletter_${format(new Date(), 'yyyyMMdd')}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    const columns = [
        {
            header: 'Suscriptor',
            accessor: (s: any) => (
                <div className="flex items-center gap-4 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-blue-50/50 flex items-center justify-center text-blue-500 border border-blue-100 shadow-inner">
                        <Mail size={18} strokeWidth={2.5} />
                    </div>
                    <div className="min-w-0">
                        <div className="text-[13px] font-black text-[#1D1D1F] truncate">{s.email}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                            <Globe size={10} />
                            {s.sourceUrl ? new URL(s.sourceUrl).pathname : 'Directo'}
                        </div>
                    </div>
                </div>
            )
        },
        {
            header: 'Estado',
            accessor: (s: any) => (
                <AdminStatusBadge 
                    label={s.isActive ? 'Activo' : 'Inactivo'} 
                    type={s.isActive ? 'success' : 'neutral'}
                />
            )
        },
        {
            header: 'Alta / Consentimiento',
            className: 'hidden md:table-cell',
            accessor: (s: any) => (
                <div className="space-y-1">
                    <div className="text-[11px] font-black text-[#1D1D1F] flex items-center gap-2">
                        <Calendar size={12} className="text-gray-400" />
                        {format(new Date(s.createdAt), 'd MMM, yyyy', { locale: es })}
                    </div>
                    {s.consentGranted && (
                        <div className="text-[9px] text-emerald-500 font-black flex items-center gap-1.5 uppercase tracking-widest">
                            <ShieldCheck size={10} strokeWidth={3} />
                            Protección RGPD
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Token ID',
            className: 'hidden xl:table-cell',
            accessor: (s: any) => (
                <div className="text-[10px] text-gray-400 font-mono font-bold opacity-60 bg-gray-50 px-2 py-0.5 rounded border border-gray-100 inline-block">
                    {s.unsubscribeToken.substring(0, 8)}
                </div>
            )
        },
        {
            header: '',
            className: 'text-right',
            accessor: (s: any) => (
                <AdminActionMenu
                    actions={[
                        { 
                            label: s.isActive ? 'Desactivar Audiencia' : 'Activar Audiencia', 
                            icon: s.isActive ? <UserX size={16} /> : <UserCheck size={16} />, 
                            onClick: () => handleToggleStatus(s) 
                        },
                        { 
                            label: 'Eliminar Registro', 
                            icon: <XCircle size={16} />, 
                            variant: 'danger', 
                            onClick: () => handleDelete(s.id) 
                        },
                    ]}
                />
            )
        }
    ]

    return (
        <div className="w-full max-w-full min-w-0 space-y-6">
            <AdminToolbar
                title="Gestión de Audiencia"
                description="Control de suscripciones, cumplimiento normativo y exportación de datos."
                actions={
                    <button
                        onClick={handleExportCSV}
                        className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-[#1D1D1F] font-bold text-[11px] uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm whitespace-nowrap"
                    >
                        <Download size={14} className="shrink-0" />
                        <span className="hidden sm:inline">Exportar Audiencia</span>
                        <span className="sm:hidden">Exportar</span>
                    </button>
                }
            />

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard 
                    title="Audiencia Total" 
                    value={stats?.total || 0} 
                    icon={Users} 
                    color="blue" 
                    subtitle="Base de datos global"
                />
                <KPICard 
                    title="Suscriptores Activos" 
                    value={stats?.activeCount || 0} 
                    icon={UserCheck} 
                    color="green" 
                    subtitle="Alcance proyectado"
                />
                <KPICard 
                    title="Nuevos (7d)" 
                    value={stats?.last7Days || 0} 
                    icon={UserPlus} 
                    color="purple" 
                    subtitle="Crecimiento neto"
                    trend={stats?.last7Days > 0 ? 'up' : 'neutral'}
                />
                <KPICard 
                    title="Último Registro" 
                    value={stats?.lastSubscriber?.split('@')[0] || '—'} 
                    icon={Mail} 
                    color="orange" 
                    subtitle={stats?.lastSubscriber || 'Sin datos recientes'}
                    isEmail={true}
                />
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full min-w-0">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar por email exacto o parcial..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-50/50 focus:border-blue-200 outline-none transition-all text-sm font-bold text-[#1D1D1F] shadow-sm"
                    />
                </div>
                <div className="flex items-center gap-1.5 p-1.5 bg-gray-100/50 rounded-2xl border border-gray-100 w-full lg:w-fit overflow-x-auto no-scrollbar">
                    {[
                        { id: 'all', label: 'Todos' },
                        { id: 'true', label: 'Activos' },
                        { id: 'false', label: 'Inactivos' }
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setFilterStatus(t.id as any)}
                            className={`flex-1 lg:flex-none whitespace-nowrap px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${filterStatus === t.id
                                ? 'bg-white text-[#1D1D1F] shadow-md border border-gray-100'
                                : 'text-gray-400 hover:text-gray-600'
                                }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <AdminTable
                columns={columns}
                data={subscribers}
                loading={loading}
                emptyMessage="No se encontraron suscriptores activos."
                renderMobileCard={(s) => (
                    <div className="space-y-4">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-blue-50/50 flex items-center justify-center text-blue-500 border border-blue-100 shadow-inner flex-shrink-0">
                                    <Mail size={20} strokeWidth={2.5} />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-black text-[#1D1D1F] truncate pr-2">{s.email}</h3>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                                        {format(new Date(s.createdAt), 'd MMM, yyyy')}
                                    </p>
                                </div>
                            </div>
                            <AdminActionMenu
                                actions={[
                                    { label: s.isActive ? 'Desactivar' : 'Activar', icon: s.isActive ? <UserX size={16} /> : <UserCheck size={16} />, onClick: () => handleToggleStatus(s) },
                                    { label: 'Eliminar', icon: <XCircle size={16} />, variant: 'danger', onClick: () => handleDelete(s.id) },
                                ]}
                            />
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                            <div className="flex gap-2">
                                <AdminStatusBadge 
                                    label={s.isActive ? 'Activo' : 'Inactivo'} 
                                    type={s.isActive ? 'success' : 'neutral'}
                                    className="text-[9px]"
                                />
                                {s.consentGranted && (
                                    <div className="flex items-center gap-1 text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
                                        <ShieldCheck size={10} strokeWidth={3} />
                                        <span className="text-[8px] font-black uppercase">RGPD</span>
                                    </div>
                                )}
                            </div>
                            <span className="text-[9px] text-gray-400 font-mono font-bold opacity-60">#{s.id.substring(0,6)}</span>
                        </div>
                    </div>
                )}
            />
        </div>
    )
}

function KPICard({ title, value, icon: Icon, color, subtitle, trend, isEmail }: any) {
    const colors: any = {
        blue: 'bg-blue-50/50 text-blue-500 border-blue-100',
        green: 'bg-emerald-50/50 text-emerald-500 border-emerald-100',
        purple: 'bg-indigo-50/50 text-indigo-500 border-indigo-100',
        orange: 'bg-amber-50/50 text-amber-500 border-amber-100',
    }

    return (
        <AdminCard className="relative overflow-hidden group">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] mb-1">{title}</p>
                    <h3 className={`text-2xl font-black text-[#1D1D1F] tracking-tight ${isEmail ? 'truncate max-w-[140px]' : ''}`}>
                        {value}
                    </h3>
                </div>
                <div className={`p-2.5 rounded-xl border flex items-center justify-center transition-all group-hover:scale-110 ${colors[color] || colors.blue}`}>
                    <Icon size={20} strokeWidth={2.5} />
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{subtitle}</span>
                {trend === 'up' && (
                    <div className="flex items-center gap-1 text-[9px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <UserPlus size={10} />
                        CRECIENDO
                    </div>
                )}
            </div>
        </AdminCard>
    )
}
