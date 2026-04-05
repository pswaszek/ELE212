import { notFound } from 'next/navigation';
import { getAssignmentById } from '@/lib/db/queries';
import { AssignmentDetailClient } from './AssignmentDetailClient';

export const dynamic = 'force-dynamic';

export default async function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const assignment = getAssignmentById(id);
  if (!assignment) notFound();

  return <AssignmentDetailClient assignment={assignment} />;
}
