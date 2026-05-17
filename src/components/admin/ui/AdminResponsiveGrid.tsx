'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AdminResponsiveGridProps {
    children: React.ReactNode
    cols?: 1 | 2 | 3 | 4
    className?: string
    gap?: 'sm' | 'md' | 'lg'
}

/**
 * AdminResponsiveGrid
 * A grid system designed for administrative density and overflow safety.
 * Forces horizontal containment and handles column collapsing.
 */
export default function AdminResponsiveGrid({
    children,
    cols = 3,
    className,
    gap = 'md'
}: AdminResponsiveGridProps) {
    
    const gridCols = {
        1: "grid-cols-1",
        2: "grid-cols-1 md:grid-cols-2",
        3: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    }

    const gapSize = {
        sm: "gap-4",
        md: "gap-6",
        lg: "gap-8"
    }

    return (
        <div className={cn(
            "grid w-full min-w-0 max-w-full overflow-hidden",
            gridCols[cols],
            gapSize[gap],
            className
        )}>
            {children}
        </div>
    )
}
