const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Bridging IA Daily News to NewsPost Blog...')
  
  // Get latest 20 news from IA Daily
  const dailyNews = await prisma.iADailyNews.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 20
  })

  console.log(`Found ${dailyNews.length} recent news to bridge.`)

  for (const news of dailyNews) {
    // Check if it already exists in NewsPost by title
    const exists = await prisma.newsPost.findFirst({
      where: { title: news.title }
    })

    if (!exists) {
      const slug = news.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')

      await prisma.newsPost.create({
        data: {
          title: news.title,
          slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
          excerpt: news.summary ? news.summary.substring(0, 200) + '...' : news.title,
          content: news.summary || news.title || 'Contenido no disponible',
          coverImage: null,
          published: true,
          publishedAt: news.publishedAt,
          category: 'Actualidad IA',
        }
      })
      console.log(`- Bridged: ${news.title}`)
    }
  }

  console.log('Bridge completed.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
