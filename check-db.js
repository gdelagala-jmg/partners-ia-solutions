const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    const structure = await prisma.$queryRaw`DESCRIBE TeamMember`;
    console.log('TABLE STRUCTURE:', JSON.stringify(structure, null, 2));
  } catch (e) {
    console.error('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}

check();
