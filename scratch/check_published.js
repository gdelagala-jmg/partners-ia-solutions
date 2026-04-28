const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const allCount = await prisma.newsPost.count();
  const publishedCount = await prisma.newsPost.count({ where: { published: true } });
  const lastNews = await prisma.newsPost.findFirst({
    orderBy: { publishedAt: 'desc' }
  });
  
  console.log('Total News:', allCount);
  console.log('Published News:', publishedCount);
  if (lastNews) {
    console.log('Last News Title:', lastNews.title);
    console.log('Last News Date:', lastNews.publishedAt);
  }
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
