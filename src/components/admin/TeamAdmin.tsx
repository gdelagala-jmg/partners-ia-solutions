'use client'

import { useState, useEffect } from 'react'
import { motion, Reorder, AnimatePresence } from 'framer-motion'
import { 
    Users, 
    Plus, 
    Edit2, 
    Trash2, 
    GripVertical, 
    Search,
    Linkedin,
    Phone,
    Briefcase,
    Zap,
    Loader2,
    X,
    Maximize2,
    User,
    Eye,
    EyeOff,
    MoreHorizontal
} from 'lucide-react'

import TeamForm, { TeamMemberValues } from './TeamForm'
import AdminToolbar from './ui/AdminToolbar'
import AdminCard from './ui/AdminCard'
import AdminStatusBadge from './ui/AdminStatusBadge'
import AdminActionMenu from './ui/AdminActionMenu'
import { cn } from '@/lib/utils'

interface TeamMember {
    id: string
    name: string
    phone?: string | null
    photoUrl?: string | null
    linkedIn?: string | null
    role?: string | null
    bio?: string | null
    showPhoto: boolean
    showName: boolean
    customFields: string
    order: number
}


export default function TeamAdmin() {
    const [members, setMembers] = useState<TeamMember[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState('')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingMember, setEditingMember] = useState<TeamMember | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    // Fetch members
    const fetchMembers = async () => {
        try {
            const res = await fetch('/api/team')
            const data = await res.json()
            if (Array.isArray(data)) {
                setMembers(data)
            }
        } catch (error) {
            console.error('Error fetching team members:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchMembers()
    }, [])

    // Handle reorder
    const handleReorder = async (newOrder: TeamMember[]) => {
        setMembers(newOrder)
        try {
            const updates = newOrder.map((m, idx) => ({ id: m.id, order: idx }))
            await fetch('/api/team/reorder', {
                method: 'PUT',
                body: JSON.stringify({ updates }),
                headers: { 'Content-Type': 'application/json' }
            })
        } catch (error) {
            console.error('Error reordering members:', error)
        }
    }

    // CRUD operations
    const openCreateModal = () => {
        setEditingMember(null)
        setIsModalOpen(true)
    }

    const openEditModal = (member: TeamMember) => {
        setEditingMember(member)
        setIsModalOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (!confirm('¿Estás seguro de que quieres eliminar a este miembro del equipo?')) return
        try {
            const res = await fetch(`/api/team/${id}`, { method: 'DELETE' })
            if (res.ok) {
                setMembers(members.filter(m => m.id !== id))
            }
        } catch (error) {
            alert('Error al eliminar')
        }
    }

    const handleFormSubmit = async (formData: TeamMemberValues) => {
        setIsSaving(true)
        try {
            const method = editingMember ? 'PUT' : 'POST'
            const url = editingMember ? `/api/team/${editingMember.id}` : '/api/team'
            
            const res = await fetch(url, {
                method,
                body: JSON.stringify(formData),
                headers: { 'Content-Type': 'application/json' }
            })

            if (res.ok) {
                await fetchMembers()
                setIsModalOpen(false)
            } else {
                const data = await res.json()
                alert(data.error || 'Error al guardar')
            }
        } catch (error) {
            alert('Error de conexión')
        } finally {
            setIsSaving(false)
        }
    }

    const filteredMembers = members.filter(m => 
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.role?.toLowerCase().includes(searchQuery.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="animate-spin text-[#1D1D1F]" size={32} />
                <p className="text-gray-400 font-medium">Cargando equipo...</p>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <AdminToolbar 
                title="Gestión de Equipo"
                description="Administra los perfiles de los profesionales que forman parte de la red."
                icon={Users}
                actions={
                    <button
                        onClick={openCreateModal}
                        className="w-full sm:w-auto px-5 py-2.5 text-[11px] uppercase tracking-widest font-black text-white bg-[#1D1D1F] hover:bg-black rounded-xl shadow-lg shadow-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={16} />
                        <span>Añadir Miembro</span>
                    </button>
                }
            />

            {/* Search Bar */}
            <div className="relative group max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#1D1D1F] transition-colors" size={18} />
                <input 
                    type="text"
                    placeholder="Buscar por nombre o cargo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white border border-gray-100 rounded-2xl pl-12 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-100 transition-all shadow-sm"
                />
            </div>

            {/* Members List */}
            {members.length === 0 ? (
                <AdminCard className="py-20 text-center border-dashed border-2">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users size={32} className="text-gray-200" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No hay equipo registrado</h3>
                    <p className="text-gray-500 mb-8 max-w-xs mx-auto text-sm">Comienza a construir tu equipo ideal hoy mismo.</p>
                    <button onClick={openCreateModal} className="text-[#1D1D1F] font-bold hover:underline flex items-center gap-2 mx-auto text-sm">
                        <Plus size={16} /> Añade a tu primer integrante
                    </button>
                </AdminCard>
            ) : (
                <Reorder.Group 
                    axis="y" 
                    values={members} 
                    onReorder={handleReorder}
                    className="space-y-4"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredMembers.map((member) => {
                            const actions = [
                                {
                                    label: 'Editar',
                                    onClick: () => openEditModal(member),
                                    icon: <Edit2 size={14} />
                                },
                                {
                                    label: 'Eliminar',
                                    onClick: () => handleDelete(member.id),
                                    icon: <Trash2 size={14} />,
                                    variant: 'danger' as const
                                }
                            ]

                            return (
                                <Reorder.Item
                                    key={member.id}
                                    value={member}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    className="relative"
                                >
                                    <AdminCard noPadding className="group">
                                        <div className="flex items-center gap-4 md:gap-6 p-4 md:p-5">
                                            {/* Handle */}
                                            <div className="cursor-grab active:cursor-grabbing p-1 text-gray-200 hover:text-gray-400 transition-colors hidden sm:block">
                                                <GripVertical size={20} />
                                            </div>

                                            {/* Avatar */}
                                            <div className="relative shrink-0">
                                                <div className={cn(
                                                    "w-12 h-12 md:w-16 md:h-16 rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-transform duration-300 group-hover:scale-105",
                                                    !member.showPhoto && "opacity-40 grayscale"
                                                )}>
                                                    {member.photoUrl ? (
                                                        <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-50 flex items-center justify-center text-gray-300">
                                                            <User size={20} />
                                                        </div>
                                                    )}
                                                </div>
                                                {!member.showPhoto && (
                                                    <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                                                        <EyeOff size={10} className="text-gray-400" />
                                                    </div>
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 mb-1">
                                                    <h3 className={cn(
                                                        "text-[15px] md:text-lg font-bold transition-all truncate pr-2",
                                                        !member.showName ? "text-gray-300 line-through" : "text-[#1D1D1F]"
                                                    )}>
                                                        {member.name}
                                                    </h3>
                                                    <div className="flex gap-2">
                                                        {member.role && (
                                                            <AdminStatusBadge 
                                                                label={member.role} 
                                                                type="default" 
                                                                dot={false}
                                                                className="uppercase tracking-widest text-[8px] md:text-[9px] px-2"
                                                            />
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] md:text-xs text-gray-500 font-medium">
                                                    {member.phone && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Phone size={10} className="text-emerald-500/60" />
                                                            {member.phone}
                                                        </span>
                                                    )}
                                                    {member.linkedIn && (
                                                        <span className="flex items-center gap-1.5">
                                                            <Linkedin size={10} className="text-blue-600/60" />
                                                            LinkedIn
                                                        </span>
                                                    )}
                                                    <span className="flex items-center gap-1.5 opacity-40 hidden sm:flex">
                                                        <Briefcase size={10} />
                                                        Pos: {members.indexOf(member) + 1}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex items-center gap-2">
                                                <div className="hidden md:flex items-center gap-1">
                                                    <button 
                                                        onClick={() => openEditModal(member)}
                                                        className="p-2.5 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-[#1D1D1F] transition-all"
                                                    >
                                                        <Edit2 size={16} />
                                                    </button>
                                                </div>
                                                <AdminActionMenu actions={actions} />
                                            </div>
                                        </div>
                                    </AdminCard>
                                </Reorder.Item>
                            )
                        })}
                    </AnimatePresence>
                </Reorder.Group>
            )}

            {/* Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSaving && setIsModalOpen(false)}
                            className="absolute inset-0 bg-[#1D1D1F]/40 backdrop-blur-sm"
                        />
                        
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl bg-white rounded-[2rem] shadow-2xl flex flex-col max-h-[90vh] border border-white"
                        >
                            <div className="flex items-center justify-between p-6 px-8 border-b border-gray-50">
                                <div>
                                    <h2 className="text-xl font-bold text-[#1D1D1F]">
                                        {editingMember ? 'Editar Miembro' : 'Nuevo Miembro'}
                                    </h2>
                                    <p className="text-xs text-gray-400 mt-0.5 font-medium">Completa los detalles del profesional.</p>
                                </div>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-2 rounded-xl hover:bg-gray-50 text-gray-400 hover:text-gray-900 transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 px-8 overflow-y-auto">
                                <TeamForm 
                                    initialData={editingMember}
                                    onSubmit={handleFormSubmit}
                                    onCancel={() => setIsModalOpen(false)}
                                />
                            </div>
                            
                            {isSaving && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-[110] flex flex-col items-center justify-center gap-4 rounded-[2rem]">
                                    <Loader2 className="animate-spin text-[#1D1D1F]" size={40} />
                                    <p className="text-[#1D1D1F] font-bold text-sm">Guardando...</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

