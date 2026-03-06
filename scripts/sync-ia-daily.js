const { PrismaClient } = require('@prisma/client');
const Parser = require('rss-parser');
const translate = require('google-translate-api-x');

const prisma = new PrismaClient();
const parser = new Parser();

const FEEDS = [
    { name: 'OpenAI', url: 'https://openai.com/news/rss.xml' },
    { name: 'Google AI', url: 'https://blog.google/technology/ai/rss/' },
    { name: 'Microsoft AI', url: 'https://blogs.microsoft.com/ai/feed/' },
];

async function sync() {
    console.log('--- Starting IA Daily Sync ---');
    try {
        for (const feed of FEEDS) {
            console.log(`Fetching ${feed.name}...`);
            const parsedFeed = await parser.parseURL(feed.url);

            for (const item of parsedFeed.items) {
                if (!item.link || !item.title) continue;

                // Check if already exists
                const existing = await prisma.iADailyNews.findUnique({
                    where: { url: item.link }
                });

                if (existing) {
                    // console.log(`Skipping existing: ${item.title}`);
                    continue;
                }

                console.log(`New item found: ${item.title}`);

                let summaryText = item.contentSnippet || item.content || item.summary || item.title || '';
                summaryText = summaryText.replace(/<[^>]*>?/gm, ''); // Clean HTML

                // Translate summary (first 300 chars)
                let translatedSummary = '';
                try {
                    const res = await translate(summaryText.substring(0, 300), { to: 'es' });
                    translatedSummary = res.text;
                } catch (err) {
                    console.error('Translation error:', err.message);
                    translatedSummary = summaryText.substring(0, 200);
                }

                // Translate title
                let translatedTitle = item.title;
                try {
                    const resTitle = await translate(item.title, { to: 'es' });
                    translatedTitle = resTitle.text;
                } catch (err) {
                    console.error('Title translation error:', err.message);
                }

                await prisma.iADailyNews.create({
                    data: {
                        title: translatedTitle,
                        url: item.link,
                        source: feed.name,
                        publishedAt: new Date(item.isoDate || item.pubDate || Date.now()),
                        summary: translatedSummary.substring(0, 200)
                    }
                });
                console.log(`Saved: ${translatedTitle}`);
            }
        }
        console.log('--- Sync Completed Successfully ---');
    } catch (error) {
        console.error('--- Sync Failed ---', error);
    } finally {
        await prisma.$disconnect();
    }
}

sync();
