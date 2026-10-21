// Modelo de dominio del configurador. Cada sección de WatchConfig corresponde a
// un paso del configurador y a una o varias capas del render SVG.

export type CaseStyleId = 'submariner' | 'nautilus' | 'explorer' | 'field';
export type MaterialId = 'steel' | 'gold' | 'titanium' | 'bronze';
export type FinishId = 'polished' | 'brushed';

export type DialColorId = 'black' | 'tiffany' | 'olive' | 'navy' | 'white' | 'salmon' | 'meteor';
export type DialTextureId = 'matte' | 'sunburst' | 'tapisserie' | 'fume';
export type IndexStyleId = 'baton' | 'arabic' | 'roman';

export type HandStyleId = 'mercedes' | 'dauphine' | 'baton' | 'snowflake';
export type HandFinishId = 'steel' | 'gold' | 'aged';

export type BezelId = 'ceramic-black' | 'ceramic-blue' | 'pepsi' | 'polished' | 'tachymeter';

export type CasebackId = 'solid' | 'sapphire';
export type RotorId = 'classic' | 'skeleton' | 'geneva';
export type RotorFinishId = 'steel' | 'gold' | 'black' | 'blue';

export type StrapTypeId = 'oyster' | 'jubilee' | 'president' | 'leather' | 'rubber' | 'nato';

export interface WatchConfig {
  case: { style: CaseStyleId; material: MaterialId; finish: FinishId };
  dial: { color: DialColorId; texture: DialTextureId; indices: IndexStyleId };
  hands: { style: HandStyleId; finish: HandFinishId };
  bezel: { insert: BezelId };
  caseback: { type: CasebackId; rotor: RotorId; rotorFinish: RotorFinishId; engraving: string };
  strap: { type: StrapTypeId; color: string };
}

export type StepId = keyof WatchConfig;
export type ViewSide = 'front' | 'back';

/** Opción genérica de catálogo con su sobreprecio sobre la base. */
export interface CatalogOption<T extends string = string> {
  id: T;
  name: string;
  description?: string;
  price: number;
}

export interface SavedDesign {
  id: string;
  name: string;
  createdAt: number;
  config: WatchConfig;
  total: number;
}
