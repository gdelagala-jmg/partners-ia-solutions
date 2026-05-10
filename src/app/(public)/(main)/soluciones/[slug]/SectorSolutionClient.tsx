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
        <div className="space-y-8 text-solutions-text-secondary leading-relaxed text-lg">
          <p className="text-xl text-solutions-text-primary font-light">
            La <strong className="text-blue-600 font-semibold">Inteligencia Artificial en el sector de la Salud</strong> está revolucionando la manera en que profesionales, clínicas y hospitales gestionan sus procesos diarios y diagnostican a los pacientes. 
          </p>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-solutions-text-primary flex items-center gap-2">
                <Lightbulb className="text-blue-600" size={24} />
                ¿Te preguntas qué hace la IA por ti?
            </h3>
            <p>
                En Partners IA Solutions desarrollamos ecosistemas inteligentes que no solo mejoran la eficiencia operativa, sino que incrementan drásticamente la <strong className="text-solutions-text-primary font-semibold">calidad de vida de las personas</strong>.
                Nuestros agentes de diagnóstico temprano asisten a los médicos proporcionando análisis en milisegundos de imágenes médicas, reduciendo los tiempos de espera y el estrés tanto para el paciente como para el especialista.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="p-6 rounded-2xl bg-white border border-solutions-border hover:bg-solutions-bg-commercial hover:border-blue-500/30 transition-all duration-300 group shadow-sm">
                <Zap className="text-blue-600 mb-3 group-hover:scale-110 transition-transform" size={24} />
                <h4 className="text-solutions-text-primary font-bold mb-2">Agentes de Triaje Clínico</h4>
                <p className="text-sm text-solutions-text-secondary">Asistentes conversacionales que orientan al paciente sobre urgencias y especialidades basadas en sus síntomas.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white border border-solutions-border hover:bg-solutions-bg-commercial hover:border-blue-500/30 transition-all duration-300 group shadow-sm">
                <BarChart3 className="text-blue-600 mb-3 group-hover:scale-110 transition-transform" size={24} />
                <h4 className="text-solutions-text-primary font-bold mb-2">Gestión Predictiva</h4>
                <p className="text-sm text-solutions-text-secondary">Algoritmos que proyectan el flujo de pacientes, garantizando la disponibilidad de recursos y minimizando el estrés hospitalario.</p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-blue-50 border border-blue-100">
            <p className="text-blue-800 italic">
                "Al implementar estas Soluciones de IA en la Salud, nuestros clientes reportan una reducción media del 40% en tareas administrativas, permitiendo un cuidado más humano."
            </p>
          </div>
        </div>
      )
    }

    return (
        <div className="space-y-8 text-solutions-text-secondary leading-relaxed text-lg">
          <p className="text-xl text-solutions-text-primary font-light">
            La <strong className="text-blue-600 font-semibold">Inteligencia Artificial en {sector.name}</strong> está redefiniendo radicalmente cómo operan los líderes de la industria.
          </p>
          
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-solutions-text-primary flex items-center gap-2">
                <Zap className="text-blue-600" size={24} />
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
                <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-white border border-solutions-border hover:border-blue-500/30 transition-all duration-300 shadow-sm">
                    <CheckCircle2 className="text-blue-600 shrink-0 mt-1" size={18} />
                    <div>
                        <h4 className="text-solutions-text-primary font-semibold text-sm">{item.title}</h4>
                        <p className="text-xs text-solutions-text-secondary mt-1">{item.desc}</p>
                    </div>
                </div>
            ))}
          </div>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-solutions-text-primary selection:bg-blue-500/10 relative overflow-hidden font-sans">
        {/* Ultra-soft background accents */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-50/30 rounded-full blur-[140px]" />
            <div className="absolute bottom-[-5%] right-[-5%] w-[40%] h-[40%] bg-indigo-50/30 rounded-full blur-[140px]" />
        </div>

        {/* Floating Lines Decorative */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #000 1px, transparent 0)', backgroundSize: '48px 48px' }} 
        />

        <div className="relative z-10">
            {/* Header / Navigation */}
            <header className="pt-24 pb-12">
                <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
                    <Link 
                        href="/soluciones" 
                        className="group inline-flex items-center text-sm font-medium text-solutions-text-secondary hover:text-blue-600 mb-8 transition-all duration-300"
                    >
                        <div className="w-8 h-8 rounded-full bg-solutions-bg-commercial flex items-center justify-center mr-3 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all shadow-sm">
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
                                    icon={<Cpu size={14} className="text-blue-600" />} 
                                    className="mb-4"
                                />
                                <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-solutions-text-primary leading-tight">
                                    Soluciones para <br className="hidden md:block" />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
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
                        <div className="bg-white border border-solutions-border rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group hover:border-blue-500/20 transition-all duration-700">
                            {/* Subtle light accent */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 blur-3xl -mr-32 -mt-32 group-hover:bg-blue-100/50 transition-all duration-700" />
                            
                            <div className="relative z-10">
                                {renderSEOContent()}
                            </div>
                        </div>

                        {/* Additional value propositions */}
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="p-6 rounded-2xl bg-white border border-solutions-border flex flex-col items-center text-center shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4">
                                    <ShieldCheck size={24} />
                                </div>
                                <h4 className="text-solutions-text-primary font-bold text-sm mb-1">Seguridad Enterprise</h4>
                                <p className="text-xs text-solutions-text-secondary font-light">Privacidad total y cumplimiento normativo.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white border border-solutions-border flex flex-col items-center text-center shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 mb-4">
                                    <Zap size={24} />
                                </div>
                                <h4 className="text-solutions-text-primary font-bold text-sm mb-1">Despliegue Ágil</h4>
                                <p className="text-xs text-solutions-text-secondary font-light">Integración con tus sistemas en semanas.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white border border-solutions-border flex flex-col items-center text-center shadow-sm">
                                <div className="w-12 h-12 rounded-xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-4">
                                    <BarChart3 size={24} />
                                </div>
                                <h4 className="text-solutions-text-primary font-bold text-sm mb-1">ROI Medible</h4>
                                <p className="text-xs text-solutions-text-secondary font-light">Optimización de costes desde el día 1.</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* PREMIUM DOSSIER SECTION - REPLICATING HOJA DE RUTA STRUCTURE */}
            <section className="relative px-5 py-20 md:py-32 bg-solutions-bg-commercial border-t border-solutions-border">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10 md:mb-16">
                        <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6 mx-auto shadow-sm">
                            <Mail size={32} />
                        </div>
                        <h3 className="text-4xl md:text-5xl font-black text-solutions-text-primary mb-4 leading-tight">
                            Solicita un dossier estratégico para <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">{sector.name}</span>
                        </h3>
                        <p className="text-solutions-text-secondary text-lg md:text-xl font-light max-w-2xl mx-auto">
                            Analizaremos tu caso y te enviaremos una propuesta detallada con soluciones de IA adaptadas específicamente a tu sector.
                        </p>
                    </div>

                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="relative group"
                    >
                        {/* Outer Glow */}
                        <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 rounded-[3rem] blur-2xl opacity-50 transition duration-1000" />
                        
                        <div className="relative bg-white border border-solutions-border rounded-[2.5rem] p-6 sm:p-10 md:p-16 shadow-2xl overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 opacity-10" />
                            <LeadForm 
                                variant="premium" 
                                context={{
                                    sourcePage: `sector-${sector.slug}`,
                                    solutionTitle: `Sector: ${sector.name}`,
                                    solutionSlug: sector.slug
                                }}
                            />

                            <div className="mt-12 flex flex-col items-center gap-4 py-6 border-t border-solutions-border">
                                <div className="flex -space-x-2">
                                    {[1,2,3,4,5].map(i => (
                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-100 overflow-hidden">
                                            <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="Expert" className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[11px] text-solutions-muted uppercase tracking-[0.2em] font-bold">
                                    Asesoramiento experto de alto nivel disponible
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>
        </div>
    </div>
  )
}
