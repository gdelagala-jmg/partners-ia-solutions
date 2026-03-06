/**
 * Generates a URL-friendly slug from a given string.
 * Handles Spanish characters (accents, ñ, etc.) correctly.
 */
export function generateSlug(text: string): string {
    return text
        .normalize('NFD') // Decompose accented characters: 'á' -> 'a' + combining accent
        .replace(/[\u0300-\u036f]/g, '') // Remove the combining accent marks
        .toLowerCase()
        .replace(/ñ/g, 'n') // Handle ñ specifically (already decomposed but mapping is cleaner)
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/[^\w-]+/g, '') // Remove non-alphanumeric characters except hyphens
        .replace(/--+/g, '-') // Replace multiple consecutive hyphens with a single one
        .replace(/^-+|-+$/g, '') // Trim leading/trailing hyphens
}
