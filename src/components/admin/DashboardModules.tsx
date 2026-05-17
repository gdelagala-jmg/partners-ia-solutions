'use client'

import { Box, Users, Mail, TrendingUp, ArrowUpRight, Activity } from 'lucide-react'
import AdminCard from './ui/AdminCard'
import AdminStatusBadge from './ui/AdminStatusBadge'
import { cn } from '@/lib/utils'

export function MetricCard({ title, value, icon: Icon, color, trend }: any) {
    return (
        <AdminCard className="h-full" noPadding>
            <div className="p-5 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between">
                    <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1 truncate">
                            {title}
                        </p>
                        <h3 className="text-3xl font-black text-[#1D1D1F] tracking-tighter truncate">
                            {value}
                        </h3>
                    </div>
                    <div className={cn(
                        "p-3 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 shadow-inner",
                        color === 'blue' && "text-blue-600 bg-blue-50/30",
                        color === 'purple' && "text-purple-600 bg-purple-50/30",
                        color === 'emerald' && "text-emerald-600 bg-emerald-50/30",
                    )}>
                        <Icon size={22} strokeWidth={2.5} />
                    </div>
                </div>
                
                {trend && (
                    <div className="mt-4 flex items-center gap-1.5 self-start px-2 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-wider">
                        <ArrowUpRight size={12} strokeWidth={3} />
                        <span>{trend}</span>
                    </div>
                )}
            </div>
        </AdminCard>
    )
}

export function RecentActivity({ items }: { items: any[] }) {
    return (
        <AdminCard noPadding>
            <div className="divide-y divide-gray-50">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 group/item hover:bg-gray-50/50 transition-colors">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-white flex items-center justify-center border border-gray-100 shadow-sm group-hover/item:border-blue-200 transition-colors">
                            <item.icon size={18} className="text-gray-400 group-hover/item:text-blue-500 transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-[#1D1D1F] truncate group-hover/item:text-blue-600 transition-colors">
                                {item.title}
                            </p>
                            <p className="text-[10px] font-medium text-gray-400 uppercase tracking-tight">
                                {item.time}
                            </p>
                        </div>
                        {item.status && (
                            <AdminStatusBadge 
                                label={item.status} 
                                type="info" 
                                dot={false} 
                                className="text-[9px] font-black py-0 px-2" 
                            />
                        )}
                    </div>
                ))}
            </div>
            
            <div className="p-3 border-t border-gray-50">
                <button className="w-full py-2 text-[11px] font-black text-blue-600 hover:bg-blue-50 rounded-lg transition-all uppercase tracking-widest">
                    Ver toda la actividad
                </button>
            </div>
        </AdminCard>
    )
}

export function SystemStatus() {
    return (
        <AdminCard noPadding>
            <div className="p-5 space-y-5">
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-100 shadow-inner">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <Activity size={14} className="text-blue-500" />
                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Database</span>
                        </div>
                        <AdminStatusBadge label="ONLINE" type="success" className="text-[9px]" />
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full w-[85%] bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
                    </div>
                </div>

                <div className="space-y-3 px-1">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            <span>CPU Usage</span>
                            <span className="text-[#1D1D1F] font-black font-mono">12%</span>
                        </div>
                        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full w-[12%] bg-[#1D1D1F] rounded-full" />
                        </div>
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-gray-400">
                            <span>Memory</span>
                            <span className="text-[#1D1D1F] font-black font-mono">45%</span>
                        </div>
                        <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full w-[45%] bg-[#1D1D1F] rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </AdminCard>
    )
}

