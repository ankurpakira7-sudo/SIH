import { Logo } from './ui/Logo';
import { User, Hospital, Building2, Home } from 'lucide-react';

export type PortalKey = 'general' | 'hospital' | 'bloodbank';

const portals: { key: PortalKey; label: string; icon: typeof User }[] = [
  { key: 'general', label: 'Public', icon: User },
  { key: 'hospital', label: 'Hospital', icon: Hospital },
  { key: 'bloodbank', label: 'Blood Bank', icon: Building2 },
];

export function NavBar({
  active,
  onChange,
}: {
  active: PortalKey;
  onChange: (k: PortalKey) => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-ink-100 bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <button onClick={() => onChange('general')} className="flex items-center">
          <Logo />
        </button>
        <nav className="flex items-center gap-1 rounded-xl bg-ink-100 p-1">
          {portals.map((p) => {
            const Icon = p.icon;
            const isActive = active === p.key;
            return (
              <button
                key={p.key}
                onClick={() => onChange(p.key)}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-all ${
                  isActive ? 'bg-white text-primary-700 shadow-sm' : 'text-ink-500 hover:text-ink-800'
                }`}
              >
                <Icon size={16} strokeWidth={2.4} />
                <span className="hidden sm:inline">{p.label}</span>
              </button>
            );
          })}
        </nav>
        <button
          onClick={() => onChange('general')}
          className="btn-ghost hidden sm:inline-flex"
          title="Home"
        >
          <Home size={16} /> Home
        </button>
      </div>
    </header>
  );
}
