'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MoreVertical, MoreHorizontal } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ActionItem {
    label: string
    icon?: React.ReactNode
    onClick: () => void
    variant?: 'default' | 'danger'
}

interface AdminActionMenuProps {
    actions: ActionItem[]
    direction?: 'vertical' | 'horizontal'
    className?: string
    align?: 'left' | 'right'
}

/**
 * AdminActionMenu
 * Premium "three-dots" ⋯ menu for action condensation.
 * Essential for responsive hardening (Wave 1).
 */
export default function AdminActionMenu({
    actions,
    direction = 'vertical',
    className,
    align = 'right'
}: AdminActionMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <div className={cn("relative inline-block", className)} ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "p-2 rounded-lg transition-all duration-200 hover:bg-gray-100/80 active:scale-95",
                    isOpen ? "bg-gray-100" : "bg-transparent"
                )}
                aria-label="Más acciones"
                type="button"
            >
                {direction === 'vertical' ? (
                    <MoreVertical className="w-5 h-5 text-gray-500" />
                ) : (
                    <MoreHorizontal className="w-5 h-5 text-gray-500" />
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.15, ease: "easeOut" }}
                        className={cn(
                            "absolute z-50 mt-2 min-w-[160px] py-1 bg-white border border-gray-200 rounded-xl shadow-xl",
                            align === 'right' ? "right-0" : "left-0"
                        )}
                    >
                        {actions.map((action, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    action.onClick()
                                    setIsOpen(false)
                                }}
                                className={cn(
                                    "w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors duration-150",
                                    action.variant === 'danger' 
                                        ? "text-red-600 hover:bg-red-50" 
                                        : "text-gray-700 hover:bg-gray-50"
                                )}
                            >
                                {action.icon && (
                                    <span className="shrink-0 w-4 h-4 opacity-70 flex items-center justify-center">
                                        {(() => {
                                            if (React.isValidElement(action.icon)) return action.icon;
                                            if (typeof action.icon === 'function' || (typeof action.icon === 'object' && action.icon !== null && ('render' in action.icon || '$$typeof' in action.icon))) {
                                                return React.createElement(action.icon as any, { size: 16 });
                                            }
                                            return null;
                                        })()}
                                    </span>
                                )}
                                <span className="font-medium whitespace-nowrap">{action.label}</span>
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
