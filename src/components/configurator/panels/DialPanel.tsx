import { DIAL_COLORS, DIAL_TEXTURES, INDEX_STYLES } from '../../../data/catalog';
import { useWatchStore } from '../../../store/useWatchStore';
import { MiniWatch } from '../../watch/MiniWatch';
import { OptionGrid, Section, SwatchRow } from '../controls';

const colorSwatches = DIAL_COLORS.map((c) => ({
  ...c,
  swatch: `radial-gradient(circle at 35% 30%, ${c.base}, ${c.base} 45%, color-mix(in srgb, ${c.base} 70%, #000))`,
}));

export function DialPanel() {
  const config = useWatchStore((s) => s.config);
  const update = useWatchStore((s) => s.update);
  return (
    <div className="space-y-8">
      <Section title="Color">
        <SwatchRow group="dial-color" options={colorSwatches} value={config.dial.color} onChange={(color) => update('dial', { color })} />
      </Section>
      <Section title="Textura">
        <OptionGrid
          group="dial-texture"
          options={DIAL_TEXTURES}
          value={config.dial.texture}
          onChange={(texture) => update('dial', { texture })}
          renderVisual={(o) => (
            <MiniWatch config={{ ...config, dial: { ...config.dial, texture: o.id } }} layers={['dial']} viewBox="112 212 176 176" className="h-full w-full p-3" />
          )}
        />
      </Section>
      <Section title="Índices">
        <OptionGrid
          group="dial-indices"
          columns={3}
          options={INDEX_STYLES}
          value={config.dial.indices}
          onChange={(indices) => update('dial', { indices })}
          renderVisual={(o) => (
            <MiniWatch config={{ ...config, dial: { ...config.dial, indices: o.id } }} layers={['dial', 'indices']} viewBox="108 208 184 184" className="h-full w-full p-2" />
          )}
        />
      </Section>
    </div>
  );
}
