'use client';

import { useState } from 'react';
import { CheckCircle2, Circle, Loader2, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import { Button } from '@/components/ui/Button';

interface StepListProps {
  assignmentId: string;
  steps: string[];
  completedSteps: string[];
  onToggle: (stepIndex: number, completed: boolean) => void;
  onGenerateSteps: () => void;
  loading?: boolean;
}

export function StepList({
  steps,
  completedSteps,
  onToggle,
  onGenerateSteps,
  loading = false,
}: StepListProps) {
  if (steps.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-sm text-slate-500 mb-3">
          Break this assignment into small steps to make it easier to start.
        </p>
        <Button
          variant="secondary"
          icon={loading ? undefined : <Sparkles size={15} />}
          loading={loading}
          onClick={onGenerateSteps}
        >
          {loading ? 'Building your steps...' : 'Generate steps'}
        </Button>
      </div>
    );
  }

  const doneCount = completedSteps.length;
  const nextIncomplete = steps.findIndex((_, i) => !completedSteps.includes(String(i)));

  return (
    <div className="space-y-2">
      {steps.map((step, i) => {
        const done = completedSteps.includes(String(i));
        const isNext = i === nextIncomplete;

        return (
          <button
            key={i}
            onClick={() => onToggle(i, !done)}
            className={clsx(
              'w-full flex items-start gap-3 px-4 py-3 rounded-xl text-left transition-all border',
              done
                ? 'bg-emerald-50 border-emerald-100 opacity-70'
                : isNext
                  ? 'bg-indigo-50 border-indigo-200 shadow-sm'
                  : 'bg-white border-slate-100 hover:bg-slate-50'
            )}
          >
            <div className="mt-0.5 shrink-0">
              {done ? (
                <CheckCircle2 size={18} className="text-emerald-500" />
              ) : (
                <Circle size={18} className={clsx(
                  isNext ? 'text-indigo-400' : 'text-slate-300'
                )} />
              )}
            </div>
            <div className="flex-1">
              <span className={clsx(
                'text-sm',
                done ? 'text-slate-400 line-through' : isNext ? 'text-slate-900 font-medium' : 'text-slate-700'
              )}>
                {isNext && !done && (
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 bg-indigo-100 px-1.5 py-0.5 rounded mr-2">
                    Next
                  </span>
                )}
                {step}
              </span>
            </div>
          </button>
        );
      })}

      {doneCount === steps.length && steps.length > 0 && (
        <div className="text-center py-3">
          <p className="text-sm font-medium text-emerald-700">
            🎉 All steps done! Great work.
          </p>
        </div>
      )}
    </div>
  );
}
