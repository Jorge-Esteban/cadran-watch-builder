import type { CaseStyleId } from '../types/watch';

// Sistema de coordenadas compartido por todas las capas SVG: viewBox 400×600 con
// el centro del reloj en (CX, CY). Todas las capas usan estas constantes para
// encajar entre sí sin offsets mágicos.

export const VIEW_W = 400;
export const VIEW_H = 600;
export const CX = 200;
export const CY = 300;

export const DIAL_R = 90;
export const BEZEL_INNER = 93;
export const BEZEL_OUTER = 113;

export interface CaseGeometry {
  shape: 'round' | 'octagon';
  caseR: number;
  /** Distancia entre asas = ancho de la correa en el enganche. */
  lugWidth: number;
  lugThickness: number;
  /** Y del extremo superior de las asas (las inferiores son simétricas). */
  lugTipY: number;
  crown: { w: number; h: number; onion: boolean };
  crownGuards: boolean;
  drilledLugs: boolean;
  coinEdge: boolean;
}

export const CASE_GEOMETRY: Record<CaseStyleId, CaseGeometry> = {
  submariner: { shape: 'round', caseR: 118, lugWidth: 80, lugThickness: 18, lugTipY: CY - 152, crown: { w: 14, h: 28, onion: false }, crownGuards: true, drilledLugs: false, coinEdge: true },
  nautilus: { shape: 'octagon', caseR: 120, lugWidth: 96, lugThickness: 0, lugTipY: CY - 132, crown: { w: 12, h: 24, onion: false }, crownGuards: false, drilledLugs: false, coinEdge: false },
  explorer: { shape: 'round', caseR: 116, lugWidth: 78, lugThickness: 15, lugTipY: CY - 150, crown: { w: 13, h: 26, onion: false }, crownGuards: false, drilledLugs: false, coinEdge: false },
  field: { shape: 'round', caseR: 116, lugWidth: 76, lugThickness: 13, lugTipY: CY - 162, crown: { w: 17, h: 30, onion: true }, crownGuards: false, drilledLugs: true, coinEdge: false },
};

/** Punto polar con 0° en las 12 y sentido horario. */
export function polar(r: number, deg: number, cx = CX, cy = CY) {
  const a = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

export function circlePath(r: number, cx = CX, cy = CY) {
  return `M ${cx - r} ${cy} a ${r} ${r} 0 1 0 ${r * 2} 0 a ${r} ${r} 0 1 0 ${-r * 2} 0 Z`;
}

/** Anillo (usar con fillRule="evenodd"). */
export function ringPath(rOuter: number, rInner: number, cx = CX, cy = CY) {
  return `${circlePath(rOuter, cx, cy)} ${circlePath(rInner, cx, cy)}`;
}

/** Sector anular entre dos ángulos (0° = 12 h). */
export function arcSegment(rOuter: number, rInner: number, from: number, to: number) {
  const large = to - from > 180 ? 1 : 0;
  const a = polar(rOuter, from);
  const b = polar(rOuter, to);
  const c = polar(rInner, to);
  const d = polar(rInner, from);
  return `M ${a.x} ${a.y} A ${rOuter} ${rOuter} 0 ${large} 1 ${b.x} ${b.y} L ${c.x} ${c.y} A ${rInner} ${rInner} 0 ${large} 0 ${d.x} ${d.y} Z`;
}

/** Octógono de esquinas redondeadas inscrito en un círculo de radio r. */
export function roundedOctagonPath(r: number, corner = 0.35, cx = CX, cy = CY) {
  const pts = Array.from({ length: 8 }, (_, i) => polar(r, 22.5 + i * 45, cx, cy));
  let d = '';
  pts.forEach((p, i) => {
    const prev = pts[(i + 7) % 8];
    const next = pts[(i + 1) % 8];
    const a = { x: p.x + (prev.x - p.x) * corner * 0.5, y: p.y + (prev.y - p.y) * corner * 0.5 };
    const b = { x: p.x + (next.x - p.x) * corner * 0.5, y: p.y + (next.y - p.y) * corner * 0.5 };
    d += `${i === 0 ? 'M' : 'L'} ${a.x} ${a.y} Q ${p.x} ${p.y} ${b.x} ${b.y} `;
  });
  return `${d}Z`;
}

/** Transformación que refleja un grupo respecto al eje vertical o horizontal del reloj. */
export const mirrorX = `translate(${CX * 2} 0) scale(-1 1)`;
export const mirrorY = `translate(0 ${CY * 2}) scale(1 -1)`;
