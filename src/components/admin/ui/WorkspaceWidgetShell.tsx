'use client'

import React from 'react'
import { clsx } from 'clsx'
import { GripVertical } from 'lucide-react'

interface WorkspaceWidgetShellProps {
    children: React.ReactNode
    title?: string
    description?: string
    icon?: React.ComponentType<{ size?: number; className?: string }>
    actions?: React.ReactNode
    className?: string
    glow?: 'none' | 'violet' | 'cian'
}

/**
 * WorkspaceWidgetShell Component
 * A premium, breathing card container for analytical and AI widgets on "Mi Espacio de Trabajo".
 * Adopts the 70% AI / 20% Operational / 10% Mission Control visual style.
 */
export default function WorkspaceWidgetShell({
    children,
    title,
    description,
    icon: Icon,
    actions,
    className,
    glow = 'none'
}: WorkspaceWidgetShellProps) {
    return (
        <div 
            className={clsx(
                "workspace-widget-solid relative flex flex-col group/widget overflow-hidden rounded-[20px]",
                glow === 'violet' && "ai-violet-glow border-violet-150/40 bg-violet-50/5",
                glow === 'cian' && "ai-cian-glow border-cyan-150/40 bg-cyan-50/5",
                className
            )}
        >
            {/* Header Area */}
            {(title || Icon || actions) && (
                <div className="px-8 pt-8 pb-0.5 flex items-start justify-between gap-4 border-b border-transparent">
                    <div className="flex items-start gap-3 min-w-0">
                        {/* Drag and Drop visual indicator - static but sutil */}
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 opacity-[0.12] group-hover/widget:opacity-40 transition-opacity duration-200 text-gray-400 cursor-grab active:cursor-grabbing">
                            <GripVertical size={12} />
                        </div>

                        {Icon && (
                            <div className={clsx(
                                "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover/widget:scale-105 duration-300",
                                glow === 'violet' 
                                    ? "bg-violet-50/40 text-violet-600" 
                                    : glow === 'cian'
                                    ? "bg-cyan-50/40 text-cyan-600"
                                    : "bg-blue-50/40 text-blue-600"
                            )}>
                                <Icon size={16} />
                            </div>
                        )}
                        
                        <div className="min-w-0">
                            {title && (
                                <h3 className="text-[12px] font-bold text-gray-900 tracking-tight uppercase">
                                    {title}
                                </h3>
                            )}
                            {description && (
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-0.5">
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
            
            {/* Content Area - Extra Breathing Space V2 */}
            <div className="flex-1 p-8 md:p-9 pt-6 md:pt-7">
                {children}
            </div>
        </div>
    )
}
