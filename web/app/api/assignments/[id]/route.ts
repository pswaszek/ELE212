import { NextResponse } from 'next/server';
import { getAssignmentById, updateAssignment } from '@/lib/db/queries';

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const assignment = getAssignmentById(id);
  if (!assignment) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(assignment);
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const updated = updateAssignment(id, body);
  if (!updated) return NextResponse.json({ error: 'Update failed' }, { status: 400 });
  return NextResponse.json(updated);
}
