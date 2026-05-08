async function testLeads() {
    const url = 'http://localhost:3000/api/leads';
    
    const payloads = [
        {
            name: "DEMO TEST",
            email: "demo@test.com",
            phone: "600000000",
            company: "Test Corp",
            message: "Quiero una demo de SaveFuel",
            source: "DEMO_REQUEST",
            solutionSlug: "savefuel",
            solutionTitle: "SaveFuel Agent",
            solutionType: "SOLUTION",
            sourceUrl: "http://localhost:3000/soluciones/savefuel",
            sourcePage: "SaveFuel Detail"
        },
        {
            name: "CONTACT TEST",
            email: "contact@test.com",
            message: "Hola, ¿cómo estáis?",
            source: "CONTACT"
        },
        {
            name: "LEGACY TEST",
            email: "legacy@test.com",
            scope: "salud",
            bottleneck: "Muchos datos",
            urgency: "8",
            source: "LEAD_CAPTURE"
        },
        {
            name: "", // Invalid
            email: "invalid",
            source: "DEMO_REQUEST"
        }
    ];

    for (const p of payloads) {
        console.log(`\nTesting payload for: ${p.name || 'INVALID'}`);
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(p)
            });
            const data = await res.json();
            console.log(`Status: ${res.status}`);
            console.log(JSON.stringify(data, null, 2));
        } catch (e) {
            console.error(`Fetch failed: ${e.message}`);
        }
    }
}

testLeads();
