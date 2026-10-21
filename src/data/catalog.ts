import type {
  BezelId,
  CaseStyleId,
  CasebackId,
  CatalogOption,
  DialColorId,
  DialTextureId,
  FinishId,
  HandFinishId,
  HandStyleId,
  IndexStyleId,
  MaterialId,
  RotorFinishId,
  RotorId,
  StrapTypeId,
} from '../types/watch';

/** Precio base: movimiento automático NH35, cristal de zafiro y montaje. */
export const BASE_PRICE = 390;
export const ENGRAVING_PRICE = 35;
export const CURRENCY = 'EUR';

// ───────────────────────── Caja ─────────────────────────

export const CASE_STYLES: CatalogOption<CaseStyleId>[] = [
  { id: 'submariner', name: 'Submariner', description: 'Buceo 40 mm · protectores de corona', price: 0 },
  { id: 'nautilus', name: 'Nautilus', description: 'Octogonal integrada · orejas laterales', price: 140 },
  { id: 'explorer', name: 'Explorer', description: 'Vestir-deportivo 39 mm · líneas puras', price: 40 },
  { id: 'field', name: 'Field', description: 'Militar 38 mm · asas largas perforadas', price: 20 },
];

export interface MetalPalette {
  /** highlight → mid → shadow → deep */
  stops: [string, string, string, string];
  swatch: string;
}

export const MATERIALS: (CatalogOption<MaterialId> & MetalPalette)[] = [
  { id: 'steel', name: 'Acero 316L', price: 0, stops: ['#fbfbfc', '#cdd0d4', '#8e939a', '#5a5f66'], swatch: 'linear-gradient(135deg,#f6f7f8,#a9adb3 55%,#6b7076)' },
  { id: 'gold', name: 'Oro PVD', price: 180, stops: ['#fff4c9', '#e8c770', '#b98b2f', '#7a5717'], swatch: 'linear-gradient(135deg,#fff1c0,#d9b257 55%,#94691f)' },
  { id: 'titanium', name: 'Titanio G2', price: 240, stops: ['#e3e3df', '#a9a8a3', '#77766f', '#4d4c47'], swatch: 'linear-gradient(135deg,#dcdcd7,#93928c 55%,#5c5b55)' },
  { id: 'bronze', name: 'Bronce CuSn8', price: 150, stops: ['#f6d3a8', '#c58a56', '#8b5631', '#5a3219'], swatch: 'linear-gradient(135deg,#f2cb9b,#b97a45 55%,#70411f)' },
];

export const FINISHES: CatalogOption<FinishId>[] = [
  { id: 'polished', name: 'Pulido espejo', price: 30 },
  { id: 'brushed', name: 'Cepillado satinado', price: 0 },
];

// ───────────────────────── Esfera ─────────────────────────

export interface DialColor extends CatalogOption<DialColorId> {
  base: string;
  /** Color de la tinta impresa (textos, minutero). */
  ink: string;
  light: boolean;
}

export const DIAL_COLORS: DialColor[] = [
  { id: 'black', name: 'Negro', price: 0, base: '#151617', ink: '#f2f0ea', light: false },
  { id: 'tiffany', name: 'Azul Tiffany', price: 60, base: '#7fd2c8', ink: '#16302d', light: true },
  { id: 'olive', name: 'Verde oliva', price: 30, base: '#565f3b', ink: '#efeadb', light: false },
  { id: 'navy', name: 'Azul marino', price: 20, base: '#1b2945', ink: '#eef0f4', light: false },
  { id: 'white', name: 'Blanco ópalo', price: 20, base: '#efebe3', ink: '#1b1b1c', light: true },
  { id: 'salmon', name: 'Salmón', price: 50, base: '#e6a68b', ink: '#3b1f14', light: true },
  { id: 'meteor', name: 'Gris meteorito', price: 40, base: '#55595f', ink: '#f1f1ef', light: false },
];

export const DIAL_TEXTURES: CatalogOption<DialTextureId>[] = [
  { id: 'matte', name: 'Mate', description: 'Lacado granulado', price: 0 },
  { id: 'sunburst', name: 'Sunburst', description: 'Rayos solares', price: 45 },
  { id: 'tapisserie', name: 'Tapisserie', description: 'Guilloché en cuadrícula', price: 85 },
  { id: 'fume', name: 'Degradado fumé', description: 'Oscurece hacia el borde', price: 55 },
];

export const INDEX_STYLES: CatalogOption<IndexStyleId>[] = [
  { id: 'baton', name: 'Bastones', description: 'Aplicados con lume', price: 0 },
  { id: 'arabic', name: 'Arábigos', description: 'Números aplicados', price: 35 },
  { id: 'roman', name: 'Romanos', description: 'Impresos radiales', price: 25 },
];

// ───────────────────────── Agujas ─────────────────────────

export const HAND_STYLES: CatalogOption<HandStyleId>[] = [
  { id: 'mercedes', name: 'Mercedes', price: 0 },
  { id: 'dauphine', name: 'Dauphine', price: 25 },
  { id: 'baton', name: 'Baton', price: 0 },
  { id: 'snowflake', name: 'Snowflake', price: 30 },
];

export interface HandFinish extends CatalogOption<HandFinishId> {
  gradient: string;
  lume: string;
  swatch: string;
}

export const HAND_FINISHES: HandFinish[] = [
  { id: 'steel', name: 'Acero pulido', description: 'Lume blanco C3', price: 0, gradient: 'metal-steel-polished', lume: '#f1f5ea', swatch: 'linear-gradient(135deg,#f6f7f8,#9a9ea4)' },
  { id: 'gold', name: 'Oro', description: 'Lume blanco C3', price: 40, gradient: 'metal-gold-polished', lume: '#f1f5ea', swatch: 'linear-gradient(135deg,#fff1c0,#b98b2f)' },
  { id: 'aged', name: 'Lume envejecido', description: 'Dorado mate · lume vintage', price: 35, gradient: 'metal-gilt', lume: '#e6cf98', swatch: 'linear-gradient(135deg,#ead6a4,#a7854a)' },
];

// ───────────────────────── Bisel ─────────────────────────

export const BEZELS: (CatalogOption<BezelId> & { swatch: string })[] = [
  { id: 'ceramic-black', name: 'Cerámica negra', description: 'Escala de buceo 60 min', price: 90, swatch: 'conic-gradient(#0d0d0e 0 100%)' },
  { id: 'ceramic-blue', name: 'Cerámica azul', description: 'Escala de buceo 60 min', price: 90, swatch: 'conic-gradient(#14295a 0 100%)' },
  { id: 'pepsi', name: 'Aluminio Pepsi', description: 'GMT 24 h rojo / azul', price: 60, swatch: 'linear-gradient(180deg,#b3262e 50%,#1c3a7a 50%)' },
  { id: 'polished', name: 'Liso pulido', description: 'Metal de la caja', price: 0, swatch: 'linear-gradient(135deg,#f4f5f6,#8e939a)' },
  { id: 'tachymeter', name: 'Taquímetro', description: 'Escala de velocidad', price: 70, swatch: 'conic-gradient(#1b1b1c 0 100%)' },
];

// ───────────────────────── Fondo / movimiento ─────────────────────────

export const CASEBACKS: CatalogOption<CasebackId>[] = [
  { id: 'solid', name: 'Fondo ciego', description: 'Acero grabado, roscado', price: 0 },
  { id: 'sapphire', name: 'Fondo visto', description: 'Zafiro · calibre NH35 visible', price: 70 },
];

export const ROTORS: CatalogOption<RotorId>[] = [
  { id: 'classic', name: 'Clásico', description: 'Sólido con grabado', price: 0 },
  { id: 'skeleton', name: 'Esqueleto', description: 'Calado', price: 65 },
  { id: 'geneva', name: 'Côtes de Genève', description: 'Decoración en franjas', price: 45 },
];

export const ROTOR_FINISHES: (CatalogOption<RotorFinishId> & { gradient: string; swatch: string })[] = [
  { id: 'steel', name: 'Rodiado', price: 0, gradient: 'metal-steel-brushed', swatch: 'linear-gradient(135deg,#f0f1f2,#9a9ea4)' },
  { id: 'gold', name: 'Dorado', price: 40, gradient: 'metal-gold-brushed', swatch: 'linear-gradient(135deg,#fff1c0,#b98b2f)' },
  { id: 'black', name: 'Negro DLC', price: 50, gradient: 'metal-dlc', swatch: 'linear-gradient(135deg,#4a4b4e,#101011)' },
  { id: 'blue', name: 'Azul térmico', price: 50, gradient: 'metal-blued', swatch: 'linear-gradient(135deg,#5d7fd6,#1a2a6b)' },
];

// ───────────────────────── Correa ─────────────────────────

export type StrapFamily = 'metal' | 'leather' | 'rubber' | 'nato';

export const STRAP_TYPES: (CatalogOption<StrapTypeId> & { family: StrapFamily })[] = [
  { id: 'oyster', name: 'Oyster', description: 'Brazalete de 3 eslabones', price: 120, family: 'metal' },
  { id: 'jubilee', name: 'Jubilee', description: 'Brazalete de 5 eslabones', price: 150, family: 'metal' },
  { id: 'president', name: 'President', description: 'Eslabones semicirculares', price: 170, family: 'metal' },
  { id: 'leather', name: 'Piel genuina', description: 'Becerro con costura', price: 45, family: 'leather' },
  { id: 'rubber', name: 'Caucho FKM', description: 'Hipoalergénico', price: 35, family: 'rubber' },
  { id: 'nato', name: 'NATO', description: 'Nailon tejido', price: 20, family: 'nato' },
];

export interface StrapColor {
  id: string;
  name: string;
  /** Uno o varios colores; en NATO son las franjas de izquierda a derecha. */
  colors: string[];
}

export const STRAP_COLORS: Record<Exclude<StrapFamily, 'metal'>, StrapColor[]> = {
  leather: [
    { id: 'cognac', name: 'Coñac', colors: ['#9a5a2a'] },
    { id: 'chocolate', name: 'Chocolate', colors: ['#4a2c1b'] },
    { id: 'black', name: 'Negro', colors: ['#1c1b1b'] },
    { id: 'navy', name: 'Azul noche', colors: ['#1f2a44'] },
    { id: 'forest', name: 'Verde bosque', colors: ['#2f3d2c'] },
    { id: 'sand', name: 'Arena', colors: ['#b89a72'] },
  ],
  rubber: [
    { id: 'black', name: 'Negro', colors: ['#1a1a1b'] },
    { id: 'navy', name: 'Azul', colors: ['#1d2f5c'] },
    { id: 'orange', name: 'Naranja', colors: ['#e0612a'] },
    { id: 'white', name: 'Blanco', colors: ['#ecebe7'] },
    { id: 'olive', name: 'Oliva', colors: ['#4c5233'] },
  ],
  nato: [
    { id: 'regiment', name: 'Regimental', colors: ['#1d2a44', '#1d2a44', '#7b1f24', '#1d2a44', '#1d2a44'] },
    { id: 'bond', name: 'Gris marino', colors: ['#2a2c30', '#7d8187', '#2a2c30', '#7d8187', '#2a2c30'] },
    { id: 'olive', name: 'Oliva', colors: ['#4b5232'] },
    { id: 'black', name: 'Negro', colors: ['#18181a'] },
    { id: 'sand', name: 'Arena', colors: ['#b59e78', '#b59e78', '#ece4d2', '#b59e78', '#b59e78'] },
  ],
};

export function strapFamily(type: StrapTypeId): StrapFamily {
  return STRAP_TYPES.find((s) => s.id === type)!.family;
}

/** Resuelve el color de la correa, cayendo en el primero de la familia si no aplica. */
export function resolveStrapColor(type: StrapTypeId, colorId: string): StrapColor | null {
  const family = strapFamily(type);
  if (family === 'metal') return null;
  const list = STRAP_COLORS[family];
  return list.find((c) => c.id === colorId) ?? list[0];
}

export function byId<T extends { id: string }>(list: readonly T[], id: string): T {
  return list.find((o) => o.id === id) ?? list[0];
}
