import { memo } from 'react';
import { MATERIALS } from '../../data/catalog';

// Gradientes, patrones y filtros compartidos por todos los SVG de la página.
// Se montan una sola vez (en un <svg> oculto) y las capas los referencian por id.

const extraMetals: { id: string; stops: [string, string, string, string] }[] = [
  { id: 'gilt', stops: ['#f2e2b6', '#cfae6c', '#9c7a3e', '#6c5126'] },
  { id: 'dlc', stops: ['#5a5b5f', '#2c2d30', '#151517', '#0a0a0b'] },
  { id: 'blued', stops: ['#8aa6f0', '#3f60c4', '#223b8c', '#121f52'] },
  { id: 'brass', stops: ['#f6e2a4', '#d3ae5a', '#9d7731', '#68491a'] },
];

/** Cilindro con eje horizontal (corona, barras): luz arriba, sombra abajo. */
function CylinderGradient({ id, stops: [hi, mid, sh, deep] }: { id: string; stops: string[] }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor={sh} />
      <stop offset="0.22" stopColor={hi} />
      <stop offset="0.4" stopColor={mid} />
      <stop offset="0.75" stopColor={sh} />
      <stop offset="1" stopColor={deep} />
    </linearGradient>
  );
}

function PolishedGradient({ id, stops: [hi, mid, sh, deep] }: { id: string; stops: string[] }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={hi} />
      <stop offset="0.22" stopColor={mid} />
      <stop offset="0.42" stopColor={deep} />
      <stop offset="0.52" stopColor={sh} />
      <stop offset="0.62" stopColor={hi} />
      <stop offset="0.8" stopColor={mid} />
      <stop offset="1" stopColor={sh} />
    </linearGradient>
  );
}

function BrushedGradient({ id, stops: [hi, mid, sh] }: { id: string; stops: string[] }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stopColor={hi} />
      <stop offset="0.35" stopColor={mid} />
      <stop offset="0.7" stopColor={sh} />
      <stop offset="1" stopColor={mid} />
    </linearGradient>
  );
}

/** Variante horizontal (sombreado cilíndrico) para eslabones de brazalete. */
function LinkGradient({ id, stops: [hi, mid, sh, deep] }: { id: string; stops: string[] }) {
  return (
    <linearGradient id={id} x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor={deep} />
      <stop offset="0.18" stopColor={sh} />
      <stop offset="0.45" stopColor={hi} />
      <stop offset="0.7" stopColor={mid} />
      <stop offset="1" stopColor={deep} />
    </linearGradient>
  );
}

export const WatchSvgDefs = memo(function WatchSvgDefs() {
  const metals = [...MATERIALS.map((m) => ({ id: m.id, stops: m.stops })), ...extraMetals];
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden focusable="false">
      <defs>
        {metals.map((m) => (
          <g key={m.id}>
            <PolishedGradient id={`metal-${m.id}-polished`} stops={m.stops} />
            <BrushedGradient id={`metal-${m.id}-brushed`} stops={m.stops} />
            <LinkGradient id={`link-${m.id}`} stops={m.stops} />
            <CylinderGradient id={`cyl-${m.id}`} stops={m.stops} />
          </g>
        ))}

        {/* Iluminación de volumen: luz principal arriba-izquierda */}
        <radialGradient id="case-volume" cx="0.36" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#fff" stopOpacity="0.38" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.78" stopColor="#000" stopOpacity="0.08" />
          <stop offset="1" stopColor="#000" stopOpacity="0.42" />
        </radialGradient>
        <linearGradient id="rim-light" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
          <stop offset="0.42" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.6" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="lug-volume" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.3" />
          <stop offset="0.35" stopColor="#fff" stopOpacity="0.22" />
          <stop offset="0.7" stopColor="#fff" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.28" />
        </linearGradient>
        <radialGradient id="contact-shadow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.72" stopColor="#000" stopOpacity="0.5" />
          <stop offset="1" stopColor="#000" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="screw-blue" cx="0.35" cy="0.3" r="0.8">
          <stop offset="0" stopColor="#9fb6ff" />
          <stop offset="0.45" stopColor="#3150b8" />
          <stop offset="1" stopColor="#101c55" />
        </radialGradient>
        <radialGradient id="ruby" cx="0.35" cy="0.3" r="0.75">
          <stop offset="0" stopColor="#ff7d93" />
          <stop offset="0.5" stopColor="#c0142f" />
          <stop offset="1" stopColor="#5a0613" />
        </radialGradient>
        <filter id="blur-2">
          <feGaussianBlur stdDeviation="2" />
        </filter>
        <filter id="bridge-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="1.6" dy="2.2" stdDeviation="1.4" floodColor="#000" floodOpacity="0.5" />
        </filter>
        {/* Alias usados por acabados de rotor y agujas */}
        <PolishedGradient id="metal-gilt" stops={extraMetals[0].stops} />
        <BrushedGradient id="metal-dlc" stops={extraMetals[1].stops} />
        <BrushedGradient id="metal-blued" stops={extraMetals[2].stops} />

        {/* Satinado: finas líneas horizontales */}
        <pattern id="brush-lines" width="4" height="1.6" patternUnits="userSpaceOnUse">
          <rect width="4" height="0.6" fill="#fff" opacity="0.16" />
          <rect y="0.8" width="4" height="0.5" fill="#000" opacity="0.08" />
        </pattern>
        {/* Satinado circular para fondos */}
        <pattern id="brush-radial" width="400" height="600" patternUnits="userSpaceOnUse">
          {Array.from({ length: 60 }, (_, i) => (
            <circle key={i} cx="200" cy="300" r={4 + i * 2.1} fill="none" stroke={i % 2 ? '#000' : '#fff'} strokeOpacity={i % 2 ? 0.06 : 0.12} strokeWidth="0.8" />
          ))}
        </pattern>

        {/* Tapisserie: rejilla de surcos con bisel de luz */}
        <pattern id="tapisserie" width="4.6" height="4.6" patternUnits="userSpaceOnUse">
          <rect width="4.6" height="0.9" fill="#000" opacity="0.32" />
          <rect width="0.9" height="4.6" fill="#000" opacity="0.32" />
          <rect x="0.9" y="0.9" width="3.7" height="0.5" fill="#fff" opacity="0.18" />
          <rect x="0.9" y="0.9" width="0.5" height="3.7" fill="#fff" opacity="0.1" />
          <rect x="0.9" y="4.1" width="3.7" height="0.5" fill="#000" opacity="0.12" />
        </pattern>

        {/* Perlage de la platina del movimiento */}
        <pattern id="perlage" width="9" height="8" patternUnits="userSpaceOnUse">
          <circle cx="4.5" cy="4" r="4.4" fill="url(#perlage-dot)" />
          <circle cx="0" cy="0" r="4.4" fill="url(#perlage-dot)" />
          <circle cx="9" cy="0" r="4.4" fill="url(#perlage-dot)" />
          <circle cx="0" cy="8" r="4.4" fill="url(#perlage-dot)" />
          <circle cx="9" cy="8" r="4.4" fill="url(#perlage-dot)" />
        </pattern>
        <radialGradient id="perlage-dot">
          <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="0.6" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#000" stopOpacity="0.18" />
        </radialGradient>

        {/* Côtes de Genève */}
        <pattern id="geneva" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
          <rect width="10" height="10" fill="#000" opacity="0.08" />
          <rect width="5" height="10" fill="#fff" opacity="0.22" />
          <rect x="4.6" width="0.8" height="10" fill="#000" opacity="0.15" />
        </pattern>

        {/* Trama tejida de NATO */}
        <pattern id="weave" width="3" height="3" patternUnits="userSpaceOnUse">
          <rect width="3" height="1.2" fill="#fff" opacity="0.08" />
          <rect y="1.6" width="3" height="0.6" fill="#000" opacity="0.18" />
        </pattern>

        {/* Esfera: viñeta, fumé y luz de cristal */}
        <radialGradient id="dial-vignette" cx="0.5" cy="0.45" r="0.6">
          <stop offset="0.55" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.35" />
        </radialGradient>
        <radialGradient id="dial-fume" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.1" stopColor="#fff" stopOpacity="0.12" />
          <stop offset="0.55" stopColor="#000" stopOpacity="0.1" />
          <stop offset="1" stopColor="#000" stopOpacity="0.85" />
        </radialGradient>
        <radialGradient id="sunburst-glow" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#fff" stopOpacity="0.7" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="rehaut" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0.9" stopColor="#000" stopOpacity="0" />
          <stop offset="1" stopColor="#000" stopOpacity="0.55" />
        </radialGradient>
        <linearGradient id="crystal-glare" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.32" />
          <stop offset="0.45" stopColor="#fff" stopOpacity="0.05" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="ceramic-sheen" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.28" />
          <stop offset="0.4" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.7" stopColor="#000" stopOpacity="0.25" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.12" />
        </linearGradient>
        <linearGradient id="strap-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#000" stopOpacity="0.35" />
          <stop offset="0.25" stopColor="#fff" stopOpacity="0.08" />
          <stop offset="0.55" stopColor="#fff" stopOpacity="0.14" />
          <stop offset="1" stopColor="#000" stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="strap-fade" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0" />
          <stop offset="0.12" stopColor="#fff" stopOpacity="1" />
          <stop offset="0.88" stopColor="#fff" stopOpacity="1" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="strap-mask" maskUnits="userSpaceOnUse" x="0" y="0" width="400" height="600">
          <rect width="400" height="600" fill="url(#strap-fade)" />
        </mask>
        <radialGradient id="sapphire-tint" cx="0.4" cy="0.35" r="0.7">
          <stop offset="0" stopColor="#bfe3ff" stopOpacity="0.08" />
          <stop offset="1" stopColor="#0b1b2b" stopOpacity="0.32" />
        </radialGradient>

        <filter id="hand-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="2.2" dy="3" stdDeviation="1.6" floodColor="#000" floodOpacity="0.45" />
        </filter>
        <filter id="soft-shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="1.2" stdDeviation="0.8" floodColor="#000" floodOpacity="0.4" />
        </filter>
        <filter id="case-shadow" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="10" stdDeviation="10" floodColor="#1a1712" floodOpacity="0.28" />
        </filter>
        <filter id="blur-6">
          <feGaussianBlur stdDeviation="6" />
        </filter>
        <filter id="grain" x="0" y="0" width="100%" height="100%">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2" seed="4" result="n" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="table" tableValues="0 0.22" />
          </feComponentTransfer>
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
      </defs>
    </svg>
  );
});
