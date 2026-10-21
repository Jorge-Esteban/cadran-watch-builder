import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { STEPS } from '../../data/steps';
import { useWatchStore } from '../../store/useWatchStore';
import { useUiStore } from '../../store/useUiStore';
import { Icon } from '../ui/Icon';
import { PANELS } from './panels';

const INTRO: Record<string, string> = {
  case: 'La arquitectura del reloj: silueta, metal y tratamiento de superficie.',
  dial: 'El rostro del reloj. Color, textura de la esfera y tipografía horaria.',
  hands: 'Forma y acabado de las agujas, a juego con los índices aplicados.',
  bezel: 'El aro giratorio: función de buceo, GMT, taquímetro o pureza pulida.',
  caseback: 'Lo que sólo ve quien lo lleva: fondo grabado o el calibre a la vista.',
  strap: 'Brazalete metálico o correa. Lo que define el carácter en la muñeca.',
};

/** Pestañas de categorías + panel activo + navegación paso a paso. */
export function Configurator() {
  const activeStep = useWatchStore((s) => s.activeStep);
  const setStep = useWatchStore((s) => s.setStep);
  const nextStep = useWatchStore((s) => s.nextStep);
  const prevStep = useWatchStore((s) => s.prevStep);
  const openModal = useUiStore((s) => s.open);
  const scrollRef = useRef<HTMLDivElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);

  const index = STEPS.findIndex((s) => s.id === activeStep);
  const Panel = PANELS[activeStep];
  const isLast = index === STEPS.length - 1;

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    tabsRef.current?.querySelector<HTMLElement>(`[data-step="${activeStep}"]`)?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }, [activeStep]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Pestañas */}
      <nav ref={tabsRef} className="no-scrollbar sticky top-[44dvh] z-20 flex gap-1 sm:top-[52dvh] overflow-x-auto border-b border-line bg-canvas/90 px-3 backdrop-blur lg:static lg:px-5" aria-label="Categorías">
        {STEPS.map((step, i) => {
          const active = step.id === activeStep;
          return (
            <button key={step.id} data-step={step.id} onClick={() => setStep(step.id)} className="relative shrink-0 px-3 pb-3 pt-4 text-left">
              <span className={`block text-[10px] tabular-nums tracking-[0.18em] ${active ? 'text-accent' : i < index ? 'text-ink/50' : 'text-faint'}`}>{step.short}</span>
              <span className={`block text-[13px] font-medium transition-colors ${active ? 'text-ink' : 'text-muted hover:text-ink'}`}>{step.label}</span>
              {active && <motion.span layoutId="tab-underline" className="absolute inset-x-3 -bottom-px h-[2px] rounded-full bg-ink" transition={{ type: 'spring', stiffness: 420, damping: 36 }} />}
            </button>
          );
        })}
      </nav>

      {/* Panel activo */}
      <div ref={scrollRef} className="min-h-0 flex-1 px-5 pb-8 pt-6 lg:overflow-y-auto lg:px-7">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -18 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <header className="mb-7">
              <h2 className="font-display text-[34px] leading-none">{STEPS[index].label}</h2>
              <p className="mt-2 max-w-sm text-[13px] leading-relaxed text-muted">{INTRO[activeStep]}</p>
            </header>
            <Panel />
          </motion.div>
        </AnimatePresence>

        {/* Navegación paso a paso */}
        <div className="mt-10 flex items-center justify-between gap-3 border-t border-line pt-5">
          <button className="btn btn-ghost px-4" onClick={prevStep} disabled={index === 0}>
            <Icon name="arrowLeft" size={16} />
            <span className="hidden sm:inline">Anterior</span>
          </button>
          <div className="flex gap-1.5" aria-hidden>
            {STEPS.map((s, i) => (
              <span key={s.id} className={`h-1 rounded-full transition-all duration-500 ${i === index ? 'w-6 bg-ink' : i < index ? 'w-1.5 bg-ink/40' : 'w-1.5 bg-line'}`} />
            ))}
          </div>
          {isLast ? (
            <button className="btn btn-primary" onClick={() => openModal('quote')}>
              Pedir presupuesto
            </button>
          ) : (
            <button className="btn btn-ghost" onClick={nextStep}>
              {STEPS[index + 1].label}
              <Icon name="arrowRight" size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
