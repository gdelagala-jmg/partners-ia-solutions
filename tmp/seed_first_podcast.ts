
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const latestNews = await prisma.newsPost.findFirst({
    where: { published: true },
    orderBy: { publishedAt: 'desc' }
  });

  if (!latestNews) {
    console.log('No published news found.');
    return;
  }

  // Create a dummy podcast episode for this news
  // Matching schema: title, description, audioUrl, duration, fileSize, pubDate, guid, coverImage, link
  const episode = await prisma.podcastEpisode.create({
    data: {
      title: latestNews.title,
      description: latestNews.content.replace(/<[^>]*>?/gm, '').substring(0, 500) + '...',
      audioUrl: 'https://partners-ia-solutions.vercel.app/test-audio.mp3', 
      duration: 120,
      fileSize: 1024 * 1024 * 2,
      pubDate: new Date(),
      link: `https://partners-ia-solutions.vercel.app/noticias/${latestNews.slug}`
    }
  });

  console.log('CREATED_EPISODE:', episode.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
