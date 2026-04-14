const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const delagalaData = [
  { id: 110807650, address: "Usategui - Trinitarios, Getxo", price: 521000, category: "VENTA", type: "PISO", thumb: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80", visible: true },
  { id: 110579807, address: "Piso en Romo, Getxo", price: 230000, category: "VENTA", type: "PISO", thumb: "https://images.unsplash.com/photo-1502672260266-1c1de2d9d0cb?auto=format&fit=crop&w=800&q=80", visible: true },
  { id: 108580222, address: "Chalet Adosado en Loiu", price: 750000, category: "VENTA", type: "CHALET", thumb: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=80", visible: true },
  { id: 110539093, address: "Las Arenas Centro, Getxo", price: 370000, category: "VENTA", type: "PISO", thumb: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80", visible: true },
  { id: 101879097, address: "Santa María de Getxo", price: 1000000, category: "VENTA", type: "CHALET", thumb: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80", visible: true },
  { id: 107392379, address: "Piso en Sta. María de Getxo", price: 850, category: "ALQUILER", type: "PISO", thumb: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80", visible: true },
  { id: 109876543, address: "Local Comercial Centro, Getxo", price: 1500, category: "ALQUILER", type: "LOCAL", thumb: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80", visible: true },
  { id: 108487200, address: "Oficina Representativa, Bilbao", price: 590000, category: "VENTA", type: "OFICINA", thumb: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80", visible: true },
  { id: 105262118, address: "Garaje Independiente, Algorta", price: 35000, category: "VENTA", type: "GARAJE", thumb: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=800&q=80", visible: true },
  { id: 110292979, address: "Local Nave Industrial, Erandio", price: 420000, category: "VENTA", type: "LOCAL", thumb: "https://images.unsplash.com/photo-1580983546522-bb174092b7ce?auto=format&fit=crop&w=800&q=80", visible: true },
  { id: 109179718, address: "Oficina Coworking, Moyua", price: 830, category: "ALQUILER", type: "OFICINA", thumb: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80", visible: true },
  { id: 107777777, address: "Doble Plaza Garaje Las Arenas", price: 150, category: "ALQUILER", type: "GARAJE", thumb: "https://images.unsplash.com/photo-1506526615555-5dc16298dc1c?auto=format&fit=crop&w=800&q=80", visible: true }
];

async function main() {
  console.log('Iniciando migración de cartera inmobiliaria...');
  
  for (const prop of delagalaData) {
    await prisma.property.upsert({
      where: { externalId: prop.id },
      update: {
        address: prop.address,
        price: prop.price,
        category: prop.category,
        type: prop.type,
        thumb: prop.thumb,
        visible: prop.visible
      },
      create: {
        externalId: prop.id,
        address: prop.address,
        price: prop.price,
        category: prop.category,
        type: prop.type,
        thumb: prop.thumb,
        visible: prop.visible
      }
    });
  }
  
  console.log('Cartera inmobiliaria migrada con éxito.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
