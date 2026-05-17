'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Globe, EyeOff, Handshake, ExternalLink, List, Settings } from 'lucide-react'
import StrategicPartnerForm from '@/components/admin/StrategicPartnerForm'
import PartnerSettingsForm from '@/components/admin/PartnerSettingsForm'
import AdminTable from '@/components/admin/ui/AdminTable'
import AdminActionMenu from '@/components/admin/ui/AdminActionMenu'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import AdminFilterBar from '@/components/admin/ui/AdminFilterBar'
import AdminStatusBadge from '@/components/admin/ui/AdminStatusBadge'

const CATEGORIES = [
    { id: 'all', label: 'Todos' },
    { id: 'Partners', label: 'Estratégicos' },
    { id: 'AI', label: 'IA Solutions' },
    { id: 'Cloud', label: 'Cloud' },
    { id: 'Infrastructure', label: 'Infraestructura' },
    { id: 'Strategic', label: 'Otros' }
] as const

type CategoryType = typeof CATEGORIES[number]['id']

export default function StrategicPartnersPage() {
    const [partners, setPartners] = useState<any[]>([])
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentPartner, setCurrentPartner] = useState<any>(null)
    const [activeTab, setActiveTab] = useState<'list' | 'settings'>('list')
    const [categoryFilter, setCategoryFilter] = useState<CategoryType>('all')

    const filteredPartners = partners.filter(p => 
        categoryFilter === 'all' ? true : p.category === categoryFilter
    )

    const fetchData = async () => {
        setLoading(true)
        try {
            const [partnersRes, settingsRes] = await Promise.all([
                fetch('/api/strategic-partners'),
                fetch('/api/strategic-partners/settings')
            ])
            
            if (partnersRes.ok) {
                const data = await partnersRes.json()
                setPartners(Array.isArray(data) ? data : [])
            }
            
            if (settingsRes.ok) {
                const data = await settingsRes.json()
                setSettings(data)
            }
        } catch (error) {
            console.error('Error fetching data:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
    }, [])

    const handleCreate = () => {
        setCurrentPartner(null)
        setIsEditing(true)
    }

    const handleEdit = (partner: any) => {
        setCurrentPartner(partner)
        setIsEditing(true)
    }

    const handleToggleStatus = async (partner: any) => {
        try {
            const res = await fetch(`/api/strategic-partners/${partner.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...partner, isActive: !partner.isActive }),
            })
            if (res.ok) fetchData()
        } catch (error) {
            console.error('Error toggling status:', error)
        }
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar este partner?')) return
        try {
            await fetch(`/api/strategic-partners/${id}`, { method: 'DELETE' })
            fetchData()
        } catch (error) {
            console.error('Error deleting partner:', error)
        }
    }

    const handleSubmitPartner = async (data: any) => {
        try {
            const url = currentPartner ? `/api/strategic-partners/${currentPartner.id}` : '/api/strategic-partners'
            const method = currentPartner ? 'PUT' : 'POST'
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (res.ok) {
                setIsEditing(false)
                fetchData()
            }
        } catch (error) {
            console.error('Error saving partner:', error)
        }
    }

    const handleSubmitSettings = async (data: any) => {
        try {
            const res = await fetch('/api/strategic-partners/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })
            if (res.ok) {
                const updatedSettings = await res.json()
                setSettings(updatedSettings)
                alert('Configuración guardada correctamente')
            }
        } catch (error) {
            console.error('Error saving settings:', error)
        }
    }

    const columns = [
        {
            header: 'Partner / Logo',
            accessor: (partner: any) => (
                <div className="flex items-center gap-4">
                    <div className="h-12 w-24 rounded-xl bg-gray-50/50 overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center p-2 shadow-inner">
                        {partner.logoUrl ? (
                            <img className="h-full w-full object-contain" src={partner.logoUrl} alt={partner.logoAlt} />
                        ) : (
                            <Handshake size={20} className="text-gray-300" />
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-black text-[#1D1D1F] leading-tight">{partner.name}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{partner.category || 'STRATEGIC'}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Visibilidad',
            className: 'hidden lg:table-cell',
            accessor: (partner: any) => (
                <div className="flex flex-wrap gap-1.5">
                    {partner.showInFooter && <AdminStatusBadge label="Footer" type="neutral" dot={false} className="text-[9px]" />}
                    {partner.showInHomepage && <AdminStatusBadge label="Home" type="info" dot={false} className="text-[9px]" />}
                    {partner.isFeatured && <AdminStatusBadge label="Top" type="warning" dot={false} className="text-[9px]" />}
                </div>
            )
        },
        {
            header: 'Estado',
            accessor: (partner: any) => (
                <AdminStatusBadge 
                    label={partner.isActive ? 'Activo' : 'Inactivo'} 
                    type={partner.isActive ? 'success' : 'neutral'}
                />
            )
        },
        {
            header: '',
            className: 'text-right',
            accessor: (partner: any) => (
                <AdminActionMenu
                    actions={[
                        { label: partner.isActive ? 'Desactivar' : 'Activar', icon: <EyeOff size={16} />, onClick: () => handleToggleStatus(partner) },
                        { label: 'Editar Partner', icon: <Edit size={16} />, onClick: () => handleEdit(partner) },
                        { label: partner.websiteUrl ? 'Ver Web' : '', icon: <ExternalLink size={16} />, onClick: () => partner.websiteUrl && window.open(partner.websiteUrl, '_blank') },
                        { label: 'Eliminar', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => handleDelete(partner.id) },
                    ].filter(a => a.label !== '')}
                />
            )
        }
    ]

    const filterOptions = CATEGORIES.map(cat => ({
        ...cat,
        count: cat.id === 'all' ? partners.length : partners.filter(p => p.category === cat.id).length
    }))

    return (
        <div className="w-full max-w-full min-w-0 space-y-6">
            <AdminToolbar
                title="Partners Estratégicos"
                description="Gestión de alianzas tecnológicas y corporativas."
                actions={
                    <div className="flex items-center gap-3">
                        {!isEditing && (
                            <>
                                <button
                                    onClick={() => setActiveTab(activeTab === 'list' ? 'settings' : 'list')}
                                    className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-[#1D1D1F] font-bold text-[11px] uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    {activeTab === 'list' ? <Settings size={14} /> : <List size={14} />}
                                    <span>{activeTab === 'list' ? 'Ajustes' : 'Listado'}</span>
                                </button>
                                <button
                                    onClick={handleCreate}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1D1D1F] text-white font-bold text-[11px] uppercase tracking-widest hover:bg-black transition-all shadow-lg shadow-gray-200"
                                >
                                    <Plus size={14} />
                                    <span>Nuevo Partner</span>
                                </button>
                            </>
                        )}
                    </div>
                }
            />

            {isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <StrategicPartnerForm
                        initialData={currentPartner}
                        onSubmit={handleSubmitPartner}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : activeTab === 'settings' ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {settings && (
                        <PartnerSettingsForm
                            initialData={settings}
                            onSubmit={handleSubmitSettings}
                        />
                    )}
                </div>
            ) : (
                <div className="space-y-6">
                    <AdminFilterBar
                        options={filterOptions}
                        activeId={categoryFilter}
                        onChange={(id) => setCategoryFilter(id as CategoryType)}
                    />

                    <AdminTable
                        columns={columns}
                        data={filteredPartners}
                        loading={loading}
                        emptyMessage="No hay partners registrados."
                        renderMobileCard={(partner) => (
                            <div className="space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <div className="h-12 w-20 bg-white rounded-xl border border-gray-100 flex items-center justify-center p-2 shadow-sm shrink-0">
                                            {partner.logoUrl ? (
                                                <img src={partner.logoUrl} className="h-full w-full object-contain" alt="" />
                                            ) : (
                                                <Handshake size={20} className="text-gray-300" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <h3 className="font-bold text-[#1D1D1F] leading-tight truncate">{partner.name}</h3>
                                            <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5 tracking-wider">{partner.category}</p>
                                        </div>
                                    </div>
                                    <AdminActionMenu
                                        actions={[
                                            { label: partner.isActive ? 'Desactivar' : 'Activar', icon: <EyeOff size={16} />, onClick: () => handleToggleStatus(partner) },
                                            { label: 'Editar', icon: <Edit size={16} />, onClick: () => handleEdit(partner) },
                                            { label: 'Eliminar', icon: <Trash2 size={16} />, variant: 'danger', onClick: () => handleDelete(partner.id) },
                                        ]}
                                    />
                                </div>
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100/50">
                                    <AdminStatusBadge 
                                        label={partner.isActive ? 'Activo' : 'Inactivo'} 
                                        type={partner.isActive ? 'success' : 'neutral'}
                                        className="text-[9px]"
                                    />
                                    {partner.showInFooter && <AdminStatusBadge label="Footer" type="neutral" dot={false} className="text-[9px]" />}
                                    {partner.isFeatured && <AdminStatusBadge label="Top Partner" type="warning" dot={false} className="text-[9px]" />}
                                </div>
                            </div>
                        )}
                    />
                </div>
            )}
        </div>
    )
}
