'use client'

import { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, Globe, EyeOff, Handshake, ExternalLink, List, Settings } from 'lucide-react'
import StrategicPartnerForm from '@/components/admin/StrategicPartnerForm'
import PartnerSettingsForm from '@/components/admin/PartnerSettingsForm'
import AdminTable from '@/components/admin/AdminTable'
import AdminActionMenu from '@/components/admin/AdminActionMenu'

export default function StrategicPartnersPage() {
    const [partners, setPartners] = useState<any[]>([])
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [isEditing, setIsEditing] = useState(false)
    const [currentPartner, setCurrentPartner] = useState<any>(null)
    const [activeTab, setActiveTab] = useState<'list' | 'settings'>('list')
    const [categoryFilter, setCategoryFilter] = useState<string>('all')

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
                    <div className="h-12 w-24 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0 border border-gray-100 flex items-center justify-center p-2 shadow-sm">
                        {partner.logoUrl ? (
                            <img className="h-full w-full object-contain" src={partner.logoUrl} alt={partner.logoAlt} />
                        ) : (
                            <Handshake size={20} className="text-gray-300" />
                        )}
                    </div>
                    <div>
                        <div className="text-sm font-black text-gray-900 leading-tight">{partner.name}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">{partner.category || 'STRATEGIC'}</div>
                    </div>
                </div>
            )
        },
        {
            header: 'Visibilidad',
            accessor: (partner: any) => (
                <div className="flex gap-2">
                    {partner.showInFooter && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-bold rounded uppercase">Footer</span>}
                    {partner.showInHomepage && <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[9px] font-bold rounded uppercase">Home</span>}
                    {partner.isFeatured && <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded uppercase">Destacado</span>}
                </div>
            )
        },
        {
            header: 'Estado',
            accessor: (partner: any) => (
                partner.isActive ? (
                    <span className="flex items-center text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                        Activo
                    </span>
                ) : (
                    <span className="flex items-center text-gray-300 text-[10px] font-black uppercase tracking-widest">
                        <span className="w-2 h-2 rounded-full bg-gray-200 mr-2" />
                        Inactivo
                    </span>
                )
            )
        },
        {
            header: '',
            className: 'text-right',
            accessor: (partner: any) => (
                <AdminActionMenu
                    actions={[
                        { label: partner.isActive ? 'Desactivar' : 'Activar', icon: partner.isActive ? EyeOff : Globe, onClick: () => handleToggleStatus(partner) },
                        { label: 'Editar Partner', icon: Edit, onClick: () => handleEdit(partner) },
                        { label: partner.websiteUrl ? 'Ver Web' : '', icon: ExternalLink, onClick: () => partner.websiteUrl && window.open(partner.websiteUrl, '_blank') },
                        { label: 'Eliminar', icon: Trash2, variant: 'danger', onClick: () => handleDelete(partner.id) },
                    ].filter(a => a.label !== '')}
                />
            )
        }
    ]

    return (
        <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
                <div className="space-y-1">
                    <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Partners Estratégicos</h1>
                    <p className="text-gray-400 mt-1 font-medium max-w-xl">Gestión de alianzas tecnológicas y corporativas para el ecosistema IA.</p>
                </div>
                {!isEditing && (
                    <div className="flex gap-3">
                        <button
                            onClick={() => setActiveTab(activeTab === 'list' ? 'settings' : 'list')}
                            className="flex items-center justify-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-2xl hover:bg-gray-50 transition-all font-semibold shadow-sm"
                        >
                            {activeTab === 'list' ? <Settings size={20} className="mr-2" /> : <List size={20} className="mr-2" />}
                            {activeTab === 'list' ? 'Ajustes' : 'Volver al Listado'}
                        </button>
                        <button
                            onClick={handleCreate}
                            className="flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 transition-all font-semibold shadow-[0_8px_20px_rgba(79,70,229,0.2)] whitespace-nowrap"
                        >
                            <Plus size={20} className="mr-2" />
                            Nuevo Partner
                        </button>
                    </div>
                )}
            </header>

            {!isEditing && activeTab === 'list' && (
                <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                    <List size={18} className="text-gray-400" />
                    <span className="text-sm font-bold text-gray-700">Filtrar por Categoría:</span>
                    <select 
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="bg-gray-50 border-gray-200 border rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-indigo-500 font-medium"
                    >
                        <option value="all">Todas las categorías</option>
                        <option value="Partners">Partners Estratégicos</option>
                        <option value="AI">Inteligencia Artificial</option>
                        <option value="Cloud">Cloud</option>
                        <option value="Infrastructure">Infraestructura</option>
                        <option value="Strategic">Estratégicos (Otros)</option>
                    </select>
                    <div className="ml-auto text-[10px] font-black text-gray-300 uppercase tracking-widest">
                        {filteredPartners.length} registros encontrados
                    </div>
                </div>
            )}

            {isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                    <StrategicPartnerForm
                        initialData={currentPartner}
                        onSubmit={handleSubmitPartner}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : activeTab === 'settings' ? (
                <div className="animate-in fade-in slide-in-from-bottom-6 duration-500">
                    {settings && (
                        <PartnerSettingsForm
                            initialData={settings}
                            onSubmit={handleSubmitSettings}
                        />
                    )}
                </div>
            ) : (
                <AdminTable
                    columns={columns}
                    data={filteredPartners}
                    loading={loading}
                    emptyMessage="No hay partners estratégicos registrados."
                    renderMobileCard={(partner) => (
                        <div className="space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-12 w-20 bg-white rounded-xl border border-gray-100 flex items-center justify-center p-2 shadow-sm shrink-0">
                                        {partner.logoUrl ? <img src={partner.logoUrl} className="h-full w-full object-contain" alt="" /> : <Handshake size={20} className="text-gray-300" />}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[#1D1D1F] leading-tight">{partner.name}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold uppercase mt-0.5">{partner.category}</p>
                                    </div>
                                </div>
                                <AdminActionMenu
                                    actions={[
                                        { label: partner.isActive ? 'Desactivar' : 'Activar', icon: partner.isActive ? EyeOff : Globe, onClick: () => handleToggleStatus(partner) },
                                        { label: 'Editar', icon: Edit, onClick: () => handleEdit(partner) },
                                        { label: 'Eliminar', icon: Trash2, variant: 'danger', onClick: () => handleDelete(partner.id) },
                                    ]}
                                />
                            </div>
                            <div className="flex gap-2">
                                {partner.showInFooter && <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[9px] font-bold rounded">Footer</span>}
                                {partner.isActive ? (
                                    <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded">Activo</span>
                                ) : (
                                    <span className="px-2 py-0.5 bg-gray-50 text-gray-400 text-[9px] font-bold rounded">Inactivo</span>
                                )}
                            </div>
                        </div>
                    )}
                />
            )}
        </div>
    )
}
