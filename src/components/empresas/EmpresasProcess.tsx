const steps = [
    {
        number: '01',
        title: 'Diagnóstico Inicial',
        description: 'Analizamos tus procesos actuales y detectamos áreas de mejora donde la Inteligencia Artificial puede tener mayor impacto.'
    },
    {
        number: '02',
        title: 'Diseño Estratégico',
        description: 'Trazamos la arquitectura de la solución, definiendo las herramientas y los flujos necesarios para integrarla de forma segura.'
    },
    {
        number: '03',
        title: 'Desarrollo e Implementación',
        description: 'Construimos la solución y la conectamos con tus sistemas existentes de manera iterativa y sin interrumpir tus operaciones.'
    },
    {
        number: '04',
        title: 'Formación y Mejora',
        description: 'Acompañamos a tu equipo en la adopción de la nueva tecnología y optimizamos continuamente el sistema según su uso real.'
    }
]

import SectionBlock from '@/components/ui/layout/SectionBlock'

export default function EmpresasProcess() {
    return (
        <SectionBlock id="proceso" className="bg-white border-t border-gray-100 scroll-mt-24 relative" spacing="compact">
            <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 items-start">
                <div className="lg:w-1/3 lg:sticky lg:top-24">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Nuestro proceso de trabajo</h2>
                    <p className="text-lg text-gray-600">
                        Un enfoque consultivo y técnico que garantiza que cada desarrollo resuelve un problema real de negocio.
                    </p>
                </div>
                
                <div className="lg:w-2/3 space-y-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex gap-6 p-6 rounded-2xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                            <div className="text-3xl font-black text-blue-200 shrink-0">
                                {step.number}
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </SectionBlock>
    )
}
