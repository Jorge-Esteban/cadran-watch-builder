import { CURRENCY } from '../data/catalog';

const fmt = new Intl.NumberFormat('es-ES', { style: 'currency', currency: CURRENCY, maximumFractionDigits: 0 });

export const formatPrice = (value: number) => fmt.format(value);
export const formatDelta = (value: number) => (value === 0 ? 'Incluido' : `+${fmt.format(value)}`);
