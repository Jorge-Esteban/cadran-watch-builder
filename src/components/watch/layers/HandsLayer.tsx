import { memo } from 'react';
import { HAND_FINISHES, byId } from '../../../data/catalog';
import { CX, CY } from '../../../lib/geometry';
import type { HandStyleId, WatchConfig } from '../../../types/watch';

interface Props {
  config: WatchConfig;
  time: { h: number; m: number; s: number };
}

interface Paint {
  metal: string;
  lume: string;
}

// Las agujas se dibujan apuntando a las 12 con el pivote en (0,0) y luego se
// trasladan/rotan al centro del reloj.

/** Capa Z=5: horas, minutos, segundos y tapa central. */
export const HandsLayer = memo(function HandsLayer({ config, time }: Props) {
  const finish = byId(HAND_FINISHES, config.hands.finish);
  const paint: Paint = { metal: `url(#${finish.gradient})`, lume: finish.lume };
  const style = config.hands.style;

  return (
    <g filter="url(#hand-shadow)">
      <g transform={`translate(${CX} ${CY}) rotate(${time.h * 30})`}>
        <HourHand style={style} paint={paint} />
      </g>
      <g transform={`translate(${CX} ${CY}) rotate(${time.m * 6})`}>
        <MinuteHand style={style} paint={paint} />
      </g>
      <g transform={`translate(${CX} ${CY}) rotate(${time.s * 6})`}>
        <SecondHand style={style} paint={paint} />
      </g>
      <circle cx={CX} cy={CY} r={4.4} fill={paint.metal} />
      <circle cx={CX} cy={CY} r={1.5} fill="#1a1a1a" opacity={0.6} />
    </g>
  );
});

export function HourHand({ style, paint }: { style: HandStyleId; paint: Paint }) {
  switch (style) {
    case 'baton':
      return (
        <g>
          <rect x={-3.8} y={-52} width={7.6} height={62} rx={1} fill={paint.metal} />
          <rect x={-2.2} y={-48} width={4.4} height={34} rx={0.6} fill={paint.lume} />
        </g>
      );
    case 'dauphine':
      return <Dauphine length={54} width={6} paint={paint} />;
    case 'mercedes':
      return (
        <g>
          <rect x={-2.3} y={-26} width={4.6} height={36} fill={paint.metal} />
          <path d="M 0 -54 L 4.2 -43 L -4.2 -43 Z" fill={paint.metal} />
          <path d="M 0 -50.5 L 2.2 -44.4 L -2.2 -44.4 Z" fill={paint.lume} />
          <circle cx={0} cy={-34} r={9.6} fill={paint.metal} />
          <circle cx={0} cy={-34} r={7.6} fill={paint.lume} />
          {[0, 120, 240].map((a) => (
            <rect key={a} x={-0.9} y={-41.6} width={1.8} height={7.6} fill={paint.metal} transform={`rotate(${a} 0 -34)`} />
          ))}
        </g>
      );
    case 'snowflake':
      return (
        <g>
          <rect x={-2.3} y={-26} width={4.6} height={36} fill={paint.metal} />
          <path d="M 0 -54 L 3.2 -45 L -3.2 -45 Z" fill={paint.metal} />
          <rect x={-8.6} y={-43.6} width={17.2} height={17.2} rx={3} transform="rotate(45 0 -35)" fill={paint.metal} />
          <rect x={-6.8} y={-41.8} width={13.6} height={13.6} rx={2.2} transform="rotate(45 0 -35)" fill={paint.lume} />
        </g>
      );
  }
}

export function MinuteHand({ style, paint }: { style: HandStyleId; paint: Paint }) {
  switch (style) {
    case 'baton':
      return (
        <g>
          <rect x={-2.9} y={-80} width={5.8} height={92} rx={0.8} fill={paint.metal} />
          <rect x={-1.6} y={-76} width={3.2} height={58} rx={0.5} fill={paint.lume} />
        </g>
      );
    case 'dauphine':
      return <Dauphine length={84} width={4.8} paint={paint} />;
    case 'mercedes':
    case 'snowflake':
      return (
        <g>
          <path d="M 0 -84 L 3.4 -75 L 3.4 10 L -3.4 10 L -3.4 -75 Z" fill={paint.metal} />
          <path d="M 0 -79.5 L 1.9 -74 L 1.9 -16 L -1.9 -16 L -1.9 -74 Z" fill={paint.lume} />
        </g>
      );
  }
}

function SecondHand({ style, paint }: { style: HandStyleId; paint: Paint }) {
  const lollipop = style !== 'dauphine';
  return (
    <g>
      <rect x={-0.7} y={-86} width={1.4} height={104} fill={paint.metal} />
      {lollipop ? (
        <g>
          <circle cx={0} cy={-60} r={4.4} fill={paint.metal} />
          <circle cx={0} cy={-60} r={3.1} fill={paint.lume} />
        </g>
      ) : (
        <circle cx={0} cy={14} r={3.2} fill={paint.metal} />
      )}
    </g>
  );
}

/** Dauphine facetada: mitad clara, mitad en sombra. */
function Dauphine({ length, width, paint }: { length: number; width: number; paint: Paint }) {
  return (
    <g>
      <path d={`M 0 ${-length} L ${width} -4 L 0 8 L ${-width} -4 Z`} fill={paint.metal} />
      <path d={`M 0 ${-length} L 0 8 L ${-width} -4 Z`} fill="#fff" opacity={0.28} />
      <path d={`M 0 ${-length} L ${width} -4 L 0 8 Z`} fill="#000" opacity={0.18} />
      <path d={`M 0 ${-length + 10} L 1.4 -14 L -1.4 -14 Z`} fill={paint.lume} opacity={0.9} />
    </g>
  );
}
