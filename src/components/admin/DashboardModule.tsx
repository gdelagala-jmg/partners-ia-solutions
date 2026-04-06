'use client'

import React from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical } from 'lucide-react'

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
        opacity: isDragging ? 0.3 : 1,
        scale: isDragging ? 1.02 : 1,
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`
                group relative bg-white/70 backdrop-blur-xl border border-white/40 
                rounded-3xl p-5 shadow-sm hover:shadow-xl transition-all duration-300
                ${isDragging ? 'shadow-2xl border-blue-200/50 scale-[1.02]' : ''}
                ${className}
            `}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-semibold text-gray-400 tracking-tight flex-1 uppercase">
                    {title}
                </h3>
                
                {isEditing && (
                    <button
                        {...attributes}
                        {...listeners}
                        className="p-1.5 text-gray-300 hover:text-gray-600 hover:bg-gray-100/50 rounded-lg cursor-grab active:cursor-grabbing transition-colors"
                        title="Arrastrar para reordenar"
                    >
                        <GripVertical size={18} />
                    </button>
                )}
            </div>

            <div className="relative">
                {children}
            </div>

            {/* Subtle Apple-style glow on hover */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-blue-500/0 via-blue-500/0 to-blue-500/[0.02] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity" />
        </div>
    )
}
