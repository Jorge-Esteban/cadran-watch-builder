import { AnimatePresence, animate, motion, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useState } from 'react';
import { STEPS } from '../../data/steps';
import { formatPrice } from '../../lib/format';
import type { Quote } from '../../lib/pricing';
import { useQuote, useWatchStore } from '../../store/useWatchStore';
import { useUiStore } from '../../store/useUiStore';
import { Icon } from '../ui/Icon';

/** Precio que "rueda" hasta el nuevo valor. */
export function AnimatedPrice({ value, className }: { value: number; className?: string }) {
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => formatPrice(Math.round(v)));
  useEffect(() => {
    const controls = animate(mv, value, { duration: 0.7, ease: [0.22, 1, 0.36, 1] });
    return controls.stop;
  }, [mv, value]);
  return <motion.span className={`tabular-nums ${className ?? ''}`}>{text}</motion.span>;
}

export function QuoteLines({ quote, compact = false }: { quote: Quote; compact?: boolean }) {
  const setStep = useWatchStore((s) => s.setStep);
  return (
    <ul className={compact ? 'space-y-1.5' : 'space-y-2'}>
      {quote.lines.map((l) => (
        <li key={`${l.step}-${l.label}`} className="flex items-baseline gap-3 text-[12.5px]">
          <button
            disabled={l.step === 'base'}
            onClick={() => l.step !== 'base' && setStep(l.step)}
            className="w-[72px] shrink-0 text-left text-muted enabled:hover:text-ink"
          >
            {l.label}
          </button>
          <span className="min-w-0 flex-1 truncate">{l.value}</span>
          <span className="tabular-nums text-ink/80">{formatPrice(l.price)}</span>
        </li>
      ))}
    </ul>
  );
}

function Actions({ onDone }: { onDone?: () => void }) {
  const open = useUiStore((s) => s.open);
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        className="btn btn-ghost"
        onClick={() => {
          onDone?.();
          open('save');
        }}
      >
        <Icon name="bookmark" size={16} />
        Guardar diseño
      </button>
      <button
        className="btn btn-primary"
        onClick={() => {
          onDone?.();
          open('quote');
        }}
      >
        Pedir presupuesto
      </button>
    </div>
  );
}

/** Resumen de escritorio, fijo al pie de la barra lateral. */
export function SummaryPanel() {
  const quote = useQuote();
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="hidden border-t border-line bg-surface/80 px-7 pb-6 pt-4 backdrop-blur lg:block">
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }} className="overflow-hidden">
            <div className="pb-4 pt-1">
              <QuoteLines quote={quote} compact />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="mb-4 flex items-end justify-between">
        <button onClick={() => setExpanded((v) => !v)} className="group flex items-center gap-1.5 text-left">
          <span className="eyebrow group-hover:text-ink">Total estimado</span>
          <Icon name="chevronUp" size={14} className={`text-muted transition-transform duration-300 ${expanded ? '' : 'rotate-180'}`} />
        </button>
        <div className="text-right">
          <AnimatedPrice value={quote.total} className="font-display text-[32px] leading-none" />
          <p className="mt-1 text-[11px] text-muted">IVA incluido · entrega en 6–8 semanas</p>
        </div>
      </div>
      <Actions />
    </div>
  );
}

/** Barra inferior en móvil/tablet que se despliega como hoja con el desglose. */
export function MobileSummaryBar() {
  const quote = useQuote();
  const activeStep = useWatchStore((s) => s.activeStep);
  const [open, setOpen] = useState(false);
  const step = STEPS.find((s) => s.id === activeStep)!;

  return (
    <div className="lg:hidden">
      <AnimatePresence>
        {open && (
          <motion.div className="fixed inset-0 z-40 bg-black/25 backdrop-blur-[2px]" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
        )}
      </AnimatePresence>
      <motion.div layout className="fixed inset-x-0 bottom-0 z-50 rounded-t-3xl border-t border-line bg-surface/95 px-5 pb-[max(env(safe-area-inset-bottom),16px)] pt-3 shadow-[0_-12px_40px_-20px_rgba(0,0,0,.35)] backdrop-blur">
        <button onClick={() => setOpen((v) => !v)} className="mx-auto mb-2 block h-1 w-10 rounded-full bg-line" aria-label={open ? 'Ocultar desglose' : 'Ver desglose'} />
        <AnimatePresence initial={false}>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="pb-4 pt-2">
                <p className="eyebrow mb-3">Tu configuración</p>
                <QuoteLines quote={quote} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen((v) => !v)} className="min-w-0 flex-1 text-left">
            <span className="block text-[10.5px] uppercase tracking-[0.2em] text-muted">
              {step.short} · {step.label} · Total
            </span>
            <AnimatedPrice value={quote.total} className="font-display text-[26px] leading-tight" />
          </button>
          {!open && (
            <button className="btn btn-primary px-4" onClick={() => useUiStore.getState().open('quote')}>
              Presupuesto
            </button>
          )}
        </div>
        {open && (
          <div className="mt-3">
            <Actions onDone={() => setOpen(false)} />
          </div>
        )}
      </motion.div>
    </div>
  );
}
