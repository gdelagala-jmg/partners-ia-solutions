'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Filter, SlidersHorizontal, X } from 'lucide-react'

const filters = {
    company: ['OpenAI', 'Google', 'Microsoft', 'Nvidia', 'Meta', 'Tesla', 'Amazon', 'IBM', 'Apple', 'Anthropic', 'Hugging Face', 'xAI', 'Mistral', 'Cohere', 'Adobe', 'Salesforce'],
    aiTool: ['ChatGPT', 'Gemini', 'Claude', 'Midjourney', 'Copilot', 'Cursor', 'Perplexity', 'Stable Diffusion', 'Whisper', 'DALL-E', 'Sora', 'Llama', 'Grok', 'Runway', 'Flux', 'Mistral'],
    aiType: ['IA Generativa', 'Machine Learning', 'NLP / PLN', 'Visión Artificial', 'Robótica', 'IA Agéntica'],
    businessArea: ['Finanzas', 'Salud', 'Educación', 'Retail', 'Manufactura', 'Tecnología', 'Marketing', 'Recursos Humanos', 'Legal'],
    sector: ['Banca', 'Farmacéutica', 'Universidades', 'Ecommerce', 'Automoción', 'Software', 'Legal', 'Educación', 'Alimentación', 'Ocio'],
    profession: ['Ejecutivos', 'Desarrolladores', 'Marketers', 'Médicos', 'Profesores', 'Diseñadores', 'Abogados']
}

export default function NewsFilterBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showPreferences, setShowPreferences] = useState(false)
    const [preferences, setPreferences] = useState({
        company: '',
        aiTool: '',
        aiType: '',
        businessArea: '',
        sector: '',
        profession: ''
    })

    // Load preferences from local storage on mount
    useEffect(() => {
        const saved = localStorage.getItem('userNewsPreferences')
        if (saved) {
            setPreferences(JSON.parse(saved))
        }
    }, [])

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString())
        if (value) {
            params.set(key, value)
        } else {
            params.delete(key)
        }
        router.push(`/noticias?${params.toString()}`)
    }

    const savePreferences = () => {
        localStorage.setItem('userNewsPreferences', JSON.stringify(preferences))
        setShowPreferences(false)

        // Auto-apply preferences
        const params = new URLSearchParams()
        Object.entries(preferences).forEach(([key, value]) => {
            if (value) params.set(key, value)
        })
        router.push(`/noticias?${params.toString()}`)
    }

    const clearFilters = () => {
        router.push('/noticias')
    }

    const getFilterLabel = (key: string) => {
        switch (key) {
            case 'company': return 'EMPRESAS';
            case 'aiType': return 'TIPO DE IA';
            case 'businessArea': return 'ÁREA NEGOCIO';
            case 'sector': return 'SECTOR';
            case 'profession': return 'PROFESIÓN';
            case 'aiTool': return 'HERRAMIENTA IA';
            default: return key;
        }
    }

    return (
        <div className="w-full mb-8">
            <div className="flex flex-col gap-6 p-5 bg-white sm:bg-gray-50 rounded-2xl sm:border border-gray-100">
                {/* Top Row: Select Filters */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 w-full">
                    {Object.entries(filters).map(([key, options]) => (
                        <div key={key} className="flex flex-col w-full">
                            <label className="text-[11px] font-bold text-blue-600/80 mb-1.5 ml-1 tracking-wider uppercase">
                                {getFilterLabel(key)}
                            </label>
                            <select
                                value={searchParams.get(key) || ''}
                                onChange={(e) => handleFilterChange(key, e.target.value)}
                                className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl hover:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 block w-full px-3 py-2.5 transition-all outline-none shadow-sm cursor-pointer truncate"
                                style={{
                                    WebkitAppearance: 'none',
                                    MozAppearance: 'none',
                                    appearance: 'none',
                                    backgroundImage: `url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%231a202c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")`,
                                    backgroundRepeat: 'no-repeat',
                                    backgroundPosition: 'right 0.75rem top 50%',
                                    backgroundSize: '0.65rem auto',
                                    paddingRight: '2rem'
                                }}
                            >
                                <option value="">Seleccionar...</option>
                                {options.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    ))}
                </div>

                {/* Bottom Row: Search & Actions */}
                <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between w-full pt-2 sm:pt-4 border-t border-gray-100">

                    {/* Search Input */}
                    <div className="relative flex-1 w-full sm:max-w-md">
                        <input
                            type="text"
                            placeholder="Buscar noticias..."
                            value={searchParams.get('q') || ''}
                            onChange={(e) => handleFilterChange('q', e.target.value)}
                            className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl hover:border-blue-400 focus:ring-2 focus:ring-blue-100 focus:border-blue-500 block w-full py-2.5 px-3 pl-10 transition-all outline-none shadow-sm"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                            <Filter size={16} className="text-gray-400" />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-row items-center gap-3 w-full sm:w-auto shrink-0 justify-end">
                        {Array.from(searchParams.values()).some(Boolean) && (
                            <button
                                onClick={clearFilters}
                                className="px-3 py-2 text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg flex items-center transition-colors font-medium"
                            >
                                <X size={16} className="mr-1.5" /> Limpiar
                            </button>
                        )}

                        <button
                            onClick={() => setShowPreferences(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center px-4 py-2.5 bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-100 rounded-xl transition-all font-semibold text-sm shadow-sm whitespace-nowrap"
                        >
                            <SlidersHorizontal size={18} className="mr-2" />
                            Mis Preferencias
                        </button>
                    </div>
                </div>
            </div>

            {/* Preferences Modal */}
            {showPreferences && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-md p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button
                            onClick={() => setShowPreferences(false)}
                            className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Personaliza tu Feed</h2>
                        <p className="text-sm text-gray-500 mb-8">Selecciona tus intereses para que recordemos qué noticias mostrarte primero.</p>

                        <div className="space-y-5">
                            {Object.entries(filters).map(([key, options]) => (
                                <div key={key}>
                                    <label className="block mb-2 text-xs font-bold uppercase tracking-wider text-gray-500">
                                        {getFilterLabel(key)} Preferido
                                    </label>
                                    <select
                                        value={(preferences as any)[key]}
                                        onChange={(e) => setPreferences({ ...preferences, [key]: e.target.value })}
                                        className="bg-gray-50 border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none"
                                    >
                                        <option value="">Seleccionar...</option>
                                        {options.map((opt) => (
                                            <option key={opt} value={opt}>{opt}</option>
                                        ))}
                                    </select>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10">
                            <button
                                onClick={finalSavePreferences}
                                className="w-full px-5 py-4 text-white bg-black hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-bold rounded-xl text-sm text-center transition-all shadow-lg active:scale-[0.98]"
                            >
                                Guardar y Aplicar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )

    function finalSavePreferences() {
        savePreferences()
    }
}
