import { memo, useId, type ReactNode } from 'react';
import { CASE_GEOMETRY, CX, CY, arcSegment, circlePath, polar, roundedOctagonPath } from '../../../lib/geometry';
import type { WatchConfig } from '../../../types/watch';
import { Movement, WINDOW_R } from './MovementLayer';

interface Props {
  config: WatchConfig;
}

const BACK_R = 104;

/** Capa trasera: tapa roscada, grabados y —con fondo visto— el calibre automático. */
export const CasebackLayer = memo(function CasebackLayer({ config }: Props) {
  const uid = useId().replace(/:/g, '');
  const geo = CASE_GEOMETRY[config.case.style];
  const { material } = config.case;
  const brushed = `url(#metal-${material}-brushed)`;
  const sapphire = config.caseback.type === 'sapphire';
  const outline = geo.shape === 'octagon' ? roundedOctagonPath(BACK_R + 4, 0.55) : circlePath(BACK_R);
  const ringText = sapphire
    ? 'SAPPHIRE CRYSTAL · CAL. NH35A · 24 JEWELS · 21 600 A/h · HACKING · '
    : 'STAINLESS STEEL · WATER RESISTANT 200 M · SAPPHIRE CRYSTAL · AUTOMATIC · ';
  const textR = sapphire ? WINDOW_R + 11 : BACK_R - 14;

  return (
    <g>
      <path d={outline} fill={brushed} stroke="#000" strokeOpacity={0.35} />
      <path d={outline} fill="url(#brush-radial)" />
      <path d={outline} fill="url(#case-volume)" opacity={0.8} />
      <path d={outline} fill="none" stroke="url(#rim-light)" strokeWidth={1.6} />
      {/* Muescas para la llave de apertura */}
      {Array.from({ length: 6 }, (_, i) => {
        const p = polar(BACK_R - 3, i * 60 + 30);
        return <rect key={i} x={p.x - 5} y={p.y - 2} width={10} height={4} rx={1} fill="#000" opacity={0.35} transform={`rotate(${i * 60 + 30} ${p.x} ${p.y})`} />;
      })}

      <path id={`ring-${uid}`} d={`M ${CX} ${CY + textR} a ${textR} ${textR} 0 1 1 0.01 0`} fill="none" />
      <Engraved>
        <text fontFamily="Inter, sans-serif" fontSize={6} letterSpacing={1.9}>
          <textPath href={`#ring-${uid}`} startOffset="0">
            {ringText}
          </textPath>
        </text>
      </Engraved>

      {sapphire ? (
        <g>
          {/* Bisel pulido del cristal trasero */}
          <circle cx={CX} cy={CY} r={WINDOW_R + 4} fill={`url(#metal-${material}-polished)`} />
          <circle cx={CX} cy={CY} r={WINDOW_R + 4} fill="none" stroke="url(#rim-light)" strokeWidth={1.2} />
          <Movement config={config} uid={uid} />
          <circle cx={CX} cy={CY} r={WINDOW_R} fill="url(#sapphire-tint)" />
          {/* Reflejos del zafiro */}
          <path d={arcSegment(WINDOW_R - 3, WINDOW_R - 30, 292, 338)} fill="#fff" opacity={0.14} filter="url(#blur-2)" />
          <path d={`M ${polar(WINDOW_R - 6, 296).x} ${polar(WINDOW_R - 6, 296).y} A ${WINDOW_R - 6} ${WINDOW_R - 6} 0 0 1 ${polar(WINDOW_R - 6, 330).x} ${polar(WINDOW_R - 6, 330).y}`} fill="none" stroke="#fff" strokeOpacity={0.45} strokeWidth={1} strokeLinecap="round" />
          <circle cx={CX} cy={CY} r={WINDOW_R} fill="none" stroke="#000" strokeOpacity={0.55} strokeWidth={1.5} />
        </g>
      ) : (
        <SolidBack engraving={config.caseback.engraving} />
      )}
    </g>
  );
});

/** Efecto de grabado: sombra oscura + luz desplazada. */
function Engraved({ children }: { children: ReactNode }) {
  return (
    <g>
      <g fill="#fff" opacity={0.45} transform="translate(0.5 0.6)">
        {children}
      </g>
      <g fill="#1d1c1a" opacity={0.55}>
        {children}
      </g>
    </g>
  );
}

function SolidBack({ engraving }: { engraving: string }) {
  const text = engraving.trim();
  return (
    <g>
      {[BACK_R - 24, BACK_R - 27, 46].map((r) => (
        <circle key={r} cx={CX} cy={CY} r={r} fill="none" stroke="#000" strokeOpacity={0.22} strokeWidth={0.8} />
      ))}
      <Engraved>
        {/* Emblema: ola estilizada */}
        <path
          d={`M ${CX - 26} ${CY - 6} q 6.5 -10 13 0 t 13 0 t 13 0 t 13 0 M ${CX - 26} ${CY + 3} q 6.5 -10 13 0 t 13 0 t 13 0 t 13 0`}
          fill="none"
          stroke="#1d1c1a"
          strokeWidth={1.4}
        />
        <text x={CX} y={CY - 18} textAnchor="middle" fontFamily="'Cormorant Garamond', serif" fontWeight={600} fontSize={10} letterSpacing={3}>
          CADRAN
        </text>
        <text x={CX} y={CY + 24} textAnchor="middle" fontFamily={text ? "'Cormorant Garamond', serif" : 'Inter, sans-serif'} fontStyle={text ? 'italic' : 'normal'} fontSize={text ? 11 : 6} letterSpacing={text ? 0.5 : 2}>
          {text || 'Nº 0001 / 0250'}
        </text>
      </Engraved>
    </g>
  );
}
