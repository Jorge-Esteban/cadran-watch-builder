import type { StepId, ViewSide, WatchConfig } from '../types/watch';

export interface StepDef {
  id: StepId;
  label: string;
  short: string;
  /** Cara del reloj que se muestra al entrar en el paso. */
  view: ViewSide;
  /** Encuadre de cámara del preview para este paso. */
  camera: { scale: number; y: number };
}

export const STEPS: StepDef[] = [
  { id: 'case', label: 'Caja', short: '01', view: 'front', camera: { scale: 1, y: 0 } },
  { id: 'dial', label: 'Esfera', short: '02', view: 'front', camera: { scale: 1.32, y: 0 } },
  { id: 'hands', label: 'Agujas', short: '03', view: 'front', camera: { scale: 1.45, y: 0 } },
  { id: 'bezel', label: 'Bisel', short: '04', view: 'front', camera: { scale: 1.18, y: 0 } },
  { id: 'caseback', label: 'Fondo', short: '05', view: 'back', camera: { scale: 1.12, y: 0 } },
  { id: 'strap', label: 'Correa', short: '06', view: 'front', camera: { scale: 0.86, y: 0 } },
];

export const DEFAULT_CONFIG: WatchConfig = {
  case: { style: 'submariner', material: 'steel', finish: 'brushed' },
  dial: { color: 'black', texture: 'sunburst', indices: 'baton' },
  hands: { style: 'mercedes', finish: 'steel' },
  bezel: { insert: 'ceramic-black' },
  caseback: { type: 'sapphire', rotor: 'classic', rotorFinish: 'steel', engraving: '' },
  strap: { type: 'oyster', color: 'cognac' },
};
