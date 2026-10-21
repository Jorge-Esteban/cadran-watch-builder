import { memo } from 'react';
import { BEZEL_INNER, CX, CY } from '../../../lib/geometry';

/** Capa Z=6 (superior): reflejos del cristal de zafiro abombado. */
export const CrystalLayer = memo(function CrystalLayer() {
  const r = BEZEL_INNER;
  return (
    <g pointerEvents="none">
      {/* Gran reflejo de ventana arriba-izquierda */}
      <path
        d={`M ${CX - r} ${CY} A ${r} ${r} 0 0 1 ${CX + r * 0.72} ${CY - r * 0.69} Q ${CX + 10} ${CY - 34} ${CX - r} ${CY} Z`}
        fill="url(#crystal-glare)"
      />
      {/* Contraluz suave abajo-derecha */}
      <path d={`M ${CX + r * 0.94} ${CY + r * 0.3} A ${r - 2} ${r - 2} 0 0 1 ${CX + r * 0.3} ${CY + r * 0.94}`} fill="none" stroke="#fff" strokeOpacity={0.16} strokeWidth={5} strokeLinecap="round" filter="url(#blur-2)" />
      {/* Filo especular nítido */}
      <path d={`M ${CX - r * 0.86} ${CY - r * 0.3} A ${r - 3} ${r - 3} 0 0 1 ${CX - r * 0.2} ${CY - r * 0.95}`} fill="none" stroke="#fff" strokeOpacity={0.4} strokeWidth={1.4} strokeLinecap="round" />
      {/* Refracción en el borde del cristal */}
      <circle cx={CX} cy={CY} r={r - 0.6} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={1.2} />
      <circle cx={CX} cy={CY} r={r - 2} fill="none" stroke="#fff" strokeOpacity={0.1} strokeWidth={1} />
    </g>
  );
});
