import { Droplet } from 'lucide-react';

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="relative flex items-center justify-center rounded-xl bg-primary-600 text-white shadow-sm"
        style={{ width: size, height: size }}
      >
        <Droplet size={size * 0.5} strokeWidth={2.4} fill="currentColor" />
      </div>
      <div className="leading-tight">
        <div className="font-extrabold text-ink-900 tracking-tight" style={{ fontSize: size * 0.4 }}>
          RaktSetu
        </div>
        <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-600">
          Blood Network
        </div>
      </div>
    </div>
  );
}
