import { clsx } from 'clsx';

type Variant = 'red' | 'orange' | 'amber' | 'yellow' | 'green' | 'blue' | 'indigo' | 'slate' | 'purple';

interface BadgeProps {
  children: React.ReactNode;
  variant?: Variant;
  size?: 'sm' | 'md';
  className?: string;
}

const variantClasses: Record<Variant, string> = {
  red:    'bg-red-100 text-red-700 border-red-200',
  orange: 'bg-orange-100 text-orange-700 border-orange-200',
  amber:  'bg-amber-100 text-amber-700 border-amber-200',
  yellow: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  green:  'bg-emerald-100 text-emerald-700 border-emerald-200',
  blue:   'bg-blue-100 text-blue-700 border-blue-200',
  indigo: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  slate:  'bg-slate-100 text-slate-600 border-slate-200',
  purple: 'bg-purple-100 text-purple-700 border-purple-200',
};

export function Badge({ children, variant = 'slate', size = 'sm', className }: BadgeProps) {
  return (
    <span className={clsx(
      'inline-flex items-center rounded-full border font-medium',
      size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
      variantClasses[variant],
      className
    )}>
      {children}
    </span>
  );
}
