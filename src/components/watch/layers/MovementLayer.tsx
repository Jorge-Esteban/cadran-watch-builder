import { motion } from 'framer-motion';
import { ROTOR_FINISHES, byId } from '../../../data/catalog';
import { CX, CY, arcSegment, polar } from '../../../lib/geometry';
import type { WatchConfig } from '../../../types/watch';

// Calibre automático tipo NH35A visto a través del fondo de zafiro.
// Orden de abajo a arriba: platina con perlage → tren de ruedas → volante →
// puentes (Côtes de Genève + anglage) → trinquete, tornillos y rubíes → rotor.

export const WINDOW_R = 78;

const PLATE = '#8a9095';
const BRIDGE = '#cdd1d4';
const BRASS = 'url(#metal-brass-polished)';

const P = (dx: number, dy: number) => ({ x: CX + dx, y: CY + dy });
const BALANCE = { ...P(38, -36), r: 19 };
const ESCAPE = { ...P(12, -46), r: 8 };
const FOURTH = { ...P(-6, -28), r: 11 };
const THIRD = { ...P(30, 4), r: 13 };
const BARREL = { ...P(-34, 24), r: 24 };
const CROWN_WHEEL = { ...P(-62, -4), r: 9 };

const BRIDGES = {
  barrel: `M ${CX - 92} ${CY - 12} C ${CX - 64} ${CY - 34}, ${CX - 26} ${CY - 26}, ${CX - 10} ${CY - 4} C ${CX + 2} ${CY + 16}, ${CX - 2} ${CY + 46}, ${CX - 20} ${CY + 62} C ${CX - 40} ${CY + 82}, ${CX - 72} ${CY + 82}, ${CX - 92} ${CY + 62} Z`,
  train: `M ${CX + 6} ${CY + 14} C ${CX + 16} ${CY - 6}, ${CX + 46} ${CY - 12}, ${CX + 68} ${CY - 4} L ${CX + 92} ${CY + 10} L ${CX + 92} ${CY + 52} C ${CX + 66} ${CY + 78}, ${CX + 24} ${CY + 86}, ${CX + 2} ${CY + 72} C ${CX - 6} ${CY + 54}, ${CX - 6} ${CY + 32}, ${CX + 6} ${CY + 14} Z`,
  cock: `M ${CX + 92} ${CY - 50} L ${BALANCE.x + 6} ${BALANCE.y - 9} A 10.8 10.8 0 1 0 ${BALANCE.x + 6} ${BALANCE.y + 9} L ${CX + 92} ${CY - 22} Z`,
};

const SCREWS: [number, number, number][] = [
  [CX - 78, CY + 4, 20],
  [CX - 30, CY + 62, -35],
  [CX + 74, CY + 16, 60],
  [CX + 44, CY + 64, 10],
  [CX + 70, CY - 36, -20],
];

const JEWELS = [THIRD, P(-6, 46), P(56, 34), P(-58, 40)];

export function Movement({ config, uid }: { config: WatchConfig; uid: string }) {
  const rotorFinish = byId(ROTOR_FINISHES, config.caseback.rotorFinish);
  const clip = `win-${uid}`;

  return (
    <g>
      <clipPath id={clip}>
        <circle cx={CX} cy={CY} r={WINDOW_R} />
      </clipPath>
      <g clipPath={`url(#${clip})`}>
        {/* Platina */}
        <circle cx={CX} cy={CY} r={WINDOW_R} fill={PLATE} />
        <circle cx={CX} cy={CY} r={WINDOW_R} fill="url(#perlage)" />
        <circle cx={BALANCE.x} cy={BALANCE.y} r={BALANCE.r + 4} fill="#000" opacity={0.22} />

        {/* Tren de ruedas (el segundero gira una vuelta por minuto) */}
        <Wheel {...THIRD} teeth={60} spokes={4} duration={480} />
        <Wheel {...FOURTH} teeth={48} spokes={4} duration={60} />
        <Wheel {...ESCAPE} teeth={15} spokes={5} duration={10} escape />
        <PalletFork />
        <Balance />

        {/* Puentes */}
        <g filter="url(#bridge-shadow)">
          {Object.entries(BRIDGES).map(([k, d]) => (
            <path key={k} d={d} fill={BRIDGE} />
          ))}
        </g>
        {Object.entries(BRIDGES).map(([k, d]) => (
          <g key={k}>
            <path d={d} fill="url(#geneva)" />
            {/* Anglage: bisel pulido a mano en el canto */}
            <path d={d} fill="none" stroke="#fff" strokeOpacity={0.8} strokeWidth={1.6} />
            <path d={d} fill="none" stroke="#2c3034" strokeOpacity={0.55} strokeWidth={0.6} />
          </g>
        ))}
        <BalanceCockDetails />

        <RatchetWheel {...BARREL} />
        <RatchetWheel {...CROWN_WHEEL} small />

        <g fill="#41464b" fontFamily="Inter, sans-serif" letterSpacing={1.1}>
          <text x={CX + 18} y={CY + 40} fontSize={7.5} fontWeight={600} transform={`rotate(-14 ${CX + 18} ${CY + 40})`}>
            NH35A
          </text>
          <text x={CX + 14} y={CY + 50} fontSize={4.2} transform={`rotate(-14 ${CX + 14} ${CY + 50})`}>
            24 JEWELS · AUTOMATIC
          </text>
          <text x={CX + 18} y={CY + 57} fontSize={3.6} opacity={0.8} transform={`rotate(-14 ${CX + 18} ${CY + 57})`}>
            UNADJUSTED · 21 600 A/h
          </text>
        </g>

        {JEWELS.map((j, i) => (
          <Jewel key={i} x={j.x} y={j.y} />
        ))}
        {SCREWS.map(([x, y, a], i) => (
          <Screw key={i} x={x} y={y} angle={a} />
        ))}

        {/* Rotor: balanceo continuo; el círculo invisible centra la caja de transformación en el pivote */}
        <motion.g key={config.caseback.rotor} initial={{ rotate: -120 }} animate={{ rotate: [-25, 160, 60, 210, -25] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}>
          <circle cx={CX} cy={CY} r={WINDOW_R} fill="transparent" />
          <Rotor type={config.caseback.rotor} fill={`url(#${rotorFinish.gradient})`} uid={uid} />
        </motion.g>
      </g>
      {/* Anillo de encaje entre movimiento y caja */}
      <circle cx={CX} cy={CY} r={WINDOW_R - 0.8} fill="none" stroke="#1c1e21" strokeOpacity={0.6} strokeWidth={2.4} />
    </g>
  );
}

function Wheel({ x, y, r, teeth, spokes, duration, escape = false }: { x: number; y: number; r: number; teeth: number; spokes: number; duration: number; escape?: boolean }) {
  const circ = 2 * Math.PI * (r - 0.6);
  return (
    <motion.g animate={{ rotate: 360 }} transition={{ duration, repeat: Infinity, ease: 'linear' }}>
      {/* Dentado */}
      <circle cx={x} cy={y} r={r - 0.6} fill="none" stroke={escape ? '#b9c0c6' : '#8f6c2c'} strokeWidth={escape ? 2.6 : 1.6} strokeDasharray={`${(circ / teeth) * (escape ? 0.35 : 0.5)} ${(circ / teeth) * (escape ? 0.65 : 0.5)}`} />
      <circle cx={x} cy={y} r={r - 1.8} fill="none" stroke={escape ? 'url(#metal-steel-polished)' : BRASS} strokeWidth={2} />
      {Array.from({ length: spokes }, (_, i) => {
        const p = polar(r - 2, (360 / spokes) * i, x, y);
        return <line key={i} x1={x} y1={y} x2={p.x} y2={p.y} stroke={escape ? '#c9ced3' : '#c9a453'} strokeWidth={1.3} />;
      })}
      <circle cx={x} cy={y} r={Math.max(2.2, r * 0.24)} fill={BRASS} stroke="#5e461a" strokeWidth={0.4} />
      <circle cx={x} cy={y} r={1} fill="#2b2b2b" />
    </motion.g>
  );
}

function Balance() {
  const { x, y, r } = BALANCE;
  return (
    <g>
      {/* Volante oscilando a 3 Hz (21 600 A/h) */}
      <motion.g animate={{ rotate: [-210, 210] }} transition={{ duration: 1 / 6, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}>
        <circle cx={x} cy={y} r={r} fill="none" stroke="#6e5420" strokeWidth={4.2} />
        <circle cx={x} cy={y} r={r} fill="none" stroke="url(#metal-gold-polished)" strokeWidth={3.2} />
        {[0, 120, 240].map((a) => {
          const p = polar(r - 1, a, x, y);
          return <line key={a} x1={x} y1={y} x2={p.x} y2={p.y} stroke="#c9a65a" strokeWidth={1.8} />;
        })}
        {/* Tornillos de inercia en la llanta */}
        {Array.from({ length: 8 }, (_, i) => {
          const p = polar(r + 1.6, i * 45 + 22.5, x, y);
          return <circle key={i} cx={p.x} cy={p.y} r={1.1} fill="#e8d6a1" />;
        })}
      </motion.g>
      {/* Espiral */}
      <path d={spiral(x, y, 13)} fill="none" stroke="#5b79c7" strokeWidth={0.45} opacity={0.9} />
    </g>
  );
}

function PalletFork() {
  const a = P(24, -42);
  return (
    <motion.g animate={{ rotate: [-7, 7] }} transition={{ duration: 1 / 6, repeat: Infinity, repeatType: 'reverse', ease: [0.7, 0, 0.3, 1] }}>
      <path d={`M ${a.x - 8} ${a.y - 5} L ${a.x} ${a.y} L ${a.x - 8} ${a.y + 5} M ${a.x} ${a.y} L ${a.x + 9} ${a.y + 3}`} stroke="#c7cdd2" strokeWidth={1.8} strokeLinecap="round" fill="none" />
      <rect x={a.x - 9.6} y={a.y - 6.4} width={2.4} height={2.4} fill="url(#ruby)" />
      <rect x={a.x - 9.6} y={a.y + 4} width={2.4} height={2.4} fill="url(#ruby)" />
    </motion.g>
  );
}

function BalanceCockDetails() {
  const { x, y } = BALANCE;
  return (
    <g>
      {/* Raqueta de regulación */}
      <path d={`M ${x} ${y} L ${x + 30} ${y - 9}`} stroke="url(#metal-steel-polished)" strokeWidth={1.6} strokeLinecap="round" />
      <path d={`M ${x} ${y} L ${x + 30} ${y - 9}`} stroke="#000" strokeOpacity={0.3} strokeWidth={0.4} />
      <g fill="#41464b" fontFamily="Inter, sans-serif" fontSize={5} fontWeight={600}>
        <text x={x + 34} y={y - 13}>−</text>
        <text x={x + 34} y={y - 1}>+</text>
      </g>
      {/* Amortiguador con muelle en lira */}
      <circle cx={x} cy={y} r={5} fill="url(#metal-gold-polished)" stroke="#5e461a" strokeWidth={0.4} />
      <circle cx={x} cy={y} r={2.4} fill="url(#ruby)" />
      <path d={`M ${x - 3.6} ${y - 2.6} Q ${x} ${y - 6.2} ${x + 3.6} ${y - 2.6} M ${x - 3.6} ${y + 2.6} Q ${x} ${y + 6.2} ${x + 3.6} ${y + 2.6}`} fill="none" stroke="#e9ecef" strokeWidth={0.6} />
    </g>
  );
}

function RatchetWheel({ x, y, r, small = false }: { x: number; y: number; r: number; small?: boolean }) {
  const circ = 2 * Math.PI * r;
  const teeth = small ? 30 : 64;
  let rays = '';
  for (let a = 0; a < 360; a += small ? 12 : 4) {
    const p = polar(r - 2, a, x, y);
    rays += `M ${x} ${y} L ${p.x} ${p.y} `;
  }
  return (
    <g filter="url(#bridge-shadow)">
      <motion.g animate={{ rotate: small ? -360 : 360 }} transition={{ duration: small ? 40 : 160, repeat: Infinity, ease: 'linear' }}>
        <circle cx={x} cy={y} r={r} fill="url(#metal-steel-polished)" />
        {/* Acabado soleil */}
        <path d={rays} stroke="#fff" strokeOpacity={0.22} strokeWidth={0.5} />
        <circle cx={x} cy={y} r={r - 0.6} fill="none" stroke="#3a3f44" strokeWidth={1.8} strokeDasharray={`${(circ / teeth) * 0.45} ${(circ / teeth) * 0.55}`} />
        {!small && <circle cx={x} cy={y} r={r - 6} fill="none" stroke="#000" strokeOpacity={0.2} strokeWidth={0.6} />}
      </motion.g>
      <Screw x={x} y={y} angle={30} r={small ? 2.4 : 4.4} steel />
    </g>
  );
}

function Screw({ x, y, angle, r = 2.8, steel = false }: { x: number; y: number; angle: number; r?: number; steel?: boolean }) {
  return (
    <g>
      <circle cx={x} cy={y} r={r + 0.7} fill="#000" opacity={0.35} />
      <circle cx={x} cy={y} r={r} fill={steel ? 'url(#metal-steel-polished)' : 'url(#screw-blue)'} />
      <rect x={x - r} y={y - r * 0.16} width={r * 2} height={r * 0.32} fill="#0c0f1c" opacity={0.8} transform={`rotate(${angle} ${x} ${y})`} />
      <circle cx={x - r * 0.35} cy={y - r * 0.4} r={r * 0.25} fill="#fff" opacity={0.55} />
    </g>
  );
}

function Jewel({ x, y }: { x: number; y: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r={4} fill="#000" opacity={0.3} />
      <circle cx={x} cy={y} r={3.6} fill="url(#metal-gold-polished)" stroke="#5e461a" strokeWidth={0.4} />
      <circle cx={x} cy={y} r={2.1} fill="url(#ruby)" />
      <circle cx={x - 0.7} cy={y - 0.7} r={0.6} fill="#fff" opacity={0.75} />
    </g>
  );
}

function Rotor({ type, fill, uid }: { type: WatchConfig['caseback']['rotor']; fill: string; uid: string }) {
  const R = WINDOW_R - 3;
  const half = arcSegment(R, 12, -90, 90);
  const textPathId = `rotor-${uid}`;
  const tp0 = polar(R - 15, -78);
  const tp1 = polar(R - 15, 78);
  return (
    <g>
      <g filter="url(#bridge-shadow)">
        {type === 'skeleton' ? (
          <g fill={fill}>
            <path d={arcSegment(R, R - 14, -90, 90)} />
            {[-52, -18, 18, 52].map((a) => (
              <path key={a} d={arcSegment(R - 12, 10, a - 4.5, a + 4.5)} />
            ))}
            <path d={arcSegment(R - 26, R - 31, -70, 70)} />
          </g>
        ) : (
          <path d={half} fill={fill} />
        )}
      </g>

      {type !== 'skeleton' && (
        <g>
          {type === 'geneva' && <path d={half} fill="url(#geneva)" />}
          {type === 'classic' && <path d={half} fill="url(#brush-radial)" />}
          {/* Masa oscilante periférica más pesada, con filo pulido */}
          <path d={arcSegment(R, R - 9, -90, 90)} fill="#000" opacity={0.18} />
          <path d={arcSegment(R - 9, R - 9.8, -88, 88)} fill="#fff" opacity={0.35} />
          {type === 'classic' && (
            <g>
              <path id={textPathId} d={`M ${tp0.x} ${tp0.y} A ${R - 15} ${R - 15} 0 0 1 ${tp1.x} ${tp1.y}`} fill="none" />
              <text fontFamily="Inter, sans-serif" fontSize={6} letterSpacing={2.2} fill="#000" opacity={0.5}>
                <textPath href={`#${textPathId}`} startOffset="50%" textAnchor="middle">
                  AUTOMATIC · CADRAN ATELIER
                </textPath>
              </text>
            </g>
          )}
        </g>
      )}
      {/* Anglage del rotor */}
      <path d={type === 'skeleton' ? arcSegment(R, R - 14, -90, 90) : half} fill="none" stroke="#fff" strokeOpacity={0.55} strokeWidth={0.9} />
      <path d={type === 'skeleton' ? arcSegment(R, R - 14, -90, 90) : half} fill="none" stroke="#000" strokeOpacity={0.35} strokeWidth={0.5} />

      {/* Tornillos del rotor */}
      {[-40, 0, 40].map((a) => {
        const p = polar(20, a);
        return <Screw key={a} x={p.x} y={p.y} angle={a + 15} r={2} />;
      })}

      {/* Rodamiento de bolas central */}
      <circle cx={CX} cy={CY} r={12.5} fill={fill} stroke="#000" strokeOpacity={0.4} strokeWidth={0.6} />
      <circle cx={CX} cy={CY} r={8.6} fill="#2a2d31" />
      {Array.from({ length: 10 }, (_, i) => {
        const p = polar(7.2, i * 36);
        return <circle key={i} cx={p.x} cy={p.y} r={1.25} fill="url(#metal-steel-polished)" />;
      })}
      <circle cx={CX} cy={CY} r={5.2} fill="url(#metal-steel-polished)" />
      <Screw x={CX} y={CY} angle={-30} r={3} />
    </g>
  );
}

function spiral(cx: number, cy: number, maxR: number) {
  let d = `M ${cx + 2} ${cy}`;
  const turns = 9;
  for (let t = 0; t <= Math.PI * 2 * turns; t += 0.25) {
    const r = 2 + (t / (Math.PI * 2 * turns)) * (maxR - 2);
    d += ` L ${cx + r * Math.cos(t)} ${cy + r * Math.sin(t)}`;
  }
  return d;
}
