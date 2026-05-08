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
    MoreHorizontal, 
    CheckCircle, 
    XCircle,
    Calendar,
    Globe,
    ShieldCheck
} from 'lucide-react'
import AdminTable from '@/components/admin/AdminTable'
import AdminActionMenu from '@/components/admin/AdminActionMenu'
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
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                        <Mail size={16} />
                    </div>
                    <div className="min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{s.email}</div>
                        <div className="text-[10px] text-gray-400 flex items-center gap-1">
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
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                    s.isActive 
                        ? 'bg-green-50 text-green-600' 
                        : 'bg-red-50 text-red-600'
                }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${s.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                    {s.isActive ? 'Activo' : 'Inactivo'}
                </span>
            )
        },
        {
            header: 'Alta / Consentimiento',
            accessor: (s: any) => (
                <div className="space-y-1">
                    <div className="text-xs text-gray-600 flex items-center gap-1.5">
                        <Calendar size={12} className="text-gray-400" />
                        {format(new Date(s.createdAt), 'd MMM, yyyy', { locale: es })}
                    </div>
                    {s.consentGranted && (
                        <div className="text-[10px] text-green-500 font-bold flex items-center gap-1 uppercase tracking-wider">
                            <ShieldCheck size={10} />
                            RGPD OK
                        </div>
                    )}
                </div>
            )
        },
        {
            header: 'Token',
            accessor: (s: any) => (
                <div className="text-[10px] text-gray-400 font-mono opacity-60">
                    {s.unsubscribeToken.substring(0, 8)}...
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
                            label: s.isActive ? 'Desactivar' : 'Activar', 
                            icon: s.isActive ? UserMinus : UserCheck, 
                            onClick: () => handleToggleStatus(s) 
                        },
                        { 
                            label: 'Eliminar', 
                            icon: XCircle, 
                            variant: 'danger', 
                            onClick: () => handleDelete(s.id) 
                        },
                    ]}
                />
            )
        }
    ]

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 px-4 md:px-0">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Newsletter</h1>
                    <p className="text-gray-400 mt-1 font-medium">Gestión de audiencia y cumplimiento editorial.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleExportCSV}
                        className="flex-1 sm:flex-none flex items-center justify-center px-5 py-2.5 bg-white/60 backdrop-blur-md text-[#1D1D1F] rounded-2xl hover:bg-white/80 transition-all font-semibold border border-white/40 shadow-sm"
                    >
                        <Download size={18} className="mr-2 text-gray-400" />
                        Exportar CSV
                    </button>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <KPICard 
                    title="Total Suscriptores" 
                    value={stats?.total || 0} 
                    icon={Users} 
                    color="blue" 
                    subtitle="Audiencia global"
                />
                <KPICard 
                    title="Activos" 
                    value={stats?.activeCount || 0} 
                    icon={UserCheck} 
                    color="green" 
                    subtitle="Recibiendo correos"
                />
                <KPICard 
                    title="Nuevos (7d)" 
                    value={stats?.last7Days || 0} 
                    icon={UserPlus} 
                    color="purple" 
                    subtitle="Crecimiento semanal"
                    trend={stats?.last7Days > 0 ? 'up' : 'neutral'}
                />
                <KPICard 
                    title="Último Registro" 
                    value={stats?.lastSubscriber?.split('@')[0] || '—'} 
                    icon={Mail} 
                    color="orange" 
                    subtitle={stats?.lastSubscriber || 'Sin datos'}
                    isEmail={true}
                />
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Buscar por email..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-11 pr-4 py-3 bg-white/50 backdrop-blur-sm border border-white/40 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                <div className="flex gap-2 p-1.5 bg-gray-200/40 backdrop-blur-sm rounded-2xl w-fit">
                    {[
                        { id: 'all', label: 'Todos' },
                        { id: 'true', label: 'Activos' },
                        { id: 'false', label: 'Inactivos' }
                    ].map(t => (
                        <button
                            key={t.id}
                            onClick={() => setFilterStatus(t.id as any)}
                            className={`px-5 py-2 text-[11px] font-bold rounded-xl transition-all ${filterStatus === t.id
                                ? 'bg-white text-[#1D1D1F] shadow-sm'
                                : 'text-gray-500 hover:text-gray-900'
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
                emptyMessage="No se encontraron suscriptores con los criterios de búsqueda."
                renderMobileCard={(s) => (
                    <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500 flex-shrink-0">
                                <Mail size={18} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 truncate pr-2 max-w-[180px]">{s.email}</h3>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-tight ${
                                        s.isActive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                                    }`}>
                                        {s.isActive ? 'Activo' : 'Inactivo'}
                                    </span>
                                    <span className="text-[10px] text-gray-400">
                                        {format(new Date(s.createdAt), 'd MMM')}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <AdminActionMenu
                            actions={[
                                { label: s.isActive ? 'Desactivar' : 'Activar', icon: s.isActive ? UserMinus : UserCheck, onClick: () => handleToggleStatus(s) },
                                { label: 'Eliminar', icon: XCircle, variant: 'danger', onClick: () => handleDelete(s.id) },
                            ]}
                        />
                    </div>
                )}
            />
        </div>
    )
}

function KPICard({ title, value, icon: Icon, color, subtitle, trend, isEmail }: any) {
    const colors: any = {
        blue: 'bg-blue-50 text-blue-500',
        green: 'bg-green-50 text-green-500',
        purple: 'bg-purple-50 text-purple-500',
        orange: 'bg-orange-50 text-orange-500',
    }

    return (
        <div className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.02)]">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">{title}</p>
                    <h3 className={`text-2xl font-black mt-2 tracking-tight ${isEmail ? 'truncate max-w-[140px]' : ''}`}>
                        {value}
                    </h3>
                </div>
                <div className={`p-3 rounded-2xl ${colors[color] || colors.blue}`}>
                    <Icon size={22} />
                </div>
            </div>
            <div className="mt-4 flex items-center justify-between">
                <span className="text-xs text-gray-400 font-medium">{subtitle}</span>
                {trend === 'up' && (
                    <span className="flex items-center text-[10px] font-black text-green-500 bg-green-50 px-2 py-0.5 rounded-full">
                        ↑ CRECIENDO
                    </span>
                )}
            </div>
        </div>
    )
}
