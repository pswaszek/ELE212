'use client';

import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { clsx } from 'clsx';

interface FocusSprintProps {
  defaultMinutes?: number;
}

export function FocusSprint({ defaultMinutes = 10 }: FocusSprintProps) {
  const [minutes, setMinutes] = useState(defaultMinutes);
  const [secondsLeft, setSecondsLeft] = useState(defaultMinutes * 60);
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft(s => {
          if (s <= 1) {
            clearInterval(intervalRef.current!);
            setRunning(false);
            setFinished(true);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running]);

  function reset(mins: number) {
    setRunning(false);
    setFinished(false);
    setMinutes(mins);
    setSecondsLeft(mins * 60);
  }

  const total = minutes * 60;
  const progress = ((total - secondsLeft) / total) * 100;
  const mins = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;

  const circumference = 2 * Math.PI * 36;
  const dashOffset = circumference - (progress / 100) * circumference;

  return (
    <Card>
      <div className="flex items-center gap-2 mb-4">
        <Timer size={16} className="text-indigo-500" />
        <h3 className="text-sm font-semibold text-slate-700">Focus Sprint</h3>
      </div>

      {/* Circular timer */}
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-24 h-24">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
            <circle cx="40" cy="40" r="36" fill="none" stroke="#e2e8f0" strokeWidth="6" />
            <circle
              cx="40" cy="40" r="36" fill="none"
              stroke={finished ? '#10b981' : '#6366f1'}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={clsx(
              'text-xl font-bold tabular-nums',
              finished ? 'text-emerald-600' : 'text-slate-800'
            )}>
              {finished ? '✓' : `${String(mins).padStart(2,'0')}:${String(secs).padStart(2,'0')}`}
            </span>
          </div>
        </div>

        {finished ? (
          <p className="text-sm font-medium text-emerald-700 text-center">
            Sprint done! Take a 2-min break, then go again.
          </p>
        ) : (
          <div className="flex items-center gap-2">
            <Button
              variant={running ? 'secondary' : 'primary'}
              size="sm"
              icon={running ? <Pause size={14} /> : <Play size={14} />}
              onClick={() => setRunning(!running)}
            >
              {running ? 'Pause' : 'Start'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              icon={<RotateCcw size={14} />}
              onClick={() => reset(minutes)}
            />
          </div>
        )}

        {/* Duration selector */}
        {!running && !finished && (
          <div className="flex gap-1.5">
            {[5, 10, 15, 25].map(m => (
              <button
                key={m}
                onClick={() => reset(m)}
                className={clsx(
                  'px-2.5 py-1 text-xs rounded-lg border transition-all',
                  minutes === m
                    ? 'bg-indigo-100 text-indigo-700 border-indigo-200 font-semibold'
                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                )}
              >
                {m}m
              </button>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
}
