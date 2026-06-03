'use client'

import React, { useState, useEffect } from 'react'
import { 
    ShieldCheck, 
    Fingerprint, 
    Trash2, 
    Loader2, 
    AlertTriangle, 
    CheckCircle2, 
    Smartphone, 
    Laptop, 
    Key, 
    Clock,
    PlusCircle
} from 'lucide-react'
import AdminToolbar from '@/components/admin/ui/AdminToolbar'
import { startRegistration, browserSupportsWebAuthn } from '@simplewebauthn/browser'

interface AuthenticatorInfo {
    id: string
    credentialID: string
    credentialDeviceType: string
    credentialBackedUp: boolean
    name: string
    createdAt: string
    lastUsedAt: string | null
}

export default function SecurityPage() {
    const [supported, setSupported] = useState<boolean | null>(null)
    const [deviceName, setDeviceName] = useState('')
    const [authenticators, setAuthenticators] = useState<AuthenticatorInfo[]>([])
    const [loading, setLoading] = useState(true)
    const [actionLoading, setActionLoading] = useState(false)
    const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({ text: '', type: null })

    // Detect browser support and fetch authenticators
    useEffect(() => {
        const isSupported = browserSupportsWebAuthn()
        setSupported(isSupported)

        // Set default device name based on User Agent
        if (typeof window !== 'undefined') {
            const ua = navigator.userAgent
            if (ua.includes('iPhone')) setDeviceName('iPhone')
            else if (ua.includes('iPad')) setDeviceName('iPad')
            else if (ua.includes('Android')) setDeviceName('Dispositivo Android')
            else if (ua.includes('Macintosh')) setDeviceName('MacBook / iMac')
            else if (ua.includes('Windows')) setDeviceName('PC Windows')
            else setDeviceName('Mi Llave de Acceso')
        }

        fetchAuthenticators()
    }, [])

    const fetchAuthenticators = async () => {
        try {
            setLoading(true)
            const res = await fetch('/api/auth/webauthn/authenticators')
            if (res.ok) {
                const data = await res.json()
                setAuthenticators(data.authenticators || [])
            } else {
                showMsg('Error al cargar la lista de dispositivos registrados', 'error')
            }
        } catch (err) {
            showMsg('Error al conectar con la API de seguridad', 'error')
        } finally {
            setLoading(false)
        }
    }

    const showMsg = (text: string, type: 'success' | 'error') => {
        setMessage({ text, type })
        setTimeout(() => {
            setMessage({ text: '', type: null })
        }, 5000)
    }

    // Register a new device
    const handleRegisterDevice = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!deviceName.trim()) {
            showMsg('Por favor introduce un nombre para el dispositivo', 'error')
            return
        }

        try {
            setActionLoading(true)
            setMessage({ text: '', type: null })

            // 1. Fetch registration options from Server
            const optionsRes = await fetch('/api/auth/webauthn/register/options')
            if (!optionsRes.ok) {
                const errData = await optionsRes.json()
                throw new Error(errData.error || 'Error al obtener opciones de registro')
            }
            const registrationOptions = await optionsRes.json()

            // 2. Trigger browser biometric prompt (navigator.credentials.create)
            let credentialResponse
            try {
                credentialResponse = await startRegistration({
                    optionsJSON: registrationOptions
                })
            } catch (authErr: any) {
                // Handle user cancellation or timeout gracefully
                if (authErr.name === 'NotAllowedError') {
                    throw new Error('Registro cancelado por el usuario o tiempo de espera agotado.')
                }
                throw new Error(authErr.message || 'Error en el diálogo biométrico del dispositivo.')
            }

            // 3. Verify registration response on Server
            const verifyRes = await fetch('/api/auth/webauthn/register/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    response: credentialResponse,
                    name: deviceName.trim()
                })
            })

            if (verifyRes.ok) {
                showMsg(`Dispositivo "${deviceName.trim()}" registrado con éxito`, 'success')
                // Reset to default device name detection
                setDeviceName(prev => prev)
                // Refresh list
                await fetchAuthenticators()
            } else {
                const verifyErr = await verifyRes.json()
                throw new Error(verifyErr.error || 'No se pudo verificar la credencial biométrica')
            }
        } catch (err: any) {
            showMsg(err.message || 'Ocurrió un error inesperado durante el registro', 'error')
        } finally {
            setActionLoading(false)
        }
    }

    // Revoke (Delete) device access
    const handleRevokeDevice = async (id: string, name: string) => {
        if (!confirm(`¿Estás seguro de que deseas revocar el acceso de "${name}"? No podrás volver a usarlo para iniciar sesión a menos que lo registres de nuevo.`)) {
            return
        }

        try {
            setActionLoading(true)
            setMessage({ text: '', type: null })

            const res = await fetch(`/api/auth/webauthn/authenticators/${id}`, {
                method: 'DELETE'
            })

            if (res.ok) {
                showMsg(`Acceso de "${name}" revocado correctamente`, 'success')
                await fetchAuthenticators()
            } else {
                const data = await res.json()
                throw new Error(data.error || 'Error al revocar el acceso del dispositivo')
            }
        } catch (err: any) {
            showMsg(err.message || 'Ocurrió un error al revocar el acceso', 'error')
        } finally {
            setActionLoading(false)
        }
    }

    return (
        <div className="w-full max-w-full min-w-0 space-y-8">
            <AdminToolbar
                title="Seguridad de Acceso"
                description="Vincula Face ID, Touch ID, Windows Hello o huellas digitales como métodos de acceso alternativos."
            />

            {/* Support Alert Box */}
            {supported === false && (
                <div className="mx-4 md:mx-0 p-4 rounded-2xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700">
                    <AlertTriangle className="shrink-0 text-red-500" size={20} />
                    <div className="space-y-1">
                        <h4 className="text-xs font-bold uppercase tracking-wider">Navegador No Compatible</h4>
                        <p className="text-xs font-medium leading-relaxed text-red-600/90">
                            Tu navegador o dispositivo actual no tiene activado el soporte para WebAuthn / Passkeys. Asegúrate de estar usando un navegador moderno (Chrome, Safari, Edge, Firefox) y tener configurado un método de desbloqueo biométrico en tu sistema operativo.
                        </p>
                    </div>
                </div>
            )}

            {supported === true && (
                <div className="mx-4 md:mx-0 p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100/50 flex items-start gap-3 text-emerald-800">
                    <CheckCircle2 className="shrink-0 text-emerald-500" size={20} />
                    <div className="space-y-1">
                        <h4 className="text-xs font-bold uppercase tracking-wider">Entorno Compatible</h4>
                        <p className="text-xs font-medium leading-relaxed text-emerald-700/90">
                            Soporte WebAuthn verificado. Puedes registrar sensores biométricos locales (Face ID, Touch ID, Windows Hello o llaves FIDO externas USB/NFC) en tu cuenta.
                        </p>
                    </div>
                </div>
            )}

            {/* Notification Messages */}
            {message.text && (
                <div className={`mx-4 md:mx-0 p-3.5 rounded-xl border text-[11px] font-bold flex items-center gap-2.5 animate-in slide-in-from-top-2 duration-300 ${
                    message.type === 'success' 
                        ? 'bg-emerald-50 border-emerald-100 text-emerald-700' 
                        : 'bg-red-50 border-red-100 text-red-600'
                }`}>
                    <div className={`w-2 h-2 rounded-full ${message.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                    {message.text}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mx-4 md:mx-0">
                {/* Registration Widget Form */}
                <div className="lg:col-span-1 bg-white border border-[#E8E8ED] rounded-3xl p-6 shadow-sm space-y-6 flex flex-col justify-between">
                    <div className="space-y-4">
                        <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center shadow-sm">
                            <Fingerprint size={22} />
                        </div>
                        <div className="space-y-1">
                            <h3 className="text-sm font-black text-[#1D1D1F]">Registrar Nuevo Sensor</h3>
                            <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                                Agrega este dispositivo a tu llavero corporativo seguro. Podrás acceder con un solo toque biométrico en lugar de escribir tu contraseña.
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleRegisterDevice} className="space-y-4 pt-4">
                        <div className="space-y-1.5">
                            <label htmlFor="device-name" className="block text-[9px] font-bold text-[#6E6E73] uppercase tracking-wider ml-1">
                                Nombre del Dispositivo / Alias
                            </label>
                            <input
                                id="device-name"
                                type="text"
                                disabled={supported === false || actionLoading}
                                required
                                placeholder="Ej: MacBook Pro de Juan"
                                className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-xs text-[#1D1D1F] placeholder:text-[#98989D] focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/20 transition-all duration-300 font-medium disabled:opacity-50"
                                value={deviceName}
                                onChange={(e) => setDeviceName(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={supported === false || actionLoading}
                            className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-[10px] font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-blue-100/50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {actionLoading ? (
                                <>
                                    <Loader2 className="animate-spin" size={14} />
                                    <span>Verificando Firma...</span>
                                </>
                            ) : (
                                <>
                                    <PlusCircle size={14} />
                                    <span>Vincular Biometría</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Registered Devices List */}
                <div className="lg:col-span-2 bg-white border border-[#E8E8ED] rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <div className="space-y-1">
                            <h3 className="text-sm font-black text-[#1D1D1F]">Dispositivos Vinculados</h3>
                            <p className="text-[11px] text-gray-400 font-medium leading-relaxed">
                                Sensores autorizados para omitir el flujo clásico de contraseña en tu cuenta.
                            </p>
                        </div>
                        <div className="px-2.5 py-1 bg-gray-50 border border-gray-200 rounded-lg text-[9px] font-bold text-gray-500">
                            {authenticators.length} {authenticators.length === 1 ? 'Llave' : 'Llaves'}
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-12 gap-3 text-gray-400">
                            <Loader2 className="animate-spin text-blue-500" size={24} />
                            <span className="text-[10px] uppercase font-bold tracking-widest">Cargando dispositivos...</span>
                        </div>
                    ) : authenticators.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                            <div className="w-12 h-12 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center text-gray-300 shadow-inner">
                                <Key size={20} />
                            </div>
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-600">No hay llaves de paso vinculadas</p>
                                <p className="text-[10px] text-gray-400 leading-normal max-w-xs">
                                    Añade tu primer dispositivo biométrico para habilitar accesos rápidos de alta seguridad.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 no-scrollbar">
                            {authenticators.map((auth) => (
                                <div 
                                    key={auth.id} 
                                    className="p-4 rounded-2xl border border-gray-100 hover:border-gray-200 bg-gray-50/20 hover:bg-gray-50/50 flex items-center justify-between transition-all duration-300"
                                >
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div className="w-9 h-9 rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-500 shadow-sm shrink-0">
                                            {auth.name.toLowerCase().includes('phone') || auth.name.toLowerCase().includes('iphone') ? (
                                                <Smartphone size={16} className="text-blue-500" />
                                            ) : (
                                                <Laptop size={16} className="text-blue-500" />
                                            )}
                                        </div>
                                        <div className="min-w-0 space-y-1">
                                            <h4 className="text-xs font-bold text-[#1D1D1F] truncate pr-2">
                                                {auth.name}
                                            </h4>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[9px] font-bold text-gray-400">
                                                <span className="flex items-center gap-1">
                                                    <Clock size={10} />
                                                    Vinculado: {new Date(auth.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                </span>
                                                {auth.lastUsedAt && (
                                                    <span className="text-blue-500 flex items-center gap-1">
                                                        <CheckCircle2 size={10} />
                                                        Uso: {new Date(auth.lastUsedAt).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                                                    </span>
                                                )}
                                                <span className={`px-1.5 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold ${
                                                    auth.credentialDeviceType === 'multiDevice' 
                                                        ? 'bg-blue-50 text-blue-600 border border-blue-100/50' 
                                                        : 'bg-amber-50 text-amber-700 border border-amber-100/50'
                                                }`}>
                                                    {auth.credentialDeviceType === 'multiDevice' ? 'Passkey Sincronizada' : 'Clave de Dispositivo'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => handleRevokeDevice(auth.id, auth.name)}
                                        disabled={actionLoading}
                                        className="p-2.5 rounded-xl bg-white border border-gray-100 text-gray-400 hover:text-red-600 hover:bg-red-50/30 hover:border-red-100 transition-all duration-300 active:scale-95 shrink-0"
                                        title="Revocar acceso biométrico"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
