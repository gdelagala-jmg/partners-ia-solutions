'use client'

import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, ShieldCheck, Mail, Send, Cpu, Lightbulb, Zap, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import LeadForm from '@/components/forms/LeadForm'
import PageBadge from '@/components/ui/PageBadge'

interface Sector {
  id: string
  name: string
  slug: string
  image: string
  description?: string
}

interface SectorSolutionClientProps {
  sector: Sector
}

export default function SectorSolutionClient({ sector }: SectorSolutionClientProps) {
  const renderSEOContent = () => {
    if (sector.slug === 'salud') {
      return (
        <div className="space-y-8 text-gray-300 leading-relaxed text-lg">
          <p className="text-xl text-white font-light">
            La <strong className="text-blue-400 font-semibold">Inteligencia Artificial en el sector de la Salud</strong> está revolucionando la manera en que profesionales, clínicas y hospitales gestionan sus procesos diarios y diagnostican a los pacientes. 
          </p>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Lightbulb className="text-blue-500" size={24} />
                ¿Te preguntas qué hace la IA por ti?
            </h3>
            <p>
                En Partners IA Solutions desarrollamos ecosistemas inteligentes que no solo mejoran la eficiencia operativa, sino que incrementan drásticamente la <strong className="text-white font-semibold">calidad de vida de las personas</strong>.
                Nuestros agentes de diagnóstico temprano asisten a los médicos proporcionando análisis en milisegundos de imágenes médicas, reduciendo los tiempos de espera y el estrés tanto para el paciente como para el especialista.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                <Zap className="text-blue-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
                <h4 className="text-white font-bold mb-2">Agentes de Triaje Clínico</h4>
                <p className="text-sm text-gray-400">Asistentes conversacionales que orientan al paciente sobre urgencias y especialidades basadas en sus síntomas.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors group">
                <BarChart3 className="text-blue-400 mb-3 group-hover:scale-110 transition-transform" size={24} />
                <h4 className="text-white font-bold mb-2">Gestión Predictiva</h4>
                <p className="text-sm text-gray-400">Algoritmos que proyectan el flujo de pacientes, garantizando la disponibilidad de recursos y minimizando el estrés hospitalario.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-blue-900/20 border border-blue-500/30">
            <p className="text-blue-100 italic">
                "Al implementar estas Soluciones de IA en la Salud, nuestros clientes reportan una reducción media del 40% en tareas administrativas, permitiendo un cuidado más humano."
            </p>
          </div>
        </div>
      )
    }

    return (
        <div className="space-y-8 text-gray-300 leading-relaxed text-lg">
          <p className="text-xl text-white font-light">
            La <strong className="text-blue-400 font-semibold">Inteligencia Artificial en {sector.name}</strong> está redefiniendo radicalmente cómo operan los líderes de la industria.
          </p>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                <Zap className="text-blue-500" size={24} />
                Transformamos procesos en resultados
            </h3>
            <p>
                Diseñamos infraestructuras de IA a medida capaces de automatizar tareas complejas, proyectar demandas del mercado y aumentar la calidad de los procesos empresariales a niveles inéditos.
                Nuestro enfoque se centra en crear agentes conversacionales avanzados, motores de búsqueda interna y analítica predictiva.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            {[
                { title: "Automatización de Backoffice", desc: "Procesamiento instantáneo de documentos y reducción de tiempos." },
                { title: "Interacción Cliente IA", desc: "Respuestas precisas 24/7 que aumentan la satisfacción del usuario." },
                { title: "Visión de Mercado", desc: "Análisis de miles de variables para proteger y proyectar el crecimiento." },
                { title: "Estrategia de Datos", desc: "Convierte tu información histórica en una ventaja competitiva real." }
            ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/10 hover:border-blue-500/30 transition-colors">
                    <CheckCircle2 className="text-blue-500 shrink-0 mt-1" size={18} />
                    <div>
                        <h4 className="text-white font-semibold text-sm">{item.title}</h4>
                        <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                    </div>
                </div>
            ))}
          </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500/30 relative overflow-hidden">
        {/* Dynamic Mesh Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
            <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-600/10 rounded-full blur-[100px]" />
        </div>

        {/* Floating Lines Decorative */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }} 
        />

        <div className="relative z-10">
            {/* Header / Navigation */}
            <header className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <Link 
                        href="/soluciones" 
                        className="group inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-400 mb-8 transition-all duration-300"
                    >
                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center mr-3 group-hover:bg-blue-500/20 group-hover:scale-110 transition-all">
                            <ArrowLeft size={16} />
                        </div>
                        Volver a todas las industrias
                    </Link>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <PageBadge 
                                    text={`Ecosistema IA para ${sector.name}`} 
                                    icon={<Cpu size={14} className="text-blue-500" />} 
                                    className="mb-4"
                                />
                                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight">
                                    Soluciones para <br className="hidden md:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                                        {sector.name}
                                    </span>
                                </h1>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content Grid */}
            <main className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 pb-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                    
                    {/* Content Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7 }}
                        className="lg:col-span-7"
                    >
                        <div className="bg-white/[0.03] backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group hover:border-blue-500/20 transition-all duration-500">
                            {/* Decorative element */}
                            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-all" />
                            
                            <div className="relative z-10">
                                {renderSEOContent()}
                            </div>
                        </div>

                        {/* Additional value propositions */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 mb-4">
                                    <ShieldCheck size={24} />
                                </div>
                                <h4 className="text-white font-bold text-sm mb-1">Seguridad Enterprise</h4>
                                <p className="text-xs text-gray-500">Privacidad total y cumplimiento normativo.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4">
                                    <Zap size={24} />
                                </div>
                                <h4 className="text-white font-bold text-sm mb-1">Despliegue Ágil</h4>
                                <p className="text-xs text-gray-500">Integración con tus sistemas en semanas.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center text-center">
                                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-4">
                                    <BarChart3 size={24} />
                                </div>
                                <h4 className="text-white font-bold text-sm mb-1">ROI Medible</h4>
                                <p className="text-xs text-gray-500">Optimización de costes desde el día 1.</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Form Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="lg:col-span-5 lg:sticky lg:top-32"
                    >
                        <div className="relative group">
                            {/* Outer Glow */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-10 group-hover:opacity-20 transition duration-1000" />
                            
                            <div className="relative bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-5 sm:p-8 shadow-2xl">
                                <div className="mb-8">
                                    <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-500 mb-5">
                                        <Mail size={28} />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">Solicita un dossier</h3>
                                    <p className="text-gray-400 text-sm">
                                        Analizaremos tu caso y te enviaremos una propuesta detallada para <span className="text-blue-400 font-medium">{sector.name}</span>.
                                    </p>
                                </div>

                                <LeadForm 
                                    variant="premium" 
                                    sourcePage={`sector-${sector.slug}`}
                                    solutionTitle={`Sector: ${sector.name}`}
                                    solutionSlug={sector.slug}
                                />

                                <div className="mt-8 flex items-center justify-center gap-3 py-4 border-t border-white/5">
                                    <div className="flex -space-x-2">
                                        {[1,2,3].map(i => (
                                            <div key={i} className="w-7 h-7 rounded-full border-2 border-[#0a0a0a] bg-gray-800 overflow-hidden">
                                                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Expert" className="w-full h-full object-cover grayscale" />
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">
                                        Asesoramiento experto disponible
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </main>
        </div>
    </div>
  )
}
