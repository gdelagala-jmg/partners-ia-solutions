const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const lead = await prisma.assistantLead.create({
    data: {
      name: "Juan Perez",
      email: "juan.perez@techcorp.com",
      phone: "+34 600 112 233",
      company: "TechCorp Solutions",
      chatSummary: "Interesado en implementar un sistema de RAG para su base de datos técnica. Busca reducir tiempos de soporte en un 40%.",
      sentiment: "POSITIVE",
      priority: "TOP",
      insights: "Lead altamente cualificado con presupuesto asignado. Su principal 'pain point' es la latencia en respuestas de soporte técnico. Oportunidad clara para integración de Knowledge Base.",
      status: "NEW"
    }
  })
  console.log("Demo Lead Created:", lead.id)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
