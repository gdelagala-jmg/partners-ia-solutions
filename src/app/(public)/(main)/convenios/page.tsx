'use client'

import { motion } from 'framer-motion'
import PageBadge from '@/components/ui/PageBadge'
import { Handshake } from 'lucide-react'

export default function AgreementsPage() {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="py-8 lg:py-8 bg-gray-50 border-b border-gray-100">
                <div className="max-w-4xl mx-auto px-5 md:px-6 lg:px-8 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <PageBadge text="Alianzas" icon={<Handshake size={14} className="text-blue-500" />} />
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-gray-900 mb-4 tracking-tight">
                            Convenios
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 max-w-xl mx-auto leading-relaxed">
                            Alianzas estratégicas para impulsar la adopción de IA en el tejido empresarial.
                        </p>
                    </motion.div>
                </div>
            </section>

            <main className="max-w-7xl mx-auto px-6 py-16 lg:px-8">
                <div className="mt-8 p-12 bg-white rounded-3xl border border-gray-200 border-dashed text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-50 rounded-2xl mb-6 border border-gray-200">
                        <Handshake className="text-gray-900" size={32} />
                    </div>
                    <p className="text-gray-500 text-lg">Próximamente: Información sobre nuestros partners y convenios institucionales.</p>
                </div>
            </main>
        </div>
    )
}
