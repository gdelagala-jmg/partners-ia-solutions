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
        <div className="max-w-4xl mx-auto space-y-8 pb-20">
            <div className="flex items-end justify-between px-4 md:px-0">
                <div>
                    <h1 className="text-4xl font-bold tracking-tight text-[#1D1D1F]">Configuración</h1>
                    <p className="text-gray-400 mt-1 font-medium">Automatización y parámetros del módulo editorial.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center justify-center px-6 py-2.5 bg-[#1D1D1F] text-white rounded-2xl hover:bg-black transition-all font-semibold disabled:opacity-50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin mr-2" /> : <Save size={18} className="mr-2" />}
                    Guardar Cambios
                </button>
            </div>

            {status === 'success' && (
                <div className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                    <CheckCircle2 size={20} />
                    <p className="text-sm font-bold">Configuración guardada correctamente.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Automation Panel */}
                <div className="md:col-span-2 space-y-6">
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                            <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                                <Bell size={24} />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Automatización Editorial</h2>
                        </div>

                        <div className="space-y-8">
                            <div className="flex items-start justify-between gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-900">Generación Automática</p>
                                    <p className="text-xs text-gray-400 leading-relaxed">Crea una campaña borrador automáticamente al publicar un nuevo artículo en la sección de Noticias.</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer"
                                        checked={settings.autoSendEnabled}
                                        onChange={(e) => setSettings({...settings, autoSendEnabled: e.target.checked})}
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                </label>
                            </div>

                            {settings.autoSendEnabled && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-top-2">
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 text-xs font-black text-gray-400 uppercase tracking-widest ml-1">
                                            <Clock size={14} />
                                            Delay de Envío (Minutos)
                                        </label>
                                        <div className="flex items-center gap-4">
                                            <input 
                                                type="number" 
                                                value={settings.autoSendDelayMinutes}
                                                onChange={(e) => setSettings({...settings, autoSendDelayMinutes: e.target.value})}
                                                className="w-24 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-bold text-center"
                                            />
                                            <p className="text-xs text-gray-400 font-medium italic">Se enviará automáticamente tras este tiempo de espera si no se cancela.</p>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100 flex gap-3">
                                        <AlertCircle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
                                        <p className="text-xs text-amber-800 font-medium leading-relaxed">
                                            <strong>Nota:</strong> Con el envío automático activado, las campañas se crearán con estado <span className="font-bold">SCHEDULED</span>. Asegúrate de que el endpoint del Cron esté configurado correctamente.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                        <div className="flex items-center gap-3 border-b border-gray-50 pb-6">
                            <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                                <Mail size={24} />
                            </div>
                            <h2 className="text-xl font-black text-gray-900 tracking-tight">Remitente y Contenido</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nombre del Remitente</label>
                                <input 
                                    type="text" 
                                    value={settings.senderName || ''}
                                    onChange={(e) => setSettings({...settings, senderName: e.target.value})}
                                    placeholder="IA Solutions"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Email del Remitente</label>
                                <input 
                                    type="email" 
                                    value={settings.senderEmail || ''}
                                    onChange={(e) => setSettings({...settings, senderEmail: e.target.value})}
                                    placeholder="newsletter@ejemplo.com"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Texto de Pie de Página (Footer)</label>
                            <textarea 
                                value={settings.footerText || ''}
                                onChange={(e) => setSettings({...settings, footerText: e.target.value})}
                                placeholder="Añade un mensaje legal o información adicional..."
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-medium min-h-[100px]"
                            />
                        </div>

                        <div className="flex items-center justify-between gap-4 p-6 bg-gray-50 rounded-3xl border border-gray-100">
                            <div className="space-y-1">
                                <p className="font-bold text-gray-900">Venta Cruzada por Defecto</p>
                                <p className="text-xs text-gray-400 leading-relaxed">Incluir bloque de "Soluciones que pueden interesarte" en todas las campañas automáticas.</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={settings.defaultCrossSellEnabled}
                                    onChange={(e) => setSettings({...settings, defaultCrossSellEnabled: e.target.checked})}
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-6">
                    <div className="bg-gray-900 p-8 rounded-[2.5rem] text-white space-y-6">
                        <div className="flex items-center gap-3">
                            <ShieldCheck className="text-blue-400" size={24} />
                            <h3 className="font-black tracking-tight">Seguridad Cron</h3>
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed font-medium">
                            El endpoint de procesamiento automático está protegido. Para ejecutarlo manualmente o mediante un cron externo, usa la siguiente estructura:
                        </p>
                        <code className="block p-4 bg-white/5 rounded-2xl text-[10px] text-blue-300 font-mono break-all leading-relaxed">
                            GET /api/cron/newsletter/process-scheduled?secret=TU_CRON_SECRET
                        </code>
                        <div className="pt-4 border-t border-white/10 space-y-4">
                            <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Recomendaciones</p>
                            <ul className="text-xs space-y-3 text-gray-300">
                                <li className="flex gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                    Frecuencia recomendada: Cada 10-15 minutos.
                                </li>
                                <li className="flex gap-2">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></span>
                                    Valida el CRON_SECRET en tus variables de entorno.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
