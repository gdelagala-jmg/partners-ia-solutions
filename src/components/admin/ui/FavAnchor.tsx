'use client'

import React from 'react'
import Link from 'next/link'
import { Star, GripVertical } from 'lucide-react'
import { clsx } from 'clsx'

interface FavAnchorProps {
    name: string
    href: string
    isActive?: boolean
    onRemove?: () => void
}

/**
 * FavAnchor Component
 * Renderizes custom user-defined shortcuts in the "Favoritos" section of the sidebar.
 * Includes visual cues for future Drag & Drop reorganizations.
 */
export default function FavAnchor({
    name,
    href,
    isActive = false,
    onRemove
}: FavAnchorProps) {
    return (
        <div 
            className={clsx(
                "group flex items-center px-4 py-2 text-[12px] font-semibold rounded-xl transition-all duration-300 relative dd-grab-handle hover:bg-gray-50/70",
                isActive 
                    ? "bg-violet-50/50 text-violet-700 border border-violet-100/50 shadow-sm" 
                    : "text-gray-600 hover:text-gray-900 border border-transparent"
            )}
        >
            {/* Future D&D Drag handle — invisible by default, visible on hover */}
            <div className="absolute left-1.5 opacity-0 group-hover:opacity-40 transition-opacity duration-200 text-gray-400">
                <GripVertical size={12} />
            </div>

            {/* Pinned visual star */}
            <Star 
                size={13} 
                className={clsx(
                    "mr-3 transition-colors duration-300 ml-1 group-hover:scale-105",
                    isActive ? "text-violet-500 fill-violet-500" : "text-amber-400 fill-amber-400/80"
                )} 
            />

            <Link href={href} className="flex-1 truncate">
                {name}
            </Link>

            {/* Micro active layout marker */}
            {isActive && (
                <div className="absolute right-2 w-1.5 h-1.5 bg-violet-500 rounded-full" />
            )}
        </div>
    )
}
