const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.iADailyNews.findMany({
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      createdAt: true
    }
  });
  console.log("TOTAL IADailyNews IN MYSQL:", posts.length);
  console.log("IADailyNews:");
  posts.slice(0, 10).forEach((p, i) => {
    console.log(`[${i+1}] ${p.title} - ${p.createdAt}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
