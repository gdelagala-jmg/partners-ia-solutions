'use client'

import React from 'react'

interface Column {
    header: string
    accessor: string | ((item: any) => React.ReactNode)
    className?: string
}

interface AdminTableProps {
    columns: Column[]
    data: any[]
    renderMobileCard: (item: any) => React.ReactNode
    emptyMessage?: string
    loading?: boolean
}

export default function AdminTable({
    columns,
    data,
    renderMobileCard,
    emptyMessage = "No hay datos disponibles.",
    loading = false
}: AdminTableProps) {
    if (loading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-white/40 backdrop-blur-sm rounded-2xl animate-pulse border border-white/20 shadow-sm" />
                ))}
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="bg-white/60 backdrop-blur-md border border-white/20 rounded-3xl p-12 text-center shadow-sm">
                <p className="text-gray-400 font-medium">{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            {/* Desktop View (Table) */}
            <div className="hidden md:block overflow-hidden bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100/50">
                        <thead className="bg-[#FBFBFD]/50 backdrop-blur-md">
                            <tr>
                                {columns.map((col, idx) => (
                                    <th
                                        key={idx}
                                        className={`px-6 py-4 text-left text-[11px] font-bold text-gray-400 uppercase tracking-widest ${col.className || ''}`}
                                    >
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {data.map((item, rowIdx) => (
                                <tr key={item.id || rowIdx} className="hover:bg-white/40 transition-colors group">
                                    {columns.map((col, colIdx) => (
                                        <td
                                            key={colIdx}
                                            className={`px-6 py-4 whitespace-nowrap text-sm text-[#1D1D1F] ${col.className || ''}`}
                                        >
                                            {typeof col.accessor === 'function' ? col.accessor(item) : item[col.accessor]}
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile View (Cards) */}
            <div className="md:hidden space-y-4">
                {data.map((item, idx) => (
                    <div key={item.id || idx} className="bg-white/70 backdrop-blur-xl border border-white/30 rounded-3xl p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)] active:scale-[0.98] transition-all">
                        {renderMobileCard(item)}
                    </div>
                ))}
            </div>
        </div>
    )
}

