'use client'

import { useState, useEffect } from 'react'
import { 
    Settings, 
    Save, 
    Loader2, 
    Bell, 
    Clock, 
    Mail, 
    ShieldCheck,
    CheckCircle2,
    AlertCircle
} from 'lucide-react'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import AdminCard from '@/components/admin/ui/AdminCard'

export default function NewsletterSettingsPage() {
    const [settings, setSettings] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/admin/newsletter/settings')
                if (res.ok) {
                    const data = await res.json()
                    setSettings(data)
                }
            } catch (error) {
                console.error('Error fetching settings:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchSettings()
    }, [])

    const handleSave = async () => {
        setSaving(true)
        setStatus('idle')
        try {
            const res = await fetch('/api/admin/newsletter/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            })
            if (res.ok) {
                setStatus('success')
                setTimeout(() => setStatus('idle'), 3000)
            } else {
                setStatus('error')
            }
        } catch (error) {
            setStatus('error')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="flex items-center justify-center h-[50vh]"><Loader2 className="animate-spin text-blue-500" /></div>

    return (
        <div className="w-full max-w-full min-w-0 space-y-8 pb-20">
            <AdminToolbar 
                title="Configuración"
                description="Automatización y parámetros del módulo editorial."
                icon={Settings}
                actions={
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center justify-center gap-1.5 px-4 sm:px-6 py-2.5 sm:py-3 bg-[#1D1D1F] text-white rounded-2xl hover:bg-black transition-all font-bold disabled:opacity-50 shadow-xl shadow-gray-200 whitespace-nowrap"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin shrink-0" /> : <Save size={18} className="shrink-0" />}
                        <span className="hidden sm:inline">Guardar Cambios</span>
                        <span className="sm:hidden">Guardar</span>
                    </button>
                }
            />

            {status === 'success' && (
                <div className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 size={20} />
                    <p className="text-sm font-bold">Configuración guardada correctamente.</p>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Automation Panel */}
                <div className="lg:col-span-2 space-y-6">
                    <AdminCard glass title="Automatización Editorial" icon={Bell}>
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold text-gray-900">Generación Automática</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed max-w-md">
                                        Crea una campaña borrador automáticamente al publicar un nuevo artículo en la sección de Noticias.
                                    </p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={settings.autoSendEnabled}
                                        onChange={(e) => setSettings({...settings, autoSendEnabled: e.target.checked})}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {settings.autoSendEnabled && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <Clock size={14} />
                                            Delay de Envío (Minutos)
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="number" 
                                                value={settings.autoSendDelayMinutes}
                                                onChange={(e) => setSettings({...settings, autoSendDelayMinutes: e.target.value})}
                                                className="w-24 px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold text-center outline-none"
                                            />
                                            <p className="text-[10px] text-gray-400 font-medium italic">Se enviará automáticamente tras este tiempo de espera si no se cancela.</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                                        <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-[10px] text-amber-800 font-medium leading-relaxed">
                                            <strong>Nota:</strong> Con el envío automático activado, las campañas se crearán con estado <span className="font-bold">SCHEDULED</span>. Asegúrate de que el endpoint del Cron esté configurado correctamente.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </AdminCard>

                    <AdminCard glass title="Remitente y Contenido" icon={Mail}>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Nombre del Remitente</label>
                                     <input 
                                         type="text" 
                                         value={settings.senderName || ''}
                                         onChange={(e) => setSettings({...settings, senderName: e.target.value})}
                                         placeholder="IA Solutions"
                                         className="w-full px-4 py-2.5 sm:py-3 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold outline-none"
                                     />
                                 </div>
                                 <div className="space-y-2">
                                     <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email del Remitente</label>
                                     <input 
                                         type="email" 
                                         value={settings.senderEmail || ''}
                                         onChange={(e) => setSettings({...settings, senderEmail: e.target.value})}
                                         placeholder="newsletter@ejemplo.com"
                                         className="w-full px-4 py-2.5 sm:py-3 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold outline-none"
                                     />
                                 </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Texto de Pie de Página (Footer)</label>
                                <textarea 
                                    value={settings.footerText || ''}
                                    onChange={(e) => setSettings({...settings, footerText: e.target.value})}
                                    placeholder="Añade un mensaje legal o información adicional..."
                                    className="w-full px-4 py-3 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm font-bold outline-none min-h-[100px] resize-none"
                                />
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 p-6 bg-gray-50/50 rounded-3xl border border-gray-100">
                                <div className="space-y-1">
                                    <h3 className="text-sm font-bold text-gray-900">Venta Cruzada por Defecto</h3>
                                    <p className="text-xs text-gray-500 leading-relaxed max-w-md">Incluir bloque de "Soluciones que pueden interesarte" en todas las campañas automáticas.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={settings.defaultCrossSellEnabled}
                                        onChange={(e) => setSettings({...settings, defaultCrossSellEnabled: e.target.checked})}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>
                        </div>
                    </AdminCard>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-6">
                    <AdminCard glass title="Configuración Cron" icon={ShieldCheck}>
                        <div className="space-y-6">
                            <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                                El endpoint de procesamiento automático está protegido. Usa la siguiente estructura para ejecución externa:
                            </p>
                            <div className="relative group">
                                <code className="block p-4 bg-gray-900 rounded-2xl text-[10px] text-blue-300 font-mono break-all leading-relaxed border border-gray-800 shadow-xl">
                                    GET /api/cron/newsletter/process-scheduled?secret=TU_CRON_SECRET
                                </code>
                            </div>
                            <div className="space-y-4 pt-2">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Recomendaciones</p>
                                <ul className="space-y-3">
                                    {[
                                        "Frecuencia: Cada 10-15 minutos.",
                                        "Valida el CRON_SECRET en tus variables de entorno."
                                    ].map((item, i) => (
                                        <li key={i} className="flex gap-3 text-xs font-bold text-gray-600 items-start">
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </AdminCard>

                    <div className="p-8 bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <ShieldCheck size={80} />
                        </div>
                        <div className="relative z-10 space-y-4">
                            <h4 className="text-lg font-black tracking-tight">Estado de Salida</h4>
                            <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/10">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                                <span className="text-xs font-bold text-green-400">Gateway Operativo</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
