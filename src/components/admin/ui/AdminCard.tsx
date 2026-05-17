'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface AdminCardProps {
    children: React.ReactNode
    title?: string
    description?: string
    icon?: React.ReactNode
    actions?: React.ReactNode
    className?: string
    contentClassName?: string
    headerClassName?: string
    glass?: boolean
    noPadding?: boolean
}

/**
 * AdminCard
 * Standardized administrative surface.
 * Optimized for density and responsive padding.
 */
export default function AdminCard({
    children,
    title,
    description,
    icon,
    actions,
    className,
    contentClassName,
    headerClassName,
    glass,
    noPadding
}: AdminCardProps) {
    return (
        <div className={cn(
            "bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col",
            glass && "bg-white/70 backdrop-blur-xl border-white/40",
            className
        )}>
            {(title || actions) && (
                <div className={cn(
                    "px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4",
                    headerClassName
                )}>
                    <div className="min-w-0 flex items-center gap-3">
                        {icon && (
                            <div className="shrink-0 text-indigo-600">
                                {(() => {
                                    if (React.isValidElement(icon)) return icon;
                                    if (
                                        typeof icon === 'function' ||
                                        (typeof icon === 'object' && icon !== null &&
                                         ('render' in (icon as object) || '$$typeof' in (icon as object)))
                                    ) {
                                        return React.createElement(icon as React.ElementType, { size: 18 });
                                    }
                                    return null;
                                })()}
                            </div>
                        )}
                        <div className="min-w-0">
                            {title && (
                                <h3 className="text-base font-semibold text-gray-900 truncate">
                                    {title}
                                </h3>
                            )}
                            {description && (
                                <p className="text-xs text-gray-500 truncate">
                                    {description}
                                </p>
                            )}
                        </div>
                    </div>
                    {actions && (
                        <div className="shrink-0 flex items-center gap-2">
                            {actions}
                        </div>
                    )}
                </div>
            )}
            
            <div className={cn(
                "flex-1",
                !noPadding && "admin-card-padding",
                contentClassName
            )}>
                {children}
            </div>
        </div>
    )
}
