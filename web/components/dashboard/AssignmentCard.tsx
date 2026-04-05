'use client';

import Link from 'next/link';
import { Clock, ExternalLink, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getUrgencyLabel, formatDueDate } from '@/lib/ai/behaviors';
import type { Assignment } from '@/lib/db/queries';
import { clsx } from 'clsx';

interface AssignmentCardProps {
  assignment: Assignment;
  compact?: boolean;
}

const statusIcons = {
  completed: <CheckCircle2 size={16} className="text-emerald-500" />,
  overdue:   <AlertCircle size={16} className="text-red-500" />,
  in_progress: <Clock size={16} className="text-indigo-500" />,
  upcoming:  null,
  skipped:   null,
};

const typeLabels: Record<string, string> = {
  homework: 'HW',
  exercise: 'Ex',
  quiz: 'Quiz',
  extra_credit: 'EC',
};

export function AssignmentCard({ assignment, compact = false }: AssignmentCardProps) {
  const urgency = getUrgencyLabel(assignment.due_date);
  const urgencyVariant = urgency.color as 'red' | 'orange' | 'amber' | 'yellow' | 'slate';
  const stepsArr = JSON.parse(assignment.steps || '[]') as string[];
  const completedArr = JSON.parse(assignment.completed_steps || '[]') as string[];
  const progress = stepsArr.length > 0 ? Math.round((completedArr.length / stepsArr.length) * 100) : 0;

  return (
    <Link href={`/assignments/${assignment.id}`}>
      <Card
        hover
        padding={compact ? 'sm' : 'md'}
        className={clsx(
          assignment.status === 'completed' && 'opacity-60',
          assignment.status === 'overdue' && 'border-red-200'
        )}
      >
        <div className="flex items-start gap-3">
          {/* Type chip */}
          <div className={clsx(
            'shrink-0 w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold',
            assignment.type === 'homework' ? 'bg-indigo-100 text-indigo-700' :
            assignment.type === 'exercise' ? 'bg-blue-100 text-blue-700' :
            assignment.type === 'extra_credit' ? 'bg-purple-100 text-purple-700' :
            'bg-slate-100 text-slate-600'
          )}>
            {typeLabels[assignment.type] ?? '?'}
            {assignment.number}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-slate-900 text-sm">{assignment.title}</span>
              {statusIcons[assignment.status]}
            </div>
            {assignment.topic && !compact && (
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{assignment.topic}</p>
            )}
            <div className="flex items-center gap-3 mt-1.5 flex-wrap">
              {assignment.due_date && (
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock size={11} />
                  {formatDueDate(assignment.due_date)}
                </span>
              )}
              {assignment.status !== 'completed' && (
                <Badge variant={urgencyVariant}>{urgency.label}</Badge>
              )}
              {assignment.status === 'completed' && (
                <Badge variant="green">Done</Badge>
              )}
            </div>

            {/* Mini progress bar */}
            {stepsArr.length > 0 && assignment.status !== 'completed' && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex-1 h-1 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-indigo-400 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">{completedArr.length}/{stepsArr.length}</span>
              </div>
            )}
          </div>

          {/* External link */}
          {assignment.url && (
            <a
              href={assignment.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              className="shrink-0 p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
              title="Open assignment"
            >
              <ExternalLink size={14} />
            </a>
          )}
        </div>
      </Card>
    </Link>
  );
}
