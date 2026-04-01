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
    EyeOff
} from 'lucide-react'

import TeamForm from './TeamForm'

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
        // Update order in DB
        try {
            const updates = newOrder.map((m, idx) => ({ id: m.id, order: idx }))
            // We could create a bulk update API or just hit them sequentially
            // For now, let's just update the local state. 
            // Better to have a separate API: /api/team/reorder
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

    const handleFormSubmit = async (formData: any) => {
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
                <Loader2 className="animate-spin text-blue-500" size={40} />
                <p className="text-slate-500 font-medium animate-pulse">Cargando equipo...</p>
            </div>
        )
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header & Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text"
                        placeholder="Buscar por nombre o cargo..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-white border border-slate-100 rounded-2xl pl-12 pr-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:ring-4 focus:ring-blue-50 focus:border-blue-500 transition-all shadow-sm"
                    />
                </div>
                <button 
                    onClick={openCreateModal}
                    className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:shadow-xl hover:shadow-blue-200 transition-all transform hover:-translate-y-0.5 active:scale-95 shadow-lg shadow-blue-100"
                >
                    <Plus size={20} />
                    <span>Añadir Miembro</span>
                </button>
            </div>

            {/* Members Grid / List */}
            {members.length === 0 ? (
                <div className="bg-white border border-dashed border-slate-200 rounded-[2rem] p-16 text-center shadow-sm">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Users size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">No hay equipo registrado</h3>
                    <p className="text-slate-500 mb-8 max-w-xs mx-auto text-sm">Comienza a construir tu equipo ideal hoy mismo.</p>
                    <button onClick={openCreateModal} className="text-blue-600 font-bold hover:underline flex items-center gap-2 mx-auto text-sm">
                        <Plus size={16} /> Añade a tu primer integrante
                    </button>
                </div>
            ) : (
                <Reorder.Group 
                    axis="y" 
                    values={members} 
                    onReorder={handleReorder}
                    className="grid grid-cols-1 gap-4"
                >
                    <AnimatePresence mode='popLayout'>
                        {filteredMembers.map((member) => (
                            <Reorder.Item
                                key={member.id}
                                value={member}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white p-4 md:p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all group cursor-default"
                            >
                                <div className="flex items-center gap-6">
                                    {/* Handle */}
                                    <div className="cursor-grab active:cursor-grabbing p-2 text-slate-200 hover:text-slate-400 transition-colors hidden md:block">
                                        <GripVertical size={24} />
                                    </div>

                                    {/* Member Info */}
                                    <div className="relative">
                                        <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full overflow-hidden border-2 border-white shadow-md group-hover:scale-105 transition-transform duration-300 ${!member.showPhoto ? 'opacity-40 grayscale border-slate-100' : 'border-white'}`}>
                                            {member.photoUrl ? (
                                                <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-slate-100 flex items-center justify-center text-slate-300">
                                                    <User size={32} />
                                                </div>
                                            )}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-7 h-7 rounded-full flex items-center justify-center border-2 border-white shadow-sm transition-all ${
                                            member.showPhoto && member.showName 
                                                ? 'bg-blue-600' 
                                                : 'bg-slate-300'
                                        }`}>
                                            {member.showPhoto && member.showName ? (
                                                <Zap size={12} className="text-white fill-white" />
                                            ) : (
                                                <EyeOff size={12} className="text-white" />
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-1">
                                            <h3 className={`text-lg font-bold transition-all truncate ${
                                                !member.showName 
                                                    ? 'text-slate-300 line-through decoration-slate-200' 
                                                    : 'text-slate-900 group-hover:text-blue-600'
                                            }`}>
                                                {member.name}
                                            </h3>
                                            <div className="flex gap-2">
                                                {member.role && (
                                                    <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-[10px] md:text-xs font-bold text-slate-500 uppercase tracking-wider">
                                                        {member.role}
                                                    </span>
                                                )}
                                                {!member.showPhoto && (
                                                    <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-50 text-[10px] font-black text-slate-300 uppercase tracking-wider border border-slate-100">
                                                        <EyeOff size={10} /> Foto Oculta
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        
                                        <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-medium">
                                            {member.phone && (
                                                <div className="flex items-center gap-1.5 hover:text-emerald-500 transition-colors cursor-pointer">
                                                    <Phone size={14} className="text-emerald-500/60" />
                                                    <span>{member.phone}</span>
                                                </div>
                                            )}
                                            {member.linkedIn && (
                                                <div className="flex items-center gap-1.5 hover:text-blue-600 transition-colors cursor-pointer">
                                                    <Linkedin size={14} className="text-blue-600/60" />
                                                    <span className="truncate max-w-[150px] md:max-w-none">LinkedIn</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-1.5 text-slate-300">
                                                <Briefcase size={14} />
                                                <span className="italic">Orden: {members.indexOf(member) + 1}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-all">
                                        <button 
                                            onClick={() => openEditModal(member)}
                                            className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-blue-50 hover:text-blue-600 transition-all shadow-sm transform hover:scale-105"
                                            title="Editar"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(member.id)}
                                            className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition-all shadow-sm transform hover:scale-105"
                                            title="Eliminar"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Hover Indicator */}
                                <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-blue-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
                            </Reorder.Item>
                        ))}
                    </AnimatePresence>
                </Reorder.Group>
            )}

            {/* Edit/Create Modal Overlay */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 overflow-hidden">
                        {/* Backdrop */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => !isSaving && setIsModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/40 backdrop-blur-md"
                        />
                        
                        {/* Modal Content */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative w-full max-w-4xl bg-white rounded-[2.5rem] shadow-2xl shadow-blue-900/10 flex flex-col max-h-[90vh] border border-white"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between p-6 px-10 border-b border-slate-50">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 shadow-inner">
                                        {editingMember ? <Edit2 size={24} /> : <Plus size={28} />}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-slate-900 leading-none mb-1">
                                            {editingMember ? 'Editar Miembro' : 'Nuevo Miembro'}
                                        </h2>
                                        <p className="text-sm font-medium text-slate-400">Completa los detalles de la "ficha" de equipo.</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => setIsModalOpen(false)}
                                    className="p-3 rounded-2xl hover:bg-slate-50 text-slate-300 hover:text-slate-900 transition-all"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            {/* Modal Body */}
                            <div className="p-6 px-10 overflow-y-auto">
                                <TeamForm 
                                    initialData={editingMember}
                                    onSubmit={handleFormSubmit}
                                    onCancel={() => setIsModalOpen(false)}
                                />
                            </div>
                            
                            {/* Loading Overlay for saving */}
                            {isSaving && (
                                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-[110] flex flex-col items-center justify-center gap-4 rounded-[2.5rem]">
                                    <Loader2 className="animate-spin text-blue-600" size={48} />
                                    <p className="text-blue-900 font-black uppercase tracking-widest text-sm">Guardando Cambios...</p>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}
