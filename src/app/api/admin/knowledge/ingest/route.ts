/**
 * Knowledge Ingestion API (Admin-protected)
 * POST /api/admin/knowledge/ingest
 * GET  /api/admin/knowledge/ingest  → returns index stats
 * 
 * Extracts content from all sources, generates embeddings, and indexes them.
 * Protected by CRON_SECRET.
 * 
 * ═══════════════════════════════════════════════
 * ENV VARS REQUIRED:
 *   NEON_DATABASE_URL  — Neon PostgreSQL connection string (pgvector)
 *   GOOGLE_GENERATIVE_AI_API_KEY — Gemini API key for embeddings
 *   CRON_SECRET — Secret token for admin API protection
 * ═══════════════════════════════════════════════
 */

import { NextResponse } from 'next/server'
import {
  extractSolutions,
  extractFAQ,
  extractSaveFuel,
  extractCommercial,
} from '@/lib/knowledge/extractor'
import { indexChunks, getIndexStats } from '@/lib/knowledge/indexer'
import { getNeonClient } from '@/lib/knowledge/neon'

export const maxDuration = 60

function authorize(req: Request): boolean {
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret') || req.headers.get('x-cron-secret')
  return secret === process.env.CRON_SECRET
}

export async function POST(req: Request) {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await req.json().catch(() => ({}))
    const scope = body.scope || 'all' // 'all' | 'solutions' | 'faq' | 'savefuel' | 'commercial'
    const clearFirst = body.clearFirst !== false // default: true

    const results: Record<string, any> = {}
    const sql = getNeonClient()

    // ── Solutions ──
    if (scope === 'all' || scope === 'solutions') {
      if (clearFirst) {
        await sql`DELETE FROM knowledge_chunks WHERE content_type = 'solution'`
      }
      const chunks = await extractSolutions()
      results.solutions = await indexChunks(chunks)
    }

    // ── FAQ ──
    if (scope === 'all' || scope === 'faq') {
      if (clearFirst) {
        await sql`DELETE FROM knowledge_chunks WHERE content_type = 'faq'`
      }
      const chunks = extractFAQ()
      results.faq = await indexChunks(chunks)
    }

    // ── SaveFuel ──
    if (scope === 'all' || scope === 'savefuel') {
      if (clearFirst) {
        await sql`DELETE FROM knowledge_chunks WHERE source = 'savefuel'`
      }
      const chunks = extractSaveFuel()
      results.savefuel = await indexChunks(chunks)
    }

    // ── Commercial ──
    if (scope === 'all' || scope === 'commercial') {
      if (clearFirst) {
        await sql`DELETE FROM knowledge_chunks WHERE content_type = 'commercial'`
      }
      const chunks = extractCommercial()
      results.commercial = await indexChunks(chunks)
    }

    const stats = await getIndexStats()

    return NextResponse.json({
      success: true,
      scope,
      results,
      stats,
    })
  } catch (error: any) {
    console.error('Knowledge ingestion error:', error)
    return NextResponse.json(
      { error: 'Ingestion failed', details: error.message },
      { status: 500 }
    )
  }
}

export async function GET(req: Request) {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const stats = await getIndexStats()
    return NextResponse.json(stats)
  } catch (error: any) {
    console.error('Knowledge stats error:', error)
    return NextResponse.json(
      { error: 'Failed to get stats', details: error.message },
      { status: 500 }
    )
  }
}
