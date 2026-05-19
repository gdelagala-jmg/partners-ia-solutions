'use client'

import { useState, useEffect } from 'react'
import { FileArchive, Loader2, CheckCircle2, AlertCircle, HelpCircle, Calendar } from 'lucide-react'
import AdminCard from '@/components/admin/ui/AdminCard'

export default function VisualArchiveSettingsCard() {
    const [enabled, setEnabled] = useState(true)
    const [preset, setPreset] = useState<'30' | '60' | '90' | 'custom'>('60')
    const [customDays, setCustomDays] = useState('60')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const [modeRes, thresholdRes] = await Promise.all([
                    fetch('/api/settings?key=visual_archive_mode'),
                    fetch('/api/settings?key=visual_archive_threshold_days')
                ])

                if (modeRes.ok) {
                    const modeData = await modeRes.json()
                    // Si no está definido en BD, por defecto es true (activo)
                    setEnabled(modeData.value !== 'false')
                }

                if (thresholdRes.ok) {
                    const thresholdData = await thresholdRes.json()
                    const days = thresholdData.value || '60'
                    if (days === '30' || days === '60' || days === '90') {
                        setPreset(days as '30' | '60' | '90')
                    } else {
                        setPreset('custom')
                        setCustomDays(days)
                    }
                }
            } catch (error) {
                console.error('Error al cargar la configuración del archivo visual:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchSettings()
    }, [])

    const saveSettings = async (newEnabled: boolean, newThreshold: string) => {
        setSaving(true)
        setStatus('idle')
        try {
            const [res1, res2] = await Promise.all([
                fetch('/api/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: 'visual_archive_mode', value: newEnabled.toString() })
                }),
                fetch('/api/settings', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ key: 'visual_archive_threshold_days', value: newThreshold })
                })
            ])

            if (res1.ok && res2.ok) {
                setStatus('success')
                setTimeout(() => setStatus('idle'), 3000)
            } else {
                setStatus('error')
            }
        } catch (error) {
            console.error('Error al guardar configuración:', error)
            setStatus('error')
        } finally {
            setSaving(false)
        }
    }

    const handleToggle = async (checked: boolean) => {
        setEnabled(checked)
        const currentThreshold = preset === 'custom' ? customDays : preset
        await saveSettings(checked, currentThreshold)
    }

    const handlePresetChange = async (value: '30' | '60' | '90' | 'custom') => {
        setPreset(value)
        if (value !== 'custom') {
            await saveSettings(enabled, value)
        }
    }

    const handleCustomSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const days = parseInt(customDays)
        if (isNaN(days) || days <= 0) {
            alert('Por favor introduce un número de días válido mayor que 0.')
            return
        }
        await saveSettings(enabled, customDays)
    }

    if (loading) {
        return (
            <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex items-center justify-center min-h-[140px]">
                <Loader2 className="animate-spin text-blue-500 mr-2" size={20} />
                <span className="text-sm font-semibold text-gray-500">Cargando configuración...</span>
            </div>
        )
    }

    return (
        <AdminCard 
            glass 
            title="Modo Archivo Visual de Noticias" 
            icon={<FileArchive size={18} />}
            description="Controla la separación visual automática de las noticias antiguas en el portal."
        >
            <div className="space-y-6">
                {/* Switch Principal */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-gray-50/50 rounded-2xl border border-gray-100 transition-all">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-gray-900">Activar Modo Archivo</h4>
                            {saving && <Loader2 className="animate-spin text-blue-500 shrink-0" size={14} />}
                            {status === 'success' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-green-600 bg-green-50 px-2 py-0.5 rounded-lg border border-green-200 uppercase tracking-wider animate-in fade-in duration-300">
                                    <CheckCircle2 size={10} /> Guardado
                                </span>
                            )}
                            {status === 'error' && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-black text-red-600 bg-red-50 px-2 py-0.5 rounded-lg border border-red-200 uppercase tracking-wider animate-in fade-in duration-300">
                                    <AlertCircle size={10} /> Error
                                </span>
                            )}
                        </div>
                        <p className="text-[11px] text-gray-500 leading-relaxed max-w-xl">
                            Oculta imágenes en noticias antiguas y las mueve al bloque Archivo de forma automática. Las imágenes del servidor permanecen intactas.
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                        <input 
                            type="checkbox" 
                            className="sr-only peer"
                            checked={enabled}
                            onChange={(e) => handleToggle(e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>

                {/* Selección de Umbral (Sólo si está activo) */}
                {enabled && (
                    <div className="space-y-4 p-5 bg-white border border-gray-100 rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300">
                        <div className="flex items-center gap-1.5 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                            <Calendar size={14} className="text-gray-400 shrink-0" />
                            Umbral de días para considerar noticia como "antigua"
                        </div>

                        {/* Botones de Rango Premium (Segmented Control) */}
                        <div className="grid grid-cols-4 p-1 bg-gray-100 rounded-xl gap-1 max-w-md">
                            {(['30', '60', '90', 'custom'] as const).map((opt) => (
                                <button
                                    key={opt}
                                    type="button"
                                    onClick={() => handlePresetChange(opt)}
                                    className={`py-2 text-xs font-bold rounded-lg transition-all ${
                                        preset === opt
                                            ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50'
                                            : 'text-gray-500 hover:text-gray-900'
                                    }`}
                                >
                                    {opt === 'custom' ? 'Personalizado' : `${opt} días`}
                                </button>
                            ))}
                        </div>

                        {/* Input Personalizado */}
                        {preset === 'custom' && (
                            <form onSubmit={handleCustomSubmit} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 max-w-md animate-in fade-in slide-in-from-top-1 duration-200">
                                <div className="flex-1 relative">
                                    <input 
                                        type="number"
                                        min="1"
                                        value={customDays}
                                        onChange={(e) => setCustomDays(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900"
                                        placeholder="Ej. 45"
                                    />
                                    <span className="absolute right-4 top-2.5 text-xs font-bold text-gray-400">Días</span>
                                </div>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2.5 bg-[#1D1D1F] hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition-all whitespace-nowrap disabled:opacity-50 flex items-center justify-center gap-1.5"
                                >
                                    {saving && <Loader2 size={12} className="animate-spin" />}
                                    Guardar
                                </button>
                            </form>
                        )}
                        <p className="text-[10px] text-gray-400 font-medium italic">
                            {preset === 'custom' 
                                ? `Las noticias con más de ${customDays || '0'} días ocultarán su portada en el listado público.` 
                                : `Las noticias publicadas hace más de ${preset} días pasarán automáticamente al Archivo.`}
                        </p>
                    </div>
                )}
            </div>
        </AdminCard>
    )
}
