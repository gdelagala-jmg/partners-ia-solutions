import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

/**
 * PUT /api/admin/editorial/[id]
 * Update editorial content (Admin only)
 */
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const content = await prisma.editorialContent.update({
      where: { id },
      data: {
        pageKey: body.pageKey,
        sectionKey: body.sectionKey,
        badge: body.badge,
        titleLine1: body.titleLine1,
        titleLine2: body.titleLine2,
        subtitle: body.subtitle,
        supportText: body.supportText,
        ctaText: body.ctaText,
        ctaUrl: body.ctaUrl,
        category: body.category,
        tone: body.tone,
        isActive: body.isActive !== undefined ? body.isActive : undefined,
        priority: body.priority !== undefined ? Number(body.priority) : undefined,
        startDate: body.startDate ? new Date(body.startDate) : body.startDate === null ? null : undefined,
        endDate: body.endDate ? new Date(body.endDate) : body.endDate === null ? null : undefined,
        internalNotes: body.internalNotes,
      }
    });

    return NextResponse.json(content);
  } catch (error: any) {
    console.error('[ADMIN_EDITORIAL_PUT_ERROR]:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Error updating editorial content' }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/editorial/[id]
 * Delete editorial content (Admin only)
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { id } = await params;

    // Direct deletion as per user request (or deactivation if preferred, 
    // but user said "eliminar solo si el patrón actual permite", 
    // and standard pattern here seems to be direct deletion for items like team members)
    await prisma.editorialContent.delete({
      where: { id }
    });

    return NextResponse.json({ success: true, message: 'Content deleted successfully' });
  } catch (error: any) {
    console.error('[ADMIN_EDITORIAL_DELETE_ERROR]:', error);
    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json({ error: 'Error deleting editorial content' }, { status: 500 });
  }
}
