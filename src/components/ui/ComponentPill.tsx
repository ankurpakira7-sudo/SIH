import { COMPONENT_META } from '@/lib/types';
import type { ComponentType } from '@/lib/types';

export function ComponentPill({
  type,
  available,
  demand,
}: {
  type: ComponentType;
  available?: number;
  demand?: number;
}) {
  const m = COMPONENT_META[type];
  const ratio = available != null && demand ? available / Math.max(demand, 1) : 1;
  const tone =
    ratio < 0.5 ? 'text-emergency-700 bg-emergency-50 border-emergency-100'
    : ratio < 0.85 ? 'text-amber-700 bg-amber-50 border-amber-100'
    : 'text-emerald-700 bg-emerald-50 border-emerald-100';
  return (
    <div className={`rounded-xl border px-3 py-2.5 ${tone}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wide">{m.label}</span>
        {available != null && <span className="text-lg font-extrabold tabular-nums">{available}</span>}
      </div>
      {demand != null && (
        <div className="mt-1 flex items-center justify-between text-[11px] font-medium opacity-80">
          <span>Forecast demand</span>
          <span className="tabular-nums">{demand} u</span>
        </div>
      )}
    </div>
  );
}

export function ComponentGrid({
  components,
}: {
  components: { type: ComponentType; available: number; demand: number }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
      {components.map((c) => (
        <ComponentPill key={c.type} type={c.type} available={c.available} demand={c.demand} />
      ))}
    </div>
  );
}
