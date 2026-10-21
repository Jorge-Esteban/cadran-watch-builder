import { HAND_FINISHES, HAND_STYLES } from '../../../data/catalog';
import { useWatchStore } from '../../../store/useWatchStore';
import { MiniWatch } from '../../watch/MiniWatch';
import { OptionGrid, Section, SwatchRow } from '../controls';

export function HandsPanel() {
  const config = useWatchStore((s) => s.config);
  const update = useWatchStore((s) => s.update);
  return (
    <div className="space-y-8">
      <Section title="Estilo de agujas">
        <OptionGrid
          group="hand-style"
          options={HAND_STYLES}
          value={config.hands.style}
          onChange={(style) => update('hands', { style })}
          renderVisual={(o) => (
            <MiniWatch config={{ ...config, hands: { ...config.hands, style: o.id } }} layers={['handsOnly']} viewBox="106 206 188 188" className="h-full w-full p-3" />
          )}
        />
      </Section>
      <Section title="Acabado" hint="Los índices aplicados se igualan">
        <SwatchRow group="hand-finish" options={HAND_FINISHES} value={config.hands.finish} onChange={(finish) => update('hands', { finish })} />
      </Section>
    </div>
  );
}
