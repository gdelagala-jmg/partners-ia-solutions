
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const count = await prisma.podcastEpisode.count();
  console.log('NUM_EPISODES:', count);
  
  if (count > 0) {
    const episodes = await prisma.podcastEpisode.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' }
    });
    console.log('LAST_EPISODES:', JSON.stringify(episodes, null, 2));
  }
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
