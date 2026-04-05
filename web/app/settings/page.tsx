import { Header } from '@/components/layout/Header';
import { Card } from '@/components/ui/Card';
import { Key, Info, BookOpen } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div>
      <Header title="Settings" subtitle="Configure your study hub" />

      <div className="space-y-5 max-w-xl">

        {/* AI Setup */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Key size={16} className="text-indigo-500" />
            <h2 className="text-sm font-semibold text-slate-700">AI Tutor Setup</h2>
          </div>
          <div className="space-y-3 text-sm text-slate-600">
            <p>The AI tutor needs an Anthropic API key to work.</p>
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 font-mono text-xs">
              <p className="text-slate-500"># Create this file in the <code>web/</code> directory:</p>
              <p className="text-slate-800">ANTHROPIC_API_KEY=your-key-here</p>
              <p className="text-slate-500"># File: web/.env.local</p>
            </div>
            <p className="text-xs text-slate-400">
              Get a free key at console.anthropic.com. The app works without it — AI features will show placeholder messages.
            </p>
          </div>
        </Card>

        {/* Course info */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <BookOpen size={16} className="text-indigo-500" />
            <h2 className="text-sm font-semibold text-slate-700">Course Info</h2>
          </div>
          <dl className="space-y-2 text-sm">
            {[
              ['Course', 'ELE 212 — Linear Circuit Theory'],
              ['Semester', 'Spring 2026'],
              ['Instructor', 'Prof. Peter F. Swaszek'],
              ['Office', '492 Fascitelli Center'],
              ['Textbook', 'Alexander & Sadiku, Fundamentals of Electric Circuits, 5th ed.'],
              ['Grading', '20% homework/exercises · 80% quizzes'],
            ].map(([label, value]) => (
              <div key={label} className="flex gap-3">
                <dt className="w-24 shrink-0 text-slate-500">{label}</dt>
                <dd className="text-slate-800">{value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        {/* About */}
        <Card>
          <div className="flex items-center gap-2 mb-3">
            <Info size={16} className="text-indigo-500" />
            <h2 className="text-sm font-semibold text-slate-700">About this app</h2>
          </div>
          <p className="text-sm text-slate-600">
            ELE 212 Study Hub is an ADHD-friendly academic support app.
            It helps you break assignments into small steps, focus with short sprints,
            and get AI explanations that start simple.
          </p>
        </Card>
      </div>
    </div>
  );
}
