
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  try {
    console.log('--- DIAGNÓSTICO DE NEWSLETTER ---');
    
    const campaigns = await prisma.newsletterCampaign.findMany({
      orderBy: { createdAt: 'desc' },
      take: 5
    });

    console.log('\nÚltimas campañas:');
    campaigns.forEach(c => {
      console.log(`- [${c.id}] ${c.title}: STATUS=${c.status}, SENT_AT=${c.sentAt || 'N/A'}`);
    });

    const subscribers = await prisma.newsletterSubscriber.count({
      where: { isActive: true }
    });
    console.log(`\nSuscriptores activos: ${subscribers}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

check();
