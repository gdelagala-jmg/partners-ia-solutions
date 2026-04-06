'use client'

import { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import { Menu, X, LogOut, ExternalLink } from 'lucide-react'

export default function AdminLayoutShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (

        <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F] selection:bg-blue-100 selection:text-blue-700 font-sans">
            {/* Mobile Header - Glassmorphic Pill style */}
            <div className="lg:hidden fixed top-4 left-4 right-4 z-40 bg-white/70 backdrop-blur-xl border border-white/20 rounded-2xl p-3 flex items-center justify-between shadow-lg shadow-black/5">
                <span className="font-semibold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 pl-2">
                    IA Partners
                </span>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-xl bg-gray-50/50 hover:bg-gray-100 transition-all active:scale-95"
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar Container - Glassmorphic translucent style */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-white/80 backdrop-blur-2xl border-r border-gray-100/50 transition-all duration-500 ease-in-out
                ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
            `}>
                <Sidebar onCloseMobile={() => setIsSidebarOpen(false)} />
            </aside>

            {/* Backdrop for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/5 z-40 lg:hidden backdrop-blur-[2px] transition-opacity duration-500"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content Area - Reduced spacing for Apple layout */}
            <main className={`
                p-4 md:p-6 transition-all duration-500
                lg:ml-64 min-h-screen pt-24 lg:pt-8
            `}>
                <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {children}
                </div>
            </main>
        </div>
    )
}
