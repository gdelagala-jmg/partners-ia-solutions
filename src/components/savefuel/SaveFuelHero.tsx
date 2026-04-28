"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Check, Users } from 'lucide-react';
import Image from 'next/image';

export default function SaveFuelHero() {
  const flags = ["🇪🇸", "🇵🇹", "🇫🇷", "🇮🇹", "🇩🇪", "🇦🇹", "🇧🇪", "🇳🇱", "🇮🇪", "🇬🇷", "🇨🇿", "🇵🇱", "🇸🇪", "🇩🇰", "🇫🇮", "🇳🇴", "🇭🇺", "🇷🇴", "🇧🇬", "🇸🇰", "🇸🇮", "🇭🇷", "🇪🇪", "🇱🇻", "🇱🇹", "🇨🇾", "🇲🇹", "🇦🇩"];

  return (
    <section id="hero" className="relative pt-[140px] pb-8 lg:pt-[160px] lg:pb-10 overflow-hidden bg-white">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-emerald-50/20 to-transparent pointer-events-none" />
      
      <div className="max-w-[1200px] mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Content - 7 cols */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7"
          >
            {/* Flags Pill */}
            <div className="inline-flex items-center gap-3 px-3 py-1.5 rounded-[2rem] bg-gray-50 border border-gray-100 mb-6 shadow-sm max-w-full overflow-hidden">
              <div className="flex -space-x-1.5 flex-nowrap overflow-x-auto no-scrollbar pb-1">
                {flags.map((flag, i) => (
                  <div key={i} className="shrink-0 w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[12px] shadow-sm relative z-[10]">
                    {flag}
                  </div>
                ))}
              </div>
              <div className="shrink-0 w-px h-3 bg-gray-200" />
              <span className="text-[10px] font-black text-gray-400 tracking-tight uppercase">
                Toda Europa en tiempo real
              </span>
            </div>

            <h1 className="text-[40px] md:text-[56px] lg:text-[68px] font-black text-[#1D1D1F] leading-[0.95] mb-5 tracking-tighter font-outfit">
              Ahorra de verdad <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-sky-400">
                en cada kilómetro.
              </span>
            </h1>

            {/* Community Banner - Found in analysis */}
            <div className="bg-emerald-50/50 border border-emerald-100/50 rounded-2xl p-4 mb-6 max-w-xl">
                <div className="flex gap-3">
                    <div className="shrink-0 w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-white">
                        <Users size={18} />
                    </div>
                    <p className="text-[13px] text-emerald-800 font-medium font-inter leading-tight">
                        <span className="font-black text-emerald-600 uppercase text-[11px] block mb-0.5">RED DE CONDUCTORES</span>
                        SaveFuel no es solo una app de precios — es una red que se ayuda entre sí. Cada validación beneficia a todos al instante.
                    </p>
                </div>
            </div>

            <p className="text-gray-500 text-[17px] md:text-[18px] leading-relaxed mb-6 max-w-lg font-inter font-medium">
              No busques solo lo barato. Calcula si el desvío compensa el ahorro neto. <span className="text-gray-900 font-bold">Datos oficiales de 28 países.</span>
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
              <a
                href="https://savefuel.app/"
                target="_blank"
                className="w-full sm:w-auto px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-black rounded-xl transition-all shadow-lg shadow-emerald-500/20 text-[16px] text-center"
              >
                Abrir App Gratis
              </a>
              <a
                 href="#how-it-works"
                 className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-50 border border-gray-200 text-[#1D1D1F] font-black rounded-xl transition-all text-[16px] text-center"
              >
                Ver cómo funciona
              </a>
            </div>
            
            <div className="flex items-center gap-6">
                <div className="flex flex-col">
                    <div className="flex items-center gap-0.5 mb-0.5">
                        {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="#10b981" className="text-emerald-500" />)}
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                        +100K usuarios activos
                    </p>
                </div>
                <div className="h-6 w-px bg-gray-100" />
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-500">
                        <Check size={14} strokeWidth={4} />
                    </div>
                    <span className="text-[11px] font-bold text-gray-500 uppercase">Sin registro</span>
                </div>
            </div>
          </motion.div>

          {/* Right Visual Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative z-10 rounded-[2rem] overflow-hidden border-[6px] border-white shadow-2xl shadow-emerald-500/10">
              <Image 
                src="/savefuel-preview.png" 
                alt="SaveFuel App Preview" 
                width={500} 
                height={700} 
                className="w-full h-auto"
                priority
              />
            </div>
            
            {/* Glow effects */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-100 rounded-full blur-[80px] opacity-30 -z-10" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-sky-100 rounded-full blur-[100px] opacity-30 -z-10" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
