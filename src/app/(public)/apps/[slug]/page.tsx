import { prisma } from '@/lib/prisma'
import { notFound, redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Share2, Info, LayoutGrid, Zap, Globe, Sparkles } from 'lucide-react'

export default async function AppLandingPage({ params }: { params: { slug: string } }) {
    const app = await prisma.app.findUnique({
        where: { slug: params.slug },
    })

    if (!app || !app.published) {
        notFound()
    }

    // If it has an external URL, we redirect if someone lands here directly
    if (app.externalUrl) {
        redirect(app.externalUrl)
    }

    return (
        <div className="min-h-screen bg-white selection:bg-blue-100 selection:text-blue-900">
            {/* Minimal Header */}
            <div className="fixed top-0 left-0 w-full h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 z-[100] flex items-center justify-between px-6 lg:px-12">
                <Link href="/apps" className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    <span className="text-sm font-black uppercase tracking-widest hidden sm:block">Atrás</span>
                </Link>
                
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-gray-50 rounded-xl overflow-hidden shadow-inner border border-gray-100">
                        <img src={app.image || '/logo-ias.png'} alt={app.name} className="w-full h-full object-cover" />
                    </div>
                    <h2 className="font-black text-xl text-gray-900 tracking-tighter sm:text-2xl">{app.name}</h2>
                </div>

                <div className="flex items-center gap-2">
                    <button className="p-2.5 text-gray-400 hover:text-gray-900 hover:bg-gray-50 rounded-xl transition-all">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>

            {/* Custom Content Container */}
            <main className="pt-32 pb-32 max-w-5xl mx-auto px-6 lg:px-12">
                {/* Hero section for the specific app */}
                <div className="mb-20 text-center space-y-8 animate-in fade-in slide-in-from-bottom-5 duration-700">
                    <div className="inline-flex items-center gap-2 px-6 py-2 bg-blue-50 border border-blue-100 rounded-2xl text-blue-600 shadow-xl shadow-blue-500/5">
                        <Sparkles size={16} className="animate-spin-slow duration-[10s]" />
                        <span className="text-sm font-black uppercase tracking-widest">Herramienta Inteligente</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-[0.9]">
                        Potencia tu <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">productividad digital</span>
                    </h1>
                    
                    <p className="text-xl text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                        {app.description}
                    </p>
                </div>

                {/* Main Content Rendered from HTML */}
                <article className="prose prose-xl prose-blue max-w-none prose-headings:font-black prose-headings:tracking-tighter prose-img:rounded-[2rem] prose-img:shadow-2xl prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50 prose-blockquote:p-6 prose-blockquote:rounded-r-[2rem] animate-in fade-in fill-mode-both delay-300">
                    {app.content ? (
                        <div dangerouslySetInnerHTML={{ __html: app.content }} />
                    ) : (
                        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200 shadow-inner space-y-6">
                            <Info size={48} className="mx-auto text-gray-300" />
                            <h3 className="text-2xl font-black text-gray-900 tracking-tight">Página en construcción</h3>
                            <p className="text-gray-500 font-medium">Esta aplicación todavía está configurando su página principal. ¡Vuelve pronto!</p>
                            <Link href="/apps" className="inline-flex items-center gap-2 text-blue-600 font-black tracking-widest uppercase text-xs hover:gap-4 transition-all">
                                Explorar otras apps <LayoutGrid size={14} />
                            </Link>
                        </div>
                    )}
                </article>

                {/* Footer Section */}
                <footer className="mt-32 pt-16 border-t border-gray-100 text-center space-y-12 animate-in fade-in fill-mode-both delay-700">
                    <div className="space-y-4">
                        <h4 className="text-2xl font-black text-gray-900 tracking-tight">¿Alguna pregunta sobre {app.name}?</h4>
                        <p className="text-gray-500 font-medium">Nuestro equipo de soporte está listo para ayudarte con la implementación.</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link 
                            href="/contacto" 
                            className="px-10 py-5 bg-gray-900 text-white rounded-3xl text-sm font-black hover:bg-black transition-all hover:scale-105 shadow-2xl shadow-gray-900/10 active:scale-95 flex items-center gap-3 group"
                        >
                            Solicitar Demo
                            <Zap size={18} className="group-hover:fill-current group-hover:text-yellow-400 transition-colors" />
                        </Link>
                        <button className="px-10 py-5 bg-white border border-gray-200 text-gray-600 rounded-3xl text-sm font-bold hover:bg-gray-50 transition-all active:scale-95 shadow-lg shadow-gray-100">
                            Guía de Usuario
                        </button>
                    </div>
                </footer>
            </main>
        </div>
    )
}
