import { NextResponse } from 'next/server';
import { getAllAssignments, getUpcomingAssignments, getOverdueAssignments, getAssignmentStats } from '@/lib/db/queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const filter = searchParams.get('filter');

  try {
    if (filter === 'upcoming') {
      const days = parseInt(searchParams.get('days') ?? '7', 10);
      return NextResponse.json(getUpcomingAssignments(days));
    }
    if (filter === 'overdue') {
      return NextResponse.json(getOverdueAssignments());
    }
    if (filter === 'stats') {
      return NextResponse.json(getAssignmentStats());
    }
    return NextResponse.json(getAllAssignments());
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Failed to load assignments' }, { status: 500 });
  }
}
