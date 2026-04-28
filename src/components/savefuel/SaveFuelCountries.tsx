'use client'

import { motion } from 'framer-motion'
import { Globe, MapPin } from 'lucide-react'

const countries = [
    { name: 'España', flag: '🇪🇸', stations: '12.240', source: 'MITECO', color: 'from-red-500 to-yellow-500' },
    { name: 'Francia', flag: '🇫🇷', stations: '9.800', source: 'Gouv.fr', color: 'from-blue-600 to-red-500' },
    { name: 'Alemania', flag: '🇩🇪', stations: '14.500', source: 'MTS-K', color: 'from-black to-yellow-500' },
    { name: 'Italia', flag: '🇮🇹', stations: '21.000', source: 'Osserv.', color: 'from-green-600 to-red-500' },
    { name: 'Portugal', flag: '🇵🇹', stations: '4.200', source: 'DGEG', color: 'from-green-700 to-red-600' },
    { name: 'Austria', flag: '🇦🇹', stations: '2.800', source: 'E-Control', color: 'from-red-600 to-white' },
    { name: 'Bélgica', flag: '🇧🇪', stations: '3.500', source: 'Statbel', color: 'from-black to-red-600' },
    { name: 'Países Bajos', flag: '🇳🇱', stations: '4.300', source: 'CBS', color: 'from-red-500 to-blue-700' },
    { name: 'Irlanda', flag: '🇮🇪', stations: '1.200', source: 'NORA', color: 'from-green-500 to-orange-500' },
    { name: 'Grecia', flag: '🇬🇷', stations: '5.100', source: 'MinEnv', color: 'from-blue-500 to-white' },
    { name: 'Rep. Checa', flag: '🇨🇿', stations: '4.000', source: 'MPO', color: 'from-blue-700 to-red-600' },
    { name: 'Polonia', flag: '🇵🇱', stations: '7.800', source: 'URE', color: 'from-white to-red-600' },
    { name: 'Suecia', flag: '🇸🇪', stations: '2.900', source: 'Energimynd', color: 'from-blue-600 to-yellow-400' },
    { name: 'Dinamarca', flag: '🇩🇰', stations: '2.000', source: 'Drivkraft', color: 'from-red-600 to-white' },
    { name: 'Finlandia', flag: '🇫🇮', stations: '1.800', source: 'Energia', color: 'from-white to-blue-600' },
    { name: 'Noruega', flag: '🇳🇴', stations: '1.700', source: 'SSB', color: 'from-red-600 to-blue-700' },
    { name: 'Hungría', flag: '🇭🇺', stations: '2.000', source: 'MEKH', color: 'from-red-600 to-green-600' },
    { name: 'Rumanía', flag: '🇷🇴', stations: '3.100', source: 'ANRE', color: 'from-blue-700 to-red-600' },
    { name: 'Bulgaria', flag: '🇧🇬', stations: '1.500', source: 'ME', color: 'from-white to-red-600' },
    { name: 'Eslovaquia', flag: '🇸🇰', stations: '1.000', source: 'MHSR', color: 'from-white to-blue-600' },
    { name: 'Eslovenia', flag: '🇸🇮', stations: '500', source: 'MZI', color: 'from-white to-red-600' },
    { name: 'Croacia', flag: '🇭🇷', stations: '900', source: 'MINGO', color: 'from-red-600 to-blue-600' },
    { name: 'Estonia', flag: '🇪🇪', stations: '300', source: 'MK', color: 'from-blue-500 to-black' },
    { name: 'Letonia', flag: '🇱🇻', stations: '400', source: 'EM', color: 'from-red-800 to-white' },
    { name: 'Lituania', flag: '🇱🇹', stations: '500', source: 'EMIN', color: 'from-yellow-400 to-green-600' },
    { name: 'Chipre', flag: '🇨🇾', stations: '300', source: 'MECI', color: 'from-white to-orange-400' },
    { name: 'Malta', flag: '🇲🇹', stations: '100', source: 'MRA', color: 'from-white to-red-600' },
    { name: 'Luxemburgo', flag: '🇱🇺', stations: '260', source: 'Etat.lu', color: 'from-red-400 to-blue-400' },
]

export default function SaveFuelCountries() {
    return (
        <section id="countries" className="py-6 bg-white font-outfit border-t border-gray-100">
            <div className="max-w-[1200px] mx-auto px-6">
                {/* Tighter Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="max-w-xl">
                        <span className="inline-block text-[12px] font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">
                            COBERTURA TOTAL
                        </span>
                        <h2 className="text-[36px] md:text-[52px] font-black text-[#1D1D1F] tracking-tighter leading-[1.1]">
                            Un buscador. <br />
                            <span className="text-gray-300">Toda la Unión Europea.</span>
                        </h2>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 px-5 py-3 rounded-2xl flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[12px] font-black text-emerald-600 uppercase tracking-widest">
                            28 Ministerios conectados
                        </span>
                    </div>
                </div>

                {/* Tighter Country Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 md:gap-3">
                    {countries.map((country, idx) => (
                        <motion.div
                            key={country.name}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.4, delay: idx * 0.05 }}
                            className="group bg-gray-50/50 rounded-[16px] border border-gray-100 p-3 md:p-4 hover:bg-white hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300 relative overflow-hidden"
                        >
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-6">
                                    <span className="text-2xl md:text-3xl filter grayscale group-hover:grayscale-0 transition-all">{country.flag}</span>
                                    <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest">{country.source}</span>
                                </div>
                                <h3 className="text-[13px] font-black text-[#1D1D1F] mb-0.5 whitespace-nowrap overflow-hidden text-ellipsis">{country.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-[16px] md:text-[18px] font-black text-emerald-500">{country.stations}</span>
                                    <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">ptos</span>
                                </div>
                            </div>
                            
                            {/* Accent Line */}
                            <div className={`absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r ${country.color} opacity-10 group-hover:opacity-100 transition-opacity`} />
                        </motion.div>
                    ))}
                </div>

                {/* Simplified Trust Bar */}
                <div className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-20 grayscale hover:opacity-50 hover:grayscale-0 transition-all duration-700">
                    <span className="text-[11px] font-black tracking-widest uppercase">MITECO</span>
                    <span className="text-[11px] font-black tracking-widest uppercase">GOUV.FR</span>
                    <span className="text-[11px] font-black tracking-widest uppercase">MTS-K</span>
                    <span className="text-[11px] font-black tracking-widest uppercase">DGEG</span>
                    <span className="text-[11px] font-black tracking-widest uppercase">E-CONTROL</span>
                </div>
            </div>
        </section>
    )
}
