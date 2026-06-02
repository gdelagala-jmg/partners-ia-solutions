'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface StickyActionBarProps {
    children: React.ReactNode
    primaryAction?: React.ReactNode
    className?: string
}

/**
 * StickyActionBar
 * Pinned floating bottom pastilla that aggregates edit actions.
 * Separates editorial/secondary actions (left-hand, passed as children) 
 * from the primary database submission action (right-hand, passed as primaryAction).
 * Styles feature modern borders, glassmorphic backdrop-blur, and sliding entry transitions.
 */
export default function StickyActionBar({
    children,
    primaryAction,
    className
}: StickyActionBarProps) {
    return (
        <div className={cn(
            "sticky bottom-6 z-30 w-full bg-white/95 backdrop-blur-md border border-gray-150 rounded-2xl p-4 shadow-xl flex flex-wrap items-center justify-between gap-4 animate-in slide-in-from-bottom-5 duration-300 mt-8",
            className
        )}>
            {/* Left Side: Draft, Cancel, Preview and distribution actions */}
            <div className="flex flex-wrap items-center gap-2.5">
                {children}
            </div>

            {/* Right Side: Primary catalog submission buttons */}
            {primaryAction && (
                <div className="flex items-center gap-2.5 sm:ml-auto w-full sm:w-auto justify-end">
                    {primaryAction}
                </div>
            )}
        </div>
    )
}
