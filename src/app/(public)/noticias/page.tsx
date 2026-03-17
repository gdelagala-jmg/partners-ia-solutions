import { Metadata } from 'next'
import NewsPageClient from '@/components/news/NewsPageClient'

export const metadata: Metadata = {
    title: 'Noticias & Insights Hub | IA Solutions',
    description: 'Mantente al día con las últimas tendencias, noticias y avances en Inteligencia Artificial aplicada a diversos sectores empresariales.',
}

export default function NewsPage() {
    return <NewsPageClient />
}
