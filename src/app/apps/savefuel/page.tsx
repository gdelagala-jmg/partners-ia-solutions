'use client'

import SaveFuelNavbar from '@/components/savefuel/SaveFuelNavbar'
import SaveFuelHero from '@/components/savefuel/SaveFuelHero'
import SaveFuelReveal from '@/components/savefuel/SaveFuelReveal'
import SaveFuelTrustBar from '@/components/savefuel/SaveFuelTrustBar'
import SaveFuelCountries from '@/components/savefuel/SaveFuelCountries'
import SaveFuelUseCases from '@/components/savefuel/SaveFuelUseCases'
import SaveFuelHowItWorks from '@/components/savefuel/SaveFuelHowItWorks'
import SaveFuelComparison from '@/components/savefuel/SaveFuelComparison'
import SaveFuelTrustCards from '@/components/savefuel/SaveFuelTrustCards'
import SaveFuelTestimonials from '@/components/savefuel/SaveFuelTestimonials'
import SaveFuelCommunity from '@/components/savefuel/SaveFuelCommunity'
import SaveFuelPricing from '@/components/savefuel/SaveFuelPricing'
import SaveFuelFAQ from '@/components/savefuel/SaveFuelFAQ'
import SaveFuelFooter from '@/components/savefuel/SaveFuelFooter'

import { redirect } from 'next/navigation'

export default function SaveFuelPage() {
    redirect('/')
    return (
        <main className="relative">
            <SaveFuelNavbar />
            <SaveFuelHero />
            <SaveFuelReveal />
            <SaveFuelTrustBar />
            <SaveFuelCountries />
            <SaveFuelUseCases />
            <SaveFuelHowItWorks />
            <SaveFuelComparison />
            <SaveFuelTrustCards />
            <SaveFuelTestimonials />
            <SaveFuelCommunity />
            <SaveFuelPricing />
            <SaveFuelFAQ />
            <SaveFuelFooter />
        </main>
    )
}
