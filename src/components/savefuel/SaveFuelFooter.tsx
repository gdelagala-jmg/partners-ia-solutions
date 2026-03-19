'use client'

import Link from 'next/link'
import { Check, ShieldCheck, Lock, Globe, Fuel } from 'lucide-react'

export default function SaveFuelFooter() {
    return (
        <footer className="bg-[#F9FAFB] pt-[64px] pb-[40px] border-t border-gray-100 font-outfit">
            <div className="max-w-[1120px] mx-auto px-[24px]">
                {/* QR Section */}
                <div className="mb-[48px] bg-white border border-gray-100 rounded-[28px] p-[40px] md:p-[56px] text-center shadow-sm relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mb-[32px]">Escanea para abrir en tu móvil</span>
                        
                        <div className="bg-white p-[8px] rounded-[24px] shadow-xl shadow-gray-200/40 mb-[32px] border border-gray-50">
                            <div className="w-[180px] h-[180px] bg-gray-50 rounded-[18px] flex items-center justify-center p-[20px]">
                                <div className="grid grid-cols-5 gap-[4px] opacity-80 w-full h-full">
                                    {[...Array(25)].map((_, i) => (
                                        <div key={i} className={`rounded-sm ${(i === 0 || i === 4 || i === 20 || i === 24 || i === 12 || i % 7 === 0) ? 'bg-[#030306]' : 'bg-transparent border border-[#030306]/10'}`} />
                                    ))}
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-[10px] text-slate-400 text-[11px] font-semibold">
                             <div className="w-[18px] h-[24px] rounded-[4px] border-2 border-slate-300 flex items-center justify-center relative">
                                 <div className="w-[8px] h-[2px] bg-slate-200 absolute bottom-[4px] rounded-full" />
                             </div>
                             Instalable como app en Android e iOS
                        </div>
                    </div>
                </div>

                {/* Legal Section */}
                <div className="mb-[48px]">
                    <div className="flex items-center gap-[10px] mb-[24px] text-[#0f172a] opacity-60">
                        <ShieldCheck size={18} className="text-slate-400" />
                        <span className="text-[10px] font-bold uppercase tracking-[0.2em]">LEGAL Y PRIVACIDAD</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[10px]">
                        {[
                            { name: 'Privacidad (RGPD)', href: '#', icon: ShieldCheck },
                            { name: 'Cookies', href: '#', icon: Globe },
                            { name: 'Términos', href: '#', icon: Check },
                            { name: 'Aviso Legal', href: '#', icon: Lock }
                        ].map((item) => (
                            <Link 
                                key={item.name} 
                                href={item.href}
                                className="bg-[#f1f5f9]/50 border border-transparent hover:border-slate-200 p-[16px] rounded-[16px] flex items-center gap-[14px] group transition-all"
                            >
                                <div className="w-[40px] h-[40px] bg-white rounded-[12px] flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow border border-gray-100">
                                    <item.icon size={18} className="text-slate-400 group-hover:text-emerald-500 transition-colors" />
                                </div>
                                <span className="text-[13px] font-semibold text-slate-600">{item.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Main Footer Bottom */}
                <div className="pt-[32px] border-t border-gray-100 flex flex-col lg:flex-row justify-between items-center gap-[20px]">
                    <div className="flex flex-col md:flex-row items-center gap-[12px] md:gap-[16px]">
                        <div className="flex items-center gap-[10px]">
                            <div className="w-[36px] h-[36px] bg-gradient-to-br from-[#14b8a6] to-[#10b981] rounded-[10px] flex items-center justify-center text-white shadow-md">
                                <Fuel size={18} />
                            </div>
                            <span className="text-[18px] font-bold text-[#0f172a] tracking-tight">SaveFuel</span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-medium tracking-tight md:border-l md:pl-[14px] md:py-[2px] border-slate-200">
                            — EL GPS del ahorro en gasolina
                        </span>
                    </div>

                    <div className="flex items-center flex-wrap justify-center gap-x-[24px] gap-y-[8px] text-[12px] font-medium text-slate-500">
                        <Link href="#" className="hover:text-emerald-600 transition-colors">Privacidad</Link>
                        <Link href="#" className="hover:text-emerald-600 transition-colors">Términos</Link>
                        <Link href="#" className="hover:text-emerald-600 transition-colors">Cookies</Link>
                        <Link href="#" className="hover:text-emerald-600 transition-colors">Gestionar cookies</Link>
                    </div>

                    <Link href="/admin/apps" className="text-[11px] font-medium text-slate-400 uppercase tracking-[0.15em] hover:text-emerald-600 transition-colors">
                        © 2026 PARTNERS IA Solutions
                    </Link>
                </div>
            </div>
        </footer>
    )
}
