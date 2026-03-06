'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Filter, SlidersHorizontal, X } from 'lucide-react'

const filters = {
    aiType: ['Generative AI', 'Machine Learning', 'NLP', 'Computer Vision', 'Robotics'],
    businessArea: ['Finance', 'Healthcare', 'Education', 'Retail', 'Manufacturing', 'Technology'],
    sector: ['Banking', 'Pharma', 'Universities', 'Ecommerce', 'Automotive', 'Software'],
    profession: ['Executives', 'Developers', 'Marketers', 'Doctors', 'Teachers', 'Designers'],
}

export default function NewsFilterBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showPreferences, setShowPreferences] = useState(false)
    const [preferences, setPreferences] = useState({
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

    return (
        <div className="w-full mb-8">
            {/* Main Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex flex-col md:flex-row gap-4 w-full flex-1">
                    {/* Search Input */}
                    <div className="relative flex-1 min-w-[200px]">
                        <input
                            type="text"
                            placeholder="Buscar noticias..."
                            value={searchParams.get('q') || ''}
                            onChange={(e) => handleFilterChange('q', e.target.value)}
                            className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-10 transition-all outline-none shadow-sm"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter size={18} className="text-gray-400" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-[2]">
                        {Object.entries(filters).map(([key, options]) => (
                            <select
                                key={key}
                                value={searchParams.get(key) || ''}
                                onChange={(e) => handleFilterChange(key, e.target.value)}
                                className="bg-white border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 transition-all outline-none shadow-sm"
                            >
                                <option value="">{key === 'businessArea' ? 'Área Negocio' : key === 'sector' ? 'Sector' : key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</option>
                                {options.map((opt) => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        ))}
                    </div>
                </div>

                <div className="flex items-center gap-2 w-full lg:w-auto mt-2 lg:mt-0">
                    {Array.from(searchParams.values()).some(Boolean) && (
                        <button
                            onClick={clearFilters}
                            className="px-4 py-2 text-sm text-gray-500 hover:text-gray-900 flex items-center transition-colors font-medium"
                        >
                            <X size={16} className="mr-1" /> Limpiar
                        </button>
                    )}

                    <button
                        onClick={() => setShowPreferences(true)}
                        className="w-full md:w-auto flex items-center justify-center px-4 py-2.5 bg-white text-gray-700 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all font-medium text-sm shadow-sm"
                    >
                        <SlidersHorizontal size={18} className="mr-2" />
                        Mis Preferencias
                    </button>
                </div>
            </div>

            {/* Preferences Modal */}
            {showPreferences && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
                    <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-md p-8 shadow-2xl relative">
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
                                        {key === 'businessArea' ? 'Área Negocio' : key === 'sector' ? 'Sector' : key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')} Preferido
                                    </label>
                                    <select
                                        value={(preferences as any)[key]}
                                        onChange={(e) => setPreferences({ ...preferences, [key]: e.target.value })}
                                        className="bg-gray-50 border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-blue-500 focus:border-blue-500 block w-full p-3 outline-none"
                                    >
                                        <option value="">Cualquiera</option>
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
