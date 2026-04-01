const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const members = [
    {
        name: 'Álvaro',
        photoUrl: '/team/member-1.jpg',
        role: 'Estrategia y Visión Exponencial',
        order: 1,
    },
    {
        name: 'José',
        photoUrl: '/team/member-2.jpg',
        role: 'Ingeniería de Soluciones y Ops',
        order: 2,
    },
    {
        name: 'Diego',
        photoUrl: '/team/member-3.jpg',
        role: 'Innovación y Transformación Digital',
        order: 3,
    },
    {
        name: 'Jaime',
        photoUrl: '/team/member-4.jpg',
        role: 'Consultoría Senior de Negocio',
        order: 4,
    },
    {
        name: 'Gonzalo',
        photoUrl: '/team/member-5.jpg',
        role: 'Estrategia Comercial y Conexión Humana',
        order: 5,
    },
];

async function main() {
    console.log('Seeding team members...');
    for (const member of members) {
        await prisma.teamMember.create({
            data: {
                ...member,
                socialLinks: '{}',
                customFields: '{}',
            }
        });
    }
    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
