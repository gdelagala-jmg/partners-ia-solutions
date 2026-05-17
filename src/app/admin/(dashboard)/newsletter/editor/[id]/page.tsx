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
import AdminFormShell from '@/components/admin/ui/AdminFormShell'
import AdminCard from '@/components/admin/ui/AdminCard'
import { cn } from '@/lib/utils'

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
        <AdminFormShell
            title={campaign.title}
            description={`ESTADO: ${campaign.status}`}
            backUrl="/admin/newsletter"
            actions={
                <div className="flex items-center gap-3">
                    <div className="hidden md:flex p-1 bg-gray-100/50 backdrop-blur-sm rounded-xl mr-2">
                        <button 
                            onClick={() => setPreviewMode('desktop')} 
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                previewMode === 'desktop' ? "bg-white shadow-sm text-blue-600" : "text-gray-400"
                            )}
                        >
                            <Monitor size={16} />
                        </button>
                        <button 
                            onClick={() => setPreviewMode('mobile')} 
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                previewMode === 'mobile' ? "bg-white shadow-sm text-blue-600" : "text-gray-400"
                            )}
                        >
                            <Smartphone size={16} />
                        </button>
                        <button 
                            onClick={() => setPreviewMode('inbox')} 
                            className={cn(
                                "p-2 rounded-lg transition-all",
                                previewMode === 'inbox' ? "bg-white shadow-sm text-blue-600" : "text-gray-400"
                            )}
                        >
                            <Inbox size={16} />
                        </button>
                    </div>
                    <button 
                        onClick={() => setShowConfirmModal(true)} 
                        disabled={bulkSending || campaign.status === 'SENT' || campaign.status === 'SENDING'}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all disabled:opacity-50"
                    >
                        {bulkSending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                        <span className="hidden sm:inline">Enviar Campaña</span>
                    </button>
                    <button 
                        onClick={handleSave} 
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl font-bold text-sm hover:bg-blue-700 transition-all disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        <span>Guardar</span>
                    </button>
                </div>
            }
        >
            <div className="flex flex-col lg:flex-row gap-8 h-full">
                {/* Editor Sidebar */}
                <div className="w-full lg:w-[450px] space-y-6">
                    {/* Stats Section */}
                    {campaign.status !== 'DRAFT' && (
                        <AdminCard title="ESTADÍSTICAS" glass>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50/50 p-4 rounded-2xl border border-green-100">
                                    <p className="text-[10px] font-black text-green-600/70 uppercase tracking-widest">Enviados</p>
                                    <p className="text-2xl font-black text-green-600">{campaignLogs.filter(l => l.deliveryStatus === 'SENT').length}</p>
                                </div>
                                <div className="bg-red-50/50 p-4 rounded-2xl border border-red-100">
                                    <p className="text-[10px] font-black text-red-600/70 uppercase tracking-widest">Fallidos</p>
                                    <p className="text-2xl font-black text-red-600">{campaignLogs.filter(l => l.deliveryStatus === 'FAILED').length}</p>
                                </div>
                            </div>
                        </AdminCard>
                    )}

                    <AdminCard title="GENERAL" glass>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Título Interno</label>
                                <input 
                                    type="text" 
                                    value={campaign.title} 
                                    onChange={(e) => updateField('title', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-medium text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Asunto del Email</label>
                                <input 
                                    type="text" 
                                    value={campaign.subject} 
                                    onChange={(e) => updateField('subject', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-medium text-sm"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Preheader</label>
                                <input 
                                    type="text" 
                                    value={campaign.preheader || ''} 
                                    onChange={(e) => updateField('preheader', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-blue-500/10 outline-none transition-all font-medium text-xs"
                                    placeholder="Texto corto visible en la bandeja de entrada..."
                                />
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="CONTENIDO PRINCIPAL" glass>
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Imagen Hero (URL)</label>
                                <div className="flex gap-2">
                                    <input 
                                        type="text" 
                                        value={campaign.heroImage || ''} 
                                        onChange={(e) => updateField('heroImage', e.target.value)}
                                        className="flex-1 px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl outline-none text-xs"
                                        placeholder="https://..."
                                    />
                                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                                        <ImageIcon size={18} />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Introducción</label>
                                <textarea 
                                    value={campaign.introText || ''} 
                                    onChange={(e) => updateField('introText', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl outline-none text-sm min-h-[80px]"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Cuerpo del Mensaje</label>
                                <div className="bg-gray-50/50 rounded-xl border border-gray-100 overflow-hidden min-h-[300px] prose prose-sm max-w-none">
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
                    </AdminCard>

                    <AdminCard title="BOTÓN DE ACCIÓN (CTA)" glass>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Texto</label>
                                <input 
                                    type="text" 
                                    value={campaign.primaryCtaText || ''} 
                                    onChange={(e) => updateField('primaryCtaText', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl outline-none text-xs"
                                    placeholder="Leer más"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">URL</label>
                                <input 
                                    type="text" 
                                    value={campaign.primaryCtaUrl || ''} 
                                    onChange={(e) => updateField('primaryCtaUrl', e.target.value)}
                                    className="w-full px-4 py-2.5 bg-gray-50/50 border border-gray-100 rounded-xl outline-none text-xs"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>
                    </AdminCard>

                    <AdminCard title="SOLUCIONES RECOMENDADAS" glass>
                        <div className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                {allSolutions.map(sol => {
                                    const isSelected = campaign.recommendedSolutions?.find((s: any) => s.id === sol.id)
                                    return (
                                        <button
                                            key={sol.id}
                                            onClick={() => toggleSolution(sol)}
                                            className={cn(
                                                "px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border",
                                                isSelected 
                                                    ? "bg-blue-600 border-blue-600 text-white" 
                                                    : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
                                            )}
                                        >
                                            {sol.title}
                                        </button>
                                    )
                                })}
                            </div>
                            
                            {campaign.recommendedSolutions?.length > 0 && (
                                <div className="space-y-2 pt-4 border-t border-gray-100">
                                    <p className="text-[9px] font-black text-gray-300 uppercase tracking-widest">Seleccionadas</p>
                                    {campaign.recommendedSolutions.map((s: any) => (
                                        <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50/50 rounded-xl border border-gray-100">
                                            <div className="min-w-0">
                                                <p className="text-xs font-bold text-gray-700 truncate">{s.title}</p>
                                                <p className="text-[10px] text-gray-400 truncate">{s.url}</p>
                                            </div>
                                            <button onClick={() => toggleSolution(s)} className="text-gray-300 hover:text-red-500 p-1 transition-colors">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </AdminCard>

                    <AdminCard title="PRUEBA INTERNA" glass>
                        <div className="space-y-4">
                            <p className="text-[11px] text-gray-400 font-medium">Verifica el diseño real enviando una prueba a tu bandeja de entrada.</p>
                            <div className="flex gap-2">
                                <input 
                                    type="email" 
                                    placeholder="email@ejemplo.com"
                                    value={testEmail}
                                    onChange={(e) => setTestEmail(e.target.value)}
                                    className="flex-1 px-4 py-2 bg-gray-50/50 border border-gray-100 rounded-xl outline-none text-xs"
                                />
                                <button 
                                    onClick={handleSendTest}
                                    disabled={testSending}
                                    className="px-4 bg-gray-900 text-white rounded-xl font-bold text-xs hover:bg-black transition-all disabled:opacity-50 min-w-[70px]"
                                >
                                    {testSending ? <Loader2 size={14} className="animate-spin" /> : 'TEST'}
                                </button>
                            </div>
                        </div>
                    </AdminCard>
                </div>

                {/* Preview Pane */}
                <div className="flex-1 min-h-[600px] lg:min-h-0 bg-gray-100/50 rounded-[2.5rem] p-4 md:p-8 flex items-start justify-center overflow-y-auto">
                    {previewMode === 'inbox' ? (
                        <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">P</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-gray-900">Partners IA Solutions</h3>
                                            <span className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Recibido hace 1 min</span>
                                        </div>
                                        <p className="text-sm font-bold text-gray-800 mt-0.5">{campaign.subject || '(Sin asunto)'}</p>
                                        <p className="text-xs text-gray-500 truncate mt-1">{campaign.preheader || campaign.introText || 'Previsualización del mensaje...'}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8">
                                <div className="h-4 w-1/3 bg-gray-100 rounded-full mb-4"></div>
                                <div className="h-4 w-full bg-gray-50 rounded-full mb-2"></div>
                                <div className="h-4 w-full bg-gray-50 rounded-full mb-2"></div>
                                <div className="h-4 w-2/3 bg-gray-50 rounded-full mb-8"></div>
                                <div className="h-48 w-full bg-gray-100 rounded-2xl"></div>
                            </div>
                        </div>
                    ) : (
                        <div className={cn(
                            "bg-white shadow-2xl transition-all duration-500 overflow-hidden",
                            previewMode === 'mobile' ? "w-[375px] h-[667px] rounded-[3rem] border-[12px] border-gray-900 ring-4 ring-gray-100" : "w-full max-w-[800px] min-h-[800px] rounded-3xl"
                        )}>
                            {previewMode === 'mobile' && <div className="w-1/3 h-6 bg-gray-900 mx-auto rounded-b-2xl mb-2"></div>}
                            <iframe 
                                srcDoc={renderedHtml} 
                                className="w-full h-full border-none"
                                title="Email Preview"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Confirmation Modal */}
            {showConfirmModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300">
                        <div className="p-8 space-y-6">
                            <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mx-auto shadow-sm">
                                <AlertTriangle size={32} />
                            </div>
                            
                            <div className="text-center space-y-2">
                                <h3 className="text-xl font-black text-gray-900 tracking-tight">¿Confirmar envío real?</h3>
                                <p className="text-sm text-gray-500 font-medium leading-relaxed px-4">
                                    Estás a punto de enviar la campaña <span className="font-bold text-gray-900">&quot;{campaign.title}&quot;</span> a tu audiencia.
                                </p>
                            </div>

                            <div className="space-y-3">
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Destinatarios</p>
                                <div className="max-h-[200px] overflow-y-auto space-y-2 p-1 custom-scrollbar">
                                    <label className="flex items-center gap-3 p-3 bg-blue-50/50 rounded-xl cursor-pointer border border-blue-100 hover:bg-blue-50 transition-colors">
                                        <input 
                                            type="radio" 
                                            name="destinatarios"
                                            checked={selectedSubscriberIds.length === 0}
                                            onChange={() => setSelectedSubscriberIds([])}
                                            className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-blue-200"
                                        />
                                        <div className="min-w-0">
                                            <p className="text-xs font-bold text-blue-900">Toda la Audiencia Activa</p>
                                            <p className="text-[10px] text-blue-700 font-medium">{subscribers.filter(s => s.isActive).length} suscriptores</p>
                                        </div>
                                    </label>
                                    
                                    <div className="pt-2">
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-3 ml-1">O selección individual:</p>
                                        {subscribers.map(sub => (
                                            <label key={sub.id} className={cn(
                                                "flex items-center gap-3 p-3 rounded-xl cursor-pointer border transition-all mb-2",
                                                selectedSubscriberIds.includes(sub.id) ? "bg-blue-50/50 border-blue-200" : "bg-gray-50/30 border-gray-100 hover:border-gray-200"
                                            )}>
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
                                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                                <div className="min-w-0">
                                                    <p className="text-xs font-bold text-gray-800 truncate">{sub.email}</p>
                                                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{sub.isActive ? 'Activo' : 'Inactivo'}</p>
                                                </div>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-red-50/30 rounded-2xl border border-red-100/50">
                                <label className="flex items-start gap-3 cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        checked={confirmCheck}
                                        onChange={(e) => setConfirmCheck(e.target.checked)}
                                        className="mt-1 w-4 h-4 rounded border-red-200 text-red-600 focus:ring-red-500"
                                    />
                                    <span className="text-[11px] font-bold text-red-700 leading-tight">
                                        Confirmo que he revisado la campaña y deseo enviarla a la audiencia real.
                                    </span>
                                </label>
                            </div>

                            <div className="flex gap-3">
                                <button 
                                    onClick={() => setShowConfirmModal(false)}
                                    className="flex-1 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold text-sm hover:bg-gray-200 transition-all"
                                >
                                    Cancelar
                                </button>
                                <button 
                                    onClick={handleBulkSend}
                                    disabled={!confirmCheck}
                                    className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200 disabled:opacity-50 disabled:shadow-none"
                                >
                                    Enviar ahora
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AdminFormShell>
    )
}
