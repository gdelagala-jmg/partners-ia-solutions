'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, Fingerprint } from 'lucide-react'
import { startAuthentication } from '@simplewebauthn/browser'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [isWebAuthnSupported, setIsWebAuthnSupported] = useState(false)
    const [buttonText, setButtonText] = useState('Acceder con Passkey')
    const [isLoading, setIsLoading] = useState(false)
    const router = useRouter()

    useEffect(() => {
        if (typeof window !== 'undefined') {
            // Check basic WebAuthn support
            if (window.PublicKeyCredential) {
                setIsWebAuthnSupported(true)
            }

            // Adapt button text based on the platform user agent
            const userAgent = window.navigator.userAgent.toLowerCase()
            if (/iphone|ipad|ipod|macintosh/.test(userAgent)) {
                setButtonText('Acceder con Face ID / Touch ID')
            } else if (/windows/.test(userAgent)) {
                setButtonText('Acceder con Windows Hello')
            } else if (/android/.test(userAgent)) {
                setButtonText('Acceder con Huella / Rostro')
            } else {
                setButtonText('Acceder con Passkey')
            }
        }
    }, [])

    const handleBiometricLogin = async () => {
        setError('')
        setIsLoading(true)
        try {
            // 1. Get authentication options from server (targeted to default admin)
            const optionsRes = await fetch(`/api/auth/webauthn/login/options?username=admin`)
            if (!optionsRes.ok) {
                const data = await optionsRes.json()
                throw new Error(data.error || 'No se pudieron obtener las opciones de autenticación')
            }
            const options = await optionsRes.json()

            // UX Optimization: Prevent opening browser dialog if user has no registered authenticators
            if (!options.allowCredentials || options.allowCredentials.length === 0) {
                throw new Error('No tienes ningún dispositivo biométrico registrado. Inicia sesión con contraseña y vincúlalo en Seguridad de acceso.')
            }

            // 2. Start authentication using simplewebauthn browser client
            let authResponse
            try {
                authResponse = await startAuthentication({ optionsJSON: options })
            } catch (err: any) {
                // Friendly cancelation handling
                if (err.name === 'NotAllowedError') {
                    throw new Error('Autenticación biométrica cancelada.')
                }
                throw err
            }

            // 3. Send verification to server
            const verifyRes = await fetch('/api/auth/webauthn/login/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ response: authResponse })
            })

            if (verifyRes.ok) {
                router.push('/admin/dashboard')
                router.refresh()
            } else {
                const data = await verifyRes.json()
                throw new Error(data.error || 'La verificación biométrica falló')
            }
        } catch (err: any) {
            console.error(err)
            setError(err.message || 'Error de autenticación biométrica')
        } finally {
            setIsLoading(false)
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            })

            if (res.ok) {
                router.push('/admin/dashboard')
                router.refresh()
            } else {
                const data = await res.json()
                setError(data.error || 'Credenciales incorrectas')
            }
        } catch (err) {
            setError('Ocurrió un error al iniciar sesión')
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#F5F5F7] text-[#1D1D1F] selection:bg-blue-100 selection:text-blue-700 p-4 font-sans">
            <div className="w-full max-w-sm p-4 sm:p-5 space-y-4 bg-white rounded-3xl border border-[#E8E8ED] shadow-xl shadow-gray-200/50 animate-in fade-in zoom-in duration-500">
                <div className="text-center space-y-3">
                    <div className="mx-auto h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-xl shadow-blue-100 rotate-3 hover:rotate-0 transition-transform duration-500">
                        <Lock className="text-white" size={24} />
                    </div>
                    <div className="space-y-1">
                        <h2 className="text-2xl font-black tracking-tight text-[#1D1D1F]">
                            Admin Console
                        </h2>
                        <p className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">
                            Partners IA Solutions
                        </p>
                    </div>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit}>
                    {error && (
                        <div className="bg-red-50 border border-red-100 text-red-600 text-[11px] font-bold p-3 rounded-xl flex items-center gap-2 animate-in slide-in-from-top-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                            <span className="leading-snug">{error}</span>
                        </div>
                    )}

                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label htmlFor="username" className="block text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider ml-1">
                                Usuario
                            </label>
                            <input
                                id="username"
                                type="text"
                                required
                                disabled={isLoading}
                                placeholder="tú@ejemplo.com"
                                className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-sm text-[#1D1D1F] placeholder:text-[#98989D] focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/20 transition-all duration-300 font-medium disabled:opacity-60"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label htmlFor="password" className="block text-[10px] font-bold text-[#6E6E73] uppercase tracking-wider ml-1">
                                Contraseña
                            </label>
                            <input
                                id="password"
                                type="password"
                                required
                                disabled={isLoading}
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-sm text-[#1D1D1F] placeholder:text-[#98989D] focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/20 transition-all duration-300 font-medium disabled:opacity-60"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full flex justify-center py-3.5 px-6 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-blue-100 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Cargando...' : 'Acceder al Panel'}
                    </button>
                </form>

                {isWebAuthnSupported && (
                    <div className="space-y-3 pt-2 animate-in fade-in slide-in-from-bottom-2 duration-700">
                        <div className="flex items-center gap-3">
                            <div className="h-[1px] bg-[#E8E8ED] grow" />
                            <span className="text-[9px] font-bold text-[#8E8E93] uppercase tracking-wider">o accede con tu dispositivo</span>
                            <div className="h-[1px] bg-[#E8E8ED] grow" />
                        </div>

                        <button
                            type="button"
                            onClick={handleBiometricLogin}
                            disabled={isLoading}
                            className="w-full flex justify-center items-center gap-2.5 py-3.5 px-6 rounded-xl text-xs font-bold text-blue-600 bg-blue-50/50 hover:bg-blue-100/70 border border-blue-100/50 hover:border-blue-200/50 active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-sm shadow-blue-50/30 disabled:opacity-60"
                        >
                            <Fingerprint size={16} className="text-blue-500 shrink-0" />
                            {buttonText}
                        </button>
                        
                        <p className="text-center text-[9px] text-[#8E8E93] font-medium leading-relaxed max-w-[240px] mx-auto">
                            Usa el dispositivo vinculado desde <Link href="/admin/seguridad" className="font-bold text-[#6E6E73] hover:text-blue-600 transition-colors">Seguridad de acceso</Link>.
                        </p>
                    </div>
                )}

                <div className="pt-2 text-center">
                    <Link href="/" className="text-[9px] text-[#98989D] font-bold uppercase tracking-[0.2em] hover:text-blue-600 transition-colors">
                        © 2026 Partners IA Solutions
                    </Link>
                </div>
            </div>
        </div>
    )
}

