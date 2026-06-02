'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp, AlertCircle, CheckCircle2 } from 'lucide-react'

interface FormAccordionProps {
    id: string
    title: string
    description: string
    icon: React.ReactNode
    isOpen: boolean
    onToggle: () => void
    hasError?: boolean
    isCompleted?: boolean
    required?: boolean
    children: React.ReactNode
    className?: string
}

/**
 * FormAccordion
 * Reusable Control Center OS component representing a collapsible section in complex forms.
 * - Supports validation error states, showing a highlighted red border and warning icon.
 * - Displays an optional completion mark when fields are populated.
 * - Features rotating chevrons and structured text headings.
 * - CRITICAL: Kept permanently in the DOM with visibility hidden toggle to prevent losing
 *   React Hook Form references when collapsed.
 */
export default function FormAccordion({
    id,
    title,
    description,
    icon,
    isOpen,
    onToggle,
    hasError = false,
    isCompleted = false,
    required = false,
    children,
    className
}: FormAccordionProps) {
    return (
        <div className={cn(
            "border rounded-2xl transition-all duration-200 overflow-hidden",
            hasError 
                ? "border-red-300 bg-red-50/5 ring-1 ring-red-200" 
                : "border-gray-150 bg-white",
            className
        )}>
            {/* Interactive Header Card */}
            <button
                type="button"
                onClick={onToggle}
                className="w-full px-5 py-4 flex items-center justify-between bg-gray-50/40 hover:bg-gray-50 transition-colors focus:outline-none"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3 min-w-0">
                    {/* Left Icon (Error state shows a warning icon instead) */}
                    <div className={cn(
                        "p-1.5 rounded-lg border shrink-0",
                        hasError 
                            ? "bg-red-50 text-red-500 border-red-100" 
                            : "bg-white text-gray-500 border-gray-100"
                    )}>
                        {hasError ? <AlertCircle size={16} /> : icon}
                    </div>
                    
                    {/* Headings */}
                    <div className="text-left min-w-0">
                        <p className="text-xs font-bold text-gray-900 flex items-center gap-2 truncate">
                            <span>{title}</span>
                            {required && (
                                <span className="text-[9px] text-indigo-500 font-bold uppercase tracking-widest shrink-0">
                                    (Obligatorio)
                                </span>
                            )}
                        </p>
                        <p className="text-[10px] text-gray-400 truncate max-w-[240px] sm:max-w-md lg:max-w-lg">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Right Indicators */}
                <div className="flex items-center gap-2.5 shrink-0 ml-4">
                    {isCompleted && !hasError && (
                        <CheckCircle2 size={14} className="text-emerald-500" />
                    )}
                    {isOpen ? (
                        <ChevronUp size={16} className="text-gray-400" />
                    ) : (
                        <ChevronDown size={16} className="text-gray-400" />
                    )}
                </div>
            </button>

            {/* Accordion Content Block (Kept in DOM so inputs remain active in React Hook Form) */}
            <div className={cn("p-5 border-t border-gray-100 space-y-2", !isOpen && "hidden")}>
                {children}
            </div>
        </div>
    )
}
