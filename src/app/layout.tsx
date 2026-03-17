import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://www.partnersiasolutions.com'),
  title: "IA Solutions - Transformación con Inteligencia Artificial",
  description: "Diseñamos y desplegamos ecosistemas inteligentes que automatizan procesos y escalan negocios.",
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/icon.png',
  },
  openGraph: {
    title: "IA Solutions - Transformación con Inteligencia Artificial",
    description: "Diseñamos y desplegamos ecosistemas inteligentes que automatizan procesos y escalan negocios.",
    images: ['/logo-ias.png'],
    siteName: 'IA Solutions',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
