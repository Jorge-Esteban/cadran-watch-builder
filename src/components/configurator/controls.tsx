import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { formatDelta } from '../../lib/format';
import { Icon } from '../ui/Icon';

// Controles reutilizables de los paneles: todos son "controlled" (value + onChange)
// y no conocen el store; los paneles hacen de puente con useWatchStore.

interface Opt<T extends string> {
  id: T;
  name: string;
  description?: string;
  price: number;
}

export function Section({ title, hint, children }: { title: string; hint?: ReactNode; children: ReactNode }) {
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="eyebrow">{title}</h3>
        {hint && <span className="text-[12px] text-muted">{hint}</span>}
      </div>
      {children}
    </section>
  );
}

interface OptionGridProps<T extends string> {
  group: string;
  options: readonly Opt<T>[];
  value: T;
  onChange: (id: T) => void;
  renderVisual?: (opt: Opt<T>) => ReactNode;
  columns?: 2 | 3;
  visualClass?: string;
}

/** Tarjetas con miniatura; el resaltado de selección se desliza con layoutId. */
export function OptionGrid<T extends string>({ group, options, value, onChange, renderVisual, columns = 2, visualClass = 'aspect-square' }: OptionGridProps<T>) {
  return (
    <div role="radiogroup" className={`grid gap-2.5 ${columns === 3 ? 'grid-cols-3' : 'grid-cols-2'}`}>
      {options.map((opt) => {
        const selected = opt.id === value;
        return (
          <button
            key={opt.id}
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(opt.id)}
            className={`group relative flex flex-col overflow-hidden rounded-2xl border text-left transition-colors duration-300 ${
              selected ? 'border-ink/70' : 'border-line hover:border-ink/25'
            }`}
          >
            {selected && (
              <motion.span layoutId={`sel-${group}`} className="absolute inset-0 rounded-2xl bg-white ring-1 ring-ink/70" transition={{ type: 'spring', stiffness: 380, damping: 34 }} />
            )}
            {renderVisual && (
              <span className={`relative block w-full ${visualClass} overflow-hidden bg-gradient-to-b from-[#f7f5f1] to-[#ece8e1]`}>
                <span className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-lux)] group-hover:scale-[1.06]">{renderVisual(opt)}</span>
              </span>
            )}
            <span className="relative flex flex-1 flex-col gap-0.5 px-3 py-2.5">
              <span className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-medium leading-tight">{opt.name}</span>
                {selected && <Icon name="check" size={14} className="shrink-0 text-accent" />}
              </span>
              {opt.description && <span className="text-[11px] leading-snug text-muted">{opt.description}</span>}
              <span className={`mt-auto pt-1 text-[11px] tabular-nums ${opt.price ? 'text-ink/70' : 'text-faint'}`}>{formatDelta(opt.price)}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

interface SwatchRowProps<T extends string> {
  group: string;
  options: readonly (Opt<T> & { swatch: string })[];
  value: T;
  onChange: (id: T) => void;
}

/** Selector circular de color / material con etiqueta de la opción activa. */
export function SwatchRow<T extends string>({ group, options, value, onChange }: SwatchRowProps<T>) {
  const active = options.find((o) => o.id === value) ?? options[0];
  return (
    <div className="space-y-3">
      <div role="radiogroup" className="flex flex-wrap gap-2.5">
        {options.map((opt) => {
          const selected = opt.id === value;
          return (
            <button key={opt.id} role="radio" aria-checked={selected} aria-label={opt.name} title={opt.name} onClick={() => onChange(opt.id)} className="relative grid size-11 place-items-center rounded-full">
              {selected && <motion.span layoutId={`sw-${group}`} className="absolute inset-0 rounded-full ring-[1.5px] ring-ink" transition={{ type: 'spring', stiffness: 420, damping: 32 }} />}
              <span className="size-8 rounded-full shadow-[inset_0_0_0_1px_rgba(0,0,0,.12),0_2px_6px_-2px_rgba(0,0,0,.35)] transition-transform duration-300 hover:scale-110" style={{ background: opt.swatch }} />
            </button>
          );
        })}
      </div>
      <motion.p key={active.id} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} className="flex items-baseline gap-2 text-[13px]">
        <span className="font-medium">{active.name}</span>
        {active.description && <span className="text-muted">· {active.description}</span>}
        <span className="ml-auto text-[12px] tabular-nums text-muted">{formatDelta(active.price)}</span>
      </motion.p>
    </div>
  );
}

interface SegmentedProps<T extends string> {
  group: string;
  options: readonly Opt<T>[];
  value: T;
  onChange: (id: T) => void;
}

export function Segmented<T extends string>({ group, options, value, onChange }: SegmentedProps<T>) {
  return (
    <div role="radiogroup" className="flex rounded-full border border-line bg-surface p-1">
      {options.map((opt) => {
        const selected = opt.id === value;
        return (
          <button key={opt.id} role="radio" aria-checked={selected} onClick={() => onChange(opt.id)} className="relative flex-1 rounded-full px-3 py-2 text-[12.5px] font-medium">
            {selected && <motion.span layoutId={`seg-${group}`} className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
            <span className={`relative flex items-center justify-center gap-1.5 ${selected ? 'text-surface' : 'text-muted'}`}>
              {opt.name}
              <span className={`text-[11px] font-normal ${selected ? 'text-surface/60' : 'text-faint'}`}>{opt.price ? formatDelta(opt.price) : ''}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}
