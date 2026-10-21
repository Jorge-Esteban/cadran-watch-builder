import { memo, useId } from 'react';
import { DIAL_COLORS, byId } from '../../../data/catalog';
import { BEZEL_INNER, CX, CY, DIAL_R, arcSegment, polar, ringPath } from '../../../lib/geometry';
import type { WatchConfig } from '../../../types/watch';

interface Props {
  config: WatchConfig;
}

const sunburstRays = (() => {
  let d = '';
  for (let deg = 0; deg < 360; deg += 1.5) {
    const p = polar(DIAL_R, deg);
    d += `M ${CX} ${CY} L ${p.x} ${p.y} `;
  }
  return d;
})();

/** Capa Z=3: plato de la esfera, textura, minutero y textos impresos. */
export const DialLayer = memo(function DialLayer({ config }: Props) {
  const clipId = `dial${useId().replace(/:/g, '')}`;
  const { texture } = config.dial;
  const color = byId(DIAL_COLORS, config.dial.color);

  return (
    <g>
      <clipPath id={clipId}>
        <circle cx={CX} cy={CY} r={DIAL_R} />
      </clipPath>
      {/* Rehaut (anillo interior entre esfera y bisel) */}
      <path d={ringPath(BEZEL_INNER, DIAL_R - 0.5)} fillRule="evenodd" fill={color.base} />
      <path d={ringPath(BEZEL_INNER, DIAL_R - 0.5)} fillRule="evenodd" fill="#000" opacity={0.35} />

      <g clipPath={`url(#${clipId})`}>
        <circle cx={CX} cy={CY} r={DIAL_R} fill={color.base} />

        {texture === 'matte' && <circle cx={CX} cy={CY} r={DIAL_R} fill={color.base} filter="url(#grain)" opacity={0.6} />}

        {texture === 'sunburst' && (
          <g>
            <path d={sunburstRays} stroke="#fff" strokeOpacity={color.light ? 0.1 : 0.06} strokeWidth={0.6} />
            {/* "Pajarita" de luz característica del sunburst */}
            <g filter="url(#blur-6)">
              <path d={arcSegment(DIAL_R + 10, 0.1, 300, 330)} fill="#fff" opacity={color.light ? 0.32 : 0.22} />
              <path d={arcSegment(DIAL_R + 10, 0.1, 120, 150)} fill="#fff" opacity={color.light ? 0.32 : 0.22} />
              <path d={arcSegment(DIAL_R + 10, 0.1, 30, 60)} fill="#000" opacity={0.28} />
              <path d={arcSegment(DIAL_R + 10, 0.1, 210, 240)} fill="#000" opacity={0.28} />
            </g>
            <circle cx={CX} cy={CY} r={18} fill="url(#sunburst-glow)" opacity={0.18} />
          </g>
        )}

        {texture === 'tapisserie' && (
          <g>
            <circle cx={CX} cy={CY} r={DIAL_R - 13} fill="url(#tapisserie)" />
            <circle cx={CX} cy={CY} r={DIAL_R - 13} fill="none" stroke="#000" strokeOpacity={0.25} strokeWidth={1} />
          </g>
        )}

        {texture === 'fume' && <circle cx={CX} cy={CY} r={DIAL_R} fill="url(#dial-fume)" />}

        <circle cx={CX} cy={CY} r={DIAL_R} fill="url(#dial-vignette)" opacity={color.light ? 0.5 : 1} />
        <MinuteTrack ink={color.ink} />
        <DialText ink={color.ink} config={config} />
      </g>
      <circle cx={CX} cy={CY} r={DIAL_R} fill="url(#rehaut)" />
    </g>
  );
});

function MinuteTrack({ ink }: { ink: string }) {
  let d = '';
  for (let i = 0; i < 60; i++) {
    if (i % 5 === 0) continue;
    const a = polar(DIAL_R - 2.5, i * 6);
    const b = polar(DIAL_R - 6, i * 6);
    d += `M ${a.x} ${a.y} L ${b.x} ${b.y} `;
  }
  return <path d={d} stroke={ink} strokeOpacity={0.85} strokeWidth={0.8} />;
}

function DialText({ ink, config }: { ink: string; config: WatchConfig }) {
  const isDiver = config.bezel.insert === 'ceramic-black' || config.bezel.insert === 'ceramic-blue';
  return (
    <g fill={ink} textAnchor="middle">
      <text x={CX} y={CY - 38} fontFamily="'Cormorant Garamond', serif" fontWeight={600} fontSize={13} letterSpacing={3.2}>
        CADRAN
      </text>
      <text x={CX} y={CY - 29} fontFamily="Inter, sans-serif" fontSize={4.4} letterSpacing={1.8} opacity={0.75}>
        ATELIER
      </text>
      <text x={CX} y={CY + 34} fontFamily="Inter, sans-serif" fontWeight={500} fontSize={5.4} letterSpacing={1.6}>
        AUTOMATIC
      </text>
      {isDiver && (
        <text x={CX} y={CY + 42} fontFamily="Inter, sans-serif" fontSize={4.6} letterSpacing={1.2} opacity={0.8}>
          200 m · 660 ft
        </text>
      )}
    </g>
  );
}
