'use client';

import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { getUrgencyLabel, formatDueDate } from '@/lib/ai/behaviors';
import type { Assignment } from '@/lib/db/queries';

interface NextActionCardProps {
  assignment: Assignment | null;
}

export function NextActionCard({ assignment }: NextActionCardProps) {
  if (!assignment) {
    return (
      <Card className="border-emerald-200 bg-emerald-50">
        <div className="flex items-center gap-3">
          <div className="text-2xl">🎉</div>
          <div>
            <p className="font-semibold text-emerald-800">You're all caught up!</p>
            <p className="text-sm text-emerald-600">No urgent assignments right now.</p>
          </div>
        </div>
      </Card>
    );
  }

  const urgency = getUrgencyLabel(assignment.due_date);
  const urgencyVariant = urgency.color as 'red' | 'orange' | 'amber' | 'yellow' | 'slate';

  return (
    <Card className="border-indigo-100 bg-gradient-to-br from-indigo-50 to-white">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-semibold text-indigo-500 uppercase tracking-wide">
              Focus on this next
            </span>
            <Badge variant={urgencyVariant}>{urgency.label}</Badge>
          </div>
          <h2 className="text-lg font-bold text-slate-900 truncate">{assignment.title}</h2>
          {assignment.topic && (
            <p className="text-sm text-slate-500 mt-0.5 truncate">{assignment.topic}</p>
          )}
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Clock size={13} />
              {formatDueDate(assignment.due_date)}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <span>~{assignment.estimated_minutes} min</span>
            </div>
          </div>
        </div>
        <Link href={`/assignments/${assignment.id}`} className="shrink-0">
          <Button size="md" icon={<ArrowRight size={16} />}>
            Start now
          </Button>
        </Link>
      </div>
    </Card>
  );
}
