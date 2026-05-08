const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const campaignId = process.argv[2]
    if (!campaignId) {
        console.error('Please provide a campaignId')
        process.exit(1)
    }

    console.log(`--- Triggering Manual Send for Campaign ${campaignId} ---`)
    
    // We'll call the API locally (server must be running on 3002)
    const response = await fetch(`http://localhost:3002/api/admin/newsletter/campaigns/${campaignId}/send`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ confirm: true })
    })

    const result = await response.json()
    console.log('Result:', result)
}

main().catch(console.error).finally(() => prisma.$disconnect())
