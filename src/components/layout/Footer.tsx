'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Linkedin, Facebook, Instagram, Youtube, MessageCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

const footerSections = [
    {
        title: 'Explora',
        links: [
            { name: 'Equipo', href: '/equipo' },
            { name: 'Casos de Éxito', href: '/casos-exito' },
            { name: 'Videos y Podcast', href: '/podcast' },
            { name: 'LAB IA', href: '/lab' },
            { name: 'Convenios', href: '/convenios' },
        ]
    },
    {
        title: 'Soluciones',
        links: [
            { name: 'Consultoría IA', href: '/soluciones' },
            { name: 'Desarrollo Custom', href: '/soluciones' },
            { name: 'Automatización', href: '/soluciones' },
        ]
    },
    {
        title: 'Empresa',
        links: [
            { name: 'Contacto', href: '/contacto' },
            { name: 'Acceso', href: '/admin/login' },
        ]
    }
]

const socialLinks = [
    { name: 'LinkedIn', href: 'https://www.linkedin.com/company/109997641/', icon: Linkedin },
    { name: 'WhatsApp', href: 'https://api.whatsapp.com/send?phone=34639023805', icon: MessageCircle },
    { name: 'Facebook', href: 'https://www.facebook.com/pgf.iasolutions', icon: Facebook },
    { name: 'Instagram', href: 'https://www.instagram.com/pgf.iasolutions/', icon: Instagram },
    { name: 'YouTube', href: 'https://www.youtube.com/@PGF.IASolutions', icon: Youtube },
]

export default function Footer({ 
    initialNavLinks = [] 
}: { 
    initialNavLinks?: any[] 
}) {
    const [navLinks, setNavLinks] = useState<any[]>(initialNavLinks.length > 0 ? initialNavLinks.filter((link: any) => link.active) : [])

    useEffect(() => {
        if (initialNavLinks.length === 0) {
            const fetchNavLinks = async () => {
                try {
                    const res = await fetch('/api/navigation')
                    if (res.ok) {
                        const data = await res.json()
                        if (Array.isArray(data)) {
                            setNavLinks(data.filter((link: any) => link.active))
                        }
                    }
                } catch (error) {
                    console.error('Error fetching navigation links:', error)
                }
            }
            fetchNavLinks()
        }
    }, [initialNavLinks])

    const dynamicFooterSections = [
        {
            title: 'Explora',
            links: navLinks
                .filter(l => l.location === 'FOOTER_EXPLORA')
                .map(link => ({ name: link.name, href: link.href }))
        },
        {
            title: 'Soluciones',
            links: navLinks
                .filter(l => l.location === 'FOOTER_SOLUCIONES')
                .map(link => ({ name: link.name, href: link.href }))
        },
        {
            title: 'Empresa',
            links: navLinks
                .filter(l => l.location === 'FOOTER_EMPRESA')
                .map(link => ({ name: link.name, href: link.href }))
        }
    ]

    return (
        <footer className="bg-gray-50 border-t border-gray-200">
            <div className="max-w-7xl mx-auto px-6 lg:px-8">
                {/* Main Footer Content */}
                <div className="py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-8 text-center md:text-left">
                    {/* Brand Section */}
                    <div className="lg:col-span-2 flex flex-col items-center md:items-start">
                        <Link href="/" className="inline-flex items-center group mb-6">
                            <div className="relative h-16 w-48">
                                <Image
                                    src="/logo_footer_new.png"
                                    alt="Partners IA Solutions"
                                    fill
                                    className="object-contain transition-transform group-hover:scale-105"
                                />
                            </div>
                        </Link>
                        <p className="text-sm text-gray-600 leading-relaxed max-w-sm mb-8">
                            Transformamos negocios con soluciones de Inteligencia Artificial de última generación.
                        </p>

                        {/* Social Links */}
                        <div className="flex items-center space-x-3">
                            {socialLinks.map((social) => (
                                <Link
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300 hover:shadow-sm transition-all"
                                    aria-label={social.name}
                                >
                                    <social.icon size={18} />
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Footer Links */}
                    {navLinks.length > 0 ? (
                        dynamicFooterSections.map((section) => (
                            <div key={section.title} className="flex flex-col items-center md:items-start">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4 tracking-wide">
                                    {section.title}
                                </h3>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    ) : (
                        footerSections.map((section) => (
                            <div key={section.title} className="flex flex-col items-center md:items-start">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4 tracking-wide">
                                    {section.title}
                                </h3>
                                <ul className="space-y-3">
                                    {section.links.map((link) => (
                                        <li key={link.name}>
                                            <Link
                                                href={link.href}
                                                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
                                            >
                                                {link.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </div>

                {/* Bottom Bar */}
                <div className="py-6 border-t border-gray-200">
                    <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
                        <p className="text-sm text-gray-500">
                            © {new Date().getFullYear()} Partners IA Solutions. Todos los derechos reservados.
                        </p>
                        <div className="flex items-center gap-4 md:gap-6 flex-wrap justify-center mt-4 md:mt-0">
                            <Link href="/aviso-legal" className="text-sm text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap">
                                Aviso Legal
                            </Link>
                            <Link href="/politica-privacidad" className="text-sm text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap">
                                Privacidad
                            </Link>
                            <Link href="/politica-cookies" className="text-sm text-gray-500 hover:text-gray-900 transition-colors whitespace-nowrap">
                                Cookies
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    )
}
