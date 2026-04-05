import { Header } from '@/components/layout/Header';
import { NextActionCard } from '@/components/dashboard/NextActionCard';
import { AssignmentCard } from '@/components/dashboard/AssignmentCard';
import { StatsSummary } from '@/components/dashboard/StatsSummary';
import {
  getUpcomingAssignments,
  getOverdueAssignments,
  getAssignmentStats,
  getTodayAssignments,
} from '@/lib/db/queries';
import { getTopRecommendation } from '@/lib/ai/behaviors';
import { AlertCircle, Calendar, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const stats = getAssignmentStats();
  const overdue = getOverdueAssignments();
  const upcoming = getUpcomingAssignments(7);
  const todayItems = getTodayAssignments();

  const allActionable = [...overdue, ...upcoming];
  const recommendation = getTopRecommendation(allActionable);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  });

  return (
    <div>
      <Header
        title="Good to see you."
        subtitle={today}
      />

      {/* Recommended next action */}
      <section className="mb-8">
        <NextActionCard assignment={recommendation} />
      </section>

      {/* Stats summary */}
      <section className="mb-8">
        <StatsSummary {...stats} />
      </section>

      {/* Overdue */}
      {overdue.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle size={16} className="text-red-500" />
            <h2 className="text-sm font-semibold text-slate-700">Overdue</h2>
            <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{overdue.length}</span>
          </div>
          <div className="space-y-2">
            {overdue.map(a => (
              <AssignmentCard key={a.id} assignment={a} compact />
            ))}
          </div>
        </section>
      )}

      {/* Due today */}
      {todayItems.length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Clock size={16} className="text-orange-500" />
            <h2 className="text-sm font-semibold text-slate-700">Due today</h2>
          </div>
          <div className="space-y-2">
            {todayItems.map(a => (
              <AssignmentCard key={a.id} assignment={a} compact />
            ))}
          </div>
        </section>
      )}

      {/* This week */}
      {upcoming.filter(a => a.status !== 'overdue').length > 0 && (
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={16} className="text-indigo-500" />
            <h2 className="text-sm font-semibold text-slate-700">This week</h2>
          </div>
          <div className="space-y-2">
            {upcoming
              .filter(a => a.status !== 'overdue')
              .slice(0, 6)
              .map(a => (
                <AssignmentCard key={a.id} assignment={a} compact />
              ))}
          </div>
        </section>
      )}
    </div>
  );
}
