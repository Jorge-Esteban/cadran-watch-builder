import type { ComponentType } from 'react';
import type { StepId } from '../../../types/watch';
import { BezelPanel } from './BezelPanel';
import { CasePanel } from './CasePanel';
import { CasebackPanel } from './CasebackPanel';
import { DialPanel } from './DialPanel';
import { HandsPanel } from './HandsPanel';
import { StrapPanel } from './StrapPanel';

/** Registro paso → panel. Añadir una categoría = un panel + una entrada aquí y en STEPS. */
export const PANELS: Record<StepId, ComponentType> = {
  case: CasePanel,
  dial: DialPanel,
  hands: HandsPanel,
  bezel: BezelPanel,
  caseback: CasebackPanel,
  strap: StrapPanel,
};
