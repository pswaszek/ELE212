import { Header } from '@/components/layout/Header';
import { AssignmentCard } from '@/components/dashboard/AssignmentCard';
import { getAllAssignments } from '@/lib/db/queries';
import type { Assignment, AssignmentType } from '@/lib/db/queries';

export const dynamic = 'force-dynamic';

const TYPE_ORDER: AssignmentType[] = ['homework', 'exercise', 'extra_credit', 'quiz'];

const TYPE_LABELS: Record<AssignmentType, string> = {
  homework: 'Homework',
  exercise: 'Exercises',
  quiz: 'Quizzes',
  extra_credit: 'Extra Credit',
};

function groupByType(assignments: Assignment[]): Record<string, Assignment[]> {
  const groups: Record<string, Assignment[]> = {};
  for (const a of assignments) {
    if (!groups[a.type]) groups[a.type] = [];
    groups[a.type].push(a);
  }
  return groups;
}

export default function AssignmentsPage() {
  const all = getAllAssignments();
  const grouped = groupByType(all);

  const total = all.length;
  const done = all.filter(a => a.status === 'completed').length;

  return (
    <div>
      <Header
        title="All Assignments"
        subtitle={`${done} of ${total} complete`}
      />

      {TYPE_ORDER.filter(t => grouped[t]?.length > 0).map(type => {
        const items = grouped[type];
        const typesDone = items.filter(a => a.status === 'completed').length;

        return (
          <section key={type} className="mb-10">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-semibold text-slate-800">{TYPE_LABELS[type]}</h2>
              <span className="text-xs text-slate-400">{typesDone}/{items.length} done</span>
            </div>
            <div className="space-y-2">
              {items.map(a => (
                <AssignmentCard key={a.id} assignment={a} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
