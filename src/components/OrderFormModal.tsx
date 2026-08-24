import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { BLOOD_GROUPS, COMPONENT_META } from '@/lib/types';
import type { BloodGroup, ComponentType, Facility, Order, OrderLine, OrderPriority } from '@/lib/types';
import { addOrder, nextOrderCode } from '@/lib/store';
import { Plus, Trash2, AlertTriangle, Check, Building2 } from 'lucide-react';

const COMPONENTS: ComponentType[] = ['PRBC', 'PLATELETS', 'FFP', 'CRYO'];

export function OrderFormModal({
  open,
  onClose,
  hospitalId,
  hospitalName,
  bank,
  onPlaced,
}: {
  open: boolean;
  onClose: () => void;
  hospitalId: string;
  hospitalName: string;
  bank: Facility;
  onPlaced: (o: Order) => void;
}) {
  const [priority, setPriority] = useState<OrderPriority>('normal');
  const [patientName, setPatientName] = useState('');
  const [patientRef, setPatientRef] = useState('');
  const [lines, setLines] = useState<OrderLine[]>([
    { component: 'PRBC', bloodGroup: 'O+', units: 1 },
  ]);

  const addLine = () =>
    setLines([...lines, { component: 'PRBC', bloodGroup: 'O+', units: 1 }]);
  const removeLine = (i: number) => setLines(lines.filter((_, idx) => idx !== i));
  const updateLine = (i: number, patch: Partial<OrderLine>) =>
    setLines(lines.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const totalUnits = lines.reduce((s, l) => s + l.units, 0);
  const valid = patientName.trim() && patientRef.trim() && lines.length > 0 && totalUnits > 0;

  const submit = () => {
    if (!valid) return;
    const at = new Date().toISOString();
    const order: Order = {
      id: 'o' + Math.random().toString(36).slice(2, 9),
      orderCode: nextOrderCode(),
      requesterId: hospitalId,
      requesterName: hospitalName,
      supplierId: bank.id,
      supplierName: bank.name,
      patientName: patientName.trim(),
      patientRef: patientRef.trim(),
      priority,
      status: 'queued',
      lines,
      createdAt: at,
      updatedAt: at,
      history: [{ status: 'queued', at }],
    };
    addOrder(order);
    onPlaced(order);
    // reset
    setPriority('normal');
    setPatientName('');
    setPatientRef('');
    setLines([{ component: 'PRBC', bloodGroup: 'O+', units: 1 }]);
  };

  return (
    <Modal open={open} onClose={onClose} title={`Place order from ${bank.name}`} maxWidth="max-w-2xl">
      <div className="space-y-5">
        {/* Priority toggle */}
        <div>
          <label className="label">Order Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setPriority('normal')}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                priority === 'normal'
                  ? 'border-normal-500 bg-normal-50'
                  : 'border-ink-200 bg-white hover:border-ink-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-ink-900">
                <span className={`chip ${priority === 'normal' ? 'bg-normal-500 text-white' : 'bg-ink-100 text-ink-500'}`}>Normal</span>
                {priority === 'normal' && <Check size={18} className="text-normal-600" />}
              </div>
              <p className="mt-1.5 text-xs text-ink-500">Standard queue, fulfilled in order of receipt.</p>
            </button>
            <button
              onClick={() => setPriority('emergency')}
              className={`rounded-xl border-2 p-4 text-left transition-all ${
                priority === 'emergency'
                  ? 'border-emergency-500 bg-emergency-50'
                  : 'border-ink-200 bg-white hover:border-ink-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-ink-900">
                <span className={`chip ${priority === 'emergency' ? 'bg-emergency-600 text-white' : 'bg-ink-100 text-ink-500'}`}>
                  <AlertTriangle size={12} /> Emergency
                </span>
                {priority === 'emergency' && <Check size={18} className="text-emergency-600" />}
              </div>
              <p className="mt-1.5 text-xs text-ink-500">Highest priority — pushed to the top of the queue.</p>
            </button>
          </div>
        </div>

        {/* Patient */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label">Patient Name / ID</label>
            <input className="input" placeholder="e.g. Patient #ND-1200" value={patientName} onChange={(e) => setPatientName(e.target.value)} />
          </div>
          <div>
            <label className="label">IPD / Case Reference</label>
            <input className="input" placeholder="e.g. IPD/NDH/2024/1200" value={patientRef} onChange={(e) => setPatientRef(e.target.value)} />
          </div>
        </div>

        {/* Lines */}
        <div>
          <div className="flex items-center justify-between">
            <label className="label mb-0">Components Required</label>
            <button onClick={addLine} className="btn-ghost h-7 px-2 text-xs"><Plus size={14} /> Add line</button>
          </div>
          <div className="mt-2 space-y-2.5">
            {lines.map((l, i) => (
              <div key={i} className="flex flex-wrap items-end gap-2 rounded-xl border border-ink-200 bg-ink-50/50 p-2.5">
                <div className="flex-1 min-w-[140px]">
                  <label className="label">Component</label>
                  <select className="input" value={l.component} onChange={(e) => updateLine(i, { component: e.target.value as ComponentType })}>
                    {COMPONENTS.map((c) => (
                      <option key={c} value={c}>{COMPONENT_META[c].label}</option>
                    ))}
                  </select>
                </div>
                <div className="w-24">
                  <label className="label">Group</label>
                  <select className="input" value={l.bloodGroup} onChange={(e) => updateLine(i, { bloodGroup: e.target.value as BloodGroup })}>
                    {BLOOD_GROUPS.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div className="w-20">
                  <label className="label">Units</label>
                  <input type="number" min={1} className="input" value={l.units} onChange={(e) => updateLine(i, { units: Math.max(1, Number(e.target.value)) })} />
                </div>
                <button onClick={() => removeLine(i)} className="btn-ghost h-10 w-10 rounded-xl p-0 text-ink-400 hover:text-emergency-600 hover:bg-emergency-50">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between rounded-lg bg-ink-100 px-3 py-2 text-sm">
            <span className="font-semibold text-ink-600">Total units</span>
            <span className="font-extrabold tabular-nums text-ink-900">{totalUnits}</span>
          </div>
        </div>

        {/* Supplier + actions */}
        <div className="flex items-center gap-2 rounded-xl bg-ink-50 px-4 py-3 text-sm text-ink-600">
          <Building2 size={16} className="text-ink-400" />
          Supplying from <strong className="text-ink-900">{bank.name}</strong> · {bank.distanceKm} km away
        </div>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary">Cancel</button>
          <button onClick={submit} disabled={!valid} className={priority === 'emergency' ? 'btn-emergency' : 'btn-primary'}>
            {priority === 'emergency' ? <AlertTriangle size={16} /> : null}
            Place {priority === 'emergency' ? 'Emergency' : 'Normal'} Order
          </button>
        </div>
      </div>
    </Modal>
  );
}
