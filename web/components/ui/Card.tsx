import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: 'sm' | 'md' | 'lg' | 'none';
}

export function Card({ children, className, hover = false, padding = 'md' }: CardProps) {
  const padClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-5',
    lg: 'p-6',
  };

  return (
    <div className={clsx(
      'bg-white rounded-2xl border border-slate-100 shadow-sm',
      hover && 'hover:shadow-md hover:border-slate-200 transition-all duration-150 cursor-pointer',
      padClasses[padding],
      className
    )}>
      {children}
    </div>
  );
}
