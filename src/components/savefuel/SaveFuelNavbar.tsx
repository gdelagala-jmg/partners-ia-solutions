'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ArrowRight, Fuel } from 'lucide-react'

export default function SaveFuelNavbar() {
    const [scrolled, setScrolled] = useState(false)
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const navLinks = [
        { name: 'Países', href: '#countries' },
        { name: 'Cómo funciona', href: '#how-it-works' },
        { name: 'Funcionalidades', href: '#features' },
        { name: 'Comunidad', href: '#community' },
        { name: 'Precios', href: '#pricing' },
        { name: 'FAQ', href: '#faq' },
    ]

    return (
        <nav 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 font-outfit h-[80px] flex items-center border-b ${
                scrolled ? 'bg-white/80 backdrop-blur-md border-gray-100' : 'bg-white/40 backdrop-blur-sm border-transparent'
            }`}
        >
            <div className="max-w-7xl mx-auto px-[24px] lg:px-[32px] w-full flex items-center justify-between">
                <Link href="/apps/savefuel" className="flex items-center group">
                    <div className="w-[36px] h-[36px] bg-gradient-to-br from-[#14b8a6] to-[#10b981] rounded-xl flex items-center justify-center text-white shadow-lg shadow-teal-500/10 transition-transform group-hover:scale-105">
                        <Fuel size={20} strokeWidth={2.5} />
                    </div>
                    <div className="flex items-center ml-[10px]">
                        <span className="text-[20px] font-bold tracking-tight text-[#0f172a]">SaveFuel</span>
                        <span className="ml-[8px] px-[8px] py-[2px] text-[10px] font-bold text-emerald-600 bg-emerald-500/10 border border-emerald-500/20 rounded-full uppercase tracking-normal">EUROPA</span>
                    </div>
                </Link>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-[4px]">
                    {navLinks.map((link) => (
                        <Link 
                            key={link.name} 
                            href={link.href}
                            className="text-[14px] font-medium text-gray-500 hover:text-gray-900 px-[12px] py-[8px] hover:bg-gray-100 rounded-lg transition-all"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="ml-[8px]">
                        <a
                            href="https://savefuel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 text-white px-[20px] h-[36px] rounded-md font-semibold text-[14px] hover:bg-emerald-700 transition-all flex items-center group shadow-md active:scale-95"
                        >
                            Abrir App
                            <ArrowRight size={14} className="ml-[8px] group-hover:translate-x-0.5 transition-transform" />
                        </a>
                    </div>
                </div>

                {/* Mobile Toggle */}
                <button 
                    className="md:hidden text-gray-600 p-2"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 flex flex-col space-y-4">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    href={link.href}
                                    className="text-lg font-bold text-[#0f172a] hover:text-[#059669] transition-colors py-2 border-b border-gray-50 flex items-center justify-between group"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                    <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </Link>
                            ))}
                            <a
                                href="https://savefuel.app/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-[#059669] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#047857] transition-all shadow-lg active:scale-95 mt-4 flex items-center justify-center"
                            >
                                Abrir App Gratis
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    )
}
