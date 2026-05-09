/**
 * Knowledge Retriever
 * Performs semantic search against Neon pgvector
 * Returns the most relevant chunks for a given query
 */

import { getNeonClient } from './neon'
import { generateQueryEmbedding } from './embedder'

export interface RetrievalResult {
  id: string
  content_type: string
  source: string
  source_slug: string
  source_url: string
  title: string
  chunk_text: string
  similarity: number
  metadata: Record<string, unknown>
}

export interface RetrievalResponse {
  query: string
  results: RetrievalResult[]
  total_found: number
  search_time_ms: number
}

export async function searchKnowledge(
  query: string,
  options: {
    topK?: number
    minSimilarity?: number
    contentTypes?: string[]
    sources?: string[]
  } = {}
): Promise<RetrievalResponse> {
  const { topK = 5, minSimilarity = 0.3, contentTypes, sources } = options
  const start = Date.now()

  // Generate embedding for the query
  const queryEmbedding = await generateQueryEmbedding(query)
  const embeddingStr = `[${queryEmbedding.join(',')}]`

  const sql = getNeonClient()

  // Build dynamic filter conditions
  let filterConditions = ''
  const params: any[] = []

  if (contentTypes && contentTypes.length > 0) {
    filterConditions += ` AND content_type = ANY($1::text[])`
    params.push(contentTypes)
  }
  if (sources && sources.length > 0) {
    const paramIdx = params.length + 1
    filterConditions += ` AND source = ANY($${paramIdx}::text[])`
    params.push(sources)
  }

  // Use raw SQL for vector similarity search since tagged templates
  // don't easily handle dynamic filter composition
  const results = await sql`
    SELECT 
      id,
      content_type,
      source,
      source_slug,
      source_url,
      title,
      chunk_text,
      metadata,
      1 - (embedding <=> ${embeddingStr}::vector) as similarity
    FROM knowledge_chunks
    WHERE 1=1
      ${contentTypes ? sql`AND content_type = ANY(${contentTypes}::text[])` : sql``}
      ${sources ? sql`AND source = ANY(${sources}::text[])` : sql``}
    ORDER BY embedding <=> ${embeddingStr}::vector
    LIMIT ${topK}
  `

  // Filter by minimum similarity
  const filtered = results
    .filter((r: any) => Number(r.similarity) >= minSimilarity)
    .map((r: any) => ({
      id: r.id,
      content_type: r.content_type,
      source: r.source,
      source_slug: r.source_slug,
      source_url: r.source_url,
      title: r.title,
      chunk_text: r.chunk_text,
      similarity: Number(Number(r.similarity).toFixed(4)),
      metadata: r.metadata || {},
    }))

  return {
    query,
    results: filtered,
    total_found: filtered.length,
    search_time_ms: Date.now() - start,
  }
}
