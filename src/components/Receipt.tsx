import { COMPONENT_META } from '@/lib/types';
import type { Order } from '@/lib/types';
import { Droplet } from 'lucide-react';

export function Receipt({ order }: { order: Order }) {
  const dateStr = new Date(order.createdAt).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  return (
    <div className="print-area mx-auto max-w-md font-mono text-[13px] leading-relaxed text-ink-900">
      <div className="flex items-center justify-between border-b-2 border-ink-900 pb-3">
        <div className="flex items-center gap-2">
          <Droplet size={22} className="text-primary-600" fill="currentColor" />
          <div>
            <div className="text-base font-extrabold tracking-tight">RaktSetu Blood Network</div>
            <div className="text-[11px] text-ink-500">Component Requisition Receipt</div>
          </div>
        </div>
      </div>

      <div className="py-3">
        <div className="flex justify-between">
          <span>Order ID</span>
          <span className="font-bold">{order.orderCode}</span>
        </div>
        <div className="flex justify-between">
          <span>Date / Time</span>
          <span>{dateStr} IST</span>
        </div>
        <div className="flex justify-between">
          <span>Priority</span>
          <span className="font-bold uppercase">{order.priority}</span>
        </div>
      </div>

      <div className="border-y border-ink-300 py-3">
        <div className="mb-1 font-bold">REQUESTING HOSPITAL</div>
        <div>{order.requesterName}</div>
        <div className="mt-2 mb-1 font-bold">SUPPLYING BLOOD BANK</div>
        <div>{order.supplierName}</div>
        <div className="mt-2 mb-1 font-bold">PATIENT REFERENCE</div>
        <div>{order.patientName}</div>
        <div>{order.patientRef}</div>
      </div>

      <div className="py-3">
        <div className="mb-2 font-bold underline">COMPONENTS REQUISITIONED</div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-ink-300 text-left">
              <th className="py-1">Component</th>
              <th className="py-1">Blood Group</th>
              <th className="py-1 text-right">Units</th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((l, i) => (
              <tr key={i} className="border-b border-ink-200">
                <td className="py-1.5">{COMPONENT_META[l.component].label}</td>
                <td className="py-1.5">{l.bloodGroup}</td>
                <td className="py-1.5 text-right font-bold">{l.units}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="mt-2 flex justify-between font-bold">
          <span>TOTAL UNITS</span>
          <span>{order.lines.reduce((s, l) => s + l.units, 0)}</span>
        </div>
      </div>

      <div className="border-t-2 border-ink-900 pt-3 text-[11px] text-ink-600">
        <p className="mb-1">
          Please bring this receipt and a valid government photo ID to collect the
          requested components from the supplying blood bank.
        </p>
        <p>Authorized signature: ____________________</p>
        <p className="mt-2 text-center">--- This is a system-generated receipt ---</p>
      </div>
    </div>
  );
}

export function PrintReceiptModal({ order, onClose }: { order: Order | null; onClose: () => void }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-ink-950/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative card max-h-[92vh] w-full max-w-lg overflow-y-auto animate-slideUp">
        <div className="no-print sticky top-0 flex items-center justify-between border-b border-ink-100 bg-white px-5 py-3.5">
          <h3 className="font-bold text-ink-900">Order Receipt</h3>
          <div className="flex items-center gap-2">
            <button onClick={() => window.print()} className="btn-primary">
              Print
            </button>
            <button onClick={onClose} className="btn-ghost">Close</button>
          </div>
        </div>
        <div className="bg-white p-6">
          <Receipt order={order} />
        </div>
      </div>
    </div>
  );
}
