import { CheckCircle2, Clock, Truck } from 'lucide-react';
import type { OrderStatus } from '@/lib/types';
import { STATUS_META } from '@/lib/types';

const steps: { key: OrderStatus; label: string; icon: typeof Clock }[] = [
  { key: 'queued', label: STATUS_META.queued.label, icon: Clock },
  { key: 'delivering', label: STATUS_META.delivering.label, icon: Truck },
  { key: 'delivered', label: STATUS_META.delivered.label, icon: CheckCircle2 },
];

export function OrderTracker({ status, compact = false }: { status: OrderStatus; compact?: boolean }) {
  const current = STATUS_META[status].step;
  return (
    <div className="flex items-center w-full">
      {steps.map((s, i) => {
        const stepNum = i + 1;
        const done = stepNum < current;
        const active = stepNum === current;
        const Icon = s.icon;
        const ring = active
          ? 'bg-primary-600 text-white ring-4 ring-primary-100'
          : done
          ? 'bg-emerald-500 text-white'
          : 'bg-ink-100 text-ink-400';
        return (
          <div key={s.key} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div className={`relative flex items-center justify-center rounded-full transition-all ${ring} ${compact ? 'h-8 w-8' : 'h-10 w-10'}`}>
                {active && (
                  <span className="absolute inset-0 rounded-full bg-primary-500 animate-pulseRing" />
                )}
                <Icon size={compact ? 15 : 18} strokeWidth={2.6} className="relative" />
              </div>
              <span className={`text-[11px] font-semibold ${active ? 'text-primary-700' : done ? 'text-emerald-700' : 'text-ink-400'}`}>
                {s.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 mx-2 h-1 rounded-full bg-ink-100 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${stepNum < current ? 'bg-emerald-500 w-full' : 'bg-transparent w-0'}`}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
