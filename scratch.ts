import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
    const solutions = await prisma.solution.findMany({
        where: { type: { contains: "LAB" } }
    })
    console.log(JSON.stringify(solutions, null, 2))
}
main()
