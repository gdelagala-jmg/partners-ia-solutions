const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('Checking Course model...')
    if (prisma.course) {
        console.log('prisma.course EXISTS')
        const courses = await prisma.course.findMany()
        console.log('Courses found:', courses)
    } else {
        console.log('prisma.course is UNDEFINED')
        console.log('Available models:', Object.keys(prisma).filter(k => !k.startsWith('_') && !k.startsWith('$')))
    }
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
    })
