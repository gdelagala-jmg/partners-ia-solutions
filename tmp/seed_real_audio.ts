
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

  // Delete any previous episodes to start clean
  await prisma.podcastEpisode.deleteMany({});

  // Create a real-looking podcast episode
  const episode = await prisma.podcastEpisode.create({
    data: {
      title: latestNews.title,
      description: "Episodio de prueba para configuración: " + latestNews.title,
      audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', // REAL MP3
      duration: 372, // Real duration for this mp3
      fileSize: 8944718, // Real file size
      pubDate: new Date(),
      link: `https://partners-ia-solutions.vercel.app/noticias/${latestNews.slug}`
    }
  });

  console.log('CREATED_EPISODE_WITH_REAL_AUDIO:', episode.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
