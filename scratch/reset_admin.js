
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function resetAdmin() {
    try {
        const user = await prisma.adminUser.upsert({
            where: { username: 'admin' },
            update: { passwordHash: 'admin123' },
            create: {
                username: 'admin',
                passwordHash: 'admin123',
            }
        });
        console.log('Admin user reset successfully:', user.username);
    } catch (error) {
        console.error('Error resetting admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

resetAdmin();
