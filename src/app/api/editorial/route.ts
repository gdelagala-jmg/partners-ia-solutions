import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/editorial
 * Query params:
 * - page: string (e.g. "home")
 * - section: string (e.g. "hero")
 * 
 * Returns active editorial content for a specific section, 
 * filtered by date and priority.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const pageKey = searchParams.get('page');
    const sectionKey = searchParams.get('section');

    if (!pageKey || !sectionKey) {
      return NextResponse.json(
        { error: 'Missing page or section parameters' },
        { status: 400 }
      );
    }

    const now = new Date();

    // Query for active content
    const content = await prisma.editorialContent.findMany({
      where: {
        pageKey,
        sectionKey,
        isActive: true,
        OR: [
          {
            AND: [
              { startDate: { lte: now } },
              { endDate: { gte: now } }
            ]
          },
          {
            AND: [
              { startDate: null },
              { endDate: null }
            ]
          },
          {
            AND: [
              { startDate: { lte: now } },
              { endDate: null }
            ]
          },
          {
            AND: [
              { startDate: null },
              { endDate: { gte: now } }
            ]
          }
        ]
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      select: {
        id: true,
        badge: true,
        titleLine1: true,
        titleLine2: true,
        subtitle: true,
        supportText: true,
        ctaText: true,
        ctaUrl: true,
        category: true,
        tone: true
        // pageKey, sectionKey, internalNotes, isActive, priority, etc. are NOT exposed
      }
    });

    return NextResponse.json({
      success: true,
      data: content,
      timestamp: now.toISOString()
    });

  } catch (error) {
    console.error('[EDITORIAL_API_ERROR]:', error);
    
    // Return a safe fail-safe response instead of 500
    // This ensures the frontend doesn't break if the DB is down
    return NextResponse.json(
      { 
        success: false, 
        data: [], 
        message: 'Editorial service temporarily unavailable' 
      },
      { status: 200 } // We return 200 with empty data to avoid throwing errors on client fetch
    );
  }
}
