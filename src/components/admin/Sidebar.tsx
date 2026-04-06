'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
    LayoutDashboard,
    Box,
    Puzzle,
    BookOpen,
    FileText,
    Mail,
    Users,
    Trophy,
    Video,
    Handshake,
    LogOut,
    ExternalLink,
    X,
    ShieldCheck,
    ShieldAlert,
    Link2,
    Bot,
    LayoutGrid
} from 'lucide-react'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Asistente AI', href: '/admin/asistente', icon: Bot },
    { name: 'Sectores', href: '/admin/sectors', icon: Box },
    { name: 'Clientes', href: '/admin/clientes', icon: Users },
    { name: 'Navegación', href: '/admin/navegacion', icon: Link2 },
    { name: 'Aplicaciones', href: '/admin/apps', icon: LayoutGrid },
    { name: 'Soluciones', href: '/admin/soluciones', icon: Puzzle },
    { name: 'Academia', href: '/admin/escuela', icon: BookOpen },
    { name: 'Noticias', href: '/admin/noticias', icon: FileText },
    { name: 'Mensajes', href: '/admin/leads', icon: Mail },
    { name: 'Equipo', icon: Users, href: '/admin/equipo' },
    { name: 'Casos Éxito', icon: Trophy, href: '/admin/casos' },
    { name: 'Media', icon: Video, href: '/admin/media' },
    { name: 'Convenios', icon: Handshake, href: '/admin/convenios' },
]

interface SidebarProps {
    onCloseMobile?: () => void
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [isMaintenance, setIsMaintenance] = useState(false)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/settings?key=maintenance_mode')
            .then(res => res.json())
            .then(data => {
                setIsMaintenance(data.value === 'true')
                setLoading(false)
            })
            .catch(() => setLoading(false))
    }, [])

    const toggleMaintenance = async () => {
        const newValue = !isMaintenance
        try {
            const res = await fetch('/api/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ key: 'maintenance_mode', value: newValue.toString() })
            })
            if (res.ok) {
                setIsMaintenance(newValue)
                router.refresh()
            }
        } catch (error) {
            console.error('Error toggling maintenance:', error)
        }
    }

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/admin/login')
        router.refresh()
    }

    return (
        <div className="flex flex-col h-full bg-white/70 backdrop-blur-xl border-r border-[#F2F2F7]">
            {/* Header - Minimalist Apple Style */}
            <div className="px-6 py-8 border-b border-[#F2F2F7]/50 hidden lg:block">
                <Link href="/" className="flex items-center group">
                    <div className="relative h-8 w-40">
                        <Image
                            src="/logo-ias.png"
                            alt="IA Solutions"
                            fill
                            className="object-contain transition-transform group-hover:scale-105 duration-500"
                            priority
                        />
                    </div>
                </Link>
            </div>

            {/* Mobile Header Close - Refined */}
            <div className="px-6 py-4 border-b border-[#F2F2F7]/50 lg:hidden flex justify-between items-center bg-white/50">
                <span className="text-sm font-bold tracking-widest text-gray-400 uppercase">Menú Principal</span>
                <button
                    onClick={onCloseMobile}
                    className="p-1.5 bg-gray-50/50 rounded-xl text-gray-400 hover:text-gray-900 transition-all border border-gray-100/50 active:scale-90"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Navigation - Compact Apple List style */}
            <nav className="flex-1 px-4 py-6 space-y-0.5 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onCloseMobile}
                            className={clsx(
                                "flex items-center px-4 py-2.5 text-[13px] font-semibold rounded-xl transition-all duration-300 group relative",
                                isActive
                                    ? "bg-[#007AFF] text-white shadow-lg shadow-[#007AFF]/20"
                                    : "text-[#1D1D1F]/70 hover:bg-[#F2F2F7]/80 hover:text-[#1D1D1F]"
                            )}
                        >
                            <Icon
                                size={16}
                                className={clsx(
                                    "mr-3 transition-colors duration-300",
                                    isActive ? "text-white" : "text-gray-400 group-hover:text-[#007AFF]"
                                )}
                            />
                            {item.name}
                            
                            {isActive && (
                                <div className="absolute left-0 w-1 h-4 bg-white/50 rounded-full" />
                            )}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer Actions - Tight Spacing */}
            <div className="px-4 py-6 border-t border-[#F2F2F7]/50 space-y-1 bg-gray-50/20">
                {!loading && (
                    <button
                        onClick={toggleMaintenance}
                        className={clsx(
                            "flex w-full items-center px-4 py-2.5 text-[12px] font-bold rounded-xl transition-all border border-transparent group mb-2",
                            isMaintenance 
                                ? "bg-amber-50/50 text-amber-700 hover:bg-amber-100/50 border-amber-100" 
                                : "bg-emerald-50/50 text-emerald-700 hover:bg-emerald-100/50 border-emerald-100"
                        )}
                    >
                        {isMaintenance ? (
                            <ShieldAlert size={14} className="mr-3" />
                        ) : (
                            <ShieldCheck size={14} className="mr-3" />
                        )}
                        <span className="flex-1 text-left uppercase tracking-tighter">Mantenimiento</span>
                        <div className={clsx(
                            "w-8 h-4 rounded-full relative transition-colors duration-500",
                            isMaintenance ? "bg-amber-500" : "bg-emerald-400"
                        )}>
                            <div className={clsx(
                                "absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all duration-500 shadow-sm",
                                isMaintenance ? "left-4.5" : "left-0.5"
                            )} />
                        </div>
                    </button>
                )}

                <Link
                    href="/"
                    target="_blank"
                    className="flex w-full items-center px-4 py-2 text-[12px] font-semibold text-gray-400 hover:bg-gray-100/50 hover:text-[#007AFF] rounded-xl transition-all group"
                >
                    <ExternalLink size={14} className="mr-3 text-gray-300 group-hover:text-[#007AFF]" />
                    Ver Sitio Público
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-2 text-[12px] font-semibold text-gray-400 hover:bg-red-50/50 hover:text-red-500 rounded-xl transition-all group"
                >
                    <LogOut size={14} className="mr-3 text-gray-300 group-hover:text-red-500" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    )
}
