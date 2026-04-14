'use client'

import { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import { Menu, X, LogOut, ExternalLink } from 'lucide-react'
import { ModuleTracker } from '@/components/admin/ModuleTracker'

export default function AdminLayoutShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (

        <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] overflow-x-hidden font-sans">
            {/* Mobile Header - Glassmorphic Pill style */}
            <div className="lg:hidden fixed top-2 left-2 right-2 z-40 bg-white/70 backdrop-blur-xl border border-white/20 rounded-xl p-2.5 flex items-center justify-between shadow-sm">
                <span className="font-semibold text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 pl-2">
                    IA Partners
                </span>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-1.5 rounded-lg bg-gray-50/50 hover:bg-gray-100 transition-all active:scale-95"
                >
                    {isSidebarOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>

            {/* Sidebar Container - Glassmorphic translucent style */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-60 bg-white/90 backdrop-blur-2xl border-r border-gray-100/50 transition-all duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
            `}>
                <Sidebar onCloseMobile={() => setIsSidebarOpen(false)} />
            </aside>

            {/* Backdrop for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/5 z-40 lg:hidden backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content Area - Ultra dense layout */}
            <main className={`
                p-2 md:p-3 transition-all duration-300
                lg:ml-60 min-h-screen pt-16 lg:pt-3 overflow-x-hidden
            `}>
                <div className="w-full mx-auto space-y-4 animate-in fade-in duration-300">
                    {children}
                </div>
            </main>
            <ModuleTracker />
        </div>
    )
}
