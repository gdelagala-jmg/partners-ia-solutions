const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const databases = await prisma.$queryRaw`SHOW DATABASES;`;
  console.log("Databases accessible:");
  console.log(databases);

  await prisma.$disconnect();
}

main().catch(console.error);
