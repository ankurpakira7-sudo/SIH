import { useState } from 'react';
import { NavBar } from '@/components/NavBar';
import type { PortalKey } from '@/components/NavBar';
import { GeneralPortal } from '@/portals/GeneralPortal';
import { HospitalPortal } from '@/portals/HospitalPortal';
import { BloodBankPortal } from '@/portals/BloodBankPortal';
import {
  Droplet, Droplets, Activity, ShieldCheck, Truck, Brain,
  Search, ArrowRight, MapPin, Hospital as HospitalIcon, Building2,
} from 'lucide-react';

function LandingHero({ onPick }: { onPick: (k: PortalKey) => void }) {
  const cards: { key: PortalKey; title: string; desc: string; icon: typeof Droplet; cls: string }[] = [
    {
      key: 'general',
      title: 'Public Portal',
      desc: 'Find nearby hospitals and check real-time blood component availability.',
      icon: Search,
      cls: 'from-sky-500 to-sky-600',
    },
    {
      key: 'hospital',
      title: 'Hospital Portal',
      desc: 'Order blood components from the network, track deliveries, print receipts.',
      icon: HospitalIcon,
      cls: 'from-primary-500 to-primary-700',
    },
    {
      key: 'bloodbank',
      title: 'Blood Bank Portal',
      desc: 'Manage order queues, peer sourcing, and AI-driven restock forecasts.',
      icon: Building2,
      cls: 'from-ink-700 to-ink-900',
    },
  ];
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <section className="card overflow-hidden">
        <div className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 px-6 py-12 text-white sm:px-10 sm:py-16">
          <div className="absolute right-8 top-8 opacity-10"><Droplets size={140} strokeWidth={1.2} /></div>
          <div className="relative max-w-2xl">
            <div className="chip bg-white/20 text-white backdrop-blur">
              <ShieldCheck size={13} /> Component Therapy · Demand Forecasting
            </div>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              RaktSetu — a smart blood-bank network
            </h1>
            <p className="mt-3 text-base text-primary-50/90">
              Track Packed RBCs, Platelets, FFP and Cryoprecipitate separately across hospitals
              and blood banks. Connect patients, hospitals and blood centres with live inventory,
              order tracking, and AI-powered restock forecasting.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button onClick={() => onPick('general')} className="btn bg-white text-primary-700 hover:bg-primary-50">
                <Search size={16} /> Find blood now <ArrowRight size={16} />
              </button>
              <button onClick={() => onPick('bloodbank')} className="btn bg-white/15 text-white backdrop-blur hover:bg-white/25">
                <Brain size={16} /> See AI forecast
              </button>
            </div>
          </div>
        </div>

        {/* Feature strip */}
        <div className="grid gap-px bg-ink-100 sm:grid-cols-3">
          {[
            { icon: Droplet, title: 'Component Therapy', desc: 'PRBC, Platelets, FFP, Cryo tracked independently' },
            { icon: Truck, title: 'Live Order Tracking', desc: 'Queued → Delivering → Delivered, Amazon-style' },
            { icon: Activity, title: 'AI Forecasting', desc: 'Seasonal demand prediction & restock alerts' },
          ].map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="bg-white px-6 py-5">
                <Icon size={22} className="text-primary-600" />
                <h3 className="mt-2 font-bold text-ink-900">{f.title}</h3>
                <p className="text-sm text-ink-500">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Portal cards */}
      <h2 className="mt-8 section-title">Choose your portal</h2>
      <div className="mt-3 grid gap-3 lg:grid-cols-3">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <button
              key={c.key}
              onClick={() => onPick(c.key)}
              className="card group p-6 text-left transition-all hover:shadow-pop hover:-translate-y-0.5"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${c.cls} text-white shadow-sm`}>
                <Icon size={24} />
              </div>
              <h3 className="mt-4 text-lg font-bold text-ink-900 group-hover:text-primary-700">{c.title}</h3>
              <p className="mt-1.5 text-sm text-ink-500">{c.desc}</p>
              <div className="mt-4 flex items-center gap-1 text-sm font-semibold text-primary-600">
                Enter portal <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex items-center justify-center gap-2 text-xs text-ink-400">
        <MapPin size={12} /> Demo location: North Dumdum, Kolkata · Mock data for prototype
      </div>
    </div>
  );
}

export default function App() {
  const [portal, setPortal] = useState<PortalKey | null>(null);

  return (
    <div className="min-h-screen bg-ink-50">
      <NavBar active={portal ?? 'general'} onChange={setPortal} />
      <main className="animate-fadeIn">
        {portal === null && <LandingHero onPick={setPortal} />}
        {portal === 'general' && <GeneralPortal />}
        {portal === 'hospital' && <HospitalPortal />}
        {portal === 'bloodbank' && <BloodBankPortal />}
      </main>
      <footer className="border-t border-ink-100 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-xs text-ink-400 sm:px-6">
          RaktSetu — Smart Blood-Bank Inventory &amp; Demand Forecasting Platform · Hackathon prototype
        </div>
      </footer>
    </div>
  );
}
