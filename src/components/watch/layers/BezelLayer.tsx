import { memo } from 'react';
import { BEZEL_INNER, BEZEL_OUTER, CASE_GEOMETRY, CX, CY, arcSegment, circlePath, polar, ringPath, roundedOctagonPath } from '../../../lib/geometry';
import type { BezelId, WatchConfig } from '../../../types/watch';

interface Props {
  config: WatchConfig;
}

const INSERT_OUTER = BEZEL_OUTER - 3;
const INSERT_INNER = BEZEL_INNER + 2.5;
const MARK_R = (INSERT_OUTER + INSERT_INNER) / 2;

const INSERT_COLORS: Partial<Record<BezelId, { bg: string; ink: string }>> = {
  'ceramic-black': { bg: '#0d0d0f', ink: '#e4e3dd' },
  'ceramic-blue': { bg: '#14285a', ink: '#e8e9ee' },
  tachymeter: { bg: '#18181a', ink: '#f2f1ec' },
};

/** Capa Z=2: aro del bisel con su inserción y escala. */
export const BezelLayer = memo(function BezelLayer({ config }: Props) {
  const { insert } = config.bezel;
  const geo = CASE_GEOMETRY[config.case.style];
  const metal = `url(#metal-${config.case.material}-polished)`;
  const outerPath = geo.shape === 'octagon' ? roundedOctagonPath(BEZEL_OUTER + 2, 0.55) : circlePath(BEZEL_OUTER);

  return (
    <g>
      {/* Aro metálico */}
      <path d={`${outerPath} ${circlePath(BEZEL_INNER)}`} fillRule="evenodd" fill={metal} stroke="#000" strokeOpacity={0.3} strokeWidth={0.8} />
      {geo.coinEdge && <circle cx={CX} cy={CY} r={BEZEL_OUTER - 1} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={2.4} strokeDasharray="1.2 1.6" />}

      {insert === 'polished' ? (
        <PolishedBezel />
      ) : insert === 'pepsi' ? (
        <PepsiInsert />
      ) : (
        <g>
          <path d={ringPath(INSERT_OUTER, INSERT_INNER)} fillRule="evenodd" fill={INSERT_COLORS[insert]!.bg} />
          {insert === 'tachymeter' ? <TachymeterScale ink={INSERT_COLORS[insert]!.ink} /> : <DiveScale ink={INSERT_COLORS[insert]!.ink} />}
          <path d={ringPath(INSERT_OUTER, INSERT_INNER)} fillRule="evenodd" fill="url(#ceramic-sheen)" opacity={insert === 'tachymeter' ? 0.5 : 1} />
        </g>
      )}

      <BezelReflections glossy={insert.startsWith('ceramic')} />
      {/* Volumen del aro metálico */}
      <path d={`${outerPath} ${circlePath(INSERT_OUTER)}`} fillRule="evenodd" fill="url(#case-volume)" />
      <path d={outerPath} fill="none" stroke="url(#rim-light)" strokeWidth={1.4} />
      <circle cx={CX} cy={CY} r={INSERT_INNER} fill="none" stroke="#000" strokeOpacity={0.4} strokeWidth={0.8} />
    </g>
  );
});

/** Reflejo especular de la ventana: mancha suave + línea nítida, más intensa en cerámica. */
function BezelReflections({ glossy }: { glossy: boolean }) {
  const k = glossy ? 1 : 0.55;
  return (
    <g pointerEvents="none">
      <path d={arcSegment(INSERT_OUTER - 1, INSERT_INNER + 1, 292, 342)} fill="#fff" opacity={0.26 * k} filter="url(#blur-2)" />
      <path d={arcSegment(INSERT_OUTER - 1, INSERT_INNER + 1, 112, 150)} fill="#fff" opacity={0.08 * k} filter="url(#blur-2)" />
      <path
        d={`M ${polar(INSERT_OUTER - 2.5, 298).x} ${polar(INSERT_OUTER - 2.5, 298).y} A ${INSERT_OUTER - 2.5} ${INSERT_OUTER - 2.5} 0 0 1 ${polar(INSERT_OUTER - 2.5, 334).x} ${polar(INSERT_OUTER - 2.5, 334).y}`}
        fill="none"
        stroke="#fff"
        strokeOpacity={0.6 * k}
        strokeWidth={0.9}
        strokeLinecap="round"
      />
    </g>
  );
}

function PolishedBezel() {
  return (
    <g>
      <circle cx={CX} cy={CY} r={INSERT_OUTER} fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={0.8} />
      <circle cx={CX} cy={CY} r={BEZEL_INNER + 3} fill="none" stroke="#000" strokeOpacity={0.25} strokeWidth={1.2} />
    </g>
  );
}

function DiveScale({ ink }: { ink: string }) {
  const ticks = Array.from({ length: 60 }, (_, i) => i).filter((i) => i % 10 !== 0 && (i < 15 || i % 5 === 0));
  return (
    <g fill={ink}>
      {ticks.map((i) => {
        const long = i % 5 === 0;
        const a = polar(INSERT_OUTER - 2, i * 6);
        const b = polar(INSERT_OUTER - (long ? 8 : 5), i * 6);
        return <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ink} strokeWidth={long ? 2.2 : 1.1} />;
      })}
      {[10, 20, 30, 40, 50].map((n) => (
        <text key={n} transform={`rotate(${n * 6} ${CX} ${CY})`} x={CX} y={CY - MARK_R + 4.2} textAnchor="middle" fontSize={11.5} fontFamily="Inter, sans-serif" fontWeight={600} letterSpacing={-0.3}>
          {n}
        </text>
      ))}
      {/* Triángulo con pip luminiscente */}
      <path d={`M ${CX - 7} ${CY - INSERT_OUTER + 2.5} L ${CX + 7} ${CY - INSERT_OUTER + 2.5} L ${CX} ${CY - INSERT_INNER - 1} Z`} fill={ink} />
      <circle cx={CX} cy={CY - INSERT_OUTER + 7} r={2.4} fill="#eef3e6" stroke="#9a9a94" strokeWidth={0.5} />
    </g>
  );
}

function PepsiInsert() {
  const ink = '#f1efe8';
  return (
    <g>
      <path d={arcSegment(INSERT_OUTER, INSERT_INNER, -90, 90)} fill="#a8242d" />
      <path d={arcSegment(INSERT_OUTER, INSERT_INNER, 90, 270)} fill="#1b3474" />
      <g fill={ink}>
        {Array.from({ length: 24 }, (_, h) => h).map((h) => {
          if (h === 0) return null;
          const deg = h * 15;
          if (h % 2 === 1) {
            const p = polar(MARK_R, deg);
            return <circle key={h} cx={p.x} cy={p.y} r={1.6} />;
          }
          return (
            <text key={h} transform={`rotate(${deg} ${CX} ${CY})`} x={CX} y={CY - MARK_R + 4} textAnchor="middle" fontSize={10.5} fontFamily="Inter, sans-serif" fontWeight={600}>
              {h}
            </text>
          );
        })}
        <path d={`M ${CX - 6.5} ${CY - INSERT_OUTER + 2.5} L ${CX + 6.5} ${CY - INSERT_OUTER + 2.5} L ${CX} ${CY - INSERT_INNER - 1} Z`} />
      </g>
      {/* Aluminio: brillo más suave que la cerámica */}
      <path d={ringPath(INSERT_OUTER, INSERT_INNER)} fillRule="evenodd" fill="url(#ceramic-sheen)" opacity={0.45} />
    </g>
  );
}

const TACHY_VALUES = [500, 400, 300, 250, 200, 150, 120, 100, 90, 80, 70, 60];

function TachymeterScale({ ink }: { ink: string }) {
  return (
    <g fill={ink}>
      {TACHY_VALUES.map((v) => {
        // velocidad v ⇒ t = 3600/v segundos ⇒ ángulo = t·6°
        const deg = (21600 / v) % 360;
        const a = polar(INSERT_OUTER - 1.5, deg);
        const b = polar(INSERT_OUTER - 5, deg);
        return (
          <g key={v}>
            <line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={ink} strokeWidth={1.1} />
            <text transform={`rotate(${deg} ${CX} ${CY})`} x={CX} y={CY - MARK_R + 6} textAnchor="middle" fontSize={8} fontFamily="Inter, sans-serif" fontWeight={500}>
              {v}
            </text>
          </g>
        );
      })}
      <text transform={`rotate(-22 ${CX} ${CY})`} x={CX} y={CY - MARK_R + 5} textAnchor="middle" fontSize={5.6} letterSpacing={1.4} fontFamily="Inter, sans-serif" opacity={0.85}>
        TACHYMÈTRE
      </text>
    </g>
  );
}
