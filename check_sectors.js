const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const sectors = await prisma.sector.findMany()
  console.log(sectors.length + " sectores found.")
  console.log(sectors)
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
