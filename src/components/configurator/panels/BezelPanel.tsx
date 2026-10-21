import { BEZELS } from '../../../data/catalog';
import { useWatchStore } from '../../../store/useWatchStore';
import { MiniWatch } from '../../watch/MiniWatch';
import { OptionGrid, Section } from '../controls';

export function BezelPanel() {
  const config = useWatchStore((s) => s.config);
  const update = useWatchStore((s) => s.update);
  return (
    <div className="space-y-8">
      <Section title="Inserción del bisel">
        <OptionGrid
          group="bezel"
          options={BEZELS}
          value={config.bezel.insert}
          onChange={(insert) => update('bezel', { insert })}
          renderVisual={(o) => (
            <MiniWatch config={{ ...config, bezel: { insert: o.id } }} layers={['bezel', 'dial', 'indices']} viewBox="82 182 236 236" className="h-full w-full p-2" />
          )}
        />
      </Section>
    </div>
  );
}
