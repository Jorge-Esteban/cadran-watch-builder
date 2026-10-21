import { AnimatePresence, motion } from 'framer-motion';
import { MATERIALS, STRAP_COLORS, STRAP_TYPES, byId, strapFamily } from '../../../data/catalog';
import { useWatchStore } from '../../../store/useWatchStore';
import type { StrapTypeId } from '../../../types/watch';
import { MiniWatch } from '../../watch/MiniWatch';
import { OptionGrid, Section, SwatchRow } from '../controls';

function stripes(colors: string[]) {
  if (colors.length === 1) {
    const c = colors[0];
    return `linear-gradient(135deg, color-mix(in srgb, ${c} 80%, #fff), ${c} 55%, color-mix(in srgb, ${c} 75%, #000))`;
  }
  const n = colors.length;
  return `linear-gradient(90deg, ${colors.map((c, i) => `${c} ${(i / n) * 100}% ${((i + 1) / n) * 100}%`).join(', ')})`;
}

export function StrapPanel() {
  const config = useWatchStore((s) => s.config);
  const update = useWatchStore((s) => s.update);
  const family = strapFamily(config.strap.type);
  const material = byId(MATERIALS, config.case.material);

  const onType = (type: StrapTypeId) => {
    const fam = strapFamily(type);
    // Al cambiar de familia conserva el color si existe en la nueva; si no, toma el primero.
    const keep = fam === 'metal' || STRAP_COLORS[fam].some((c) => c.id === config.strap.color);
    update('strap', { type, color: keep ? config.strap.color : STRAP_COLORS[fam as Exclude<typeof fam, 'metal'>][0].id });
  };

  return (
    <div className="space-y-8">
      <Section title="Tipo">
        <OptionGrid
          group="strap"
          columns={3}
          visualClass="aspect-[3/4]"
          options={STRAP_TYPES}
          value={config.strap.type}
          onChange={onType}
          renderVisual={(o) => (
            <MiniWatch config={{ ...config, strap: { ...config.strap, type: o.id } }} layers={['strap', 'case', 'bezel', 'dial']} viewBox="96 300 208 290" className="h-full w-full" />
          )}
        />
      </Section>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div key={family} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
          {family === 'metal' ? (
            <div className="flex items-center gap-4 rounded-2xl border border-line bg-surface p-4">
              <span className="size-10 shrink-0 rounded-full shadow-inner" style={{ background: material.swatch }} />
              <p className="text-[13px] leading-relaxed text-muted">
                El brazalete se mecaniza en <span className="font-medium text-ink">{material.name}</span> a juego con la caja y hereda su acabado. Cambia el material en el paso{' '}
                <span className="text-ink">01 · Caja</span>.
              </p>
            </div>
          ) : (
            <Section title="Color">
              <SwatchRow
                group={`strap-${family}`}
                options={STRAP_COLORS[family].map((c) => ({ id: c.id, name: c.name, price: 0, swatch: stripes(c.colors) }))}
                value={config.strap.color}
                onChange={(color) => update('strap', { color })}
              />
            </Section>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
