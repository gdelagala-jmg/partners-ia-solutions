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
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="h-20 bg-gray-50 rounded-xl animate-pulse border border-gray-100" />
                ))}
            </div>
        )
    }

    if (data.length === 0) {
        return (
            <div className="bg-white border border-gray-100 rounded-xl p-12 text-center">
                <p className="text-gray-500 font-medium">{emptyMessage}</p>
            </div>
        )
    }

    return (
        <div className="w-full">
            {/* Desktop View (Table) */}
            <div className="hidden md:block overflow-hidden bg-white border border-gray-100 rounded-xl shadow-sm">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-100">
                        <thead className="bg-gray-50/50">
                            <tr>
                                {columns.map((col, idx) => (
                                    <th
                                        key={idx}
                                        className={`px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className || ''}`}
                                    >
                                        {col.header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {data.map((item, rowIdx) => (
                                <tr key={item.id || rowIdx} className="hover:bg-gray-50/50 transition-colors">
                                    {columns.map((col, colIdx) => (
                                        <td
                                            key={colIdx}
                                            className={`px-6 py-4 whitespace-nowrap text-sm text-gray-900 ${col.className || ''}`}
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
                    <div key={item.id || idx} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm active:scale-[0.98] transition-transform">
                        {renderMobileCard(item)}
                    </div>
                ))}
            </div>
        </div>
    )
}
