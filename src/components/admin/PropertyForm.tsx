'use client'

import { useState } from 'react'
import { Home, Euro, MapPin, Image as ImageIcon, Box, Eye, Zap, X } from 'lucide-react'
import { motion } from 'framer-motion'

interface PropertyFormProps {
  initialData?: any
  onSubmit: (data: any) => void
  onCancel: () => void
}

export default function PropertyForm({ initialData, onSubmit, onCancel }: PropertyFormProps) {
  const [formData, setFormData] = useState({
    address: initialData?.address || '',
    price: initialData?.price || '',
    category: initialData?.category || 'VENTA',
    type: initialData?.type || 'PISO',
    thumb: initialData?.thumb || '',
    matterportUrl: initialData?.matterportUrl || '',
    description: initialData?.description || '',
    visible: initialData?.visible ?? true,
    featured: initialData?.featured || false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] p-8 shadow-2xl shadow-gray-200/50 space-y-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center text-white">
            <Home size={20} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {initialData ? 'Editar Propiedad' : 'Nueva Propiedad'}
          </h2>
        </div>
        <button type="button" onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <X size={24} className="text-gray-400" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Basic Info */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Dirección Completa</label>
            <div className="relative group">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
              <input
                required
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full h-14 pl-12 pr-6 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-bold text-gray-900"
                placeholder="Ej: Calle Mayor 10, Getxo"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Precio</label>
              <div className="relative group">
                <Euro className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
                <input
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full h-14 pl-12 pr-6 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-bold text-gray-900"
                  placeholder="0.00"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Tipo</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full h-14 px-6 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-bold text-gray-900 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%236B7280%22%20stroke-width%3D%221.67%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px_20px] bg-[right_1rem_center] bg-no-repeat"
              >
                <option value="PISO">PISO</option>
                <option value="CHALET">CHALET</option>
                <option value="LOCAL">LOCAL</option>
                <option value="OFICINA">OFICINA</option>
                <option value="GARAJE">GARAJE</option>
              </select>
            </div>
          </div>
        </div>

        {/* Multimedia & Status */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">URL Imagen (Thumb)</label>
            <div className="relative group">
              <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
              <input
                type="text"
                value={formData.thumb}
                onChange={(e) => setFormData({ ...formData, thumb: e.target.value })}
                className="w-full h-14 pl-12 pr-6 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-bold text-gray-900"
                placeholder="https://..."
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Matterport (Tour 3D)</label>
            <div className="relative group">
              <Box className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-black transition-colors" size={18} />
              <input
                type="text"
                value={formData.matterportUrl}
                onChange={(e) => setFormData({ ...formData, matterportUrl: e.target.value })}
                className="w-full h-14 pl-12 pr-6 bg-gray-50/50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-gray-100 transition-all font-bold text-gray-900"
                placeholder="https://my.matterport.com/show/..."
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
        <div className="flex gap-6">
           <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, visible: !formData.visible })}
                className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${formData.visible ? 'bg-green-500 shadow-lg shadow-green-100' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.visible ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-900">Visible</span>
                <span className="text-[10px] text-gray-400 font-medium">Activar en el portal</span>
              </div>
           </div>

           <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                className={`w-12 h-6 rounded-full transition-all flex items-center px-1 ${formData.featured ? 'bg-amber-400 shadow-lg shadow-amber-100' : 'bg-gray-200'}`}
              >
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.featured ? 'translate-x-6' : 'translate-x-0'}`} />
              </button>
              <div className="flex flex-col">
                <span className="text-[11px] font-black uppercase tracking-wider text-gray-900">Destacada</span>
                <span className="text-[10px] text-gray-400 font-medium">Posicionar al inicio</span>
              </div>
           </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="h-14 px-8 rounded-2xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="h-14 px-12 bg-black text-white rounded-2xl font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-200 active:scale-95"
          >
            {initialData ? 'Guardar Cambios' : 'Crear Propiedad'}
          </button>
        </div>
      </div>
    </form>
  )
}
