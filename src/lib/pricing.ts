import {
  BASE_PRICE,
  BEZELS,
  CASEBACKS,
  CASE_STYLES,
  DIAL_COLORS,
  DIAL_TEXTURES,
  ENGRAVING_PRICE,
  FINISHES,
  HAND_FINISHES,
  HAND_STYLES,
  INDEX_STYLES,
  MATERIALS,
  ROTORS,
  ROTOR_FINISHES,
  STRAP_TYPES,
  byId,
  resolveStrapColor,
} from '../data/catalog';
import type { StepId, WatchConfig } from '../types/watch';

export interface QuoteLine {
  step: StepId | 'base';
  label: string;
  value: string;
  price: number;
}

export interface Quote {
  lines: QuoteLine[];
  total: number;
}

/** Desglose de precio puro y determinista a partir de la configuración. */
export function computeQuote(c: WatchConfig): Quote {
  const material = byId(MATERIALS, c.case.material);
  const lines: QuoteLine[] = [
    { step: 'base', label: 'Base', value: 'Automático NH35 · zafiro', price: BASE_PRICE },
    { step: 'case', label: 'Caja', value: byId(CASE_STYLES, c.case.style).name, price: byId(CASE_STYLES, c.case.style).price },
    { step: 'case', label: 'Material', value: material.name, price: material.price },
    { step: 'case', label: 'Acabado', value: byId(FINISHES, c.case.finish).name, price: byId(FINISHES, c.case.finish).price },
    { step: 'dial', label: 'Esfera', value: `${byId(DIAL_COLORS, c.dial.color).name} · ${byId(DIAL_TEXTURES, c.dial.texture).name}`, price: byId(DIAL_COLORS, c.dial.color).price + byId(DIAL_TEXTURES, c.dial.texture).price },
    { step: 'dial', label: 'Índices', value: byId(INDEX_STYLES, c.dial.indices).name, price: byId(INDEX_STYLES, c.dial.indices).price },
    { step: 'hands', label: 'Agujas', value: `${byId(HAND_STYLES, c.hands.style).name} · ${byId(HAND_FINISHES, c.hands.finish).name}`, price: byId(HAND_STYLES, c.hands.style).price + byId(HAND_FINISHES, c.hands.finish).price },
    { step: 'bezel', label: 'Bisel', value: byId(BEZELS, c.bezel.insert).name, price: byId(BEZELS, c.bezel.insert).price },
    { step: 'caseback', label: 'Fondo', value: byId(CASEBACKS, c.caseback.type).name, price: byId(CASEBACKS, c.caseback.type).price },
  ];

  if (c.caseback.type === 'sapphire') {
    const rotor = byId(ROTORS, c.caseback.rotor);
    const finish = byId(ROTOR_FINISHES, c.caseback.rotorFinish);
    lines.push({ step: 'caseback', label: 'Rotor', value: `${rotor.name} · ${finish.name}`, price: rotor.price + finish.price });
  } else if (c.caseback.engraving.trim()) {
    lines.push({ step: 'caseback', label: 'Grabado', value: `“${c.caseback.engraving.trim()}”`, price: ENGRAVING_PRICE });
  }

  const strap = byId(STRAP_TYPES, c.strap.type);
  const strapColor = resolveStrapColor(c.strap.type, c.strap.color);
  // Los brazaletes metálicos se fabrican en el material de la caja: oro y titanio encarecen.
  const metalSurcharge = strap.family === 'metal' ? Math.round(material.price * 0.6) : 0;
  lines.push({
    step: 'strap',
    label: 'Correa',
    value: strapColor ? `${strap.name} · ${strapColor.name}` : `${strap.name} · ${material.name}`,
    price: strap.price + metalSurcharge,
  });

  return { lines, total: lines.reduce((sum, l) => sum + l.price, 0) };
}
