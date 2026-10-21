import { AnimatePresence, motion, type Transition, type Variants } from 'framer-motion';
import type { ReactNode } from 'react';
import { VIEW_H, VIEW_W } from '../../lib/geometry';
import type { WatchConfig } from '../../types/watch';
import { BezelLayer } from './layers/BezelLayer';
import { CaseLayer } from './layers/CaseLayer';
import { CasebackLayer } from './layers/CasebackLayer';
import { CrystalLayer } from './layers/CrystalLayer';
import { DialLayer } from './layers/DialLayer';
import { HandsLayer } from './layers/HandsLayer';
import { IndicesLayer } from './layers/IndicesLayer';
import { StrapLayer } from './layers/StrapLayer';

// Composición por capas en orden Z (de abajo a arriba). Cada capa se envuelve en
// <Swap>, que hace un fundido cruzado cuando cambia su clave (la pieza elegida).

const ease: Transition = { duration: 0.55, ease: [0.22, 1, 0.36, 1] };

type Variant = 'fade' | 'spin' | 'settle' | 'drop';

const variants: Record<Variant, Variants> = {
  fade: { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } },
  spin: { initial: { opacity: 0, rotate: -50, scale: 1.04 }, animate: { opacity: 1, rotate: 0, scale: 1 }, exit: { opacity: 0, rotate: 30 } },
  settle: { initial: { opacity: 0, scale: 0.94 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0, scale: 1.02 } },
  drop: { initial: { opacity: 0, scale: 1.08 }, animate: { opacity: 1, scale: 1 }, exit: { opacity: 0 } },
};

function Swap({ k, variant = 'fade', children }: { k: string; variant?: Variant; children: ReactNode }) {
  const v = variants[variant];
  return (
    <AnimatePresence initial={false}>
      <motion.g key={k} variants={v} initial="initial" animate="animate" exit="exit" transition={ease}>
        {children}
      </motion.g>
    </AnimatePresence>
  );
}

interface Props {
  config: WatchConfig;
  time: { h: number; m: number; s: number };
  className?: string;
}

export function WatchFront({ config, time, className }: Props) {
  const c = config;
  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className={className} role="img" aria-label="Vista frontal del reloj">
      <Swap k={`${c.strap.type}-${c.strap.color}`}>
        <StrapLayer config={c} />
      </Swap>
      <Swap k={`${c.case.style}-${c.case.material}-${c.case.finish}`}>
        <CaseLayer config={c} />
      </Swap>
      <Swap k={c.bezel.insert} variant="spin">
        <BezelLayer config={c} />
      </Swap>
      <Swap k={`${c.dial.color}-${c.dial.texture}`} variant="settle">
        <DialLayer config={c} />
      </Swap>
      <Swap k={`${c.dial.indices}-${c.hands.finish}`} variant="drop">
        <IndicesLayer config={c} />
      </Swap>
      <Swap k={`${c.hands.style}-${c.hands.finish}`}>
        <HandsLayer config={c} time={time} />
      </Swap>
      <CrystalLayer />
    </svg>
  );
}

export function WatchBack({ config, className }: Omit<Props, 'time'>) {
  const c = config;
  return (
    <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} className={className} role="img" aria-label="Vista trasera del reloj">
      <Swap k={`${c.strap.type}-${c.strap.color}`}>
        <StrapLayer config={c} side="back" />
      </Swap>
      <Swap k={`${c.case.style}-${c.case.material}-${c.case.finish}`}>
        <CaseLayer config={c} side="back" />
      </Swap>
      <Swap k={`${c.caseback.type}`} variant="settle">
        <CasebackLayer config={c} />
      </Swap>
    </svg>
  );
}
