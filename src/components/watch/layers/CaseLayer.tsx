import { memo, useId } from 'react';
import { BEZEL_OUTER, CASE_GEOMETRY, CX, CY, circlePath, mirrorX, mirrorY, roundedOctagonPath, type CaseGeometry } from '../../../lib/geometry';
import type { MaterialId, ViewSide, WatchConfig } from '../../../types/watch';

interface Props {
  config: WatchConfig;
  side?: ViewSide;
}

// Iluminación común a toda la caja: luz principal arriba-izquierda. Cada pieza se
// pinta en tres pasadas: metal base → volumen (gradiente de luz/sombra) → filos
// pulidos (reflejos especulares finos).

/** Capa Z=1: sombra de contacto, asas, corona y cuerpo de la caja. En la trasera se refleja. */
export const CaseLayer = memo(function CaseLayer({ config, side = 'front' }: Props) {
  const uid = useId().replace(/:/g, '');
  const { style, material, finish } = config.case;
  const geo = CASE_GEOMETRY[style];
  const fill = `url(#metal-${material}-${finish})`;
  const bodyPath = geo.shape === 'octagon' ? roundedOctagonPath(geo.caseR, 0.5) : circlePath(geo.caseR);

  return (
    <g transform={side === 'back' ? mirrorX : undefined}>
      {/* Sombra de contacto sobre la correa */}
      <circle cx={CX} cy={CY + 4} r={geo.caseR + 16} fill="url(#contact-shadow)" opacity={0.55} />

      <g filter="url(#case-shadow)">
        {geo.shape === 'octagon' ? <IntegratedShoulders geo={geo} fill={fill} /> : <Lugs geo={geo} fill={fill} material={material} uid={uid} />}
        <Crown geo={geo} material={material} />
        {geo.crownGuards && <CrownGuards geo={geo} fill={fill} />}
        {geo.shape === 'octagon' && <Ears geo={geo} fill={fill} />}
        <path d={bodyPath} fill={fill} />
      </g>

      {finish === 'brushed' && <path d={bodyPath} fill="url(#brush-lines)" opacity={0.7} />}
      <path d={bodyPath} fill="url(#case-volume)" />
      {/* Arista exterior: luz arriba-izquierda, sombra abajo-derecha */}
      <path d={bodyPath} fill="none" stroke="url(#rim-light)" strokeWidth={2.2} />
      <path d={bodyPath} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={0.8} />

      {/* Chaflán pulido interior y surco de asiento del bisel */}
      {geo.shape === 'octagon' ? (
        <path d={roundedOctagonPath(geo.caseR - 4, 0.5)} fill="none" stroke="#fff" strokeOpacity={finish === 'polished' ? 0.6 : 0.45} strokeWidth={1.4} />
      ) : (
        <circle cx={CX} cy={CY} r={geo.caseR - 2.6} fill="none" stroke="#fff" strokeOpacity={finish === 'polished' ? 0.6 : 0.42} strokeWidth={1.3} />
      )}
      <circle cx={CX} cy={CY} r={BEZEL_OUTER + 1.6} fill="none" stroke="#000" strokeOpacity={0.45} strokeWidth={2.4} filter="url(#blur-2)" />
    </g>
  );
});

/** Puntos clave de la asa superior izquierda; el resto se obtiene por simetría. */
function lugShape(geo: CaseGeometry) {
  const R = geo.caseR;
  const xIn = CX - geo.lugWidth / 2;
  const xOut = xIn - geo.lugThickness;
  const tip = geo.lugTipY;
  const onCircle = (x: number, inset: number) => CY - Math.sqrt(R * R - (CX - x) ** 2) + inset;
  // La raíz exterior se abre hacia fuera para fundirse con el flanco de la caja.
  const rootOutX = xOut - geo.lugThickness * 1.15;
  const rootOut = { x: rootOutX, y: onCircle(rootOutX, 4) };
  const rootInY = onCircle(xIn, 6);
  const outerCurve = `M ${rootOut.x} ${rootOut.y} C ${rootOut.x + 4} ${rootOut.y - 22}, ${xOut - 1.5} ${tip + 40}, ${xOut} ${tip + 11} Q ${xOut + 0.6} ${tip} ${xOut + 9} ${tip}`;
  const outline = `${outerCurve} L ${xIn - 3} ${tip} Q ${xIn} ${tip} ${xIn} ${tip + 4} L ${xIn} ${rootInY} L ${CX - R * 0.45} ${CY - R * 0.55} Z`;
  return { xIn, xOut, tip, rootInY, outerCurve, outline };
}

function Lugs({ geo, fill, material, uid }: { geo: CaseGeometry; fill: string; material: MaterialId; uid: string }) {
  const s = lugShape(geo);
  const clip = `lug-${uid}`;
  const bevel = Math.max(3.5, geo.lugThickness * 0.32);
  const lug = (
    <g>
      <path d={s.outline} fill={fill} />
      <path d={s.outline} fill="url(#lug-volume)" />
      {/* Bisel pulido que sigue la curva exterior (sólo la mitad interior del trazo queda visible) */}
      <g clipPath={`url(#${clip})`}>
        <path d={s.outerCurve} fill="none" stroke={`url(#metal-${material}-polished)`} strokeWidth={bevel * 2} />
        <path d={s.outerCurve} fill="none" stroke="#fff" strokeOpacity={0.75} strokeWidth={0.9} transform={`translate(${bevel} 1)`} />
        <path d={s.outerCurve} fill="none" stroke="#000" strokeOpacity={0.25} strokeWidth={0.8} transform={`translate(${bevel + 0.9} 1)`} />
        {/* Sombra propia en el canto interior, junto a la correa */}
        <rect x={s.xIn - 2.4} y={s.tip} width={2.4} height={s.rootInY - s.tip} fill="#000" opacity={0.22} />
        {/* Cara frontal de la punta */}
        <rect x={s.xOut} y={s.tip} width={s.xIn - s.xOut} height={1.6} fill="#000" opacity={0.3} />
      </g>
      <path d={s.outline} fill="none" stroke="#000" strokeOpacity={0.32} strokeWidth={0.7} />
      {geo.drilledLugs && (
        <g>
          <circle cx={s.xIn - geo.lugThickness / 2} cy={s.tip + 12} r={2.3} fill="#1e1b18" />
          <path d={`M ${s.xIn - geo.lugThickness / 2 - 2} ${s.tip + 13.4} a 2.3 2.3 0 0 0 4 0`} fill="none" stroke="#fff" strokeOpacity={0.5} strokeWidth={0.6} />
        </g>
      )}
    </g>
  );
  return (
    <g>
      <clipPath id={clip}>
        <path d={s.outline} />
      </clipPath>
      {lug}
      <g transform={mirrorX}>{lug}</g>
      <g transform={mirrorY}>{lug}</g>
      <g transform={`${mirrorX} ${mirrorY}`}>{lug}</g>
    </g>
  );
}

/** Hombros del brazalete integrado (estilo Nautilus). */
function IntegratedShoulders({ geo, fill }: { geo: CaseGeometry; fill: string }) {
  // Hombro corto que sale del plano superior del octógono hacia el brazalete
  const half = geo.lugWidth / 2 + 3;
  const d = `M ${CX - 62} ${CY - 98} C ${CX - 60} ${CY - 112}, ${CX - half - 2} ${geo.lugTipY + 8}, ${CX - half} ${geo.lugTipY} L ${CX + half} ${geo.lugTipY} C ${CX + half + 2} ${geo.lugTipY + 8}, ${CX + 60} ${CY - 112}, ${CX + 62} ${CY - 98} Z`;
  const shoulder = (
    <g>
      <path d={d} fill={fill} />
      <path d={d} fill="url(#lug-volume)" opacity={0.8} />
      <path d={d} fill="none" stroke="#000" strokeOpacity={0.3} strokeWidth={0.8} />
      <path d={`M ${CX - half + 2} ${geo.lugTipY + 1.5} L ${CX + half - 2} ${geo.lugTipY + 1.5}`} stroke="#fff" strokeOpacity={0.6} strokeWidth={1} />
    </g>
  );
  return (
    <g>
      {shoulder}
      <g transform={mirrorY}>{shoulder}</g>
    </g>
  );
}

function Ears({ geo, fill }: { geo: CaseGeometry; fill: string }) {
  const x = CX + geo.caseR - 14;
  const ear = (
    <g>
      <rect x={x} y={CY - 26} width={24} height={52} rx={9} fill={fill} />
      <rect x={x} y={CY - 26} width={24} height={52} rx={9} fill="url(#lug-volume)" />
      <rect x={x + 15} y={CY - 20} width={2} height={40} rx={1} fill="#fff" opacity={0.5} />
      <rect x={x} y={CY - 26} width={24} height={52} rx={9} fill="none" stroke="#000" strokeOpacity={0.3} strokeWidth={0.8} />
    </g>
  );
  return (
    <g>
      {ear}
      <g transform={mirrorX}>{ear}</g>
    </g>
  );
}

function Crown({ geo, material }: { geo: CaseGeometry; material: MaterialId }) {
  const x = CX + geo.caseR + (geo.shape === 'octagon' ? 8 : -3);
  const { w, h, onion } = geo.crown;
  const cyl = `url(#cyl-${material})`;
  return (
    <g>
      {/* Tubo */}
      <rect x={x - 4} y={CY - h * 0.26} width={8} height={h * 0.52} fill={cyl} />
      <rect x={x + 2} y={CY - h * 0.26} width={1.2} height={h * 0.52} fill="#000" opacity={0.35} />
      {onion ? (
        <g>
          {[0, 1, 2].map((i) => (
            <ellipse key={i} cx={x + 4 + i * (w / 3)} cy={CY} rx={w / 5} ry={h / 2 - Math.abs(i - 1) * 3} fill={cyl} stroke="#000" strokeOpacity={0.35} strokeWidth={0.7} />
          ))}
          <ellipse cx={x + w + 1} cy={CY} rx={2} ry={h / 2 - 5} fill={cyl} stroke="#000" strokeOpacity={0.3} strokeWidth={0.6} />
        </g>
      ) : (
        <g>
          <rect x={x + 2} y={CY - h / 2} width={w} height={h} rx={3.2} fill={cyl} />
          {Array.from({ length: 11 }, (_, i) => {
            const y = CY - h / 2 + 2.5 + i * ((h - 5) / 10);
            return (
              <g key={i}>
                <line x1={x + 3.5} x2={x + w} y1={y} y2={y} stroke="#000" strokeOpacity={0.32} strokeWidth={0.8} />
                <line x1={x + 3.5} x2={x + w} y1={y + 0.9} y2={y + 0.9} stroke="#fff" strokeOpacity={0.18} strokeWidth={0.5} />
              </g>
            );
          })}
          {/* Cara frontal de la corona */}
          <rect x={x + w - 0.5} y={CY - h / 2 + 1.5} width={3} height={h - 3} rx={1.4} fill={cyl} stroke="#000" strokeOpacity={0.3} strokeWidth={0.6} />
          <rect x={x + 2} y={CY - h / 2} width={w} height={h} rx={3.2} fill="none" stroke="#000" strokeOpacity={0.4} strokeWidth={0.8} />
        </g>
      )}
    </g>
  );
}

function CrownGuards({ geo, fill }: { geo: CaseGeometry; fill: string }) {
  const x = CX + geo.caseR - 12;
  const d = `M ${x} ${CY - 48} Q ${x + 23} ${CY - 41} ${x + 21} ${CY - 17} L ${x} ${CY - 17} Z`;
  const guard = (
    <g>
      <path d={d} fill={fill} />
      <path d={d} fill="url(#lug-volume)" />
      <path d={`M ${x + 6} ${CY - 45} Q ${x + 19} ${CY - 39} ${x + 18} ${CY - 20}`} fill="none" stroke="#fff" strokeOpacity={0.6} strokeWidth={0.9} />
      <path d={d} fill="none" stroke="#000" strokeOpacity={0.3} strokeWidth={0.8} />
    </g>
  );
  return (
    <g>
      {guard}
      <g transform={mirrorY}>{guard}</g>
    </g>
  );
}
