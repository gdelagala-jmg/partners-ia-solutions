const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const posts = await prisma.newsPost.findMany({
    orderBy: { publishedAt: 'desc' },
    select: {
      id: true,
      title: true,
      published: true,
      coverImage: true,
      category: true
    }
  });
  console.log("TOTAL POSTS IN MYSQL:", posts.length);
  console.log("POSTS:");
  posts.slice(0, 5).forEach((p, i) => {
    console.log(`[${i+1}] ${p.title} (Published: ${p.published}) - ${p.coverImage ? 'HAS IMAGE' : 'NO IMAGE'} - ${p.category}`);
  });
}

main().catch(console.error).finally(() => prisma.$disconnect());
