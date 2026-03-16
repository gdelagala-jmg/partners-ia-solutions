'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'

export default function AdminLogin() {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

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
                setError(data.error || 'Login failed')
            }
        } catch (err) {
            setError('An error occurred')
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
                            {error}
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
                                placeholder="tú@ejemplo.com"
                                className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-sm text-[#1D1D1F] placeholder:text-[#98989D] focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/20 transition-all duration-300 font-medium"
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
                                placeholder="••••••••"
                                className="w-full px-4 py-3 bg-[#F5F5F7] border border-transparent rounded-xl text-sm text-[#1D1D1F] placeholder:text-[#98989D] focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500/20 transition-all duration-300 font-medium"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3.5 px-6 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] transition-all duration-300 shadow-lg shadow-blue-100"
                    >
                        Acceder al Panel
                    </button>
                </form>

                <div className="pt-2 text-center">
                    <p className="text-[9px] text-[#98989D] font-bold uppercase tracking-[0.2em]">
                        © 2026 Partners IA Solutions
                    </p>
                </div>
            </div>
        </div>
    )
}
