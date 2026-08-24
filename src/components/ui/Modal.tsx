import type { ReactNode } from 'react';
import { X } from 'lucide-react';

export function Modal({
  open,
  onClose,
  title,
  children,
  maxWidth = 'max-w-lg',
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn">
      <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm" onClick={onClose} />
      <div className={`relative card w-full ${maxWidth} max-h-[92vh] overflow-y-auto rounded-b-none sm:rounded-2xl animate-slideUp`}>
        <div className="sticky top-0 flex items-center justify-between border-b border-ink-100 bg-white/95 px-5 py-3.5 backdrop-blur">
          <h3 className="font-bold text-ink-900">{title}</h3>
          <button onClick={onClose} className="btn-ghost h-8 w-8 rounded-lg p-0">
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}
