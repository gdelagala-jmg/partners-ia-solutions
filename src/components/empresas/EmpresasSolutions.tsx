import { Bot, LineChart, FileText, Workflow, Users, Puzzle } from 'lucide-react'

const solutions = [
    {
        title: 'Automatización de Procesos',
        description: 'Eliminamos tareas manuales y repetitivas integrando IA en tus flujos de trabajo diarios para ahorrar tiempo y recursos.',
        icon: Workflow,
        color: 'text-purple-600',
        bg: 'bg-purple-50'
    },
    {
        title: 'Análisis de Datos y Reporting',
        description: 'Dashboards inteligentes que extraen información clave de tus bases de datos para tomar decisiones estratégicas en tiempo real.',
        icon: LineChart,
        color: 'text-blue-600',
        bg: 'bg-blue-50'
    },
    {
        title: 'Asistentes de Atención al Cliente',
        description: 'Chatbots avanzados que entienden el contexto y resuelven dudas de clientes 24/7, conectados a tus propios manuales.',
        icon: Bot,
        color: 'text-emerald-600',
        bg: 'bg-emerald-50'
    },
    {
        title: 'Gestión Documental',
        description: 'Sistemas que leen, clasifican y extraen datos de facturas, contratos y documentos legales automáticamente.',
        icon: FileText,
        color: 'text-amber-600',
        bg: 'bg-amber-50'
    },
    {
        title: 'Integraciones a Medida',
        description: 'Conectamos nuestras soluciones de IA con tu CRM, ERP o herramientas actuales (Salesforce, SAP, Hubspot, etc.).',
        icon: Puzzle,
        color: 'text-pink-600',
        bg: 'bg-pink-50'
    },
    {
        title: 'Copilotos para Empleados',
        description: 'Herramientas internas para ventas, RRHH o marketing que potencian el rendimiento diario de tu equipo.',
        icon: Users,
        color: 'text-indigo-600',
        bg: 'bg-indigo-50'
    }
]

export default function EmpresasSolutions() {
    return (
        <section id="soluciones" className="py-12 md:py-16 relative bg-gray-50 scroll-mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">¿En qué podemos ayudarte?</h2>
                    <p className="text-lg text-gray-600">
                        Nuestras soluciones abarcan todos los departamentos de tu empresa, enfocándonos siempre en el retorno de inversión y la eficiencia.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {solutions.map((solution, index) => (
                        <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                            <div className={`w-14 h-14 ${solution.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <solution.icon className={`w-7 h-7 ${solution.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">{solution.title}</h3>
                            <p className="text-gray-600 leading-relaxed">
                                {solution.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
