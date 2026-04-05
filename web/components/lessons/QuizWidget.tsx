'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Lightbulb, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';

interface QuizData {
  question: string;
  choices: string[];
  correct: string;
  explanation: string;
}

interface QuizWidgetProps {
  topic: string;
}

export function QuizWidget({ topic }: QuizWidgetProps) {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function loadQuiz() {
    setLoading(true);
    setSelected(null);
    setQuiz(null);
    try {
      const res = await fetch('/api/ai/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      setQuiz(data);
    } catch {
      setQuiz({
        question: `What is the main purpose of ${topic}?`,
        choices: ['A. Analyze circuit behavior', 'B. Add components', 'C. Increase voltage'],
        correct: 'A',
        explanation: 'Circuit analysis methods help us find voltages and currents in complex networks.',
      });
    } finally {
      setLoading(false);
    }
  }

  const answered = selected !== null;
  const correct = answered && quiz ? selected.startsWith(quiz.correct) : false;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <Lightbulb size={16} className="text-amber-500" />
        <h3 className="text-sm font-semibold text-slate-700">Quick Check</h3>
      </div>

      {!quiz ? (
        <div className="text-center py-4">
          <p className="text-sm text-slate-500 mb-3">Test your understanding with a quick question.</p>
          <Button
            variant="secondary"
            size="sm"
            loading={loading}
            onClick={loadQuiz}
          >
            {loading ? 'Generating...' : 'Give me a question'}
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-medium text-slate-800">{quiz.question}</p>
          <div className="space-y-2">
            {quiz.choices.map(choice => {
              const letter = choice.charAt(0);
              const isCorrect = letter === quiz.correct;
              const isSelected = selected === choice;

              return (
                <button
                  key={choice}
                  disabled={answered}
                  onClick={() => setSelected(choice)}
                  className={clsx(
                    'w-full text-left px-3 py-2 rounded-xl text-sm border transition-all',
                    !answered
                      ? 'hover:bg-slate-50 bg-white border-slate-200'
                      : isCorrect
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                        : isSelected
                          ? 'bg-red-50 border-red-200 text-red-800'
                          : 'bg-white border-slate-200 text-slate-400'
                  )}
                >
                  <span className="flex items-center gap-2">
                    {answered && isCorrect && <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />}
                    {answered && isSelected && !isCorrect && <XCircle size={14} className="text-red-500 shrink-0" />}
                    {choice}
                  </span>
                </button>
              );
            })}
          </div>

          {answered && (
            <div className={clsx(
              'px-3 py-2 rounded-xl text-sm',
              correct ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
            )}>
              {correct ? '✓ Correct! ' : 'Not quite. '}
              {quiz.explanation}
            </div>
          )}

          {answered && (
            <Button variant="ghost" size="sm" icon={<RefreshCw size={13} />} onClick={loadQuiz}>
              Try another
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
