'use client'

import { useState, useEffect } from 'react'
import { Home, Plus, Search, Filter, MoreHorizontal, Eye, EyeOff, Edit2, Trash2, MapPin, Euro, Tag, Zap, CreditCard, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminTable from '@/components/admin/AdminTable'
import AdminActionMenu from '@/components/admin/AdminActionMenu'
import PropertyForm from '@/components/admin/PropertyForm'

export default function PropertiesPage() {
  const [properties, setProperties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filter, setFilter] = useState('ALL')
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingProperty, setEditingProperty] = useState<any>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  useEffect(() => {
    fetchProperties()
  }, [])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const fetchProperties = async () => {
    try {
      const res = await fetch('/api/properties')
      if (res.ok) {
        const data = await res.json()
        setProperties(data)
      }
    } catch (error) {
      console.error('Failed to fetch properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: any) => {
    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setIsFormOpen(false)
        fetchProperties()
        showMessage('success', 'Propiedad creada correctamente')
      }
    } catch (error) {
      showMessage('error', 'Error al crear la propiedad')
    }
  }

  const handleUpdate = async (data: any) => {
    try {
      const res = await fetch(`/api/properties/${editingProperty.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setEditingProperty(null)
        setIsFormOpen(false)
        fetchProperties()
        showMessage('success', 'Propiedad actualizada')
      }
    } catch (error) {
      showMessage('error', 'Error al actualizar')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Escoger eliminar esta propiedad?')) return
    try {
      const res = await fetch(`/api/properties/${id}`, { method: 'DELETE' })
      if (res.ok) fetchProperties()
    } catch (error) {
      console.error('Failed to delete property:', error)
    }
  }

  const toggleVisibility = async (id: string, currentVisible: boolean) => {
    try {
      const res = await fetch(`/api/properties/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ visible: !currentVisible })
      })
      if (res.ok) {
        setProperties(properties.map(p => p.id === id ? { ...p, visible: !currentVisible } : p))
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error)
    }
  }

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.address.toLowerCase().includes(searchTerm.toLowerCase()) || p.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filter === 'ALL' || p.category === filter
    return matchesSearch && matchesFilter
  })

  const columns = [
    {
      header: 'Propiedad',
      accessor: (row: any) => (
        <div className="flex items-center gap-4">
          <div className="w-16 h-12 rounded-xl border border-gray-100 overflow-hidden bg-gray-50 flex-shrink-0 relative">
            <img src={row.thumb || '/placeholder-property.jpg'} alt="" className="w-full h-full object-cover" />
            {!row.visible && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center">
                <EyeOff size={14} className="text-gray-400" />
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className={`font-bold tracking-tight text-[15px] ${row.visible ? 'text-gray-900' : 'text-gray-400'}`}>
              {row.address}
            </span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100">
                {row.type}
              </span>
              {row.featured && (
                <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider text-amber-500 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-100">
                  <Zap size={10} fill="currentColor" /> Destacado
                </span>
              )}
            </div>
          </div>
        </div>
      )
    },
    {
      header: 'Categoría',
      accessor: 'category',
      render: (val: string) => (
        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
          val === 'VENTA' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-green-50 text-green-600 border-green-100'
        }`}>
          {val}
        </span>
      )
    },
    {
      header: 'Precio',
      accessor: 'price',
      render: (val: number) => (
        <div className="flex items-center gap-1.5 font-mono text-sm font-bold text-gray-900">
          <Euro size={14} className="text-gray-400" />
          {val.toLocaleString('es-ES')}
        </div>
      )
    },
    {
      header: 'Acciones',
      className: 'text-right',
      accessor: (row: any) => (
        <AdminActionMenu
          actions={[
            {
              label: row.visible ? 'Ocultar' : 'Mostrar',
              icon: row.visible ? EyeOff : Eye,
              onClick: () => toggleVisibility(row.id, row.visible)
            },
            {
              label: 'Editar',
              icon: Edit2,
              onClick: () => {
                setEditingProperty(row)
                setIsFormOpen(true)
              }
            },
            {
              label: 'Promoción Stripe',
              icon: CreditCard,
              onClick: () => console.log('Promote', row.id),
              variant: 'default'
            },
            {
              label: 'Eliminar',
              icon: Trash2,
              onClick: () => handleDelete(row.id),
              variant: 'danger'
            }
          ]}
        />
      )
    }
  ]

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-white shadow-2xl shadow-gray-200 rounded-2xl flex items-center justify-center border border-gray-100">
            <Home size={26} className="text-black" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Cartera de Inmuebles</h1>
            <p className="text-gray-500 font-medium font-inter">Control de inventario inteligente para InmoIA360</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
            <input
              type="text"
              placeholder="Buscar propiedad..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="h-12 pl-11 pr-6 bg-white border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all text-sm font-medium shadow-sm w-64"
            />
          </div>
          
          <button 
            onClick={() => {
              setEditingProperty(null)
              setIsFormOpen(true)
            }}
            className="bg-black h-12 px-8 rounded-2xl flex items-center gap-2 hover:bg-gray-800 transition-all font-bold text-white shadow-xl shadow-gray-200"
          >
            <Plus size={20} />
            <span>Nueva Propiedad</span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="px-4"
          >
            <PropertyForm
              initialData={editingProperty}
              onSubmit={editingProperty ? handleUpdate : handleCreate}
              onCancel={() => {
                setIsFormOpen(false)
                setEditingProperty(null)
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters Bar */}
      <div className="flex items-center gap-2 px-4">
        {['ALL', 'VENTA', 'ALQUILER'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              filter === cat ? 'bg-black text-white shadow-lg' : 'bg-white text-gray-400 hover:text-black border border-gray-100'
            }`}
          >
            {cat === 'ALL' ? 'Todos' : cat}
          </button>
        ))}
      </div>

      <main className="px-4">
        <div className="bg-white/60 backdrop-blur-xl border border-white rounded-[2.5rem] shadow-2xl shadow-gray-200/50 overflow-hidden">
          <AdminTable
            data={filteredProperties}
            columns={columns as any}
            loading={loading}
          />
        </div>
      </main>
    </div>
  )
}
