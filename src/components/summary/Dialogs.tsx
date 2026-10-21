import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, type FormEvent, type ReactNode } from 'react';
import { DIAL_COLORS, MATERIALS, byId } from '../../data/catalog';
import { formatPrice } from '../../lib/format';
import { shareUrl } from '../../lib/share';
import { useQuote, useWatchStore } from '../../store/useWatchStore';
import { useUiStore } from '../../store/useUiStore';
import { Icon } from '../ui/Icon';
import { MiniWatch } from '../watch/MiniWatch';
import { QuoteLines } from './Summary';

function Shell({ open, onClose, title, side = false, children }: { open: boolean; onClose: () => void; title: string; side?: boolean; children: ReactNode }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div className="fixed inset-0 z-[60] flex items-end justify-center sm:items-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <div className="absolute inset-0 bg-[#1b1b1d]/35 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            role="dialog"
            aria-modal
            aria-label={title}
            className={`relative flex max-h-[92dvh] w-full flex-col overflow-hidden bg-surface shadow-2xl ${
              side ? 'rounded-t-3xl sm:absolute sm:inset-y-0 sm:right-0 sm:max-h-none sm:w-[420px] sm:rounded-none' : 'rounded-t-3xl sm:max-w-[560px] sm:rounded-3xl'
            }`}
            initial={side ? { x: 40, opacity: 0 } : { y: 40, opacity: 0, scale: 0.98 }}
            animate={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            exit={side ? { x: 40, opacity: 0 } : { y: 30, opacity: 0 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex items-center justify-between border-b border-line px-6 py-4">
              <h2 className="font-display text-2xl">{title}</h2>
              <button className="icon-btn size-9" onClick={onClose} aria-label="Cerrar">
                <Icon name="close" size={16} />
              </button>
            </div>
            <div className="overflow-y-auto px-6 py-5">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function QuoteModal() {
  const isOpen = useUiStore((s) => s.modal === 'quote');
  const close = useUiStore((s) => s.close);
  const config = useWatchStore((s) => s.config);
  const quote = useQuote();
  const [sent, setSent] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) setSent(null);
  }, [isOpen]);

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Sin backend todavía: se genera una referencia local. Aquí iría el POST a la API de pedidos
    // con { contacto, config, quote, enlace: shareUrl(config) }.
    setSent(`CA-${Date.now().toString(36).toUpperCase().slice(-6)}`);
  };

  return (
    <Shell open={isOpen} onClose={close} title="Solicitar presupuesto">
      {sent ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 py-6 text-center">
          <span className="mx-auto grid size-14 place-items-center rounded-full bg-accent-soft text-accent">
            <Icon name="check" size={26} />
          </span>
          <h3 className="font-display text-3xl">Solicitud preparada</h3>
          <p className="mx-auto max-w-sm text-sm text-muted">
            Referencia <span className="font-medium text-ink">{sent}</span>. Un relojero revisará tu configuración y te responderá con el presupuesto definitivo.
          </p>
          <button className="btn btn-primary mx-auto" onClick={close}>
            Volver al configurador
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          <div className="flex gap-4 rounded-2xl bg-canvas p-4">
            <MiniWatch config={config} layers={["strap", "case", "bezel", "dial", "indices", "hands"]} viewBox="40 60 320 480" className="hidden h-36 w-24 shrink-0 sm:block" />
            <div className="min-w-0 flex-1">
              <QuoteLines quote={quote} compact />
              <div className="mt-3 flex items-baseline justify-between border-t border-line pt-3">
                <span className="eyebrow">Total</span>
                <span className="font-display text-2xl tabular-nums">{formatPrice(quote.total)}</span>
              </div>
            </div>
          </div>
          <form className="grid gap-3 sm:grid-cols-2" onSubmit={submit}>
            <input className="field" name="name" placeholder="Nombre" required autoComplete="name" />
            <input className="field" name="email" type="email" placeholder="Email" required autoComplete="email" />
            <textarea className="field h-24 resize-none py-3 sm:col-span-2" name="notes" placeholder="Talla de muñeca, fecha deseada, comentarios…" />
            <button className="btn btn-primary sm:col-span-2" type="submit">
              Enviar solicitud
            </button>
          </form>
        </div>
      )}
    </Shell>
  );
}

export function SaveModal() {
  const isOpen = useUiStore((s) => s.modal === 'save');
  const { close, notify } = useUiStore.getState();
  const saveDesign = useWatchStore((s) => s.saveDesign);
  const count = useWatchStore((s) => s.savedDesigns.length);
  const [name, setName] = useState('');

  useEffect(() => {
    if (isOpen) setName('');
  }, [isOpen]);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const d = saveDesign(name);
    close();
    notify(`“${d.name}” guardado`);
  };

  return (
    <Shell open={isOpen} onClose={close} title="Guardar diseño">
      <form className="space-y-4" onSubmit={submit}>
        <input className="field font-display text-lg" autoFocus placeholder={`Diseño ${count + 1}`} value={name} maxLength={40} onChange={(e) => setName(e.target.value)} />
        <p className="text-[12px] text-muted">Se guarda en este navegador. Usa “Compartir” para llevártelo a otro dispositivo.</p>
        <button className="btn btn-primary w-full" type="submit">
          Guardar
        </button>
      </form>
    </Shell>
  );
}

export function SavedDesignsDrawer() {
  const isOpen = useUiStore((s) => s.modal === 'saved');
  const { close, notify } = useUiStore.getState();
  const designs = useWatchStore((s) => s.savedDesigns);
  const loadConfig = useWatchStore((s) => s.loadConfig);
  const deleteDesign = useWatchStore((s) => s.deleteDesign);
  const date = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

  return (
    <Shell open={isOpen} onClose={close} title="Mis diseños" side>
      {designs.length === 0 ? (
        <p className="py-10 text-center text-sm text-muted">Aún no has guardado ningún diseño.</p>
      ) : (
        <ul className="space-y-3">
          <AnimatePresence initial={false}>
            {designs.map((d) => (
              <motion.li key={d.id} layout initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 30 }} className="flex items-center gap-3 rounded-2xl border border-line p-3">
                <MiniWatch config={d.config} layers={['case', 'bezel', 'dial', 'indices', 'hands']} viewBox="60 160 280 280" className="size-16 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{d.name}</p>
                  <p className="flex items-center gap-1.5 text-[11px] text-muted">
                    <span className="size-2 rounded-full" style={{ background: byId(MATERIALS, d.config.case.material).swatch }} />
                    <span className="size-2 rounded-full" style={{ background: byId(DIAL_COLORS, d.config.dial.color).base }} />
                    {date.format(d.createdAt)} · {formatPrice(d.total)}
                  </p>
                </div>
                <button
                  className="btn btn-ghost h-9 px-3 text-[12px]"
                  onClick={() => {
                    loadConfig(d.config);
                    close();
                    notify(`“${d.name}” cargado`);
                  }}
                >
                  Cargar
                </button>
                <button className="icon-btn size-9 text-muted hover:text-red-700" aria-label={`Eliminar ${d.name}`} onClick={() => deleteDesign(d.id)}>
                  <Icon name="trash" size={15} />
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      )}
    </Shell>
  );
}

export function Toast() {
  const toast = useUiStore((s) => s.toast);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!toast) return;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 2400);
    return () => window.clearTimeout(t);
  }, [toast]);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex justify-center">
      <AnimatePresence>
        {visible && toast && (
          <motion.div key={toast.id} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-[13px] text-surface shadow-xl">
            <Icon name="check" size={15} className="text-accent" />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export async function copyShareLink() {
  const { config } = useWatchStore.getState();
  const url = shareUrl(config);
  window.history.replaceState(null, '', url);
  try {
    await navigator.clipboard.writeText(url);
    useUiStore.getState().notify('Enlace copiado al portapapeles');
  } catch {
    useUiStore.getState().notify('Enlace listo en la barra de direcciones');
  }
}
