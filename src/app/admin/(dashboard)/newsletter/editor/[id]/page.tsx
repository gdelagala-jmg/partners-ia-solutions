'use client'

import { useState, useEffect, useRef } from 'react'
import { 
    Save, 
    Send, 
    Eye, 
    Smartphone, 
    Monitor, 
    Inbox, 
    ArrowLeft, 
    Image as ImageIcon, 
    Link, 
    Plus, 
    GripVertical, 
    Trash2,
    CheckCircle2,
    AlertCircle,
    Loader2,
    X,
    ShieldCheck,
    AlertTriangle
} from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import 'react-quill-new/dist/quill.snow.css'
import { generateNewsletterHtml } from '@/lib/newsletter-templates'

const ReactQuill = dynamic(() => import('react-quill-new'), { ssr: false })

export default function CampaignEditor() {
    const { id } = useParams()
    const router = useRouter()
    const [campaign, setCampaign] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile' | 'inbox'>('desktop')
    const [testEmail, setTestEmail] = useState('')
    const [testSending, setTestSending] = useState(false)
    const [bulkSending, setBulkSending] = useState(false)
    const [showConfirmModal, setShowConfirmModal] = useState(false)
    const [confirmCheck, setConfirmCheck] = useState(false)
    const [allSolutions, setAllSolutions] = useState<any[]>([])
    const [subscribers, setSubscribers] = useState<any[]>([])
    const [selectedSubscriberIds, setSelectedSubscriberIds] = useState<string[]>([])
    const [campaignLogs, setCampaignLogs] = useState<any[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [cRes, sRes, subRes] = await Promise.all([
                    fetch(`/api/admin/newsletter/campaigns/${id}`),
                    fetch('/api/solutions?admin=true'),
                    fetch('/api/admin/newsletter/subscribers?active=true')
                ])
                if (cRes.ok) {
                    const data = await cRes.json()
                    setCampaign(data)
                    setCampaignLogs(data.logs || [])
                }
                if (sRes.ok) setAllSolutions(await sRes.json())
                if (subRes.ok) {
                    const subData = await subRes.json()
                    setSubscribers(subData.subscribers || [])
                }
            } catch (error) {
                console.error('Error fetching data:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [id])

    const handleSave = async () => {
        setSaving(true)
        try {
            const res = await fetch(`/api/admin/newsletter/campaigns/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(campaign)
            })
            if (res.ok) {
                // Show success toast or something
            }
        } catch (error) {
            console.error('Error saving campaign:', error)
        } finally {
            setSaving(false)
        }
    }

    const handleSendTest = async () => {
        if (!testEmail) return alert('Introduce un email de prueba')
        setTestSending(true)
        try {
            const res = await fetch(`/api/admin/newsletter/campaigns/${id}/test`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ testEmail })
            })
            if (res.ok) {
                alert('Test enviado correctamente')
            } else {
                const err = await res.json()
                alert(`Error: ${err.error}`)
            }
        } catch (error) {
            alert('Error al enviar el test')
        } finally {
            setTestSending(false)
        }
    }

    const handleBulkSend = async () => {
        if (!confirmCheck) return
        setBulkSending(true)
        setShowConfirmModal(false)
        try {
            const res = await fetch(`/api/admin/newsletter/campaigns/${id}/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    subscriberIds: selectedSubscriberIds.length > 0 ? selectedSubscriberIds : null 
                })
            })
            const result = await res.json()
            if (res.ok) {
                alert(`Envío completado: ${result.sent} enviados, ${result.failed} fallidos.`)
                // Refresh campaign data
                const refreshRes = await fetch(`/api/admin/newsletter/campaigns/${id}`)
                if (refreshRes.ok) {
                    const data = await refreshRes.json()
                    setCampaign(data)
                    setCampaignLogs(data.logs || [])
                }
            } else {
                alert(`Error: ${result.error}`)
            }
        } catch (error) {
            alert('Error al realizar el envío masivo')
        } finally {
            setBulkSending(false)
        }
    }

    const updateField = (field: string, value: any) => {
        setCampaign((prev: any) => ({ ...prev, [field]: value }))
    }

    const toggleSolution = (sol: any) => {
        const current = campaign.recommendedSolutions || []
        const exists = current.find((s: any) => s.id === sol.id)
        
        let next
        if (exists) {
            next = current.filter((s: any) => s.id !== sol.id)
        } else {
            next = [...current, { id: sol.id, title: sol.title, url: `https://partnersiasolutions.com/soluciones/${sol.slug}`, active: true, description: sol.description || '' }]
        }
        updateField('recommendedSolutions', next)
    }

    if (loading) return <div className="flex items-center justify-center h-[80vh]"><Loader2 className="animate-spin text-blue-500" size={40} /></div>
    if (!campaign) return <div>Campaña no encontrada</div>

    const renderedHtml = generateNewsletterHtml(campaign)

    return (
        <div className="flex flex-col h-[calc(100vh-100px)] -m-4 md:-m-6">
            {/* Toolbar */}
            <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-900 leading-tight truncate max-w-[200px] md:max-w-none">{campaign.title}</h1>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{campaign.status}</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex p-1 bg-gray-100 rounded-xl mr-4">
                        <button 
                            onClick={() => setPreviewMode('desktop')} 
                            className={`p-2 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                        >
                            <Monitor size={18} />
                        </button>
                        <button 
                            onClick={() => setPreviewMode('mobile')} 
                            className={`p-2 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                        >
                            <Smartphone size={18} />
                        </button>
                        <button 
                            onClick={() => setPreviewMode('inbox')} 
                            className={`p-2 rounded-lg transition-all ${previewMode === 'inbox' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
                        >
                            <Inbox size={18} />
                        </button>
                    </div>
                    <button 
                        onClick={() => setShowConfirmModal(true)} 
                        disabled={bulkSending || campaign.status === 'SENT' || campaign.status === 'SENDING'}
                        className="flex items-center gap-2 px-5 py-2 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50 disabled:bg-gray-200"
                    >
                        {bulkSending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                        Enviar a Audiencia
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="flex items-center gap-2 px-5 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        Guardar
                    </button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Editor Sidebar */}
                <div className="w-full md:w-[450px] overflow-y-auto p-6 bg-gray-50 border-r border-gray-200 space-y-8 scrollbar-hide">
                    {/* Stats Section */}
                    {campaign.status !== 'DRAFT' && (
                        <section className="space-y-4">
                            <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Estadísticas de Envío</h2>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Enviados</p>
                                    <p className="text-2xl font-black text-green-600">{campaignLogs.filter(l => l.deliveryStatus === 'SENT').length}</p>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fallidos</p>
                                    <p className="text-2xl font-black text-red-600">{campaignLogs.filter(l => l.deliveryStatus === 'FAILED').length}</p>
                                </div>
                            </div>
                        </section>
                    )}
                    {/* General Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">General</h2>
                        <div className="space-y-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 ml-1">Título Interno</label>
                                <input 
                                    type="text" 
                                    value={campaign.title} 
                                    onChange={(e) => updateField('title', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 ml-1">Asunto del Email</label>
                                <input 
                                    type="text" 
                                    value={campaign.subject} 
                                    onChange={(e) => updateField('subject', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 ml-1">Preheader (Texto invisible inicial)</label>
                                <input 
                                    type="text" 
                                    value={campaign.preheader || ''} 
                                    onChange={(e) => updateField('preheader', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-medium text-sm"
                                />
                            </div>
                        </div>
                    </section>

                    {/* Content Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Contenido</h2>
                        <div className="space-y-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 ml-1">Imagen Hero (URL)</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={campaign.heroImage || ''} 
                                        onChange={(e) => updateField('heroImage', e.target.value)}
                                        className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm"
                                        placeholder="https://..."
                                    />
                                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                                        <ImageIcon size={18} />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 ml-1">Introducción (Corta)</label>
                                <textarea 
                                    value={campaign.introText || ''} 
                                    onChange={(e) => updateField('introText', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 ml-1">Cuerpo del Mensaje</label>
                                <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden min-h-[300px]">
                                    <ReactQuill 
                                        theme="snow" 
                                        value={campaign.content || ''} 
                                        onChange={(val) => updateField('content', val)}
                                        modules={{
                                            toolbar: [
                                                ['bold', 'italic', 'underline'],
                                                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                                ['link', 'clean']
                                            ]
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* CTA Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Botón Principal (CTA)</h2>
                        <div className="grid grid-cols-2 gap-4 bg-white p-5 rounded-3xl border border-gray-200 shadow-sm">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 ml-1">Texto</label>
                                <input 
                                    type="text" 
                                    value={campaign.primaryCtaText || ''} 
                                    onChange={(e) => updateField('primaryCtaText', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm"
                                    placeholder="Leer más"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 ml-1">URL</label>
                                <input 
                                    type="text" 
                                    value={campaign.primaryCtaUrl || ''} 
                                    onChange={(e) => updateField('primaryCtaUrl', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </section>

                    {/* Solutions Section */}
                    <section className="space-y-4">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Soluciones Recomendadas</h2>
                        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {allSolutions.map(sol => {
                                    const isSelected = campaign.recommendedSolutions?.find((s: any) => s.id === sol.id)
                                    return (
                                        <button
                                            key={sol.id}
                                            onClick={() => toggleSolution(sol)}
                                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border ${
                                                isSelected 
                                                    ? 'bg-blue-600 border-blue-600 text-white' 
                                                    : 'bg-white border-gray-200 text-gray-500 hover:border-gray-400'
                                            }`}
                                        >
                                            {sol.title}
                                        </button>
                                    )
                                })}
                            </div>
                            
                            {campaign.recommendedSolutions?.length > 0 && (
                                <div className="space-y-2 pt-4 border-t border-gray-100">
                                    <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Seleccionadas</p>
                                    {campaign.recommendedSolutions.map((s: any, idx: number) => (
                                        <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-gray-700 truncate">{s.title}</p>
                                                <p className="text-[10px] text-gray-400 truncate">{s.url}</p>
                                            </div>
                                            <button onClick={() => toggleSolution(s)} className="text-gray-300 hover:text-red-500 p-1">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Test Send Section */}
                    <section className="space-y-4 pb-12">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Prueba Interna</h2>
                        <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                            <p className="text-xs text-gray-400">Envía una versión de prueba a un email específico para verificar el diseño real en bandeja de entrada.</p>
                            <div className="flex gap-2">
                                <input 
                                    type="email" 
                                    placeholder="email@ejemplo.com"
                                    value={testEmail}
                                    onChange={(e) => setTestEmail(e.target.value)}
                                    className="flex-1 px-4 py-2.5 bg-gray-50 border border-gray-100 rounded-xl outline-none text-sm"
                                />
                                <button 
                                    onClick={handleSendTest}
                                    disabled={testSending}
                                    className="px-4 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all disabled:opacity-50 flex items-center justify-center min-w-[80px]"
                                >
                                    {testSending ? <Loader2 size={18} className="animate-spin" /> : 'Test'}
                                </button>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Preview Pane */}
                <div className="hidden md:flex flex-1 bg-gray-200 p-8 overflow-y-auto items-start justify-center scrollbar-hide">
                    {previewMode === 'inbox' ? (
                        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="p-6 border-b border-gray-100 bg-gray-50">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl">P</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-gray-900">Partners IA Solutions</h3>
                                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest">Recibido hace 1 min</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800 mt-0.5">{campaign.subject}</p>
                                        <p className="text-xs text-gray-500 truncate mt-1">{campaign.preheader || campaign.introText}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="h-4 w-1/3 bg-gray-100 rounded-full mb-4"></div>
                                <div className="h-4 w-full bg-gray-50 rounded-full mb-2"></div>
                                <div className="h-4 w-full bg-gray-50 rounded-full mb-2"></div>
                                <div className="h-4 w-2/3 bg-gray-50 rounded-full mb-8"></div>
                                <div className="h-32 w-full bg-gray-100 rounded-2xl"></div>
                            </div>
                        </div>
                    ) : (
                        <div className={`bg-white shadow-2xl transition-all duration-500 overflow-hidden ${previewMode === 'mobile' ? 'w-[375px] rounded-[3rem] border-[10px] border-gray-900' : 'w-full max-w-[800px] rounded-3xl'}`}>
                            {previewMode === 'mobile' && <div className="w-1/3 h-6 bg-gray-900 mx-auto rounded-b-3xl mb-4"></div>}
                            <iframe 
                                srcDoc={renderedHtml} 
                                className="w-full min-h-[800px] border-none"
                                title="Email Preview"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 space-y-6">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto">
                                <AlertTriangle size={32} />
                            </div>
                            
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">¿Confirmar envío real?</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                                    Estás a punto de enviar la campaña <span className="font-bold text-gray-900">"{campaign.title}"</span>.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Seleccionar Destinatarios</p>
                                <div className="max-h-[200px] overflow-y-auto space-y-2 p-1">
                                    <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl cursor-pointer border border-blue-100">
                                        <input 
                                            type="radio" 
                                            name="destinatarios"
                                            checked={selectedSubscriberIds.length === 0}
                                            onChange={() => setSelectedSubscriberIds([])}
                                            className="text-blue-600 focus:ring-blue-500"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-blue-900">Toda la Audiencia Activa</p>
                                            <p className="text-[10px] text-blue-700">{subscribers.filter(s => s.isActive).length} suscriptores</p>
                                        </div>
                                    </label>
                                    
                                    <div className="relative">
                                        <p className="text-[10px] font-bold text-gray-400 mb-2 mt-4 ml-1">O selecciona suscriptores de prueba:</p>
                                        {subscribers.map(sub => (
                                            <label key={sub.id} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all mb-2 ${selectedSubscriberIds.includes(sub.id) ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-100'}`}>
                                                <input 
                                                    type="checkbox" 
                                                    checked={selectedSubscriberIds.includes(sub.id)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedSubscriberIds([...selectedSubscriberIds, sub.id])
                                                        } else {
                                                            setSelectedSubscriberIds(selectedSubscriberIds.filter(id => id !== sub.id))
                                                        }
                                                    }}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-gray-800 truncate">{sub.email}</p>
                                                    <p className="text-[10px] text-gray-400">{sub.isActive ? 'Activo' : 'Inactivo'}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <label className="flex items-start gap-3 p-4 bg-red-50/50 rounded-2xl cursor-pointer hover:bg-red-50 transition-colors border border-red-100">
                                <input 
                                    type="checkbox" 
                                    checked={confirmCheck}
                                    onChange={(e) => setConfirmCheck(e.target.checked)}
                                    className="mt-1 rounded border-red-200 text-red-600 focus:ring-red-500"
                                />
                                <span className="text-xs font-bold text-red-700 leading-tight">
                                    Confirmo que he revisado la campaña y deseo enviarla a la audiencia real.
                                </span>
                            </label>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleBulkSend}
                                    disabled={!confirmCheck}
                                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:shadow-none"
                                >
                                    Enviar ahora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
