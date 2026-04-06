'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
    Users, 
    Zap, 
    Settings, 
    Rocket, 
    Gem, 
    Handshake, 
    ShieldCheck, 
    CheckCircle2,
    Calendar
} from 'lucide-react'

import PageBadge from '@/components/ui/PageBadge'
import TeamCircles from '@/components/sections/TeamCircles'

const skills = [
    {
        title: "Estrategia y Visión Exponencial",
        desc: "El radar que detecta oportunidades de negocio donde otros solo ven algoritmos. Liderazgo orientado a la escalabilidad.",
        icon: Zap,
        color: "from-amber-400 to-orange-500"
    },
    {
        title: "Ingeniería de Soluciones y Ops",
        desc: "El músculo técnico. Arquitectura de sistemas que garantiza que la IA sea estable, segura y eficiente.",
        icon: Settings,
        color: "from-blue-400 to-indigo-500"
    },
    {
        title: "Innovación y Transformación Digital",
        desc: "La pieza que acelera la adopción tecnológica, convirtiendo procesos obsoletos en flujos de trabajo inteligentes.",
        icon: Rocket,
        color: "from-purple-400 to-pink-500"
    },
    {
        title: "Consultoría Senior de Negocio",
        desc: "El filtro de la experiencia. Asegura que cada implementación tenga sentido financiero y estructural a largo plazo.",
        icon: Gem,
        color: "from-emerald-400 to-teal-500"
    },
    {
        title: "Estrategia Comercial y Conexión Humana",
        desc: "El puente. Traduce la complejidad técnica en valor real para las personas, humanizando cada solución.",
        icon: Handshake,
        color: "from-rose-400 to-red-500"
    }
]

export default function TeamPage() {
    return (
        <div className="min-h-screen bg-slate-50 overflow-hidden">
            {/* Hero Section */}
            <section className="relative py-8 lg:py-8 px-5 md:px-6 overflow-hidden flex items-center">
                {/* Background Image Layer */}
                <div className="absolute inset-0 z-0">
                    {/* Opacity Overlay to maintain focus on content */}
                    <div className="absolute inset-0 bg-slate-50/70 backdrop-blur-[1px] z-10" />
                    <Image 
                        src="/images/team-hero-bg.jpg" 
                        alt="Fondo de Equipo" 
                        fill 
                        priority
                        className="object-cover object-center"
                    />
                </div>

                <div className="container mx-auto max-w-4xl relative z-10 text-center">
                    <PageBadge text="Expertos en Innovación Inteligente" icon={<Users size={14} className="text-blue-500" />} />
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-center"
                    >
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-slate-900 mb-4 leading-[1.1] tracking-tight">
                            "No predecimos el futuro de la IA: <br />
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                                lo construimos para tu empresa.
                            </span>"
                        </h1>
                        <p className="text-base md:text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
                            Unimos visión estratégica, ingeniería y marketing para aterrizar la inteligencia artificial en resultados reales.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Story Section */}
            <section className="py-10 md:py-16 bg-white relative">
                <div className="container mx-auto max-w-5xl px-5 md:px-6">
                    <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                        >
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 flex items-center gap-3">
                                <span className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm">01</span>
                                Nuestra Historia
                            </h2>
                            <div className="space-y-4 text-base md:text-lg text-slate-600 leading-relaxed">
                                <p>
                                    Hace tres años, la ola de la IA transformó nuestra forma de vivir y trabajar. Lo que empezó como una inmersión personal, evolucionó hace dos años en un proyecto sólido.
                                </p>
                                <p>
                                    Somos un grupo multidisciplinar que decidió dejar de ser espectador para convertirse en guía. Hemos complementado nuestras carreras de fondo con Másteres especializados y formación continua.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="relative group hidden md:block"
                        >
                            <div className="absolute -inset-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-[2rem] blur-2xl opacity-50 group-hover:opacity-75 transition-opacity" />
                            <div className="relative p-8 bg-white/70 backdrop-blur-xl border border-white rounded-[2rem] shadow-xl space-y-4">
                                <p className="text-slate-700 italic">
                                    "No solo usamos IA; entendemos su arquitectura y su impacto en el negocio."
                                </p>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white shadow-sm" />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Circular Dream Team Section */}
            <section className="py-10 md:py-16 bg-slate-50 relative z-10">
                <div className="container mx-auto px-5 md:px-6 relative">
                    <div className="text-center mb-8 md:mb-14">
                        <h2 className="text-2xl md:text-4xl font-bold text-slate-900 mb-3">The Dream Team</h2>
                        <p className="text-slate-600 text-base md:text-lg">5 Skills, 1 Objetivo: Resultados de Negocio</p>
                    </div>

                    <div className="hidden lg:flex relative max-w-4xl mx-auto h-[600px] items-center justify-center">
                        {/* Central Hub */}
                        <motion.div 
                            initial={{ scale: 0 }}
                            whileInView={{ scale: 1 }}
                            viewport={{ once: true }}
                            className="relative z-10 w-48 h-48 rounded-full bg-white shadow-2xl border border-slate-100 flex items-center justify-center text-center p-6 group cursor-default"
                        >
                            <div className="absolute inset-0 rounded-full bg-blue-600 opacity-5 animate-pulse" />
                            <div className="space-y-1">
                                <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">Nuestro</span>
                                <div className="text-3xl font-black text-slate-900">ADN</div>
                                <span className="text-[10px] text-slate-400 block">IA SOLUTIONS</span>
                            </div>
                        </motion.div>

                        {/* Orbiting Skills */}
                        {skills.map((skill, index) => {
                            const angle = (index * 72 - 90) * (Math.PI / 180)
                            const radius = 250 // Normal radius
                            const x = Math.cos(angle) * radius
                            const y = Math.sin(angle) * radius

                            return (
                                <div key={index} className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    {/* Connection Line */}
                                    <motion.div 
                                        initial={{ opacity: 0, scaleX: 0 }}
                                        whileInView={{ opacity: 0.2, scaleX: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 + index * 0.1 }}
                                        style={{ 
                                            width: radius,
                                            height: '2px',
                                            transformOrigin: 'left center',
                                            rotate: (index * 72 - 90) + 'deg',
                                            translateX: '96px' // Half of hub width
                                        }}
                                        className="bg-slate-400 absolute left-1/2 top-1/2"
                                    />

                                    {/* Skill Node */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                                        whileInView={{ opacity: 1, scale: 1, x, y }}
                                        viewport={{ once: true }}
                                        transition={{ 
                                            type: "spring", 
                                            stiffness: 100, 
                                            delay: 0.5 + index * 0.1 
                                        }}
                                        className="absolute pointer-events-auto z-20 hover:z-50"
                                    >
                                        <div className="relative group">
                                            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${skill.color} p-4 flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 cursor-help ring-4 ring-white`}>
                                                <skill.icon size={32} />
                                            </div>
                                            
                                            {/* Tooltip Content */}
                                            <div className="absolute top-20 left-1/2 -translate-x-1/2 w-72 p-6 bg-white rounded-[2rem] shadow-2xl border border-slate-100 opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50 text-center scale-95 group-hover:scale-100">
                                                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${skill.color} mx-auto mb-4 flex items-center justify-center text-white shadow-sm`}>
                                                    <skill.icon size={24} />
                                                </div>
                                                <h3 className="font-bold text-slate-900 mb-2 leading-tight text-lg">{skill.title}</h3>
                                                <p className="text-sm text-slate-600 leading-relaxed">{skill.desc}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            )
                        })}

                        {/* Labels for small screens or context */}
                        <div className="absolute -bottom-16 text-slate-400 text-sm italic">
                            *Interactúa con los iconos de nuestro ADN
                        </div>
                    </div>

                    {/* Mobile View of Skills (Grid) */}
                    <div className="lg:hidden mt-8 grid gap-4">
                        {skills.map((skill, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className="p-5 bg-white rounded-2xl border border-slate-100 shadow-sm flex gap-4 items-start"
                            >
                                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${skill.color} flex items-center justify-center text-white`}>
                                    <skill.icon size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-bold text-slate-900">{skill.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{skill.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Team Member Photo Circles */}
                    <TeamCircles />

                </div>
            </section>

            {/* Why Trust Us Section */}
            <section className="py-10 md:py-16 bg-white">
                <div className="container mx-auto px-5 md:px-6 max-w-6xl">
                    <div className="text-center mb-8 md:mb-12">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900">¿Por qué confiar en nosotros?</h2>
                        <div className="w-20 h-1.5 bg-blue-600 mx-auto mt-4 rounded-full" />
                    </div>

                    <div className="grid md:grid-cols-3 gap-5">
                        {[
                            {
                                title: "Formación de Élite",
                                desc: "Capacitación constante en las herramientas top de IA para ofrecerte siempre lo último (y lo que de verdad funciona).",
                                icon: ShieldCheck,
                                color: "bg-blue-50 text-blue-600"
                            },
                            {
                                title: "ADN Multidisciplinar",
                                desc: "Unimos Ingeniería, Marketing y Negocios. Una visión 360º que pocos pueden ofrecer.",
                                icon: CheckCircle2,
                                color: "bg-indigo-50 text-indigo-600"
                            },
                            {
                                title: "Realismo Tecnológico",
                                desc: "Sin humo. Entregamos información real y soluciones que impactan en tu cuenta de resultados desde el primer día.",
                                icon: Zap,
                                color: "bg-amber-50 text-amber-600"
                            }
                        ].map((item, index) => (
                            <motion.div 
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="p-5 md:p-8 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all group"
                            >
                                <div className={`w-12 h-12 rounded-2xl ${item.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                    <item.icon size={28} />
                                </div>
                                <item.icon size={28} />
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-600 text-sm md:text-base leading-relaxed">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-12 md:py-24 px-5 md:px-6 relative bg-slate-50">
                <div className="container mx-auto max-w-4xl relative">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-white rounded-3xl md:rounded-[3rem] p-6 md:p-12 text-center border border-slate-100 shadow-xl"
                    >
                        <h2 className="text-2xl md:text-5xl font-bold text-slate-900 mb-6 md:mb-8 leading-tight">
                            "¿Hablamos de soluciones reales?{' '}
                            <span className="text-blue-600">Convirtamos la IA en tu ventaja competitiva.</span>"
                        </h2>
                        <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-full md:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 text-slate-900 px-6 md:px-10 py-4 md:py-5 rounded-2xl md:rounded-full font-bold text-base md:text-lg shadow-sm hover:bg-slate-200 transition-all border border-slate-200"
                        >
                            <Calendar size={18} className="text-blue-600 flex-shrink-0" />
                            <span>Agendar Consultoría Estratégica</span>
                        </motion.button>
                        
                        <p className="mt-6 md:mt-8 text-slate-500 text-sm font-medium">
                            Sin compromiso · 100% pragmático · Resultados medibles
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
