/**
 * Embedding generator using Google Gemini text-embedding-004
 * Produces 768-dimension vectors for semantic search
 */

const EMBEDDING_MODEL = 'text-embedding-004'
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${EMBEDDING_MODEL}:embedContent`

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set')
  }

  // Clean and truncate text (model max ~2048 tokens ≈ ~8000 chars)
  const cleanText = text
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 8000)

  const res = await fetch(`${API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: `models/${EMBEDDING_MODEL}`,
      content: { parts: [{ text: cleanText }] },
      taskType: 'RETRIEVAL_DOCUMENT',
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Embedding API error (${res.status}): ${err}`)
  }

  const data = await res.json()
  return data.embedding.values as number[]
}

export async function generateQueryEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY
  if (!apiKey) {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set')
  }

  const cleanText = text.replace(/\s+/g, ' ').trim().slice(0, 2000)

  const res = await fetch(`${API_URL}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: `models/${EMBEDDING_MODEL}`,
      content: { parts: [{ text: cleanText }] },
      taskType: 'RETRIEVAL_QUERY',
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Embedding API error (${res.status}): ${err}`)
  }

  const data = await res.json()
  return data.embedding.values as number[]
}
