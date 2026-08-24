import { forecastAlerts, demandHistory } from '@/lib/mockData';
import { COMPONENT_META } from '@/lib/types';
import type { ForecastAlert } from '@/lib/types';
import { StatCard } from '@/components/ui/StatCard';
import {
  TrendingUp, AlertTriangle, Info, CheckCircle2, Brain,
  Sparkles, ArrowUpRight, ArrowDownRight, Activity,
} from 'lucide-react';

const toneMap: Record<ForecastAlert['tone'], { icon: typeof AlertTriangle; cls: string; bar: string }> = {
  critical: { icon: AlertTriangle, cls: 'border-emergency-200 bg-emergency-50', bar: 'bg-emergency-500' },
  warning: { icon: AlertTriangle, cls: 'border-amber-200 bg-amber-50', bar: 'bg-amber-500' },
  info: { icon: Info, cls: 'border-sky-200 bg-sky-50', bar: 'bg-sky-500' },
  ok: { icon: CheckCircle2, cls: 'border-emerald-200 bg-emerald-50', bar: 'bg-emerald-500' },
};

const series = [
  { key: 'PRBC' as const, color: '#e21f3b', label: 'Packed RBC' },
  { key: 'PLATELETS' as const, color: '#d97706', label: 'Platelets' },
  { key: 'FFP' as const, color: '#0284c7', label: 'FFP' },
  { key: 'CRYO' as const, color: '#7c3aed', label: 'Cryoprecipitate' },
];

function MiniChart() {
  const max = Math.max(...demandHistory.flatMap((d) => series.map((s) => d[s.key])));
  const w = 100 / (demandHistory.length - 1);
  const toPath = (key: (typeof series)[number]['key']) =>
    demandHistory.map((d, i) => `${i === 0 ? 'M' : 'L'} ${i * w} ${100 - (d[key] / max) * 100}`).join(' ');
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-ink-900">12-Week Demand Trend</h3>
          <p className="text-xs text-ink-500">Historical component demand vs. forecast window</p>
        </div>
        <Activity size={20} className="text-primary-500" />
      </div>
      <div className="mt-4 flex flex-wrap gap-3 text-xs">
        {series.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 font-medium text-ink-600">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} /> {s.label}
          </span>
        ))}
      </div>
      <div className="mt-4 overflow-hidden rounded-xl bg-ink-50 p-3">
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-40 w-full">
          {[0, 25, 50, 75, 100].map((y) => (
            <line key={y} x1="0" y1={y} x2="100" y2={y} stroke="#e2e8f0" strokeWidth="0.3" />
          ))}
          {series.map((s) => (
            <g key={s.key}>
              <path d={toPath(s.key)} fill="none" stroke={s.color} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" />
              <path d={`${toPath(s.key)} L 100 100 L 0 100 Z`} fill={s.color} opacity="0.06" />
            </g>
          ))}
        </svg>
        <div className="mt-1 flex justify-between text-[10px] text-ink-400">
          {demandHistory.map((d) => <span key={d.week}>{d.week}</span>)}
        </div>
      </div>
    </div>
  );
}

export function ForecastDashboard() {
  const critical = forecastAlerts.filter((a) => a.tone === 'critical').length;
  const warnings = forecastAlerts.filter((a) => a.tone === 'warning').length;
  const topRec = forecastAlerts.filter((a) => a.recommendPct > 0);

  return (
    <div className="space-y-5">
      <div className="card overflow-hidden">
        <div className="relative bg-gradient-to-br from-ink-900 via-ink-800 to-primary-900 px-6 py-6 text-white">
          <div className="absolute right-5 top-5 opacity-10"><Brain size={90} /></div>
          <div className="relative">
            <div className="chip bg-white/15 text-white backdrop-blur">
              <Sparkles size={13} /> AI Forecasting Engine
            </div>
            <h2 className="mt-3 text-xl font-extrabold sm:text-2xl">Predictive Restock Recommendations</h2>
            <p className="mt-1.5 max-w-2xl text-sm text-ink-200">
              Machine-learning model trained on 3 years of seasonal demand, outbreak reports,
              and hospital admission patterns. Recommendations update weekly.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Critical Alerts" value={critical} tone="emergency" icon={<AlertTriangle size={20} />} />
        <StatCard label="Warnings" value={warnings} tone="primary" icon={<TrendingUp size={20} />} />
        <StatCard label="Components Tracked" value={4} sub="Component therapy" icon={<Activity size={20} />} />
        <StatCard label="Model Confidence" value="92%" sub="MAPE 8.2%" icon={<Brain size={20} />} tone="primary" />
      </div>

      <MiniChart />

      <div>
        <h3 className="section-title">Actionable Recommendations</h3>
        <div className="mt-3 space-y-3">
          {forecastAlerts.map((a) => {
            const t = toneMap[a.tone];
            const Icon = t.icon;
            const m = COMPONENT_META[a.component];
            const up = a.recommendPct > 0;
            return (
              <div key={a.id} className={`card border-2 p-5 ${t.cls}`}>
                <div className="flex items-start gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white ${t.bar.replace('bg-', 'text-')}`}>
                    <Icon size={22} />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`chip ${m.color} ${m.bg}`}>{m.label}</span>
                      <span className="text-xs font-medium text-ink-500">{a.season}</span>
                      {a.recommendPct !== 0 && (
                        <span className={`chip ${up ? 'bg-emergency-100 text-emergency-700' : 'bg-emerald-100 text-emerald-700'}`}>
                          {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                          {up ? '+' : ''}{a.recommendPct}%
                        </span>
                      )}
                    </div>
                    <h4 className="mt-2 font-bold text-ink-900">{a.title}</h4>
                    <p className="mt-1 text-sm text-ink-600">{a.detail}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
