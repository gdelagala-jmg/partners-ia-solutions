/**
 * Returns the best available image for a solution based on its title and slug
 */
export function getSolutionImage(solution: { title: string; slug: string; multimedia?: string | null }) {
    if (solution.multimedia && solution.multimedia !== '/logo-ias.png' && !solution.multimedia.includes('placeholder')) {
        return solution.multimedia
    }

    const title = solution.title.toLowerCase()
    const slug = solution.slug.toLowerCase()

    if (title.includes('customer') || title.includes('soporte') || slug.includes('customer')) {
        return '/images/visuals/solution-customer-support.png'
    }
    if (title.includes('firma') || title.includes('segur') || title.includes('legal') || slug.includes('segura')) {
        return '/images/visuals/solution-secure-firm.png'
    }
    if (title.includes('agentic') || title.includes('agente') || slug.includes('agent')) {
        return '/images/visuals/solution-agentic-ai.png'
    }
    if (title.includes('finance') || title.includes('finanza') || slug.includes('finance')) {
        return '/images/visuals/sector-finance.png'
    }
    if (title.includes('real estate') || title.includes('inmueble') || slug.includes('inmueble')) {
        return '/images/visuals/sector-real-estate.png'
    }

    return solution.multimedia || '/logo-ias.png'
}
