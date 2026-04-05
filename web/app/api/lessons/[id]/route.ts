import { NextResponse } from 'next/server';
import { getLessonById } from '@/lib/db/queries';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lesson = getLessonById(id);
  if (!lesson) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(lesson);
}
