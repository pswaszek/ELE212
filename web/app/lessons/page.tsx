import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { getAllLessons } from '@/lib/db/queries';
import { BookOpen, FileText, Calendar } from 'lucide-react';
import { clsx } from 'clsx';

export const dynamic = 'force-dynamic';

const SECTION_META: Record<string, { label: string; color: string; description: string }> = {
  A: { label: 'Basics',    color: 'bg-blue-50 border-blue-200',    description: 'Circuit variables, Kirchhoff, resistors' },
  B: { label: 'Nodal',     color: 'bg-indigo-50 border-indigo-200', description: 'Node voltage analysis, supernodes, op amps' },
  C: { label: 'Phasors',   color: 'bg-violet-50 border-violet-200', description: 'AC analysis, impedance, AC power' },
  D: { label: 'Theorems',  color: 'bg-purple-50 border-purple-200', description: 'Thevenin, Norton, max power transfer' },
  F: { label: '1st Order', color: 'bg-rose-50 border-rose-200',    description: 'RC and RL transient response' },
  G: { label: '2nd Order', color: 'bg-orange-50 border-orange-200', description: 'RLC circuits, natural and step response' },
  H: { label: 'Mesh',      color: 'bg-amber-50 border-amber-200',  description: 'Mesh current analysis' },
};

const TODAY = new Date('2026-04-05');

export default function LessonsPage() {
  const lessons = getAllLessons();

  // Group by section
  const grouped: Record<string, typeof lessons> = {};
  for (const l of lessons) {
    if (!grouped[l.section]) grouped[l.section] = [];
    grouped[l.section].push(l);
  }

  return (
    <div>
      <Header
        title="Lectures"
        subtitle={`${lessons.length} lectures · ELE 212 Spring 2026`}
      />

      <div className="space-y-8">
        {Object.entries(grouped).map(([section, items]) => {
          const meta = SECTION_META[section] ?? { label: section, color: 'bg-slate-50 border-slate-200', description: '' };

          return (
            <section key={section}>
              <div className="flex items-center gap-3 mb-3">
                <div className={clsx('px-3 py-1 rounded-lg border text-sm font-semibold text-slate-700', meta.color)}>
                  {meta.label}
                </div>
                <p className="text-sm text-slate-500">{meta.description}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {items.map(lesson => {
                  const lectureDate = new Date(lesson.date);
                  const isPast = lectureDate <= TODAY;
                  const isRecent = isPast && (TODAY.getTime() - lectureDate.getTime()) < 7 * 24 * 60 * 60 * 1000;

                  return (
                    <Link key={lesson.id} href={`/lessons/${lesson.id}`}>
                      <Card hover padding="sm" className={clsx(!isPast && 'opacity-60')}>
                        <div className="flex items-start gap-3">
                          <div className="shrink-0 w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center">
                            <BookOpen size={15} className="text-slate-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-sm font-semibold text-slate-900">
                                Lec {lesson.lecture_number}: {lesson.title}
                              </span>
                              {isRecent && <Badge variant="indigo">Recent</Badge>}
                              {!isPast && <Badge variant="slate">Upcoming</Badge>}
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{lesson.topic}</p>
                            <div className="flex items-center gap-3 mt-1.5">
                              <span className="text-xs text-slate-400 flex items-center gap-1">
                                <Calendar size={11} />
                                {new Date(lesson.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </span>
                              {lesson.slides_file && (
                                <span className="text-xs text-indigo-500 flex items-center gap-1">
                                  <FileText size={11} />
                                  Slides
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
