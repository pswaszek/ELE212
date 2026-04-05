import { NextResponse } from 'next/server';
import { getAllLessons, getLessonsBySection } from '@/lib/db/queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const section = searchParams.get('section');

  try {
    if (section) return NextResponse.json(getLessonsBySection(section));
    return NextResponse.json(getAllLessons());
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load lessons' }, { status: 500 });
  }
}
