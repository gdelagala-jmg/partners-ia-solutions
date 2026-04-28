"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ChevronDown, Flame } from 'lucide-react';

export default function SaveFuelNavbar() {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Funciones', href: '#features' },
        { name: 'Cómo funciona', href: '#how-it-works' },
        { name: 'Cobertura', href: '#countries' },
        { name: 'Precios', href: '#pricing' },
        { name: 'FAQ', href: '#faq' },
    ];

    return (
        <nav 
            className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 font-outfit ${
                scrolled 
                ? 'bg-white/80 backdrop-blur-xl border-b border-gray-100/50 py-4 shadow-sm' 
                : 'bg-white py-6'
            }`}
        >
            <div className="max-w-[1200px] mx-auto px-6 flex items-center justify-between">
                {/* Brand Logo */}
                <Link href="/apps/savefuel" className="flex items-center gap-3 group relative z-10">
                    <div className="w-11 h-11 bg-emerald-500 rounded-[14px] flex items-center justify-center text-white transition-transform duration-300 group-hover:scale-110 shadow-lg shadow-emerald-500/20">
                        <Flame size={24} fill="currentColor" />
                    </div>
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                            <span className="text-[22px] font-black tracking-tighter text-[#1D1D1F] leading-none">SaveFuel</span>
                            <div className="px-1.5 py-0.5 bg-emerald-50 border border-emerald-100 rounded-md">
                                <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">PRO</span>
                            </div>
                        </div>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.05em] mt-1">El GPS del ahorro en gasolina</span>
                    </div>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden 2xl:flex items-center gap-8">
                    <div className="flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link 
                                key={link.name} 
                                href={link.href}
                                className="text-[14px] font-bold text-gray-500 hover:text-[#1D1D1F] transition-colors whitespace-nowrap"
                            >
                                {link.name}
                            </Link>
                        ))}
                    </div>
                    
                    <div className="h-6 w-px bg-gray-100 mx-2" />

                    <a
                        href="https://savefuel.app/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-emerald-500 text-white px-7 py-3 rounded-2xl font-bold text-[14px] hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 active:scale-95 whitespace-nowrap"
                    >
                        Abrir App
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <button 
                    className="2xl:hidden w-11 h-11 flex items-center justify-center text-[#1D1D1F] bg-gray-50 rounded-xl"
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="2xl:hidden bg-white border-t border-gray-50 overflow-hidden shadow-2xl"
                    >
                        <div className="p-6 flex flex-col gap-4">
                            {navLinks.map((link) => (
                                <Link 
                                    key={link.name} 
                                    href={link.href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="text-[16px] font-bold text-gray-600 hover:text-emerald-600 py-2 border-b border-gray-50"
                                >
                                    {link.name}
                                </Link>
                            ))}
                            <a
                                href="https://savefuel.app/"
                                className="mt-4 bg-emerald-500 text-white py-4 rounded-2xl font-bold text-center shadow-lg shadow-emerald-500/20"
                            >
                                Abrir App Gratis
                            </a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
