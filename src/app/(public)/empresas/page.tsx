import { Metadata } from 'next'
import EmpresasHero from '@/components/empresas/EmpresasHero'
import EmpresasValues from '@/components/empresas/EmpresasValues'
import EmpresasSolutions from '@/components/empresas/EmpresasSolutions'
import EmpresasProcess from '@/components/empresas/EmpresasProcess'
import EmpresasFormPortal from '@/components/empresas/EmpresasFormPortal'
import FundingCTA from '@/components/empresas/FundingCTA'

export const metadata: Metadata = {
    title: 'Soluciones IA para Empresas | Automatización y Optimización',
    description: 'Ayudamos a empresas a automatizar procesos, mejorar la productividad y tomar decisiones basadas en datos mediante soluciones de Inteligencia Artificial.',
}

export default function EmpresasPage() {
    return (
        <div className="flex flex-col min-h-screen">
            <EmpresasHero />
            <EmpresasValues />
            <EmpresasSolutions />
            <EmpresasProcess />
            <EmpresasFormPortal />
            
            {/* Funding CTA Floater */}
            <FundingCTA />
        </div>
    )
}
