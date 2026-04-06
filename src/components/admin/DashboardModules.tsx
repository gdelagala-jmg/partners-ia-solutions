'use client'

import { Box, Users, Mail, TrendingUp, ArrowUpRight, Activity } from 'lucide-react'

export function MetricCard({ title, value, icon: Icon, color, trend }: any) {
    return (
        <div className="flex flex-col">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-3xl font-bold text-[#1D1D1F] tracking-tight">{value}</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">{title}</p>
                </div>
                <div className={`p-3 rounded-2xl bg-white border border-white shadow-sm flex items-center justify-center shrink-0`}>
                    <Icon size={24} className={`text-[#1D1D1F] opacity-80`} />
                </div>
            </div>
            
            {trend && (
                <div className="mt-4 flex items-center gap-1.5 self-start px-2 py-0.5 rounded-full bg-emerald-50/50 border border-emerald-100/20 text-emerald-600 text-xs font-semibold">
                    <ArrowUpRight size={14} />
                    <span>{trend}</span>
                </div>
            )}
        </div>
    )
}

export function RecentActivity({ items }: { items: any[] }) {
    return (
        <div className="space-y-4">
            {items.map((item, i) => (
                <div key={i} className="flex items-center gap-4 group/item">
                    <div className="h-10 w-10 shrink-0 rounded-2xl bg-gray-50 flex items-center justify-center border border-gray-100 group-hover/item:bg-blue-50 group-hover/item:border-blue-100 transition-colors">
                        <item.icon size={18} className="text-gray-400 group-hover/item:text-blue-500 transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{item.title}</p>
                        <p className="text-xs text-gray-400">{item.time}</p>
                    </div>
                    {item.status && (
                        <span className="shrink-0 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-blue-50 text-blue-500 rounded-lg border border-blue-100/50">
                            {item.status}
                        </span>
                    )}
                </div>
            ))}
            
            <button className="w-full mt-4 py-2.5 text-xs font-semibold text-blue-500 hover:bg-blue-50/50 rounded-xl border border-transparent hover:border-blue-100 transition-all">
                Ver toda la actividad
            </button>
        </div>
    )
}

export function SystemStatus() {
    return (
        <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100/20">
                <div className="flex items-center gap-2 mb-2">
                    <Activity size={16} className="text-blue-500" />
                    <span className="text-xs font-bold text-blue-900 uppercase tracking-widest">Sistemas</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-blue-700/60 uppercase">DB Status</span>
                    <span className="text-emerald-500 font-bold">● ONLINE</span>
                </div>
                <div className="mt-2 h-1 w-full bg-blue-200/30 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-blue-500 rounded-full" />
                </div>
            </div>

            <div className="flex flex-col gap-1">
                <div className="flex justify-between text-xs text-gray-500 px-1">
                    <span>Uso de CPU</span>
                    <span className="font-semibold text-gray-900 font-mono">12%</span>
                </div>
                <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full w-[12%] bg-[#1D1D1F] rounded-full" />
                </div>
            </div>
        </div>
    )
}
