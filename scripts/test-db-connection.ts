import { prisma } from '../src/lib/prisma';

async function testRss() {
  console.log('--- Testing RSS Endpoint Logic ---');
  try {
    const episodes = await prisma.podcastEpisode.findMany({
      orderBy: { pubDate: 'desc' },
      take: 5,
    });
    console.log(`Found ${episodes.length} episodes.`);
    
    if (episodes.length > 0) {
      console.log('Sample Episode:', episodes[0].title);
    } else {
      console.log('No episodes found, but query succeeded.');
    }
    
    console.log('✅ Base logic verified.');
  } catch (error) {
    console.error('❌ Error in RSS logic:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRss();
