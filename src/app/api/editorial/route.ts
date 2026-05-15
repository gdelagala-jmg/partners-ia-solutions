import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

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
        AND: [
          {
            OR: [
              { startDate: null },
              { startDate: { lte: now } }
            ]
          },
          {
            OR: [
              { endDate: null },
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
      }
    });

    return NextResponse.json(content);

  } catch (error) {
    console.error('[EDITORIAL_API_ERROR]:', error);
    return NextResponse.json([], { status: 200 });
  }
}
