'use client'

import React from 'react'
import { cn } from '@/lib/utils'

type StatusType = 'success' | 'warning' | 'error' | 'info' | 'default'

interface AdminStatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    label: string
    type?: StatusType
    dot?: boolean
}

/**
 * AdminStatusBadge
 * Professional status indicators for the admin dashboard.
 */
export default function AdminStatusBadge({
    label,
    type = 'default',
    dot = true,
    className,
    children,
    ...props
}: AdminStatusBadgeProps) {
    
    const styles = {
        default: "bg-gray-100 text-gray-700 border-gray-200",
        success: "bg-emerald-50 text-emerald-700 border-emerald-200",
        warning: "bg-amber-50 text-amber-700 border-amber-200",
        error: "bg-red-50 text-red-700 border-red-200",
        info: "bg-blue-50 text-blue-700 border-blue-200"
    }

    const dotStyles = {
        default: "bg-gray-400",
        success: "bg-emerald-500",
        warning: "bg-amber-500",
        error: "bg-red-500",
        info: "bg-blue-500"
    }

    return (
        <span className={cn(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border whitespace-nowrap",
            styles[type],
            className
        )}
        {...props}
        >
            {dot && <span className={cn("w-1.5 h-1.5 rounded-full", dotStyles[type])} />}
            {label || children}
        </span>
    )
}
