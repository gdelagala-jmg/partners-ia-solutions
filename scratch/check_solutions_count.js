const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function countSolutions() {
  try {
    const total = await prisma.solution.count();
    const published = await prisma.solution.count({ where: { published: true } });
    const featured = await prisma.solution.count({ where: { featured: true } });
    
    console.log('TOTAL_SOLUTIONS:', total);
    console.log('PUBLISHED_SOLUTIONS:', published);
    console.log('FEATURED_SOLUTIONS:', featured);
    
    const solutions = await prisma.solution.findMany({
        take: 5,
        select: { title: true, published: true, featured: true }
    });
    console.log('SAMPLE_SOLUTIONS:', JSON.stringify(solutions, null, 2));

  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

countSolutions();
