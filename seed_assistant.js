const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  const mockLead = {
    name: "María Fernández",
    email: "maria.fernandez@ejemplo.com",
    phone: "+34 600 123 456",
    company: "Logística Global",
    chatSummary: "El usuario preguntó sobre cómo la IA podría ayudar a optimizar las rutas de entrega de su flota de 50 camiones. El asistente le explicó nuestras soluciones de Automatización y Consultoría. El usuario mostró mucho interés en agendar una demo la semana que viene.",
    status: "NEW"
  }
  
  await prisma.assistantLead.create({
    data: mockLead
  })
  
  console.log("Mock lead guardado.")
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect()
  })
