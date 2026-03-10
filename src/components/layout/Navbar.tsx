'use client'

import Link from 'next/link'
import { useState, useEffect, useRef } from 'react'
import { Menu, X, User, ChevronDown, LayoutDashboard, LogOut } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'

const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Soluciones', href: '/soluciones' },
    { name: 'Escuela', href: '/escuela' },
    { name: 'Noticias IA', href: '/noticias' },
]

export default function Navbar({ session }: { session?: any }) {
    const [isOpen, setIsOpen] = useState(false)
    const [scrolled, setScrolled] = useState(false)
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
    const pathname = usePathname()
    const router = useRouter()
    const menuRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsUserMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' })
        setIsUserMenuOpen(false)
        router.refresh()
    }

    return (
        <nav
            className={`fixed w-full z-[100] top-0 transition-all duration-300 ${scrolled
                ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-sm'
                : 'bg-white/60 backdrop-blur-md border-b border-transparent'
                }`}
        >
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                <div className="flex items-center justify-between py-5">
                    <Link href="/" className="flex items-center group shrink-0">
                        <img
                            src="/logo-ias.png"
                            alt="IA Solutions"
                            className="h-16 w-auto object-contain transition-transform group-hover:scale-105"
                        />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {navItems.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${pathname === item.href || pathname.startsWith(item.href)
                                    ? 'text-gray-900 bg-gray-100'
                                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                    }`}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* Right Side Actions */}
                    <div className="flex items-center space-x-1 md:space-x-3">
                        <Link
                            href="/contacto"
                            className="hidden md:block px-5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all hover:scale-105 shadow-sm"
                        >
                            Contactar
                        </Link>

                        {session ? (
                            <div className="relative" ref={menuRef}>
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex flex-row items-center space-x-1 p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all font-medium"
                                >
                                    <User size={20} />
                                    <ChevronDown size={14} className={`transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-50">
                                        <div className="px-4 py-2 border-b border-gray-50 mb-2">
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Admin</p>
                                        </div>
                                        <Link
                                            href="/admin/dashboard"
                                            onClick={() => setIsUserMenuOpen(false)}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                        >
                                            <LayoutDashboard size={16} className="mr-2" />
                                            Dashboard
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut size={16} className="mr-2" />
                                            Cerrar Sesión
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/admin/login"
                                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-all"
                                title="Acceso Admin"
                            >
                                <User size={20} />
                            </Link>
                        )}

                        {/* Mobile Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="md:hidden p-2 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-all"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
                    }`}
            >
                <div className="px-6 py-4 bg-white border-t border-gray-200 space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-3 text-sm font-medium rounded-lg transition-all text-center ${pathname === item.href || pathname.startsWith(item.href)
                                ? 'text-gray-900 bg-gray-100'
                                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                                }`}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <div className="pt-4 space-y-2 border-t border-gray-200">
                        <Link
                            href="/contacto"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-3 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-all text-center"
                        >
                            Contactar
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    )
}
