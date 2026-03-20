import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.partnersiasolutions.com'),
  title: {
    default: "IA Solutions | Ecosistemas Inteligentes y Automatización IA",
    template: "%s | Partners IA Solutions"
  },
  description: "Consultores expertos en IA. Diseñamos y desplegamos ecosistemas inteligentes que automatizan procesos y escalan negocios mediante Agentes de IA y soluciones personalizadas.",
  keywords: ["Consultoría IA", "IA Solutions", "Inteligencia Artificial", "Agentes de IA", "Automatización", "Ecosistemas Inteligentes", "Transformación Digital"],
  authors: [{ name: "Partners IA Solutions" }],
  creator: "Partners IA Solutions",
  publisher: "Partners IA Solutions",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "IA Solutions | Ecosistemas Inteligentes",
    description: "Consultores expertos en IA. Diseñamos y desplegamos ecosistemas inteligentes que automatizan procesos y escalan negocios.",
    url: 'https://www.partnersiasolutions.com',
    siteName: 'Partners IA Solutions',
    locale: 'es_ES',
    type: 'website',
    images: [
      {
        url: '/logo-ias.png',
        width: 800,
        height: 600,
        alt: 'Partners IA Solutions Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "IA Solutions | Ecosistemas Inteligentes",
    description: "Consultores expertos en IA. Diseñamos y desplegamos ecosistemas inteligentes que automatizan procesos y escalan negocios.",
    creator: '@partnersiasol',
    images: ['/logo-ias.png'],
  },
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
