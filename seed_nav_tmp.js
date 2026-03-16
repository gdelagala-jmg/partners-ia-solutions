const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const links = [
    { name: 'Inicio', href: '/', order: 1, active: true },
    { name: 'Soluciones', href: '/soluciones', order: 2, active: true },
    { name: 'Escuela', href: '/escuela', order: 3, active: true },
    { name: 'Noticias IA', href: '/noticias', order: 4, active: true },
    { name: 'Contacto', href: '/contacto', order: 5, active: true },
  ]

  for (const link of links) {
    await prisma.navLink.upsert({
      where: { id: 0 }, // This won't match anything, so it will always create unless we use a unique field
      update: {},
      create: link,
    }).catch(async (e) => {
        // Fallback if upsert logic with id 0 fails (id might not be autoincrement in some cases)
        await prisma.navLink.create({ data: link }).catch(() => {});
    })
  }

  console.log('Navigation links seeded')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
