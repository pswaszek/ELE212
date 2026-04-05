import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, FileText, ExternalLink, BookOpen } from 'lucide-react';
import { getLessonById } from '@/lib/db/queries';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { AIHelpPanel } from '@/components/assignments/AIHelpPanel';
import { QuizWidget } from '@/components/lessons/QuizWidget';

export const dynamic = 'force-dynamic';

const COURSE_PDF_BASE = '/course-pdfs';

// Key concepts by section (for showing what to remember)
const SECTION_CONCEPTS: Record<string, string[]> = {
  A: ['Voltage (V) = energy per charge', 'Current (I) = charge per second', 'KVL: voltages around a loop = 0', 'KCL: currents at a node = 0', 'Ohm\'s law: V = IR'],
  B: ['Label each node voltage (e.g., V₁, V₂)', 'Ground node = 0V', 'Write KCL at each non-ground node', 'Solve the system of equations', 'Supernode = voltage source between two non-reference nodes'],
  C: ['Phasors convert sine waves to complex numbers', 'Impedance: Z_R = R, Z_L = jωL, Z_C = 1/(jωC)', 'Voltage and current stay in phase for R', 'L and C create phase shifts', 'Power factor = cos(phase angle between V and I)'],
  D: ['Thevenin: replace complex circuit with V_th + R_th', 'Norton: replace complex circuit with I_N + R_N', 'V_th = open-circuit voltage', 'R_th = resistance seen from terminals (sources off)', 'Max power: R_load = R_th'],
  F: ['Time constant τ = RC or L/R', 'Response decays as e^(-t/τ)', 'After 5τ, circuit is at steady state', 'Initial value: what happens at t=0⁺', 'Final value: what happens as t→∞'],
  G: ['Two energy storage elements = 2nd order', 'Characteristic equation: s² + 2αs + ω₀² = 0', 'Overdamped: two real roots', 'Underdamped: oscillates', 'Critically damped: fastest no-oscillation decay'],
  H: ['Assign mesh currents (loops)', 'Write KVL for each mesh', 'Mesh current = net current in that loop', 'Supermesh = current source between two meshes'],
};

export default async function LessonDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lesson = getLessonById(id);
  if (!lesson) notFound();

  const concepts = SECTION_CONCEPTS[lesson.section] ?? [];
  const lectureDate = new Date(lesson.date).toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
  });

  return (
    <div>
      <Link href="/lessons" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-800 mb-5 transition-colors">
        <ArrowLeft size={15} />
        All lectures
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="indigo">Lecture {lesson.lecture_number}</Badge>
          <Badge variant="slate">{lectureDate}</Badge>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{lesson.title}</h1>
        <p className="text-slate-500 mt-1">{lesson.topic}</p>
        {lesson.textbook_ref && (
          <p className="text-xs text-slate-400 mt-1">Textbook: {lesson.textbook_ref}</p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: main content */}
        <div className="lg:col-span-2 space-y-6">

          {/* Slide links */}
          <Card>
            <div className="flex items-center gap-2 mb-3">
              <FileText size={15} className="text-slate-400" />
              <h2 className="text-sm font-semibold text-slate-700">Lecture Materials</h2>
            </div>
            <div className="space-y-2">
              {lesson.slides_file ? (
                <a
                  href={`/${lesson.slides_file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-200 rounded-xl transition-all group"
                >
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                    <FileText size={14} className="text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Lecture Slides</p>
                    <p className="text-xs text-slate-400">{lesson.slides_file}</p>
                  </div>
                  <ExternalLink size={13} className="ml-auto text-slate-400 group-hover:text-indigo-500" />
                </a>
              ) : (
                <p className="text-sm text-slate-400 px-3">Slides not available yet.</p>
              )}

              {lesson.annotated_file && (
                <a
                  href={`/${lesson.annotated_file}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2.5 bg-slate-50 hover:bg-emerald-50 border border-slate-200 hover:border-emerald-200 rounded-xl transition-all group"
                >
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <FileText size={14} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">Annotated Copy</p>
                    <p className="text-xs text-slate-400">{lesson.annotated_file}</p>
                  </div>
                  <ExternalLink size={13} className="ml-auto text-slate-400 group-hover:text-emerald-500" />
                </a>
              )}
            </div>
          </Card>

          {/* Key concepts */}
          {concepts.length > 0 && (
            <Card>
              <div className="flex items-center gap-2 mb-3">
                <BookOpen size={15} className="text-amber-500" />
                <h2 className="text-sm font-semibold text-slate-700">What to remember</h2>
              </div>
              <ul className="space-y-2">
                {concepts.map((c, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                    <span className="mt-0.5 w-5 h-5 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    {c}
                  </li>
                ))}
              </ul>
            </Card>
          )}
        </div>

        {/* Right: AI + quiz */}
        <div className="space-y-5">
          <AIHelpPanel
            contextType="lesson"
            lessonTopic={lesson.topic}
            starterTopic={lesson.topic}
          />
          <QuizWidget topic={lesson.topic} />
        </div>
      </div>
    </div>
  );
}
