const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const posts = await prisma.newsPost.findMany({ 
    where: { published: true }, 
    select: { title: true, publishedAt: true }, 
    orderBy: { publishedAt: 'desc' }, 
    take: 5 
  })
  
  console.log('\n--- ÚLTIMAS 5 NOTICIAS EN LA BASE DE DATOS (MYSQL) ---')
  posts.forEach((p, i) => console.log(`${i+1}. [${p.publishedAt ? p.publishedAt.toISOString().split('T')[0] : 'N/A'}] ${p.title}`))
  
  const settings = await prisma.siteSetting.findMany()
  console.log('\n--- CONFIGURACIONES DEL PORTAL ---')
  settings.forEach(s => console.log(`${s.key}: ${s.value.substring(0, 50)}...`))
  
  const iaNews = await prisma.iADailyNews.count()
  console.log(`\n--- ROBOT IA DAILY NEWS: ${iaNews} registros ---`)
}

main().finally(() => prisma.$disconnect())
