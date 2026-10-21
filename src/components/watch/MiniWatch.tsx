import { memo } from 'react';
import { DIAL_COLORS, HAND_FINISHES, byId } from '../../data/catalog';
import { CX, CY, DIAL_R } from '../../lib/geometry';
import type { WatchConfig } from '../../types/watch';
import { BezelLayer } from './layers/BezelLayer';
import { CaseLayer } from './layers/CaseLayer';
import { CasebackLayer } from './layers/CasebackLayer';
import { DialLayer } from './layers/DialLayer';
import { HandsLayer, HourHand, MinuteHand } from './layers/HandsLayer';
import { IndicesLayer } from './layers/IndicesLayer';
import { StrapLayer } from './layers/StrapLayer';

export type MiniLayer = 'strap' | 'case' | 'bezel' | 'dial' | 'indices' | 'hands' | 'caseback' | 'handsOnly';

const POSE = { h: 10.15, m: 9, s: 36 };

interface Props {
  config: WatchConfig;
  layers: MiniLayer[];
  viewBox: string;
  className?: string;
}

/**
 * Miniatura estática que reutiliza las mismas capas del preview principal,
 * recortadas con un viewBox distinto. Garantiza que la miniatura de cada opción
 * sea exactamente la pieza que se montará.
 */
export const MiniWatch = memo(function MiniWatch({ config, layers, viewBox, className }: Props) {
  const has = (l: MiniLayer) => layers.includes(l);
  return (
    <svg viewBox={viewBox} className={className} aria-hidden>
      {has('strap') && <StrapLayer config={config} />}
      {has('case') && <CaseLayer config={config} />}
      {has('caseback') && <CasebackLayer config={config} />}
      {has('bezel') && <BezelLayer config={config} />}
      {has('dial') && <DialLayer config={config} />}
      {has('indices') && <IndicesLayer config={config} />}
      {has('hands') && <HandsLayer config={config} time={POSE} />}
      {has('handsOnly') && <HandsOnly config={config} />}
    </svg>
  );
});

/** Agujas sobre un disco liso, para comparar formas sin ruido visual. */
function HandsOnly({ config }: { config: WatchConfig }) {
  const finish = byId(HAND_FINISHES, config.hands.finish);
  const dial = byId(DIAL_COLORS, config.dial.color);
  const paint = { metal: `url(#${finish.gradient})`, lume: finish.lume };
  return (
    <g>
      <circle cx={CX} cy={CY} r={DIAL_R} fill={dial.base} />
      <circle cx={CX} cy={CY} r={DIAL_R} fill="url(#dial-vignette)" />
      <g filter="url(#hand-shadow)">
        <g transform={`translate(${CX} ${CY}) rotate(-50)`}>
          <HourHand style={config.hands.style} paint={paint} />
        </g>
        <g transform={`translate(${CX} ${CY}) rotate(55)`}>
          <MinuteHand style={config.hands.style} paint={paint} />
        </g>
        <circle cx={CX} cy={CY} r={4.4} fill={paint.metal} />
      </g>
    </g>
  );
}
