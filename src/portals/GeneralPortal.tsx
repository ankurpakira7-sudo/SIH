import { useMemo, useState } from 'react';
import { hospitals, DEFAULT_LOCATION } from '@/lib/mockData';
import type { Facility } from '@/lib/types';
import { COMPONENT_META } from '@/lib/types';
import { ComponentGrid } from '@/components/ui/ComponentPill';
import { Modal } from '@/components/ui/Modal';
import {
  Search, MapPin, Phone, Navigation, Hospital as HospitalIcon,
  Droplets, ChevronRight, Stethoscope,
} from 'lucide-react';

export function GeneralPortal() {
  const [query, setQuery] = useState('');
  const [radius, setRadius] = useState(12);
  const [selected, setSelected] = useState<Facility | null>(null);

  const filtered = useMemo(() => {
    return hospitals
      .filter((h) => h.distanceKm <= radius)
      .filter((h) =>
        query.trim()
          ? (h.name + h.area + h.address).toLowerCase().includes(query.toLowerCase())
          : true
      )
      .sort((a, b) => a.distanceKm - b.distanceKm);
  }, [query, radius]);

  const totalUnits = (f: Facility) => f.components.reduce((s, c) => s + c.available, 0);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Hero / location header */}
      <section className="card overflow-hidden">
        <div className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 px-6 py-8 text-white sm:px-8 sm:py-10">
          <div className="absolute right-6 top-6 opacity-10">
            <Droplets size={120} strokeWidth={1.5} />
          </div>
          <div className="relative">
            <div className="chip bg-white/20 text-white backdrop-blur">
              <MapPin size={13} strokeWidth={2.6} /> Live near you
            </div>
            <h1 className="mt-3 text-2xl font-extrabold sm:text-3xl">
              Find blood components at hospitals near you
            </h1>
            <p className="mt-2 max-w-xl text-sm text-primary-50/90">
              Real-time availability of Packed RBCs, Platelets, FFP and Cryoprecipitate —
              component therapy tracked, not just whole blood.
            </p>
            <div className="mt-4 flex items-center gap-2 text-sm font-medium text-primary-50">
              <Navigation size={15} />
              Detected location: <strong className="text-white">{DEFAULT_LOCATION.name}</strong>
              <span className="text-primary-100">({DEFAULT_LOCATION.lat}, {DEFAULT_LOCATION.lng})</span>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex flex-col gap-3 border-t border-ink-100 px-5 py-4 sm:flex-row sm:items-center sm:px-8">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              className="input pl-11"
              placeholder="Search by hospital name or area…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="text-xs font-semibold uppercase tracking-wide text-ink-500">Within</label>
            <select
              className="input w-auto"
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
            >
              {[5, 8, 12, 20, 50].map((r) => (
                <option key={r} value={r}>{r} km</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Results */}
      <div className="mt-5 flex items-center justify-between">
        <h2 className="section-title">
          {filtered.length} hospital{filtered.length !== 1 && 's'} nearby
        </h2>
        <span className="text-xs text-ink-500">Sorted by distance</span>
      </div>

      <div className="mt-3 grid gap-3 lg:grid-cols-2">
        {filtered.map((h) => {
          const total = totalUnits(h);
          const low = h.components.filter((c) => c.available < c.demand).length;
          return (
            <button
              key={h.id}
              onClick={() => setSelected(h)}
              className="card group p-5 text-left transition-all hover:shadow-pop hover:border-primary-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary-50 text-primary-600">
                    <HospitalIcon size={22} />
                  </div>
                  <div>
                    <h3 className="font-bold text-ink-900 leading-snug group-hover:text-primary-700">
                      {h.name}
                    </h3>
                    <p className="mt-0.5 flex items-center gap-1.5 text-sm text-ink-500">
                      <MapPin size={13} /> {h.address}
                    </p>
                    <p className="mt-1.5 flex items-center gap-3 text-xs font-medium text-ink-500">
                      <span className="flex items-center gap-1 text-primary-600">
                        <Navigation size={12} /> {h.distanceKm} km away
                      </span>
                      <span className="flex items-center gap-1">
                        <Phone size={12} /> {h.phone}
                      </span>
                    </p>
                  </div>
                </div>
                <ChevronRight size={20} className="mt-1 text-ink-300 transition-transform group-hover:translate-x-1 group-hover:text-primary-500" />
              </div>

              <div className="mt-4 flex items-center gap-2.5">
                <div className="flex-1 rounded-xl bg-ink-50 px-3 py-2.5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">Total units</div>
                  <div className="text-xl font-extrabold text-ink-900">{total}</div>
                </div>
                <div className="flex-1 rounded-xl bg-ink-50 px-3 py-2.5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">Components</div>
                  <div className="text-xl font-extrabold text-ink-900">4 types</div>
                </div>
                <div className={`flex-1 rounded-xl px-3 py-2.5 ${low > 0 ? 'bg-emergency-50' : 'bg-emerald-50'}`}>
                  <div className="text-xs font-semibold uppercase tracking-wide text-ink-500">Stock status</div>
                  <div className={`text-xl font-extrabold ${low > 0 ? 'text-emergency-600' : 'text-emerald-600'}`}>
                    {low > 0 ? `${low} low` : 'Healthy'}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
        {filtered.length === 0 && (
          <div className="card col-span-full p-10 text-center text-ink-500">
            <Stethoscope size={40} className="mx-auto mb-3 text-ink-300" />
            No hospitals found within {radius} km. Try widening your search radius.
          </div>
        )}
      </div>

      {/* Availability modal */}
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? selected.name : ''}
        maxWidth="max-w-2xl"
      >
        {selected && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-3 text-sm text-ink-600">
              <span className="chip bg-primary-50 text-primary-700">
                <MapPin size={12} /> {selected.area}
              </span>
              <span className="chip bg-ink-100 text-ink-700">
                <Navigation size={12} /> {selected.distanceKm} km
              </span>
              <span className="chip bg-ink-100 text-ink-700">
                <Phone size={12} /> {selected.phone}
              </span>
            </div>

            <div>
              <h4 className="label">Real-time component availability</h4>
              <ComponentGrid components={selected.components} />
            </div>

            <div className="rounded-xl border border-ink-100 bg-ink-50 p-4">
              <h4 className="flex items-center gap-2 text-sm font-bold text-ink-800">
                <Droplets size={16} className="text-primary-600" /> Component Therapy Guide
              </h4>
              <ul className="mt-2.5 space-y-2 text-sm text-ink-600">
                {Object.values(COMPONENT_META).map((m) => (
                  <li key={m.short} className="flex items-start gap-2.5">
                    <span className={`mt-0.5 chip ${m.color} ${m.bg}`}>{m.short}</span>
                    <span><strong className="text-ink-800">{m.label}</strong> — {m.desc}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-800">
              <strong>How to collect:</strong> Visit the hospital blood bank with the patient's
              prescription and a valid ID. The attending doctor will issue a component requisition.
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
