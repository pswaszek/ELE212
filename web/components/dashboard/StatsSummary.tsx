import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { CheckCircle2, AlertCircle, Clock, TrendingUp } from 'lucide-react';

interface StatsProps {
  total: number;
  done: number;
  overdue: number;
  upcoming: number;
  percent: number;
}

export function StatsSummary({ total, done, overdue, upcoming, percent }: StatsProps) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-slate-700">Homework Progress</h3>
        <span className="text-lg font-bold text-indigo-600">{percent}%</span>
      </div>
      <ProgressBar value={percent} color="indigo" size="md" className="mb-4" />
      <div className="grid grid-cols-3 gap-3">
        <Stat
          icon={<CheckCircle2 size={15} className="text-emerald-500" />}
          value={done}
          label="Done"
          color="text-emerald-600"
        />
        <Stat
          icon={<AlertCircle size={15} className="text-red-500" />}
          value={overdue}
          label="Overdue"
          color="text-red-600"
        />
        <Stat
          icon={<Clock size={15} className="text-indigo-500" />}
          value={upcoming}
          label="Upcoming"
          color="text-indigo-600"
        />
      </div>
    </Card>
  );
}

function Stat({ icon, value, label, color }: {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1 p-2 bg-slate-50 rounded-xl">
      {icon}
      <span className={`text-lg font-bold leading-none ${color}`}>{value}</span>
      <span className="text-xs text-slate-500">{label}</span>
    </div>
  );
}
