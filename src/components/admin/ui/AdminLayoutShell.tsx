'use client'

import React, { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'
import { ModuleTracker } from '@/components/admin/ModuleTracker'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import './AdminInfrastructure.css'

interface AdminLayoutShellProps {
    children: React.ReactNode
    className?: string
}

/**
 * AdminLayoutShell (Hardened & Responsive)
 * The root infrastructure for the admin UX.
 * Handles sidebar layout, mobile responsiveness, and overflow prevention.
 */
export default function AdminLayoutShell({
    children,
    className
}: AdminLayoutShellProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)

    return (
        <div className="flex min-h-screen bg-gray-50/50 relative">
            {/* Mobile Header Overlay - Wave 1 Hardening */}
            <div className="lg:hidden fixed top-3 left-3 right-3 z-40 bg-white/80 backdrop-blur-md border border-gray-200 rounded-xl p-2.5 flex items-center justify-between shadow-sm">
                <span className="font-bold text-sm tracking-tight text-blue-600 pl-2">
                    ADMIN PANEL
                </span>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-all active:scale-95"
                    aria-label={isSidebarOpen ? "Cerrar menú" : "Abrir menú"}
                >
                    {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                </button>
            </div>

            {/* Sidebar Overlay for Mobile */}
            <div 
                className={cn(
                    "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300",
                    isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sidebar Section - Padded container for V2A.5 floating capsule dock */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-60 bg-transparent transition-transform duration-300 ease-in-out lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
                "py-3 pl-3 pr-1.5",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <Sidebar onCloseMobile={() => setIsSidebarOpen(false)} />
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 relative">
                {/* Module Tracker / Breadcrumbs Layer */}
                <div className="shrink-0 z-20 pt-16 lg:pt-0">
                    <ModuleTracker />
                </div>

                {/* Scrollable Workspace - Now using document scroll */}
                <div className={cn(
                    "flex-1 relative admin-safe-container overflow-hidden",
                    "p-3 sm:p-6 lg:p-8",
                    className
                )}>
                    {/* Inner content wrapper with maximum width for readability on ultra-wide screens */}
                    <div className="max-w-[1600px] mx-auto w-full min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    )
}
