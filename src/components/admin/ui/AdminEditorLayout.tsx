'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AdminEditorLayoutProps {
    children: React.ReactNode
    sidebar: React.ReactNode
    telemetry?: React.ReactNode
    className?: string
}

/**
 * AdminEditorLayout
 * Reusable Control Center OS component representing the asymmetrical 70/30 grid layout.
 * Enforces structured division:
 * - Content Area: 70% width (lg:col-span-7) for main fields, accordions, and assets.
 * - Sidebar Area: 30% width (lg:col-span-3) for configurations, categories, and controls.
 * Supports a modular top banner for completeness telemetry.
 */
export default function AdminEditorLayout({
    children,
    sidebar,
    telemetry,
    className
}: AdminEditorLayoutProps) {
    return (
        <div className={cn("space-y-8 select-none", className)}>
            {/* Dynamic Telemetry Banner wrapper */}
            {telemetry && (
                <div className="w-full animate-in fade-in slide-in-from-top-1 duration-200">
                    {telemetry}
                </div>
            )}

            {/* Grid distribution */}
            <div className="grid grid-cols-1 lg:grid-cols-10 gap-8">
                {/* Main content - 7 columns */}
                <div className="lg:col-span-7 space-y-6">
                    {children}
                </div>

                {/* Sidebar options - 3 columns */}
                <div className="lg:col-span-3 space-y-6">
                    {sidebar}
                </div>
            </div>
        </div>
    )
}
