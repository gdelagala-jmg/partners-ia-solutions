'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AdminToolbarProps {
    title: string
    description?: string
    actions?: React.ReactNode
    children?: React.ReactNode // Secondary actions or filters
    className?: string
    icon?: React.ReactNode
}

/**
 * AdminToolbar
 * Reusable header for admin modules.
 * Wave 5 hardening: flex-wrap so actions don't push width on 320px–375px.
 */
export default function AdminToolbar({
    title,
    description,
    actions,
    children,
    className,
    icon
}: AdminToolbarProps) {
    return (
        <div className={cn(
            "mb-8 flex flex-wrap gap-4 items-start lg:mb-10",
            className
        )}>
            {/* Title + description — takes all space it can */}
            <div className="min-w-0 flex-1">
                <div className="flex items-start gap-3 sm:gap-4">
                    {icon && (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0 border border-indigo-100/50 shadow-sm mt-0.5">
                            {(() => {
                                if (React.isValidElement(icon)) return icon;
                                if (typeof icon === 'function' || (typeof icon === 'object' && icon !== null && ('render' in icon || '$$typeof' in icon))) {
                                    return React.createElement(icon as any, { size: 22 });
                                }
                                return null;
                            })()}
                        </div>
                    )}
                    <div className="min-w-0 flex-1">
                        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-[#1D1D1F] truncate leading-tight">
                            {title}
                        </h1>
                        {description && (
                            <p className="mt-1.5 text-sm text-gray-500 max-w-3xl leading-relaxed">
                                {description}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Actions — shrink-0 so they don't compress, but flex-wrap parent prevents overflow */}
            <div className="flex items-center gap-3 shrink-0">
                {children}
                {actions && (
                    <div className="flex items-center gap-2">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    )
}
