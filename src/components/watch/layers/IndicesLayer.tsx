import { memo } from 'react';
import { DIAL_COLORS, HAND_FINISHES, byId } from '../../../data/catalog';
import { CX, CY, DIAL_R, polar } from '../../../lib/geometry';
import type { WatchConfig } from '../../../types/watch';

interface Props {
  config: WatchConfig;
}

const ROMAN = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
const HOURS = Array.from({ length: 12 }, (_, i) => i);

/**
 * Capa Z=4: índices horarios. Los aplicados usan el mismo metal y lume que las
 * agujas para que el conjunto sea coherente.
 */
export const IndicesLayer = memo(function IndicesLayer({ config }: Props) {
  const finish = byId(HAND_FINISHES, config.hands.finish);
  const dial = byId(DIAL_COLORS, config.dial.color);
  const metal = `url(#${finish.gradient})`;

  if (config.dial.indices === 'roman') {
    return (
      <g fill={dial.ink} fontFamily="'Cormorant Garamond', serif" fontWeight={600} textAnchor="middle">
        {HOURS.map((i) => (
          <text key={i} transform={`rotate(${i * 30} ${CX} ${CY})`} x={CX} y={CY - DIAL_R + 25} fontSize={i % 3 === 0 ? 17 : 15}>
            {ROMAN[i]}
          </text>
        ))}
      </g>
    );
  }

  if (config.dial.indices === 'arabic') {
    return (
      <g>
        <g filter="url(#soft-shadow)" fill={metal} stroke="#000" strokeOpacity={0.55} strokeWidth={0.6} fontFamily="Inter, sans-serif" fontWeight={600} textAnchor="middle">
          {HOURS.map((i) => {
            const p = polar(DIAL_R - 22, i * 30);
            return (
              <text key={i} x={p.x} y={p.y + 6.6} fontSize={i === 0 ? 19 : 18} letterSpacing={-0.8}>
                {i === 0 ? 12 : i}
              </text>
            );
          })}
        </g>
        {HOURS.map((i) => {
          const p = polar(DIAL_R - 8, i * 30);
          return <circle key={i} cx={p.x} cy={p.y} r={2.2} fill={finish.lume} stroke={metal} strokeWidth={0.6} />;
        })}
      </g>
    );
  }

  // Bastones aplicados con relleno luminiscente
  return (
    <g filter="url(#soft-shadow)">
      {HOURS.map((i) => {
        const len = i % 3 === 0 ? 22 : 18;
        const y = CY - DIAL_R + 7;
        const batons = i === 0 ? [-5.2, 5.2] : [0];
        return (
          <g key={i} transform={`rotate(${i * 30} ${CX} ${CY})`}>
            {batons.map((dx) => (
              <g key={dx}>
                <rect x={CX + dx - 3.6} y={y} width={7.2} height={len} rx={0.8} fill={metal} />
                <rect x={CX + dx - 2.2} y={y + 1.4} width={4.4} height={len - 2.8} rx={0.4} fill={finish.lume} />
              </g>
            ))}
          </g>
        );
      })}
    </g>
  );
});
