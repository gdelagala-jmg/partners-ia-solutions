const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  try {
    console.log('Testing Prisma connection...')
    const count = await prisma.navLink.count()
    console.log('NavLink count:', count)
    const links = await prisma.navLink.findMany()
    console.log('Links:', JSON.stringify(links, null, 2))
  } catch (err) {
    console.error('Prisma Error:', err)
  } finally {
    await prisma.$disconnect()
  }
}

test()
