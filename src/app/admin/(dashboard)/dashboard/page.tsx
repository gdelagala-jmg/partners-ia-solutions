// Card components are implemented locally as DashboardCard to avoid dependency on missing ui files
// For now, raw implementations to avoid dependency on uncreated files
import { Box, Users, Mail, TrendingUp } from 'lucide-react'

// Simple Card Component mock since we haven't created ui/card yet
function DashboardCard({ title, value, icon: Icon, color }: any) {
    return (
        <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow transition-all">
            <div className="flex items-center justify-between">
                <div className="overflow-hidden mr-2">
                    <p className="text-sm font-medium text-gray-500" title={title}>{title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mt-2">{value}</h3>
                </div>
                <div className={`p-3 rounded-lg bg-${color}-50 flex-shrink-0`}>
                    <Icon className={`text-${color}-600`} size={24} />
                </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-500">
                <TrendingUp size={14} className="text-green-600 mr-1 flex-shrink-0" />
                <span className="text-green-600 font-medium mr-1">+2.5%</span> <span>desde el mes pasado</span>
            </div>
        </div >
    )
}

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 mt-2">Bienvenido al Panel de Control de Partners IA Solutions.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
                <DashboardCard title="Soluciones Activas" value="12" icon={Box} color="cyan" />
                <DashboardCard title="Total Leads" value="45" icon={Mail} color="purple" />
                <DashboardCard title="Miembros Equipo" value="8" icon={Users} color="blue" />
                <DashboardCard title="Visitas Totales" value="1,240" icon={TrendingUp} color="emerald" />
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Actividad Reciente</h2>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                            <div className="flex items-center">
                                <div className="h-10 w-10 rounded-full bg-gray-50 flex items-center justify-center mr-4">
                                    <Mail size={18} className="text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-900">Nuevo Lead Recibido</p>
                                    <p className="text-xs text-gray-500">hace {i} horas</p>
                                </div>
                            </div>
                            <span className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded-full">
                                Nuevo
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
