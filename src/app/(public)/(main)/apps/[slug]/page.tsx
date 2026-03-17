import { prisma } from '@/lib/prisma'

import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Share2, Info, LayoutGrid, Zap, Globe, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AppLandingPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    
    // Attempt to find the app using the 'application' model
    const app = await (prisma as any).application.findUnique({
        where: { slug },
    })

    if (!app || !app.published) {
        notFound()
    }

    // If it has an external URL, we redirect if someone lands here directly
    if (app.externalUrl) {
        redirect(app.externalUrl)
    }

    return (
        <div className="min-h-screen bg-white selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
            {/* Nav Header - Improved for Transparency/Glassmorphism */}
            <div className="fixed top-0 left-0 w-full h-20 bg-white/70 backdrop-blur-2xl border-b border-gray-100/50 z-[100] flex items-center justify-between px-6 lg:px-12 transition-all duration-500">
                <Link href="/apps" className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-all group">
                    <div className="p-2 bg-gray-50 group-hover:bg-emerald-50 rounded-lg transition-colors">
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] hidden sm:block">Factoría de Apps</span>
                </Link>
                
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-white rounded-xl overflow-hidden shadow-2xl shadow-emerald-500/10 border border-emerald-100 p-1.5 p-2">
                        <img src={app.image || '/logo-ias.png'} alt={app.name} className="w-full h-full object-contain" />
                    </div>
                    <h2 className="font-black text-xl text-gray-900 tracking-tighter sm:text-2xl">{app.name}</h2>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2.5 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* Immersive Main Container */}
            <main className="pt-20">
                {/* 
                    Check if we want the default hero. 
                    For high-fidelity landing pages like FuelSave, we might want to skip it.
                    Logic: if content starts with a specific marker or if the app name is FuelSave (or similar specialized flag).
                    For now, I'll conditionalize it: if content exists, we skip the default minimal hero to avoid double header.
                */}
                {!app.content && (
                    <div className="max-w-5xl mx-auto px-6 lg:px-12 pt-12 mb-20 text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                        <div className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-50 border border-emerald-100 rounded-2xl text-emerald-600 shadow-xl shadow-emerald-500/5">
                            <Sparkles size={16} className="animate-spin-slow duration-[10s]" />
                            <span className="text-sm font-black uppercase tracking-widest">Herramienta Inteligente</span>
                        </div>
                        
                        <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.9]">
                            Potencia tu <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">productividad digital</span>
                        </h1>
                        
                        <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                            {app.description}
                        </p>
                    </div>
                )}

                {/* Main Content Rendered from HTML - Expanded to Full Width with internal padding control */}
                <article className="max-w-7xl mx-auto animate-in fade-in fill-mode-both duration-1000">
                    {app.content ? (
                        <div dangerouslySetInnerHTML={{ __html: app.content }} className="w-full" />
                    ) : (
                        <div className="max-w-3xl mx-auto text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 shadow-inner space-y-6 m-6 sm:m-12">
                            <Info size={48} className="mx-auto text-gray-300" />
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Página en construcción</h3>
                            <p className="text-gray-500 font-medium">Esta aplicación todavía está configurando su página principal. ¡Vuelve pronto!</p>
                            <Link href="/apps" className="inline-flex items-center gap-2 text-emerald-600 font-black tracking-widest uppercase text-xs hover:gap-4 transition-all">
                                Explorar otras apps <LayoutGrid size={14} />
                            </Link>
                        </div>
                    )}
                </article>

                {/* Uniform Interactive Footer */}
                <footer className="max-w-7xl mx-auto px-6 lg:px-12 pb-32">
                    <div className="pt-24 border-t border-gray-100 text-center space-y-12 animate-in fade-in fill-mode-both duration-700 delay-500">
                        <div className="space-y-4">
                            <h4 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tighter">¿Alguna pregunta sobre {app.name}?</h4>
                            <p className="text-gray-500 text-lg font-medium max-w-2xl mx-auto">Nuestro equipo de soporte está listo para ayudarte con la implementación y optimización.</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center gap-6">
                            <Link 
                                href="/contacto" 
                                className="px-12 py-5 bg-gray-900 text-white rounded-[2rem] text-sm font-black hover:bg-black transition-all hover:scale-105 shadow-2xl shadow-gray-900/10 active:scale-95 flex items-center gap-3 group"
                            >
                                Solicitar Demo Directa
                                <Zap size={18} className="group-hover:fill-current group-hover:text-yellow-400 transition-colors" />
                            </Link>
                            <button className="px-12 py-5 bg-white border border-gray-200 text-gray-600 rounded-[2rem] text-sm font-bold hover:bg-gray-50 transition-all active:scale-95 shadow-xl shadow-gray-100">
                                Guía de Usuario
                            </button>
                        </div>
                    </div>
                </footer>
            </main>
        </div>
    )
}
