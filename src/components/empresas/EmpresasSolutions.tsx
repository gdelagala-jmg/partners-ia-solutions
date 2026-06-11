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

import SectionBlock from '@/components/ui/layout/SectionBlock'
import SectionHeader from '@/components/ui/layout/SectionHeader'
import CardGrid from '@/components/ui/layout/CardGrid'

export default function EmpresasSolutions() {
    return (
        <SectionBlock id="soluciones" className="bg-gray-50 scroll-mt-24 relative" spacing="compact" containerWidth="default">
            <SectionHeader 
                title="¿En qué podemos ayudarte?"
                subtitle="Nuestras soluciones abarcan todos los departamentos de tu empresa, enfocándonos siempre en el retorno de inversión y la eficiencia."
            />
            
            <CardGrid columns={3}>
                {solutions.map((solution, index) => (
                    <div key={index} className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 hover:border-blue-100 transition-all duration-300 group flex flex-col h-full">
                        <div className={`w-14 h-14 ${solution.bg} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm`}>
                            <solution.icon className={`w-7 h-7 ${solution.color}`} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors">{solution.title}</h3>
                        <p className="text-gray-600 leading-relaxed flex-grow">
                            {solution.description}
                        </p>
                    </div>
                ))}
            </CardGrid>
        </SectionBlock>
    )
}
