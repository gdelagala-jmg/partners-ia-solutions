'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface FilterOption<T extends string> {
    id: T
    label: string
    count?: number
}

interface AdminFilterBarProps<T extends string> {
    options: FilterOption<T>[]
    activeId: T
    onChange: (id: T) => void
    className?: string
}

/**
 * AdminFilterBar
 * A premium, horizontal filter bar with counts and smooth transitions.
 */
export default function AdminFilterBar<T extends string>({
    options,
    activeId,
    onChange,
    className
}: AdminFilterBarProps<T>) {
    return (
        <div className={cn(
            "flex gap-2 overflow-x-auto pb-2 scrollbar-hide no-scrollbar",
            className
        )}>
            {options.map((option) => {
                const isActive = activeId === option.id
                
                return (
                    <button
                        key={option.id}
                        onClick={() => onChange(option.id)}
                        className={cn(
                            "flex items-center gap-2 px-5 py-2.5 rounded-2xl text-[13px] font-bold transition-all whitespace-nowrap border shadow-sm",
                            isActive
                                ? "bg-[#1D1D1F] text-white border-[#1D1D1F] shadow-lg shadow-black/5"
                                : "bg-white/60 backdrop-blur-md text-gray-500 border-white hover:bg-white/80"
                        )}
                    >
                        {option.label}
                        {option.count !== undefined && (
                            <span className={cn(
                                "text-[10px] px-2 py-0.5 rounded-lg",
                                isActive 
                                    ? "bg-white/20 text-white" 
                                    : "bg-gray-100 text-gray-400"
                            )}>
                                {option.count}
                            </span>
                        )}
                    </button>
                )
            })}
        </div>
    )
}
