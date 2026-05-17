'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'
import AdminCard from './ui/AdminCard'
import { cn } from '@/lib/utils'

interface DashboardModuleProps {
    id: string
    title: string
    children: React.ReactNode
    isEditing?: boolean
    className?: string
}

export function DashboardModule({ id, title, children, isEditing, className = '' }: DashboardModuleProps) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: isDragging ? 50 : 'auto',
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative transition-all duration-300",
                isDragging ? "opacity-30 scale-[1.02] z-50 cursor-grabbing" : "opacity-100",
                isEditing && !isDragging && "hover:scale-[1.01]",
                className
            )}
        >
            <AdminCard
                title={title.toUpperCase()}
                headerClassName="border-none pb-0 pt-5 px-5"
                contentClassName="pt-2"
                glass
                noPadding
                className={cn(
                    "rounded-[2rem] border-white/40 shadow-sm group-hover:shadow-xl transition-all duration-500",
                    isEditing && !isDragging && "border-dashed border-blue-300/50 bg-blue-50/10",
                    isDragging && "shadow-2xl border-blue-400/50 scale-[1.02] ring-4 ring-blue-500/10"
                )}
                actions={isEditing && (
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Mover
                        </span>
                        <button
                            {...attributes}
                            {...listeners}
                            className="p-1.5 text-blue-400 hover:text-blue-600 hover:bg-blue-100/50 rounded-lg cursor-grab active:cursor-grabbing transition-colors"
                            title="Arrastrar para reordenar"
                        >
                            <GripVertical size={18} />
                        </button>
                    </div>
                )}
            >
                <div className="px-5 pb-5">
                    {children}
                </div>
            </AdminCard>

            {/* Subtle premium glow on hover */}
            <div className={cn(
                "absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-blue-500/0 via-blue-500/0 to-blue-500/[0.03] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity",
                isDragging && "hidden"
            )} />
        </div>
    )
}

