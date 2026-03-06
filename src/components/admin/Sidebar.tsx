'use client'

import Link from 'next/link'
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
    X
} from 'lucide-react'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'

const menuItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Sectores', href: '/admin/sectors', icon: Box },
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

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        router.push('/admin/login')
        router.refresh()
    }

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Header */}
            <div className="p-8 border-b border-gray-50 hidden lg:block">
                <Link href="/" className="flex items-center group">
                    <img
                        src="/logo-ias.png"
                        alt="IA Solutions Admin"
                        className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
                    />
                </Link>
            </div>

            {/* Mobile Header Close */}
            <div className="p-6 border-b border-gray-50 lg:hidden flex justify-between items-center">
                <span className="text-xl font-bold text-gray-900 underline decoration-blue-500 decoration-4 underline-offset-4">Menú</span>
                <button
                    onClick={onCloseMobile}
                    className="p-2 bg-gray-50 rounded-full text-gray-400 hover:text-gray-900 transition-colors"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-6 space-y-1 overflow-y-auto custom-scrollbar">
                {menuItems.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            onClick={onCloseMobile}
                            className={clsx(
                                "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group",
                                isActive
                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            )}
                        >
                            <Icon
                                size={18}
                                className={clsx(
                                    "mr-3 transition-colors",
                                    isActive ? "text-white" : "text-gray-400 group-hover:text-blue-600"
                                )}
                            />
                            {item.name}
                        </Link>
                    )
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-6 border-t border-gray-50 space-y-2">
                <Link
                    href="/"
                    target="_blank"
                    className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-blue-600 rounded-xl transition-all group"
                >
                    <ExternalLink size={18} className="mr-3 text-gray-400 group-hover:text-blue-600 transition-colors" />
                    Sitio Público
                </Link>
                <button
                    onClick={handleLogout}
                    className="flex w-full items-center px-4 py-3 text-sm font-medium text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-all group"
                >
                    <LogOut size={18} className="mr-3 text-gray-400 group-hover:text-red-600 transition-colors" />
                    Cerrar Sesión
                </button>
            </div>
        </div>
    )
}
