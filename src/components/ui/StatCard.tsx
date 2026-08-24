import type { ReactNode } from 'react';

export function StatCard({
  label,
  value,
  sub,
  icon,
  tone = 'default',
}: {
  label: string;
  value: ReactNode;
  sub?: string;
  icon?: ReactNode;
  tone?: 'default' | 'primary' | 'emergency' | 'normal' | 'done';
}) {
  const tones: Record<string, string> = {
    default: 'bg-white',
    primary: 'bg-primary-50 border-primary-100',
    emergency: 'bg-emergency-50 border-emergency-100',
    normal: 'bg-normal-50 border-normal-100',
    done: 'bg-done-100 border-ink-200',
  };
  return (
    <div className={`card p-4 ${tones[tone]}`}>
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">{label}</div>
          <div className="mt-1 text-2xl font-extrabold tabular-nums text-ink-900">{value}</div>
          {sub && <div className="mt-0.5 text-xs text-ink-500">{sub}</div>}
        </div>
        {icon && <div className="text-ink-400">{icon}</div>}
      </div>
    </div>
  );
}
