/**
 * Knowledge Search API (Admin-protected)
 * GET /api/admin/knowledge/search?q=<query>&topK=5&debug=true
 * 
 * Performs semantic search against the knowledge base.
 * Returns chunks with similarity scores for debugging/testing.
 * Protected by CRON_SECRET.
 */

import { NextResponse } from 'next/server'
import { searchKnowledge } from '@/lib/knowledge/retriever'

function authorize(req: Request): boolean {
  const url = new URL(req.url)
  const secret = url.searchParams.get('secret') || req.headers.get('x-cron-secret')
  return secret === process.env.CRON_SECRET
}

export async function GET(req: Request) {
  if (!authorize(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')
    const topK = parseInt(searchParams.get('topK') || '5', 10)
    const minSim = parseFloat(searchParams.get('minSimilarity') || '0.25')
    const contentType = searchParams.get('contentType') || undefined
    const source = searchParams.get('source') || undefined

    if (!query) {
      return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
    }

    const results = await searchKnowledge(query, {
      topK,
      minSimilarity: minSim,
      contentTypes: contentType ? [contentType] : undefined,
      sources: source ? [source] : undefined,
    })

    return NextResponse.json(results)
  } catch (error: any) {
    console.error('Knowledge search error:', error)
    return NextResponse.json(
      { error: 'Search failed', details: error.message },
      { status: 500 }
    )
  }
}
