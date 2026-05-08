const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const post = await prisma.newsPost.create({
        data: {
            title: 'Test Post Automation OFF',
            slug: 'test-post-automation-off-' + Date.now(),
            content: '<p>Este es un post de prueba para validar que con autoSendEnabled en OFF se crea una campaña en DRAFT.</p>',
            published: false,
            category: 'IA Test'
        }
    })
    console.log('✅ Created draft post:', post.id)
    return post.id
}

main().catch(console.error).finally(() => prisma.$disconnect())
