import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import FlashNewsTicker from '@/components/news/FlashNewsTicker'
import Breadcrumbs from '@/components/layout/Breadcrumbs'
import { getSession } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getSession()
    
    // Fetch navigation links on the server to avoid client-side fetch delay
    let navLinks: any[] = []
    try {
        navLinks = await prisma.navLink.findMany({
            orderBy: {
                order: 'asc'
            }
        })
    } catch (error) {
        console.error('Error fetching nav links in layout:', error)
    }

    return (
        <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-blue-100 selection:text-blue-900">
            <Navbar session={session} initialNavLinks={navLinks} />
            <main className="flex-1 pt-16">
                <Breadcrumbs />
                {children}
            </main>
            <FlashNewsTicker />
            <Footer initialNavLinks={navLinks} />
        </div>
    )
}
