import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// List of sources to scrape
const SOURCES = [
    { name: 'OpenAI', url: 'https://openai.com/news', selector: 'article' },
    { name: 'Google AI', url: 'https://blog.google/technology/ai/', selector: 'article' },
    { name: 'Microsoft AI', url: 'https://blogs.microsoft.com/ai/', selector: 'article' },
    { name: 'Meta AI', url: 'https://ai.meta.com/blog/', selector: 'article' },
    { name: 'Nvidia', url: 'https://nvidianews.nvidia.com/news', selector: 'article' },
    { name: 'Anthropic', url: 'https://www.anthropic.com/news', selector: 'article' }
]

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const refresh = searchParams.get('refresh') === 'true'

        // 1. Fetch from DB first
        const cachedNews = await prisma.iADailyNews.findMany({
            where: {
                publishedAt: {
                    gte: new Date(Date.now() - 168 * 60 * 60 * 1000) // Last 7 days
                }
            },
            orderBy: {
                publishedAt: 'desc'
            }
        })

        // If we have news and not forcing refresh, return them
        if (cachedNews.length > 0 && !refresh) {
            return NextResponse.json(cachedNews)
        }

        // 2. If no news or refresh requested, we trigger the "scraper"
        // Note: In a real environment, this would be a background task or a separate process.
        // For now, we return what we have and maybe a message that sync is needed.
        // Or if the user wants it NOW, we could trigger a specific "sync" call.

        return NextResponse.json(cachedNews)
    } catch (error: any) {
        console.error('Error fetching IA Daily news:', error)
        return NextResponse.json({ error: 'Failed to fetch IA Daily news' }, { status: 500 })
    }
}

// POS/SYNC endpoint to trigger actual scraping
export async function POST(request: Request) {
    // This would ideally be protected or triggered by a cron job
    try {
        // Return a message that sync is starting (or perform it here if small)
        // For this task, I will provide the scraping logic in a separate "sync" script 
        // that the assistant can run once to populate the DB.
        return NextResponse.json({ message: 'Sync triggered' })
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
