import { Users, Leaf, BarChart3, Heart } from 'lucide-react'

const values = [
    {
        title: 'Cercanos',
        description: 'Atención local y cercana, siempre que lo necesitas.',
        icon: Users,
    },
    {
        title: 'Prácticos',
        description: 'Soluciones claras y útiles para tu negocio.',
        icon: Leaf,
    },
    {
        title: 'Eficaces',
        description: 'Resultados medibles que impulsan tu crecimiento.',
        icon: BarChart3,
    },
    {
        title: 'Comprometidos',
        description: 'Nos importa tu negocio y nuestra comunidad.',
        icon: Heart,
    }
]

export default function EmpresasValues() {
    return (
        <section className="bg-white border-b border-gray-100 py-10 md:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-0">
                    {values.map((value, index) => (
                        <div key={index} className={`flex items-start gap-5 ${index > 0 ? 'md:pl-8 lg:pl-10 md:border-l border-gray-100' : ''} ${index === 2 || index === 3 ? 'pt-8 md:pt-0' : ''}`}>
                            <div className="flex-shrink-0 w-14 h-14 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-600 transition-colors hover:border-blue-200 hover:text-blue-600 hover:bg-blue-50">
                                <value.icon strokeWidth={1.5} size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-1">{value.title}</h3>
                                <p className="text-gray-500 text-sm leading-relaxed pr-4">
                                    {value.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
