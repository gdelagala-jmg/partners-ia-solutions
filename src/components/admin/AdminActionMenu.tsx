'use client'

import { useState, useRef, useEffect } from 'react'
import { MoreHorizontal } from 'lucide-react'

interface Action {
    label: string
    icon: React.ElementType
    onClick: () => void
    variant?: 'default' | 'danger'
}

interface AdminActionMenuProps {
    actions: Action[]
}

export default function AdminActionMenu({ actions }: AdminActionMenuProps) {
    const [isOpen, setIsOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

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
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-900 focus:outline-none"
            >
                <MoreHorizontal size={20} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] z-50 py-2 animate-in fade-in zoom-in duration-200">
                    {actions.map((action, idx) => {
                        const Icon = action.icon
                        return (
                            <button
                                key={idx}
                                onClick={() => {
                                    action.onClick()
                                    setIsOpen(false)
                                }}
                                className={`w-full flex items-center px-4 py-2.5 text-sm transition-all active:scale-[0.98] ${action.variant === 'danger'
                                        ? 'text-red-500 hover:bg-red-50/50'
                                        : 'text-[#1D1D1F] hover:bg-white/40'
                                    }`}
                            >
                                <Icon size={16} className="mr-3 text-gray-400" />
                                {action.label}
                            </button>
                        )
                    })}
                </div>
            )}

        </div>
    )
}
