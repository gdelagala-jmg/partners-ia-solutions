'use client'

import { motion } from 'framer-motion'

const countries = [
    { name: 'España', flag: '🇪🇸', stations: '12.000+', source: 'Fuente oficial', colorBar: '#ef4444' },
    { name: 'Francia', flag: '🇫🇷', stations: '9.500+', source: 'Fuente oficial', colorBar: '#1e3a8a' },
    { name: 'Alemania', flag: '🇩🇪', stations: '11.000+', source: 'Fuente oficial', colorBar: '#ca8a04' },
    { name: 'Italia', flag: '🇮🇹', stations: '8.000+', source: 'Fuente oficial', colorBar: '#16a34a' },
    { name: 'Portugal', flag: '🇵🇹', stations: '4.500+', source: 'Fuente oficial', colorBar: '#dc2626' },
    { name: 'Austria', flag: '🇦🇹', stations: '2.700+', source: 'Fuente oficial', colorBar: '#9f1239' },
    { name: 'Bélgica', flag: '🇧🇪', stations: '3.400+', source: 'Fuente oficial', colorBar: '#1c1917' },
    { name: 'Países Bajos', flag: '🇳🇱', stations: '4.200+', source: 'Fuente oficial', colorBar: '#f97316' },
    { name: 'Luxemburgo', flag: '🇱🇺', stations: '250+', source: 'Fuente oficial', colorBar: '#3b82f6' },
    { name: 'Eslovenia', flag: '🇸🇮', stations: '500+', source: 'Fuente oficial', colorBar: '#2563eb' },
]

export default function SaveFuelCountries() {
    return (
        <section id="countries" className="py-[80px] bg-[#f8fafc] overflow-hidden font-outfit">
            <div className="max-w-[1120px] mx-auto px-[24px]">
                {/* Section Header */}
                <div className="text-center mb-[48px]">
                    <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-[0.25em] mb-[12px] block">
                        COBERTURA EUROPEA
                    </span>
                    <h2 className="text-[40px] md:text-[56px] font-black text-[#0f172a] mb-[20px] tracking-tight leading-[1.1]">
                        Un buscador.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0d9488] to-[#0ea5e9]">
                            Toda Europa.
                        </span>
                    </h2>
                    <p className="text-[17px] text-gray-500 max-w-[520px] mx-auto leading-[1.7]">
                        Datos oficiales de 10 países europeos. Más de 55.000 gasolineras con precios reales actualizados cada 30 minutos.
                    </p>
                </div>

                {/* Route search pill */}
                <div className="flex justify-center mb-[48px]">
                    <div className="inline-flex items-center gap-[10px] bg-white border border-gray-200 rounded-full px-[20px] py-[12px] shadow-sm text-[14px] text-gray-600 font-medium">
                        <span className="text-emerald-600">⊙</span>
                        Madrid→Bruselas, Lisboa→Viena, München→Ljubljana, París→Roma...
                    </div>
                </div>

                {/* Country Cards Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-[10px] md:gap-[12px]">
                    {countries.map((country, idx) => (
                        <motion.div
                            key={country.name}
                            initial={{ opacity: 0, y: 10 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.04 }}
                            className="group bg-white rounded-[16px] border border-gray-100 p-[16px] hover:shadow-md transition-all cursor-default overflow-hidden"
                        >
                            {/* Flag + Name row */}
                            <div className="flex items-center gap-[8px] mb-[8px]">
                                <span className="text-[22px]">{country.flag}</span>
                                <span className="text-[14px] font-bold text-[#0f172a]">{country.name}</span>
                            </div>
                            {/* Source label */}
                            <div className="text-[11px] text-gray-400 font-medium mb-[10px]">{country.source}</div>
                            {/* Station count */}
                            <div className="text-[18px] font-black text-[#0f172a] mb-[4px]">{country.stations}</div>
                            <div className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">estaciones</div>
                            {/* Colored bar at bottom */}
                            <div
                                className="mt-[12px] h-[3px] rounded-full w-full"
                                style={{ backgroundColor: country.colorBar }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
