import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, Building2 } from 'lucide-react'

export default function EmpresasHero() {
    return (
        <section className="relative w-full pt-10 md:pt-6 pb-24 md:pb-32 lg:pb-40">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full z-0">
                <Image 
                    src="/images/hero-empresas.png" 
                    alt="Dueña de comercio local gestionando su negocio" 
                    fill 
                    className="object-cover object-[70%_30%] z-0"
                    priority
                    sizes="100vw"
                    quality={90}
                />
                {/* Gradient Overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/50 to-transparent z-10 pointer-events-none" />
                <div className="absolute inset-0 bg-gray-900/40 md:hidden z-10 pointer-events-none" /> {/* Darker on mobile for text contrast */}
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 w-full pt-6 md:pt-5">
                <div className="max-w-2xl text-left">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-5">
                        <Building2 size={14} className="text-blue-300" />
                        <span className="text-xs sm:text-sm font-semibold !text-white tracking-wide uppercase">Soluciones Prácticas para tu Negocio</span>
                    </div>
                    
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight !text-white mb-5 leading-[1.1]">
                        Impulsamos negocios locales, <br className="hidden md:block" />
                        <span className="!text-blue-400">creamos futuro.</span>
                    </h1>
                    
                    <p className="text-lg md:text-xl !text-white mb-8 leading-relaxed font-light">
                        Acompañamos a pymes y autónomos con servicios pensados para simplificar, digitalizar y hacer crecer su día a día.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-start gap-4 w-full sm:w-auto">
                        <Link href="#soluciones" className="px-8 py-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/30 w-full sm:w-auto flex items-center justify-center group">
                            Conoce nuestros servicios
                            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link href="#diagnostico" className="px-8 py-4 bg-transparent text-white border border-white/30 rounded-xl font-medium hover:bg-white/10 backdrop-blur-sm transition-all w-full sm:w-auto text-center">
                            Hablemos de tu proyecto
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
