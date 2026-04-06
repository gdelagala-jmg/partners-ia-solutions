'use client'

import { motion } from 'framer-motion'
import { Sparkles, Bot, ShieldCheck, Zap, HelpCircle, MessageCircle } from 'lucide-react'
import PageBadge from '@/components/ui/PageBadge'
import FAQItem from '@/components/ui/FAQItem'
import LeadCaptureSection from '@/components/sections/LeadCaptureSection'

const faqCategories = [
  {
    title: 'General',
    icon: <Sparkles size={18} className="text-blue-500" />,
    items: [
      {
        question: '¿Qué es Partners IA Solutions?',
        answer: 'Somos una consultora tecnológica especializada en el diseño y despliegue de Ecosistemas de IA. No solo vendemos software; construimos arquitecturas inteligentes (Agentes, RAG y Automatizaciones) que se integran en el ADN de tu empresa para escalar operaciones y reducir costes.'
      },
      {
        question: '¿Cómo ayudáis a las empresas?',
        answer: 'Transformamos cuellos de botella operativos en ventajas competitivas. Desde la automatización de la atención al cliente con agentes autónomos hasta la gestión del conocimiento interno con sistemas RAG, permitimos que tu equipo se centre en tareas de alto valor mientras la IA gestiona la ejecución técnica.'
      }
    ]
  },
  {
    title: 'Tecnología y Soluciones',
    icon: <Bot size={18} className="text-purple-500" />,
    items: [
      {
        question: '¿Qué es un Ecosistema de Agentes de IA?',
        answer: 'Es una red de asistentes inteligentes autónomos que colaboran entre sí para cumplir objetivos complejos. Pueden investigar, redactar, analizar datos o gestionar leads sin intervención humana constante, funcionando las 24 horas del día.'
      },
      {
        question: '¿Qué significa RAG (Retrieval-Augmented Generation)?',
        answer: 'Es una tecnología que permite a la IA responder preguntas basándose exclusivamente en tus propios documentos, bases de datos y manuales. Esto elimina las "alucinaciones" de la IA y garantiza respuestas precisas, privadas y actualizadas con la información de tu negocio.'
      },
      {
        question: '¿Desarrolláis soluciones a medida?',
        answer: 'Sí. Todas nuestras implementaciones son personalizadas. Realizamos una auditoría inicial para entender tus procesos y diseñamos la arquitectura de IA que mejor se adapte a tus necesidades específicas y a los sistemas que ya utilizas.'
      }
    ]
  },
  {
    title: 'Sectores y Aplicación',
    icon: <Zap size={18} className="text-amber-500" />,
    items: [
      {
        question: '¿En qué sectores tenéis experiencia?',
        answer: 'Trabajamos con sectores donde el volumen de información y la necesidad de eficiencia son críticos: Inmobiliario (Real Estate), Legal, Financiero, Logística y Educación (E-learning). Cada sector recibe una capa de IA entrenada específicamente en su terminología y retos.'
      },
      {
        question: '¿Mi empresa es demasiado pequeña para usar IA?',
        answer: 'En absoluto. La IA es el gran igualador. Permite que empresas pequeñas operen con la eficiencia de corporaciones multinacionales. Tenemos soluciones escalables que crecen con tu negocio.'
      }
    ]
  },
  {
    title: 'Seguridad y Privacidad',
    icon: <ShieldCheck size={18} className="text-green-500" />,
    items: [
      {
        question: '¿Están mis datos seguros?',
        answer: 'La privacidad es nuestro pilar fundamental. Implementamos soluciones que cumplen estrictamente con la RGPD. Tus datos corporativos se utilizan para entrenar o contextualizar tus propios modelos y nunca se comparten ni se usan para entrenar IAs públicas de terceros.'
      },
      {
        question: '¿Dónde se alojan los sistemas de IA?',
        answer: 'Dependiendo de las necesidades de seguridad, podemos desplegar soluciones en nubes seguras (Vercel, AWS, Azure) o incluso en infraestructuras locales si el cliente requiere un control total sobre el entorno.'
      }
    ]
  },
  {
    title: 'Proceso y Contacto',
    icon: <MessageCircle size={18} className="text-blue-600" />,
    items: [
      {
        question: '¿Cuál es el primer paso para trabajar juntos?',
        answer: 'Todo empieza con una Consultoría Estratégica. Analizamos tu arquitectura actual, detectamos ineficiencias monetizables y te presentamos un Roadmap de IA con el ROI estimado. No implementamos por implementar; implementamos para rentabilizar.'
      },
      {
        question: '¿Ofrecéis soporte post-implementación?',
        answer: 'Sí. Acompañamos a nuestros partners en la fase de adopción, optimización de prompts y mantenimiento técnico. La IA evoluciona cada semana, y nosotros nos encargamos de que tu sistema nunca se quede atrás.'
      }
    ]
  }
]

export default function FAQPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,113,227,0.03),transparent_50%)]" />
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10 text-center">
          <PageBadge 
            text="Centro de Soporte" 
            icon={<HelpCircle size={14} className="text-blue-500" />} 
          />
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-6 tracking-tight"
          >
            Preguntas Frecuentes
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
          >
            Todo lo que necesitas saber sobre cómo la Inteligencia Artificial de Partners IA Solutions puede transformar tu negocio.
          </motion.p>
        </div>
      </section>

      {/* FAQ Categories & Items */}
      <section className="pb-24 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-16">
          {faqCategories.map((category, catIdx) => (
            <motion.div 
              key={category.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: catIdx * 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 px-2">
                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center border border-gray-100 shadow-sm">
                  {category.icon}
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-black tracking-tight">
                  {category.title}
                </h2>
              </div>
              
              <div className="grid gap-4">
                {category.items.map((item, itemIdx) => (
                  <FAQItem 
                    key={itemIdx}
                    question={item.question}
                    answer={item.answer}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gray-50 py-16 border-y border-gray-100">
        <div className="max-w-4xl mx-auto px-6 text-center">
            <h3 className="text-2xl font-bold text-black mb-4 tracking-tight">¿Alguna otra duda especial?</h3>
            <p className="text-gray-600 mb-8 font-medium">Nuestro equipo de expertos está listo para resolver tus inquietudes técnicas o estratégicas.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a 
                    href="/contacto" 
                    className="px-8 py-3.5 bg-black text-white font-bold rounded-2xl hover:bg-gray-800 transition-all hover:scale-105 shadow-xl shadow-gray-200"
                >
                    Contactar Ahora
                </a>
                <a 
                    href="https://api.whatsapp.com/send?phone=34639023805" 
                    target="_blank"
                    className="px-8 py-3.5 bg-white text-green-600 font-bold rounded-2xl border border-green-100 hover:bg-green-50 transition-all flex items-center gap-2 shadow-sm"
                >
                    <MessageCircle size={18} />
                    WhatsApp Directo
                </a>
            </div>
        </div>
      </section>

      {/* Lead Capture */}
      <LeadCaptureSection />
    </div>
  )
}
