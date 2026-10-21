import { AnimatePresence, motion } from 'framer-motion';
import { CASEBACKS, ENGRAVING_PRICE, ROTORS, ROTOR_FINISHES } from '../../../data/catalog';
import { formatDelta } from '../../../lib/format';
import { useWatchStore } from '../../../store/useWatchStore';
import { MiniWatch } from '../../watch/MiniWatch';
import { OptionGrid, Section, SwatchRow } from '../controls';

const MAX_ENGRAVING = 22;

export function CasebackPanel() {
  const config = useWatchStore((s) => s.config);
  const update = useWatchStore((s) => s.update);
  const cb = config.caseback;
  return (
    <div className="space-y-8">
      <Section title="Tipo de fondo">
        <OptionGrid
          group="caseback"
          options={CASEBACKS}
          value={cb.type}
          onChange={(type) => update('caseback', { type })}
          renderVisual={(o) => (
            <MiniWatch config={{ ...config, caseback: { ...cb, type: o.id } }} layers={['caseback']} viewBox="90 190 220 220" className="h-full w-full p-2" />
          )}
        />
      </Section>

      <AnimatePresence mode="wait" initial={false}>
        {cb.type === 'sapphire' ? (
          <motion.div key="rotor" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className="space-y-8">
            <Section title="Rotor personalizado" hint="NH35A · 24 rubíes">
              <OptionGrid
                group="rotor"
                columns={3}
                options={ROTORS}
                value={cb.rotor}
                onChange={(rotor) => update('caseback', { rotor })}
                renderVisual={(o) => (
                  <MiniWatch config={{ ...config, caseback: { ...cb, rotor: o.id } }} layers={['caseback']} viewBox="118 218 164 164" className="h-full w-full" />
                )}
              />
            </Section>
            <Section title="Acabado del rotor">
              <SwatchRow group="rotor-finish" options={ROTOR_FINISHES} value={cb.rotorFinish} onChange={(rotorFinish) => update('caseback', { rotorFinish })} />
            </Section>
          </motion.div>
        ) : (
          <motion.div key="engrave" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
            <Section title="Grabado personalizado" hint={formatDelta(ENGRAVING_PRICE)}>
              <label className="block space-y-2">
                <input
                  className="field font-display text-lg italic"
                  placeholder="Para A., siempre"
                  maxLength={MAX_ENGRAVING}
                  value={cb.engraving}
                  onChange={(e) => update('caseback', { engraving: e.target.value })}
                />
                <span className="flex justify-between text-[11px] text-muted">
                  <span>Grabado láser en el centro del fondo</span>
                  <span className="tabular-nums">
                    {cb.engraving.length}/{MAX_ENGRAVING}
                  </span>
                </span>
              </label>
            </Section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
