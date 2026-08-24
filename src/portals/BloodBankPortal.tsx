import { useMemo, useState } from 'react';
import { bloodBanks } from '@/lib/mockData';
import { getAllOrders, updateOrderStatus } from '@/lib/store';
import type { Order, OrderStatus } from '@/lib/types';
import { COMPONENT_META, STATUS_META } from '@/lib/types';
import { StatCard } from '@/components/ui/StatCard';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badges';
import { ForecastDashboard } from './ForecastDashboard';
import {
  Building2, Navigation, AlertTriangle, ClipboardList, Brain,
  Network, ChevronDown, Clock, ArrowUpDown,
} from 'lucide-react';

const THIS_BANK = bloodBanks[0]; // Central Blood Bank, Maniktala

type Tab = 'queue' | 'peers' | 'forecast';

export function BloodBankPortal() {
  const [tab, setTab] = useState<Tab>('queue');
  const [orders, setOrders] = useState<Order[]>(getAllOrders());

  const refresh = () => setOrders(getAllOrders());

  const sorted = useMemo(() => {
    const rank = (o: Order) => {
      if (o.status === 'delivered') return 3;
      if (o.priority === 'emergency') return 0;
      return 1;
    };
    return [...orders].sort((a, b) => {
      const r = rank(a) - rank(b);
      if (r !== 0) return r;
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    });
  }, [orders]);

  const peers = bloodBanks.filter((b) => b.id !== THIS_BANK.id).sort((a, b) => a.distanceKm - b.distanceKm);

  const emergencyCount = orders.filter((o) => o.priority === 'emergency' && o.status !== 'delivered').length;
  const activeCount = orders.filter((o) => o.status !== 'delivered').length;
  const deliveredCount = orders.filter((o) => o.status === 'delivered').length;

  const setStatus = (id: string, status: OrderStatus) => {
    updateOrderStatus(id, status);
    refresh();
  };

  const tabs: { key: Tab; label: string; icon: typeof ClipboardList }[] = [
    { key: 'queue', label: 'Queue Management', icon: ClipboardList },
    { key: 'peers', label: 'Peer Network', icon: Network },
    { key: 'forecast', label: 'AI Forecast', icon: Brain },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="chip bg-primary-50 text-primary-700">
            <Building2 size={12} /> Blood Bank Portal
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-ink-900">{THIS_BANK.name}</h1>
          <p className="text-sm text-ink-500">{THIS_BANK.address}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-5 flex items-center gap-1 overflow-x-auto rounded-xl bg-ink-100 p-1">
        {tabs.map((t) => {
          const Icon = t.icon;
          const active = tab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${
                active ? 'bg-white text-primary-700 shadow-sm' : 'text-ink-500 hover:text-ink-800'
              }`}
            >
              <Icon size={16} /> {t.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {tab === 'queue' && (
          <QueueManagement
            orders={sorted}
            emergencyCount={emergencyCount}
            activeCount={activeCount}
            deliveredCount={deliveredCount}
            onSetStatus={setStatus}
          />
        )}
        {tab === 'peers' && <PeerNetwork peers={peers} />}
        {tab === 'forecast' && <ForecastDashboard />}
      </div>
    </div>
  );
}

function QueueManagement({
  orders, emergencyCount, activeCount, deliveredCount, onSetStatus,
}: {
  orders: Order[];
  emergencyCount: number;
  activeCount: number;
  deliveredCount: number;
  onSetStatus: (id: string, status: OrderStatus) => void;
}) {
  const statuses: OrderStatus[] = ['queued', 'delivering', 'delivered'];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total Orders" value={orders.length} icon={<ClipboardList size={20} />} tone="primary" />
        <StatCard label="Emergency" value={emergencyCount} sub="Active" icon={<AlertTriangle size={20} />} tone="emergency" />
        <StatCard label="In Transit" value={activeCount} sub="Active" icon={<Clock size={20} />} tone="normal" />
        <StatCard label="Completed" value={deliveredCount} icon={<ClipboardList size={20} />} tone="done" />
      </div>

      <div className="flex items-center gap-2 text-sm text-ink-500">
        <ArrowUpDown size={15} /> Sorted: <strong className="text-ink-700">Emergency first</strong>, then by date
      </div>

      <div className="space-y-2.5">
        {orders.map((o) => {
          const isEmergency = o.priority === 'emergency';
          const isDelivered = o.status === 'delivered';
          const containerCls = isDelivered
            ? 'bg-done-100/70 border-ink-200'
            : isEmergency
            ? 'bg-emergency-50 border-emergency-200 ring-1 ring-emergency-100'
            : 'bg-normal-50 border-normal-100';
          return (
            <div key={o.id} className={`card border-2 ${containerCls}`}>
              <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                    isDelivered ? 'bg-done-100 text-done-500' : isEmergency ? 'bg-emergency-600 text-white' : 'bg-normal-500 text-white'
                  }`}>
                    {isEmergency && !isDelivered ? <AlertTriangle size={18} /> : <ClipboardList size={18} />}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-sm font-bold text-ink-900">{o.orderCode}</span>
                      <PriorityBadge priority={o.priority} />
                      <StatusBadge status={o.status} />
                    </div>
                    <div className="mt-1 text-sm text-ink-600">
                      From <strong className="text-ink-800">{o.requesterName}</strong>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      {o.lines.map((l, i) => (
                        <span key={i} className={`chip ${COMPONENT_META[l.component].color} ${COMPONENT_META[l.component].bg}`}>
                          {COMPONENT_META[l.component].short} · {l.bloodGroup} · {l.units}u
                        </span>
                      ))}
                    </div>
                    <div className="mt-1.5 text-xs text-ink-400">
                      {new Date(o.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      {' · '}Ref: {o.patientRef}
                    </div>
                  </div>
                </div>

                {/* Status dropdown */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <select
                      value={o.status}
                      onChange={(e) => onSetStatus(o.id, e.target.value as OrderStatus)}
                      className={`appearance-none rounded-xl border py-2.5 pl-3.5 pr-9 text-sm font-semibold outline-none transition ${
                        isDelivered
                          ? 'border-ink-200 bg-white text-done-600'
                          : isEmergency
                          ? 'border-emergency-300 bg-white text-emergency-700 focus:ring-2 focus:ring-emergency-100'
                          : 'border-normal-300 bg-white text-normal-700 focus:ring-2 focus:ring-normal-100'
                      }`}
                    >
                      {statuses.map((s) => (
                        <option key={s} value={s}>{STATUS_META[s].label}</option>
                      ))}
                    </select>
                    <ChevronDown size={15} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-400" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
        {orders.length === 0 && (
          <div className="card p-8 text-center text-ink-500">
            <ClipboardList size={36} className="mx-auto mb-2 text-ink-300" />
            No orders in the queue.
          </div>
        )}
      </div>
    </div>
  );
}

function PeerNetwork({ peers }: { peers: typeof bloodBanks }) {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="section-title">Peer Blood Centre Network</h2>
        <p className="text-sm text-ink-500">Check availability at nearby centres to source rare components.</p>
      </div>
      <div className="grid gap-3 lg:grid-cols-2">
        {peers.map((b) => {
          const total = b.components.reduce((s, c) => s + c.available, 0);
          return (
            <div key={b.id} className="card p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-900">{b.name}</h3>
                    <p className="mt-0.5 text-sm text-ink-500">{b.address}</p>
                    <div className="mt-1.5 flex items-center gap-3 text-xs font-medium">
                      <span className="flex items-center gap-1 text-primary-600"><Navigation size={12} /> {b.distanceKm} km</span>
                      <span className="text-ink-400">{total} units</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-4 gap-2">
                {b.components.map((c) => {
                  const m = COMPONENT_META[c.type];
                  const low = c.available < c.demand;
                  return (
                    <div key={c.type} className={`rounded-lg border px-2 py-2 text-center ${low ? 'border-emergency-200 bg-emergency-50' : m.bg}`}>
                      <div className={`text-[10px] font-bold uppercase ${low ? 'text-emergency-700' : m.color}`}>{m.short}</div>
                      <div className="text-base font-extrabold text-ink-900 tabular-nums">{c.available}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
