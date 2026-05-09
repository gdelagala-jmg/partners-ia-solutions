/**
 * Knowledge Indexer
 * Takes content chunks, generates embeddings, and upserts them into Neon pgvector
 */

import { getNeonClient } from './neon'
import { generateEmbedding } from './embedder'
import { ContentChunk } from './extractor'

export interface IndexResult {
  total: number
  indexed: number
  errors: string[]
  duration_ms: number
}

export async function indexChunks(chunks: ContentChunk[]): Promise<IndexResult> {
  const sql = getNeonClient()
  const start = Date.now()
  const errors: string[] = []
  let indexed = 0

  for (const chunk of chunks) {
    try {
      // Generate embedding
      const embedding = await generateEmbedding(chunk.chunk_text)
      const embeddingStr = `[${embedding.join(',')}]`

      // Upsert: delete existing chunks for this source_id + chunk_index, then insert
      await sql`
        DELETE FROM knowledge_chunks 
        WHERE source_id = ${chunk.source_id} 
          AND chunk_index = ${chunk.chunk_index}
      `

      await sql`
        INSERT INTO knowledge_chunks 
          (content_type, source, source_id, source_slug, source_url, title, chunk_text, chunk_index, metadata, embedding)
        VALUES 
          (${chunk.content_type}, ${chunk.source}, ${chunk.source_id}, ${chunk.source_slug}, ${chunk.source_url}, ${chunk.title}, ${chunk.chunk_text}, ${chunk.chunk_index}, ${JSON.stringify(chunk.metadata)}::jsonb, ${embeddingStr}::vector)
      `

      indexed++
    } catch (err: any) {
      errors.push(`[${chunk.source_id}/${chunk.chunk_index}] ${err.message}`)
    }

    // Rate limiting: small delay between embeddings to avoid quota issues
    if (indexed % 10 === 0 && indexed > 0) {
      await new Promise((r) => setTimeout(r, 200))
    }
  }

  return {
    total: chunks.length,
    indexed,
    errors,
    duration_ms: Date.now() - start,
  }
}

/**
 * Clear all chunks of a specific content type before re-indexing
 */
export async function clearContentType(contentType: string): Promise<number> {
  const sql = getNeonClient()
  const result = await sql`
    DELETE FROM knowledge_chunks WHERE content_type = ${contentType}
  `
  return result.length
}

/**
 * Clear all chunks from a specific source
 */
export async function clearSource(source: string): Promise<number> {
  const sql = getNeonClient()
  const result = await sql`
    DELETE FROM knowledge_chunks WHERE source = ${source}
  `
  return result.length
}

/**
 * Get stats about indexed content
 */
export async function getIndexStats() {
  const sql = getNeonClient()
  const stats = await sql`
    SELECT 
      content_type,
      source,
      COUNT(*) as chunk_count,
      COUNT(DISTINCT source_id) as source_count,
      MIN(created_at) as oldest,
      MAX(updated_at) as newest
    FROM knowledge_chunks
    GROUP BY content_type, source
    ORDER BY content_type
  `
  
  const total = await sql`SELECT COUNT(*) as count FROM knowledge_chunks`
  
  return {
    by_type: stats,
    total_chunks: Number(total[0]?.count || 0),
  }
}
