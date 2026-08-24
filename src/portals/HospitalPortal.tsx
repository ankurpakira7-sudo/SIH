import { useMemo, useState } from 'react';
import { bloodBanks, hospitals } from '@/lib/mockData';
import { getOrdersForHospital, updateOrderStatus } from '@/lib/store';
import type { Facility, Order } from '@/lib/types';
import { COMPONENT_META, STATUS_META } from '@/lib/types';
import { ComponentGrid } from '@/components/ui/ComponentPill';
import { StatCard } from '@/components/ui/StatCard';
import { OrderTracker } from '@/components/ui/OrderTracker';
import { PriorityBadge, StatusBadge } from '@/components/ui/Badges';
import { Modal } from '@/components/ui/Modal';
import { OrderFormModal } from '@/components/OrderFormModal';
import { PrintReceiptModal } from '@/components/Receipt';
import {
  Navigation, Building2, Package, AlertTriangle, Plus, FileText,
  Search, Clock, ChevronRight, Truck,
} from 'lucide-react';

const THIS_HOSPITAL = hospitals[0]; // North Dumdum District Hospital

export function HospitalPortal() {
  const [orders, setOrders] = useState<Order[]>(getOrdersForHospital(THIS_HOSPITAL.id));
  const [orderBank, setOrderBank] = useState<Facility | null>(null);
  const [viewBank, setViewBank] = useState<Facility | null>(null);
  const [receiptOrder, setReceiptOrder] = useState<Order | null>(null);
  const [search, setSearch] = useState('');

  const banks = useMemo(() => {
    return bloodBanks
      .filter((b) => (search ? (b.name + b.area).toLowerCase().includes(search.toLowerCase()) : true))
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [search]);

  const activeOrders = orders.filter((o) => o.status !== 'delivered');
  const completedOrders = orders.filter((o) => o.status === 'delivered');
  const emergencyCount = orders.filter((o) => o.priority === 'emergency' && o.status !== 'delivered').length;
  const totalPending = orders.filter((o) => o.status === 'queued').length;

  const refresh = () => setOrders(getOrdersForHospital(THIS_HOSPITAL.id));

  const placed = (o: Order) => {
    refresh();
    setOrderBank(null);
    setReceiptOrder(o);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="chip bg-primary-50 text-primary-700">
            <Building2 size={12} /> Hospital Portal
          </div>
          <h1 className="mt-2 text-2xl font-extrabold text-ink-900">{THIS_HOSPITAL.name}</h1>
          <p className="text-sm text-ink-500">{THIS_HOSPITAL.address}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Active Orders" value={activeOrders.length} sub="In progress" icon={<Package size={22} />} tone="primary" />
        <StatCard label="Emergency Pending" value={emergencyCount} sub="Highest priority" icon={<AlertTriangle size={22} />} tone="emergency" />
        <StatCard label="Queued" value={totalPending} sub="Awaiting dispatch" icon={<Clock size={22} />} tone="normal" />
        <StatCard label="Nearby Blood Banks" value={bloodBanks.length} sub="Within network" icon={<Building2 size={22} />} />
      </div>

      {/* Blood Bank Network */}
      <section className="mt-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="section-title">Blood Bank Network</h2>
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input className="input pl-10" placeholder="Search blood banks…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="mt-3 grid gap-3 lg:grid-cols-2">
          {banks.map((b) => {
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
                        <span className="text-ink-400">{total} units total</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mini stock preview */}
                <div className="mt-4 grid grid-cols-4 gap-2">
                  {b.components.map((c) => {
                    const m = COMPONENT_META[c.type];
                    return (
                      <div key={c.type} className={`rounded-lg border px-2 py-2 text-center ${m.bg}`}>
                        <div className={`text-[10px] font-bold uppercase ${m.color}`}>{m.short}</div>
                        <div className="text-base font-extrabold text-ink-900 tabular-nums">{c.available}</div>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-4 flex gap-2">
                  <button onClick={() => setViewBank(b)} className="btn-secondary flex-1">
                    <FileText size={15} /> View stock
                  </button>
                  <button onClick={() => setOrderBank(b)} className="btn-primary flex-1">
                    <Plus size={15} /> Place order
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Active Order Tracking */}
      <section className="mt-7">
        <h2 className="section-title">Live Order Tracking</h2>
        <p className="text-sm text-ink-500">Track your requisitions from queue to delivery.</p>

        <div className="mt-3 space-y-3">
          {activeOrders.length === 0 && (
            <div className="card p-8 text-center text-ink-500">
              <Truck size={36} className="mx-auto mb-2 text-ink-300" />
              No active orders. Place an order from the blood bank network above.
            </div>
          )}
          {activeOrders.map((o) => (
            <div key={o.id} className={`card overflow-hidden ${
              o.priority === 'emergency' ? 'ring-2 ring-emergency-200' : ''
            }`}>
              <div className={`flex flex-wrap items-center justify-between gap-3 px-5 py-3 ${
                o.priority === 'emergency' ? 'bg-emergency-50' : 'bg-normal-50'
              }`}>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-ink-900">{o.orderCode}</span>
                  <PriorityBadge priority={o.priority} />
                  <StatusBadge status={o.status} />
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setReceiptOrder(o)} className="btn-ghost h-8 px-2.5 text-xs">
                    <FileText size={13} /> Receipt
                  </button>
                </div>
              </div>
              <div className="px-5 py-4">
                <div className="grid gap-4 sm:grid-cols-[1fr_1.2fr]">
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">Supplier</div>
                    <div className="font-semibold text-ink-800">{o.supplierName}</div>
                    <div className="mt-2 text-xs font-semibold uppercase tracking-wide text-ink-500">Components</div>
                    <div className="mt-1 flex flex-wrap gap-1.5">
                      {o.lines.map((l, i) => (
                        <span key={i} className={`chip ${COMPONENT_META[l.component].color} ${COMPONENT_META[l.component].bg}`}>
                          {COMPONENT_META[l.component].short} · {l.bloodGroup} · {l.units}u
                        </span>
                      ))}
                    </div>
                    <div className="mt-2 text-xs text-ink-500">
                      Placed {new Date(o.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <div className="rounded-xl bg-ink-50 p-4">
                    <OrderTracker status={o.status} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Completed orders */}
      {completedOrders.length > 0 && (
        <section className="mt-7">
          <h2 className="section-title text-done-600">Completed Orders</h2>
          <div className="mt-3 grid gap-2 lg:grid-cols-2">
            {completedOrders.map((o) => (
              <button key={o.id} onClick={() => setReceiptOrder(o)} className="card group flex items-center justify-between gap-3 bg-done-100/60 p-4 text-left hover:border-ink-300">
                <div>
                  <div className="font-mono text-sm font-bold text-done-600">{o.orderCode}</div>
                  <div className="text-xs text-ink-500">{o.supplierName} · {o.lines.length} component(s)</div>
                </div>
                <div className="flex items-center gap-2 text-done-500">
                  <StatusBadge status={o.status} />
                  <ChevronRight size={18} className="transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Stock view modal */}
      <Modal open={!!viewBank} onClose={() => setViewBank(null)} title={viewBank ? viewBank.name : ''} maxWidth="max-w-xl">
        {viewBank && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm text-ink-600">
              <span className="chip bg-primary-50 text-primary-700"><Navigation size={12} /> {viewBank.distanceKm} km</span>
              <span className="chip bg-ink-100 text-ink-700">{viewBank.address}</span>
            </div>
            <div>
              <h4 className="label">Component-specific stock</h4>
              <ComponentGrid components={viewBank.components} />
            </div>
            <button onClick={() => { const b = viewBank; setViewBank(null); setOrderBank(b); }} className="btn-primary w-full">
              <Plus size={16} /> Place order from this bank
            </button>
          </div>
        )}
      </Modal>

      {/* Order form */}
      {orderBank && (
        <OrderFormModal
          open={!!orderBank}
          onClose={() => setOrderBank(null)}
          hospitalId={THIS_HOSPITAL.id}
          hospitalName={THIS_HOSPITAL.name}
          bank={orderBank}
          onPlaced={placed}
        />
      )}

      {/* Receipt */}
      <PrintReceiptModal order={receiptOrder} onClose={() => setReceiptOrder(null)} />
    </div>
  );
}
