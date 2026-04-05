import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number; // 0–100
  color?: 'indigo' | 'emerald' | 'amber' | 'red';
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  label?: string;
  className?: string;
}

const colorClasses = {
  indigo: 'bg-indigo-500',
  emerald: 'bg-emerald-500',
  amber: 'bg-amber-400',
  red: 'bg-red-500',
};

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

export function ProgressBar({
  value,
  color = 'indigo',
  size = 'md',
  showLabel = false,
  label,
  className,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, value));

  return (
    <div className={clsx('w-full', className)}>
      {(showLabel || label) && (
        <div className="flex justify-between mb-1">
          <span className="text-xs text-slate-500">{label ?? 'Progress'}</span>
          <span className="text-xs font-medium text-slate-700">{pct}%</span>
        </div>
      )}
      <div className={clsx('w-full bg-slate-100 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={clsx('h-full rounded-full transition-all duration-500', colorClasses[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
