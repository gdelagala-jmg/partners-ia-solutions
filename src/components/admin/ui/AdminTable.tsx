'use client'

import React from 'react'
import { cn } from '@/lib/utils'
import AdminCard from './AdminCard'

interface Column {
    header: string
    accessor: string | ((item: any) => React.ReactNode)
    render?: (value: any, item: any) => React.ReactNode
    className?: string
}

interface AdminTableProps {
    columns: Column[]
    data: any[]
    renderMobileCard: (item: any) => React.ReactNode
    emptyMessage?: string
    loading?: boolean
    className?: string
}

/**
 * AdminTable
 * A premium, responsive table component that automatically switches to a card-based
 * layout on mobile devices.
 * 
 * Wave 5 – Responsive hardening:
 * - Removed `whitespace-nowrap` from <td> (was causing horizontal page scroll)
 * - Added max-w-full + min-w-0 on outer wrapper
 * - Table uses `w-full` instead of `min-w-full` to prevent over-expansion
 * - Mobile cards use p-4 sm:p-5 for density
 */
export default function AdminTable({
    columns,
    data,
    renderMobileCard,
    emptyMessage = "No hay datos disponibles.",
    loading = false,
    className
}: AdminTableProps) {
    if (loading) {
        return (
            <div className={cn("space-y-4", className)}>
                {[1, 2, 3].map(i => (
                    <div 
                        key={i} 
                        className="h-20 bg-white/40 backdrop-blur-sm rounded-3xl animate-pulse border border-white shadow-sm" 
                    />
                ))}
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <AdminCard className={cn("p-12 text-center", className)}>
                <p className="text-gray-400 font-bold text-[13px] uppercase tracking-widest">
                    {emptyMessage}
                </p>
            </AdminCard>
        )
    }

    return (
        <div className={cn("w-full max-w-full min-w-0", className)}>
            {/* Desktop View (Table) — hidden on mobile */}
            <div className="hidden md:block overflow-hidden bg-white/80 backdrop-blur-xl border border-white rounded-[2rem] shadow-[0_8px_40px_rgba(0,0,0,0.04)] max-w-full">
                <div className="overflow-x-auto max-w-full">
                    <table className="w-full divide-y divide-gray-100/50">
                        <thead className="bg-gray-50/50">
                            <tr>
                                {columns.map((col, idx) => (
                                    <th
                                        key={idx}
                                        className={cn(
                                            "px-4 lg:px-6 py-5 text-left text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]",
                                            col.className
                                        )}
                                    >
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {data.map((item, rowIdx) => (
                                <tr 
                                    key={item.id || rowIdx} 
                                    className="hover:bg-gray-50/30 transition-all group"
                                >
                                    {columns.map((col, colIdx) => (
                                        <td
                                            key={colIdx}
                                            className={cn(
                                                // Removed whitespace-nowrap — it was forcing horizontal expansion.
                                                // max-w-0 lets truncate work inside flex children.
                                                "px-4 lg:px-6 py-5 text-[13px] font-medium text-[#1D1D1F] max-w-0",
                                                col.className
                                            )}
                                        >
                                            {(() => {
                                                const value = typeof col.accessor === 'function' 
                                                    ? col.accessor(item) 
                                                    : item[col.accessor];
                                                
                                                if (col.render) {
                                                    return col.render(value, item);
                                                }
                                                
                                                return value;
                                            })()}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile View (Cards) — shown only on mobile */}
            <div className="md:hidden space-y-4">
                {data.map((item, idx) => (
                    <AdminCard 
                        key={item.id || idx}
                        className="active:scale-[0.98] transition-transform border-white"
                        noPadding
                    >
                        <div className="p-4 sm:p-5">
                            {renderMobileCard(item)}
                        </div>
                    </AdminCard>
                ))}
            </div>
        </div>
    )
}
