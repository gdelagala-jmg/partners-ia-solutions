const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Restoring settings...')
  
  const settings = [
    {
      key: 'main_podcast_channel',
      value: '<iframe data-testid="embed-iframe" style="border-radius:12px" src="https://open.spotify.com/embed/show/2L0NV7YhTyXzUEcP7VAv7H?utm_source=generator&theme=0" width="100%" height="352" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>'
    },
    {
      key: 'maintenance_mode',
      value: 'false'
    }
  ]

  for (const s of settings) {
    await prisma.siteSetting.upsert({
      where: { key: s.key },
      update: { value: s.value },
      create: s
    })
    console.log(`- ${s.key} restored.`)
  }

  console.log('All settings restored.')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
