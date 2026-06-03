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
    LayoutGrid,
    Send,
    Settings,
    Sparkles,
    GripVertical,
    Star,
    Activity,
    Sliders
} from 'lucide-react'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import FavAnchor from './ui/FavAnchor'

// Organized Sidebar Domains based on human workflow V2
const sidebarGroups = [
    {
        title: 'Páginas',
        items: [
            { name: 'Inicio', href: '/admin/editorial', icon: Sparkles },
            { name: 'Soluciones', href: '/admin/soluciones', icon: Puzzle },
            { name: 'Sectores', href: '/admin/sectors', icon: Box },
            { name: 'Academia', href: '/admin/escuela', icon: BookOpen },
            { name: 'Casos de Éxito', href: '/admin/casos', icon: Trophy },
            { name: 'Partners', href: '/admin/partners', icon: Handshake },
            { name: 'Convenios', href: '/admin/convenios', icon: Handshake },
            { name: 'Clientes', href: '/admin/clientes', icon: Users },
        ]
    },
    {
        title: 'Contenido',
        items: [
            { name: 'Noticias', href: '/admin/noticias', icon: FileText },
            { name: 'Hero Studio', href: '/admin/editorial', icon: Sparkles },
            { name: 'Biblioteca Multimedia', href: '/admin/media', icon: Video },
        ]
    },
    {
        title: 'Negocio',
        items: [
            { name: 'Leads', href: '/admin/leads', icon: Mail },
            { name: 'Inbox', href: '/admin/leads?view=inbox', icon: Mail },
            { name: 'Campañas', href: '/admin/newsletter/campaigns', icon: Send },
            { name: 'Newsletter', href: '/admin/newsletter', icon: Users },
            { name: 'Conversaciones IA', href: '/admin/asistente?view=chats', icon: Bot },
        ]
    },
    {
        title: 'Inteligencia',
        items: [
            { name: 'Asistente AI', href: '/admin/asistente', icon: Bot },
            { name: 'RAG Status', href: '/admin/asistente?view=rag', icon: Sliders },
            { name: 'Insights', href: '/admin/asistente?view=insights', icon: Activity },
            { name: 'Analytics IA', href: '/admin/dashboard', icon: LayoutDashboard },
        ]
    },
    {
        title: 'Sistema',
        items: [
            { name: 'Navegación', href: '/admin/navegacion', icon: Link2 },
            { name: 'Equipo', href: '/admin/equipo', icon: Users },
            { name: 'SMTP Config', href: '/admin/newsletter/settings', icon: Settings },
            { name: 'Seguridad', href: '/admin/seguridad', icon: ShieldCheck },
        ]
    }
]

// Mocked Favorites for the UX demonstration (Class A daily modules)
const initialFavorites = [
    { name: 'Noticias CMS', href: '/admin/noticias' },
    { name: 'Asistente AI Leads', href: '/admin/asistente' },
    { name: 'Bandeja Leads', href: '/admin/leads' }
]

interface SidebarProps {
    onCloseMobile?: () => void
}

export default function Sidebar({ onCloseMobile }: SidebarProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [isMaintenance, setIsMaintenance] = useState(false)
    const [loading, setLoading] = useState(true)
    const [favorites, setFavorites] = useState(initialFavorites)

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
        <div className="flex flex-col h-full glass-dock rounded-[2rem] overflow-hidden select-none">
            {/* Header - Minimalist premium Apple Style */}
            <div className="px-5 pt-7 pb-4 hidden lg:block bg-transparent">
                <div className="flex justify-start pl-1">
                    <Link href="/" className="flex items-center group">
                        <div className="flex items-center gap-2 text-[11px] font-bold text-gray-900 tracking-tight select-none">
                            <div className="w-5 h-5 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-sm shadow-blue-500/10 transition-transform group-hover:scale-105 duration-300">
                                <Sparkles size={11} className="fill-white" />
                            </div>
                            <span>Partners IA • Workspace</span>
                        </div>
                    </Link>
                </div>
            </div>

            {/* Mobile Header Close */}
            <div className="px-5 py-4 border-b border-gray-100 lg:hidden flex justify-between items-center bg-transparent">
                <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase">Menú Principal</span>
                <button
                    onClick={onCloseMobile}
                    className="p-1.5 bg-gray-50 rounded-xl text-gray-400 hover:text-gray-900 transition-all border border-gray-100 active:scale-90"
                >
                    <X size={16} />
                </button>
            </div>

            {/* Navigation Workspace - Breathing and Categorized */}
            <div className="flex-1 px-3 py-4 space-y-5 overflow-y-auto no-scrollbar bg-transparent">
                {/* 1. Main Navigation Shortcut (Mi Espacio de Trabajo) */}
                <div className="space-y-1">
                    <Link
                        href="/admin/dashboard"
                        onClick={onCloseMobile}
                        className={clsx(
                            "flex items-center px-3 py-2 text-[12px] font-bold rounded-xl transition-all duration-300 group relative border border-transparent",
                            pathname === '/admin/dashboard'
                                ? "active-premium-item text-gray-950"
                                : "text-gray-500 hover:bg-gray-50/50 hover:text-gray-950"
                        )}
                    >
                        <LayoutDashboard
                            size={14}
                            className={clsx(
                                "mr-2.5 transition-colors duration-300 shrink-0",
                                pathname === '/admin/dashboard' ? "text-blue-600" : "text-gray-400 group-hover:text-gray-950"
                            )}
                        />
                        <span className="truncate">Mi Espacio de Trabajo</span>

                        {pathname === '/admin/dashboard' && (
                            <div className="ml-auto w-1 h-3 bg-blue-500 rounded-full" />
                        )}
                    </Link>
                </div>

                {/* 2. ⭐ FAVORITOS SECTION */}
                <div className="space-y-1">
                    <div className="px-3 text-[9px] font-black text-gray-400 uppercase tracking-widest flex items-center justify-between">
                        <span>Favoritos</span>
                        <span className="text-[8px] font-semibold text-gray-300 lowercase italic opacity-40">D&D</span>
                    </div>
                    <div className="space-y-0.5 pt-1">
                        {favorites.map((fav) => (
                            <FavAnchor 
                                key={fav.href}
                                name={fav.name}
                                href={fav.href}
                                isActive={pathname === fav.href}
                            />
                        ))}
                    </div>
                </div>

                {/* 3. WORKFLOW DOMAINS */}
                {sidebarGroups.map((group, groupIdx) => (
                    <div key={groupIdx} className="space-y-1">
                        <div className="px-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                            {group.title}
                        </div>
                        <div className="space-y-0.5 pt-1">
                            {group.items.map((item) => {
                                const Icon = item.icon
                                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                                return (
                                    <div 
                                        key={item.href}
                                        className="group/item relative flex items-center rounded-xl transition-all duration-300"
                                    >
                                        {/* Drag Handle on hover for future D&D ready architecture */}
                                        <div className="absolute left-1 opacity-0 group-hover/item:opacity-30 transition-opacity duration-200 text-gray-400 cursor-grab active:cursor-grabbing dd-grab-handle">
                                            <GripVertical size={10} />
                                        </div>

                                        <Link
                                            href={item.href}
                                            onClick={onCloseMobile}
                                            className={clsx(
                                                "flex-1 flex items-center px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all duration-300 border border-transparent",
                                                isActive
                                                    ? "active-premium-item text-gray-950"
                                                    : "text-gray-500 hover:bg-gray-50/55 hover:text-gray-950"
                                            )}
                                        >
                                            <Icon
                                                size={12}
                                                className={clsx(
                                                    "mr-2.5 transition-colors duration-300 shrink-0",
                                                    isActive ? "text-blue-500" : "text-gray-400 group-hover/item:text-gray-950"
                                                )}
                                            />
                                            <span className="truncate">{item.name}</span>

                                            {isActive && (
                                                <div className="ml-auto w-1 h-3 bg-blue-500 rounded-full" />
                                            )}
                                        </Link>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* Footer Actions - Compact Apple Style */}
            <div className="px-3 py-4 border-t border-gray-100 space-y-1 bg-gray-50/5">
                {!loading && (
                    <button
                        onClick={toggleMaintenance}
                        className={clsx(
                            "flex w-full items-center px-3 py-1.5 text-[10px] font-bold rounded-lg transition-all border group mb-1.5",
                            isMaintenance 
                                ? "bg-amber-50/50 text-amber-700 hover:bg-amber-100/50 border-amber-100/50" 
                                : "bg-emerald-50/30 text-emerald-700 hover:bg-emerald-100/30 border-emerald-100/30"
                        )}
                    >
                        {isMaintenance ? (
                            <ShieldAlert size={12} className="mr-2 shrink-0" />
                        ) : (
                            <ShieldCheck size={12} className="mr-2 shrink-0" />
                        )}
                        <span className="flex-1 text-left uppercase tracking-tight text-[9px]">Mantenimiento</span>
                        <div className={clsx(
                            "w-6 h-3 rounded-full relative transition-colors duration-500 shrink-0",
                            isMaintenance ? "bg-amber-500" : "bg-emerald-400"
                        )}>
                            <div className={clsx(
                                "absolute top-0.5 w-2 h-2 bg-white rounded-full transition-all duration-500 shadow-sm",
                                isMaintenance ? "left-3.5" : "left-0.5"
                            )} />
                        </div>
                    </button>
                )}

                <Link
                    href="/"
                    target="_blank"
                    className="flex w-full items-center px-3 py-1.5 text-[10px] font-semibold text-gray-400 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-all group"
                >
                    <ExternalLink size={12} className="mr-2 text-gray-300 group-hover:text-gray-900 shrink-0" />
                    Sitio Público
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-3 py-1.5 text-[10px] font-semibold text-gray-400 hover:bg-red-50/20 hover:text-red-500 rounded-lg transition-all group"
                >
                    <LogOut size={12} className="mr-2 text-gray-300 group-hover:text-red-500 shrink-0" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    )
}
