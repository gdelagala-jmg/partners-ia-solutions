import { Metadata } from 'next'
import NewsletterForm from '@/components/newsletter/NewsletterForm'
import { Sparkles, Mail, ShieldCheck, Zap } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Newsletter Editorial | Partners IA Solutions',
  description: 'Suscríbete a nuestra newsletter para recibir insights exclusivos, noticias de última hora y soluciones reales de Inteligencia Artificial para tu negocio.',
}

export default function NewsletterPage() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center bg-white px-4 md:px-6 py-12">
      <div className="max-w-3xl w-full text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Decorative Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center shadow-sm">
            <Mail size={32} />
          </div>
        </div>

        {/* Header Text */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-100 bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
            Suscripción Editorial
          </div>
          <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 tracking-tight leading-tight">
            Mantente a la vanguardia <br /> <span className="text-blue-500">con Partners IA</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
            Únete a nuestra comunidad de líderes y profesionales que reciben semanalmente la mejor curación de IA aplicada a negocio.
          </p>
        </div>

        {/* The Form */}
        <div className="bg-gray-50/50 backdrop-blur-sm rounded-3xl p-8 border border-gray-100 shadow-xl shadow-gray-200/50">
          <NewsletterForm variant="home" />
        </div>

        {/* Trust Indicators */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
          {[
            { icon: Sparkles, text: 'Contenido exclusivo' },
            { icon: Zap, text: 'Sin ruido, solo valor' },
            { icon: ShieldCheck, text: 'Privacidad garantizada' }
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-center gap-2 text-xs font-medium text-gray-400">
              <item.icon size={14} className="text-blue-400" />
              <span>{item.text}</span>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-8 flex flex-col items-center gap-4">
          <Link 
            href="/" 
            className="text-sm font-semibold text-gray-400 hover:text-gray-900 transition-colors"
          >
            ← Volver a la página principal
          </Link>
        </div>
      </div>
    </div>
  )
}
