const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Explicit Bridging News...')
  
  const dailyNews = await prisma.iADailyNews.findMany({
    orderBy: { publishedAt: 'desc' },
    take: 10
  })

  for (const news of dailyNews) {
    const slug = news.title
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    const data = {
      title: news.title || 'Sin titulo',
      slug: `${slug}-${Math.floor(Math.random() * 10000)}`,
      category: 'Actualidad IA',
      content: news.summary || news.title || 'Noticia de actualidad sobre IA.',
      published: true,
      publishedAt: news.publishedAt || new Date(),
    }

    console.log('Attempting to create NewsPost with data:', JSON.stringify(data, null, 2))

    try {
      await prisma.newsPost.create({ data })
      console.log(`- Created: ${news.title}`)
    } catch (err) {
      console.error('Failed to create:', news.title, err.message)
    }
  }
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
