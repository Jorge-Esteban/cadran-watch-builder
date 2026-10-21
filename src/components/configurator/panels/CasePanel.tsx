import { CASE_STYLES, FINISHES, MATERIALS } from '../../../data/catalog';
import { useWatchStore } from '../../../store/useWatchStore';
import { MiniWatch } from '../../watch/MiniWatch';
import { OptionGrid, Section, Segmented, SwatchRow } from '../controls';

export function CasePanel() {
  const config = useWatchStore((s) => s.config);
  const update = useWatchStore((s) => s.update);
  return (
    <div className="space-y-8">
      <Section title="Estilo de caja">
        <OptionGrid
          group="case-style"
          options={CASE_STYLES}
          value={config.case.style}
          onChange={(style) => update('case', { style })}
          renderVisual={(o) => (
            <MiniWatch config={{ ...config, case: { ...config.case, style: o.id } }} layers={['case', 'bezel', 'dial', 'indices', 'hands']} viewBox="50 132 300 336" className="h-full w-full p-2" />
          )}
        />
      </Section>
      <Section title="Material">
        <SwatchRow group="material" options={MATERIALS} value={config.case.material} onChange={(material) => update('case', { material })} />
      </Section>
      <Section title="Acabado">
        <Segmented group="finish" options={FINISHES} value={config.case.finish} onChange={(finish) => update('case', { finish })} />
      </Section>
    </div>
  );
}
