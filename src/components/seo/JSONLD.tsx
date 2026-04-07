import React from 'react'

interface JSONLDProps {
    type: 'Organization' | 'LocalBusiness' | 'NewsArticle' | 'BreadcrumbList' | 'Service'
    data: any
}

export default function JSONLD({ type, data }: JSONLDProps) {
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': type,
        ...data,
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
    )
}

// Helper para crear el schema de Organización (Global)
export const getOrganizationSchema = () => ({
    name: 'Partners IA Solutions',
    url: 'https://www.partnersiasolutions.com',
    logo: 'https://www.partnersiasolutions.com/logo-ias.png',
    sameAs: [
        'https://www.linkedin.com/company/partners-ia-solutions',
        'https://twitter.com/partnersiasol'
    ],
    description: 'Consultores expertos en IA. Diseñamos y desplegamos ecosistemas inteligentes que automatizan procesos y escalan negocios.'
})

// Helper para crear el schema de Negocio Local (Digital)
export const getLocalBusinessSchema = () => ({
    name: 'Partners IA Solutions',
    image: 'https://www.partnersiasolutions.com/logo-ias.png',
    '@id': 'https://www.partnersiasolutions.com',
    url: 'https://www.partnersiasolutions.com',
    telephone: '', // Opcional si el usuario lo provee
    address: {
        '@type': 'PostalAddress',
        'streetAddress': '',
        'addressLocality': 'España',
        'addressRegion': '',
        'postalCode': '',
        'addressCountry': 'ES'
    },
    geo: {
        '@type': 'GeoCoordinates',
        'latitude': 40.416775,
        'longitude': -3.703790
    },
    openingHoursSpecification: {
        '@type': 'OpeningHoursSpecification',
        'dayOfWeek': [
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday'
        ],
        'opens': '09:00',
        'closes': '19:00'
    }
})
