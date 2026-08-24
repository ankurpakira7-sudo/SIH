import type { OrderPriority, OrderStatus } from '@/lib/types';
import { AlertTriangle, Clock, Truck, CheckCircle2 } from 'lucide-react';

export function PriorityBadge({ priority }: { priority: OrderPriority }) {
  if (priority === 'emergency') {
    return (
      <span className="chip bg-emergency-100 text-emergency-700">
        <AlertTriangle size={12} strokeWidth={2.6} /> Emergency
      </span>
    );
  }
  return <span className="chip bg-normal-100 text-normal-700">Normal</span>;
}

const statusMap = {
  queued: { label: 'Queued', icon: Clock, cls: 'bg-amber-100 text-amber-700' },
  delivering: { label: 'Delivering', icon: Truck, cls: 'bg-sky-100 text-sky-700' },
  delivered: { label: 'Delivered', icon: CheckCircle2, cls: 'bg-done-100 text-done-600' },
} as const;

export function StatusBadge({ status }: { status: OrderStatus }) {
  const s = statusMap[status];
  const Icon = s.icon;
  return (
    <span className={`chip ${s.cls}`}>
      <Icon size={12} strokeWidth={2.6} /> {s.label}
    </span>
  );
}
