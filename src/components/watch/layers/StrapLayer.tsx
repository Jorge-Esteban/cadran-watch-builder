import { memo, type ReactNode } from 'react';
import { resolveStrapColor, strapFamily } from '../../../data/catalog';
import { CASE_GEOMETRY, CX, CY, mirrorY } from '../../../lib/geometry';
import type { ViewSide, WatchConfig } from '../../../types/watch';

interface Props {
  config: WatchConfig;
  side?: ViewSide;
}

const GAP = '#1b1b1d';

/**
 * Capa Z=0. Dibuja el tramo superior de la correa en coordenadas del reloj y lo
 * refleja para obtener el inferior; los extras asimétricos (agujeros, pasadores)
 * se dibujan aparte sobre el tramo inferior.
 */
export const StrapLayer = memo(function StrapLayer({ config, side = 'front' }: Props) {
  const geo = CASE_GEOMETRY[config.case.style];
  const family = strapFamily(config.strap.type);
  const material = config.case.material;

  const yStart = CY - 92; // oculto bajo la caja
  const yEnd = -12;
  const wLug = geo.lugWidth - 2;
  const wEnd = wLug * (family === 'metal' ? 0.9 : 0.82);
  const widthAt = (y: number) => wLug + (wEnd - wLug) * ((yStart - y) / (yStart - yEnd));
  const silhouette = `M ${CX - wLug / 2} ${yStart} L ${CX - wEnd / 2} ${yEnd} L ${CX + wEnd / 2} ${yEnd} L ${CX + wLug / 2} ${yStart} Z`;

  let segment: ReactNode;
  let bottomExtras: ReactNode = null;

  if (family === 'metal') {
    segment = <MetalBracelet type={config.strap.type} material={material} finish={config.case.finish} lugTipY={geo.lugTipY} yStart={yStart} yEnd={yEnd} widthAt={widthAt} silhouette={silhouette} />;
  } else {
    const color = resolveStrapColor(config.strap.type, config.strap.color)!;
    const main = color.colors[0];
    if (family === 'leather') {
      const inset = 6;
      const stitch = (dir: 1 | -1) => `M ${CX + dir * (wLug / 2 - inset)} ${geo.lugTipY + 4} L ${CX + dir * (wEnd / 2 - inset)} ${yEnd}`;
      segment = (
        <g>
          <path d={silhouette} fill={main} />
          <path d={silhouette} fill={main} filter="url(#grain)" />
          <path d={silhouette} fill="url(#strap-sheen)" />
          <path d={stitch(-1)} stroke="#f1e6d2" strokeOpacity={0.75} strokeWidth={1.1} strokeDasharray="3.2 2.6" />
          <path d={stitch(1)} stroke="#f1e6d2" strokeOpacity={0.75} strokeWidth={1.1} strokeDasharray="3.2 2.6" />
          <path d={silhouette} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={1.2} />
        </g>
      );
      bottomExtras = (
        <g>
          <rect x={CX - wEnd / 2 - 3} y={CY + 200} width={wEnd + 6} height={14} rx={3} fill={main} stroke="#000" strokeOpacity={0.4} />
          <rect x={CX - wEnd / 2 - 3} y={CY + 200} width={wEnd + 6} height={14} rx={3} fill="url(#strap-sheen)" />
          {[232, 250, 268].map((dy) => (
            <g key={dy}>
              <ellipse cx={CX} cy={CY + dy} rx={2.8} ry={2.4} fill="#120d0a" />
              <ellipse cx={CX} cy={CY + dy + 1.2} rx={2.4} ry={1} fill="#fff" opacity={0.12} />
            </g>
          ))}
        </g>
      );
    } else if (family === 'rubber') {
      const groove = (dir: 1 | -1) => `M ${CX + dir * (wLug / 2 - 15)} ${geo.lugTipY} L ${CX + dir * (wEnd / 2 - 13)} ${yEnd}`;
      segment = (
        <g>
          <path d={silhouette} fill={main} />
          <path d={silhouette} fill="url(#strap-sheen)" />
          {([-1, 1] as const).map((d) => (
            <g key={d}>
              <path d={groove(d)} stroke="#000" strokeOpacity={0.45} strokeWidth={3} strokeLinecap="round" />
              <path d={groove(d)} stroke="#fff" strokeOpacity={0.12} strokeWidth={1} transform="translate(1.6 0)" />
            </g>
          ))}
          <path d={silhouette} fill="none" stroke="#000" strokeOpacity={0.4} strokeWidth={1} />
        </g>
      );
    } else {
      // NATO: franjas a lo largo de la correa
      const n = color.colors.length;
      segment = (
        <g>
          {color.colors.map((c, i) => {
            const l0 = CX - wLug / 2 + (wLug * i) / n;
            const l1 = CX - wLug / 2 + (wLug * (i + 1)) / n;
            const e0 = CX - wEnd / 2 + (wEnd * i) / n;
            const e1 = CX - wEnd / 2 + (wEnd * (i + 1)) / n;
            return <path key={i} d={`M ${l0} ${yStart} L ${e0} ${yEnd} L ${e1} ${yEnd} L ${l1} ${yStart} Z`} fill={c} />;
          })}
          <path d={silhouette} fill="url(#weave)" />
          <path d={silhouette} fill="url(#strap-sheen)" opacity={0.7} />
          <path d={silhouette} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={1} />
        </g>
      );
      bottomExtras = (
        <g>
          {[196, 222].map((dy) => (
            <g key={dy}>
              <rect x={CX - wEnd / 2 - 4} y={CY + dy} width={wEnd + 8} height={9} rx={2} fill={`url(#link-${material})`} stroke="#000" strokeOpacity={0.35} />
              <rect x={CX - wEnd / 2 + 1} y={CY + dy + 3} width={wEnd - 2} height={3} fill="#000" opacity={0.35} />
            </g>
          ))}
        </g>
      );
    }
  }

  return (
    <g mask="url(#strap-mask)">
      <g>{segment}</g>
      <g transform={mirrorY}>{segment}</g>
      {side === 'front' && bottomExtras}
      {side === 'back' && family !== 'metal' && (
        // Forro interior más oscuro visto desde la trasera
        <g opacity={0.28}>
          <path d={silhouette} fill="#000" />
          <path d={silhouette} fill="#000" transform={mirrorY} />
        </g>
      )}
    </g>
  );
});

interface BraceletProps {
  type: WatchConfig['strap']['type'];
  material: WatchConfig['case']['material'];
  finish: WatchConfig['case']['finish'];
  lugTipY: number;
  yStart: number;
  yEnd: number;
  widthAt: (y: number) => number;
  silhouette: string;
}

function MetalBracelet({ type, material, finish, lugTipY, yStart, yEnd, widthAt, silhouette }: BraceletProps) {
  const link = `url(#link-${material})`;
  const polished = `url(#metal-${material}-polished)`;
  const center = `url(#metal-${material}-${finish})`;
  const rowH = type === 'oyster' ? 22 : type === 'jubilee' ? 16 : 18;
  const rows: ReactNode[] = [];

  for (let y = lugTipY - 4; y > yEnd - rowH; y -= rowH + 1.4) {
    const top = y - rowH;
    const w = widthAt(y - rowH / 2);
    const x0 = CX - w / 2;
    const piece = (from: number, frac: number, fill: string, key: string, opts: { y?: number; h?: number; rx?: number } = {}) => (
      <rect key={key} x={x0 + w * from + 0.7} y={opts.y ?? top} width={w * frac - 1.4} height={opts.h ?? rowH} rx={opts.rx ?? 2.2} fill={fill} />
    );

    if (type === 'oyster') {
      rows.push(piece(0, 0.3, link, `${y}a`), piece(0.3, 0.4, center, `${y}b`), piece(0.7, 0.3, link, `${y}c`));
    } else if (type === 'jubilee') {
      const half = rowH / 2 - 0.7;
      rows.push(
        piece(0, 0.27, link, `${y}a`),
        piece(0.73, 0.27, link, `${y}e`),
        piece(0.27, 0.15, polished, `${y}b1`, { h: half, rx: 1.6 }),
        piece(0.27, 0.15, polished, `${y}b2`, { y: top + rowH / 2 + 0.7, h: half, rx: 1.6 }),
        piece(0.58, 0.15, polished, `${y}d1`, { h: half, rx: 1.6 }),
        piece(0.58, 0.15, polished, `${y}d2`, { y: top + rowH / 2 + 0.7, h: half, rx: 1.6 }),
        piece(0.42, 0.16, center, `${y}c1`, { y: top - rowH / 4, h: half, rx: 1.6 }),
        piece(0.42, 0.16, center, `${y}c2`, { y: top + rowH / 4 + 0.7, h: half, rx: 1.6 }),
      );
    } else {
      const rx = rowH / 2 - 1;
      rows.push(piece(0, 0.31, link, `${y}a`, { rx }), piece(0.31, 0.38, polished, `${y}b`, { rx }), piece(0.69, 0.31, link, `${y}c`, { rx }));
    }
  }

  const endW = widthAt(lugTipY);
  return (
    <g>
      <path d={silhouette} fill={GAP} />
      {rows}
      {/* Pieza de unión (endlink) */}
      <rect x={CX - widthAt(yStart) / 2} y={lugTipY - 4} width={widthAt(yStart)} height={yStart - lugTipY + 4} fill={link} />
      <rect x={CX - endW / 2} y={lugTipY - 4} width={endW} height={2} fill="#000" opacity={0.3} />
      <path d={silhouette} fill="url(#brush-lines)" opacity={finish === 'brushed' ? 0.9 : 0.35} />
    </g>
  );
}

