import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import translate from 'google-translate-api-x';

const parser = new Parser();

// Configure the feeds to scrape
const FEEDS = [
    { name: 'Google AI', url: 'https://blog.google/technology/ai/rss/' },
    { name: 'Microsoft AI', url: 'https://blogs.microsoft.com/ai/feed/' },
    { name: 'OpenAI', url: 'https://openai.com/news/rss.xml' },
];

// Helper to check if published within last 72 hours
const isWithin72Hours = (dateString: string) => {
    const pubDate = new Date(dateString);
    const now = new Date();
    const diffHours = (now.getTime() - pubDate.getTime()) / (1000 * 60 * 60);
    return diffHours <= 168; // 7 days
};

export async function GET() {
    try {
        const allNews = [];

        for (const feed of FEEDS) {
            try {
                const parsedFeed = await parser.parseURL(feed.url);

                // Filter items published within the last 72 hours
                const recentItems = parsedFeed.items.filter(item => item.isoDate ? isWithin72Hours(item.isoDate) : false);

                for (const item of recentItems) {
                    let summaryText = item.contentSnippet || item.content || item.summary || item.title || '';

                    // Clean up HTML tags if any
                    summaryText = summaryText.replace(/<[^>]*>?/gm, '');

                    // Translate Summary to Spanish (Spain)
                    let translatedSummary = summaryText;
                    try {
                        const res = await translate(summaryText.substring(0, 300), { to: 'es' });
                        translatedSummary = res.text;
                    } catch (err) {
                        console.error('Translation error for:', item.title, err);
                    }

                    // Translate Title to Spanish (Spain)
                    let translatedTitle = item.title;
                    try {
                        if (item.title) {
                            const resTitle = await translate(item.title, { to: 'es' });
                            translatedTitle = resTitle.text;
                        }
                    } catch (err) {
                        console.error('Translation error for title:', item.title, err);
                    }

                    // Truncate to 100 characters and append link
                    let finalSummary = translatedSummary.length > 100
                        ? translatedSummary.substring(0, 97) + '...'
                        : translatedSummary;

                    finalSummary = `${finalSummary} [Fuente](${item.link})`;

                    allNews.push({
                        title: translatedTitle,
                        link: item.link,
                        date: item.isoDate,
                        company: feed.name,
                        summary: finalSummary
                    });
                }
            } catch (err) {
                console.error(`Error fetching feed ${feed.name}:`, err);
            }
        }

        // Sort by date descending
        allNews.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());

        return NextResponse.json(allNews);
    } catch (error) {
        console.error('Error fetching flash news:', error);
        return NextResponse.json({ error: 'Failed to fetch flash news' }, { status: 500 });
    }
}
