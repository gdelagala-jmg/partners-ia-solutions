'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle2, ShieldCheck, Mail, Send } from 'lucide-react'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import LeadCaptureSection from '@/components/sections/LeadCaptureSection'

interface Sector {
  id: string
  name: string
  slug: string
  image: string
  description?: string
}

export default function SectorSolutionPage() {
  const { slug } = useParams()
  const [sector, setSector] = useState<Sector | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSectorInfo = async () => {
      try {
        const res = await fetch(`/api/sectors?active=true`)
        if (res.ok) {
          const data: Sector[] = await res.json()
          const current = data.find(s => s.slug === slug)
          if (current) {
             setSector(current)
          } else {
             setSector(null)
          }
        }
      } catch (error) {
        console.error('Error fetching sector info:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchSectorInfo()
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!sector) return notFound()

  // SEO Text Matrix per Sector (Fallback or Dynamic Content based on the User's Request)
  const renderSEOContent = () => {
    if (sector.slug === 'salud') {
      return (
        <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
          <p>La <strong className="text-gray-900 font-semibold">Inteligencia Artificial en el sector de la Salud</strong> está revolucionando la manera en que profesionales, clínicas y hospitales gestionan sus procesos diarios y diagnostican a los pacientes. En Partners IA Solutions desarrollamos ecosistemas inteligentes que no solo mejoran la eficiencia operativa, sino que incrementan drásticamente la <strong className="text-gray-900 font-semibold">calidad de vida de las personas</strong>.</p>
          
          <h3 className="text-2xl font-bold text-gray-900 pt-4">¿Te preguntas qué hace la Inteligencia Artificial por ti?</h3>
          <p>Nuestros agentes de diagnóstico temprano asisten a los médicos proporcionando análisis en milisegundos de imágenes médicas, reduciendo los tiempos de espera y el estrés tanto para el paciente como para el especialista. Las herramientas de gestión inteligente de historiales médicos permiten cruzar datos vitales para alertar sobre posibles complicaciones antes de que ocurran, pasando de una medicina reactiva a una medicina preventiva y vanguardista.</p>
          
          <h3 className="text-2xl font-bold text-gray-900 pt-4">Nuestras Soluciones destacadas</h3>
          <ul className="space-y-4 pt-2">
            <li className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
              <span><strong className="text-gray-900 font-semibold">Agentes de Triaje Clínico (Pre-diagnóstico):</strong> Asistentes conversacionales que orientan al paciente sobre urgencias y especialidades basadas en sus síntomas.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
              <span><strong className="text-gray-900 font-semibold">Gestión Predictiva de Camas y Recursos:</strong> Algoritmos que proyectan el flujo de pacientes, garantizando la disponibilidad de quirófanos y minimizando el estrés hospitalario.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
              <span><strong className="text-gray-900 font-semibold">Seguimiento Postoperatorio Inteligente:</strong> Monitoreo automático mediante chatbots para alertar de desvíos en la recuperación sin requerir desplazamientos físicos.</span>
            </li>
          </ul>

          <p className="pt-4">Al implementar estas <strong className="text-gray-900 font-semibold">Soluciones de IA en la Salud</strong>, nuestros clientes reportan una reducción media del 40% en tareas administrativas, permitiendo a los facultativos hacer lo que mejor saben hacer: brindar cuidado humano y atento a quien más lo necesita.</p>
        </div>
      )
    }

    // Default Fallback Template for any other sector
    return (
        <div className="space-y-6 text-gray-600 leading-relaxed text-lg">
          <p>La <strong className="text-gray-900 font-semibold">Inteligencia Artificial en {sector.name.toLowerCase()}</strong> está redefiniendo radicalmente cómo operan los líderes de la industria. En Partners IA Solutions, diseñamos infraestructuras de IA a medida capaces de automatizar tareas complejas, proyectar demandas del mercado y aumentar la calidad de los procesos empresariales a niveles inéditos.</p>
          
          <h3 className="text-2xl font-bold text-gray-900 pt-4">Transformamos procesos en resultados</h3>
          <p>Nuestro enfoque se centra en crear agentes conversacionales avanzados, motores de búsqueda interna y analítica predictiva. Ayudando así a las mentes brillantes de tu equipo a enfocarse en decisiones estratégicas mientras la Inteligencia Artificial gestiona la carga de trabajo repetitiva al instante.</p>
          
          <h3 className="text-2xl font-bold text-gray-900 pt-4">Beneficios de escalar tu empresa con IA</h3>
          <ul className="space-y-4 pt-2">
            <li className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
              <span><strong className="text-gray-900 font-semibold">Automatización de Backoffice:</strong> Procesamiento instantáneo de documentos y reducción drástica de tiempos operativos.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
              <span><strong className="text-gray-900 font-semibold">Interacción Cliente IA (24/7):</strong> Respuestas instantáneas y precisas que aumentan la satisfacción de tus clientes.</span>
            </li>
            <li className="flex items-start">
              <CheckCircle2 className="h-6 w-6 text-blue-500 mr-3 flex-shrink-0 mt-0.5" />
              <span><strong className="text-gray-900 font-semibold">Visión de Mercado Predictiva:</strong> Análisis de miles de variables de datos en segundos para proteger y proyectar el crecimiento de tu negocio.</span>
            </li>
          </ul>
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
        
      {/* Dynamic Header */}
      <div className="relative pt-28 pb-16 lg:pt-28 lg:pb-24 bg-white border-b border-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 lg:px-8 relative z-10 text-center">
            <Link href="/soluciones" className="inline-flex items-center text-sm font-medium text-gray-400 hover:text-blue-600 mb-8 transition-colors">
                <ArrowLeft size={16} className="mr-2" />
                Volver a todas las industrias
            </Link>
            <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight"
            >
                Soluciones para <br className="hidden sm:block"/>
                <span className="text-blue-600">Mi {sector.name}</span>
            </motion.h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left SEO Content */}
            <div className="lg:col-span-7 bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gray-50 to-white rounded-full blur-2xl -mr-20 -mt-20 opacity-50 pointer-events-none" />
                <div className="relative z-10">
                    {renderSEOContent()}
                </div>
            </div>

            {/* Right Form Component */}
            <div className="lg:col-span-5 sticky top-24">
                <div className="bg-white p-5 md:p-8 rounded-3xl shadow-xl shadow-blue-900/5 border border-gray-100">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                            <Mail size={24} />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">Solicita un dossier</h3>
                            <p className="text-sm text-gray-500 leading-tight mt-1">Recibe información detallada para {sector.name.toLowerCase()}.</p>
                        </div>
                    </div>

                    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert("Mensaje enviado con éxito"); }}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nombre completo / Empresa</label>
                            <input 
                                type="text" 
                                required
                                placeholder="Ej: Clínica San José"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tu email profesional</label>
                            <input 
                                type="email" 
                                required
                                placeholder="ejemplo@empresa.com"
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">¿Cómo podemos ayudarte?</label>
                            <textarea 
                                rows={3}
                                placeholder="Me gustaría conocer más sobre las soluciones predictivas..."
                                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none resize-none custom-scrollbar"
                            />
                        </div>
                        <button 
                            type="submit"
                            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl flex items-center justify-center gap-2 group transition-all"
                        >
                            Solicitar Información 
                            <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                        </button>

                        <div className="flex items-center gap-2 justify-center mt-6 text-xs text-gray-400">
                            <ShieldCheck size={14} />
                            Tus datos se encuentran 100% protegidos (RGPD).
                        </div>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}
