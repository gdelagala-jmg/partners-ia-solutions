const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function test() {
  try {
    console.log('Listing tables...')
    const tables = await prisma.$queryRaw`SHOW TABLES`
    console.log('Tables:', JSON.stringify(tables, null, 2))
  } catch (err) {
    console.error('Prisma Error:', err)
  } finally {
    await prisma.$disconnect()
  }
}

test()
