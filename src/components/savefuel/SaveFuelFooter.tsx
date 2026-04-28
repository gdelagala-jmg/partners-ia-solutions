'use client'

import { Fuel, Linkedin, Facebook, Instagram, Youtube, Mail } from 'lucide-react'
import Image from 'next/image'

// Custom TikTok Icon
const TikTokIcon = ({ size = 18 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91.04.15 1.53.85 3.01 2.01 4.02 1.09.96 2.53 1.48 4.04 1.52v4.04c-1.46-.02-2.91-.45-4.13-1.22-.01 2.55-.02 5.09-.02 7.64 0 2.23-.92 4.36-2.52 5.89-1.57 1.5-3.69 2.29-5.87 2.06-2.71-.28-5.06-2.14-5.84-4.75-.8-2.65.11-5.61 2.31-7.24 2.1-1.56 4.96-1.8 7.29-.63v4.22c-1.07-.63-2.4-.76-3.56-.34-1.12.41-1.95 1.34-2.19 2.52-.25 1.25.17 2.57 1.1 3.42.92.83 2.25 1.07 3.44.62 1.13-.43 1.9-1.47 1.98-2.68.03-3.95.02-7.9.02-11.85-.01-2.45-.02-4.91-.01-7.36z" />
    </svg>
)

export default function SaveFuelFooter() {
    return (
        <footer className="bg-white text-gray-900 border-t border-gray-200 font-outfit overflow-hidden">
            <div className="max-w-[1200px] mx-auto px-6">
                <div className="py-16 grid grid-cols-1 md:grid-cols-12 gap-12 text-center md:text-left">
                    
                    {/* Brand Section */}
                    <div className="md:col-span-5 flex flex-col items-center md:items-start">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                <Fuel size={26} strokeWidth={3} />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-2xl font-black tracking-tighter text-[#1D1D1F] leading-none">SaveFuel</span>
                                <span className="text-[10px] font-black text-emerald-500 tracking-[0.2em] uppercase mt-1">PRO</span>
                            </div>
                        </div>
                        <p className="text-[15px] text-gray-500 leading-relaxed max-w-sm mb-8 font-inter font-medium">
                            El GPS del ahorro en gasolina. La inteligencia colectiva al servicio del conductor europeo.
                        </p>

                        <div className="flex flex-col items-center md:items-start w-full">
                            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 mb-3">Síguenos en redes</span>
                            <div className="flex items-center gap-2">
                                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-pink-600 hover:scale-110 transition-transform shadow-sm">
                                    <Instagram size={16} />
                                </a>
                                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-blue-600 hover:scale-110 transition-transform shadow-sm">
                                    <Facebook size={16} />
                                </a>
                                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-blue-700 hover:scale-110 transition-transform shadow-sm">
                                    <Linkedin size={16} />
                                </a>
                                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-black hover:scale-110 transition-transform shadow-sm">
                                    <TikTokIcon size={16} />
                                </a>
                                <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-white border border-gray-200 text-red-600 hover:scale-110 transition-transform shadow-sm">
                                    <Youtube size={16} />
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div>
                            <h4 className="font-black text-[13px] text-gray-900 uppercase tracking-widest mb-6">Herramientas</h4>
                            <ul className="space-y-4 text-gray-500 text-[14px] font-medium font-inter">
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">Calculadora</a></li>
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">Widget para tu web</a></li>
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">Programa de Socios</a></li>
                                <li><a href="#" className="hover:text-emerald-600 transition-colors">Noticias</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-black text-[13px] text-gray-900 uppercase tracking-widest mb-6">Producto</h4>
                            <ul className="space-y-4 text-gray-500 text-[14px] font-medium font-inter">
                                <li><a href="#how-it-works" className="hover:text-emerald-600 transition-colors">Cómo funciona</a></li>
                                <li><a href="#countries" className="hover:text-emerald-600 transition-colors">Cobertura</a></li>
                                <li><a href="#pricing" className="hover:text-emerald-600 transition-colors">Precios</a></li>
                            </ul>
                        </div>
                        <div className="col-span-2 sm:col-span-1">
                            <h4 className="font-black text-[13px] text-gray-900 uppercase tracking-widest mb-6">Contacto</h4>
                            <ul className="space-y-4 text-gray-500 text-[14px] font-medium font-inter">
                                <li>
                                    <a href="mailto:contacto@savefuel.app" className="flex items-center justify-center md:justify-start gap-2 hover:text-emerald-600 transition-colors">
                                        <Mail size={16} />
                                        <span>contacto@savefuel.app</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest font-inter">
                    <p>© 2026 PARTNERS IA Solutions S.L. - España · UE</p>
                    <div className="flex items-center gap-4 flex-wrap justify-center">
                        <a href="#" className="hover:text-gray-900 transition-colors">Aviso Legal</a>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <a href="#" className="hover:text-gray-900 transition-colors">Privacidad</a>
                        <span className="w-1 h-1 rounded-full bg-gray-300" />
                        <a href="#" className="hover:text-gray-900 transition-colors">Cookies</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
