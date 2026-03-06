'use client'

import { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import { Menu, X, LogOut, ExternalLink } from 'lucide-react'

export default function AdminLayoutShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (

        <div className="min-h-screen bg-gray-50/50 text-gray-900 selection:bg-blue-100 selection:text-blue-700">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between">
                <span className="font-bold text-lg bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                    Partners IA
                </span>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 -mr-2 text-gray-500 hover:text-gray-900 transition-colors"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Container */}
            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}
            `}>
                <Sidebar onCloseMobile={() => setIsSidebarOpen(false)} />
            </aside>

            {/* Backdrop for mobile sidebar */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-gray-900/20 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <main className={`
                p-4 md:p-6 lg:p-10 pt-20 lg:pt-10 transition-all duration-300
                lg:ml-72 min-h-screen
            `}>
                <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {children}
                </div>
            </main>
        </div>
    )
}
