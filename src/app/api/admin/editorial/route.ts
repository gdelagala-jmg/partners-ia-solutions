import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/admin/editorial
 * List all editorial content (Admin only)
 */
export async function GET(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const pageKey = searchParams.get('page');
    const sectionKey = searchParams.get('section');

    const where: any = {};
    if (pageKey) where.pageKey = pageKey;
    if (sectionKey) where.sectionKey = sectionKey;

    const content = await prisma.editorialContent.findMany({
      where,
      orderBy: [
        { pageKey: 'asc' },
        { sectionKey: 'asc' },
        { priority: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('[ADMIN_EDITORIAL_GET_ERROR]:', error);
    return NextResponse.json({ error: 'Error fetching editorial content' }, { status: 500 });
  }
}

/**
 * POST /api/admin/editorial
 * Create new editorial content (Admin only)
 */
export async function POST(req: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();

    // Basic validation
    if (!body.pageKey || !body.sectionKey) {
      return NextResponse.json({ error: 'pageKey and sectionKey are required' }, { status: 400 });
    }

    const content = await prisma.editorialContent.create({
      data: {
        pageKey: body.pageKey,
        sectionKey: body.sectionKey,
        badge: body.badge || null,
        titleLine1: body.titleLine1 || null,
        titleLine2: body.titleLine2 || null,
        subtitle: body.subtitle || null,
        supportText: body.supportText || null,
        ctaText: body.ctaText || null,
        ctaUrl: body.ctaUrl || null,
        category: body.category || 'GENERAL',
        tone: body.tone || 'DIRECT',
        isActive: body.isActive !== undefined ? body.isActive : true,
        priority: body.priority !== undefined ? Number(body.priority) : 0,
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        internalNotes: body.internalNotes || null,
      }
    });

    return NextResponse.json(content);
  } catch (error) {
    console.error('[ADMIN_EDITORIAL_POST_ERROR]:', error);
    return NextResponse.json({ error: 'Error creating editorial content' }, { status: 500 });
  }
}
