import { animate, motion, useMotionValue, useSpring } from 'framer-motion';
import { useEffect, useRef, type PointerEvent } from 'react';
import { STEPS } from '../../data/steps';
import { useClock } from '../../hooks/useClock';
import { useWatchStore } from '../../store/useWatchStore';
import { useUiStore } from '../../store/useUiStore';
import { Icon } from '../ui/Icon';
import { WatchBack, WatchFront } from '../watch/WatchRender';

const spring = { stiffness: 120, damping: 18, mass: 0.8 };

/**
 * Escenario de previsualización: encuadre de cámara por paso, zoom manual,
 * arrastre cuando hay zoom, inclinación con el puntero y giro 3D frontal/trasera.
 */
export function PreviewStage() {
  const config = useWatchStore((s) => s.config);
  const view = useWatchStore((s) => s.view);
  const activeStep = useWatchStore((s) => s.activeStep);
  const zoom = useWatchStore((s) => s.zoom);
  const setZoom = useWatchStore((s) => s.setZoom);
  const toggleView = useWatchStore((s) => s.toggleView);
  const liveTime = useUiStore((s) => s.liveTime);
  const toggleLiveTime = useUiStore((s) => s.toggleLiveTime);
  const time = useClock(liveTime);

  const stageRef = useRef<HTMLDivElement>(null);
  const camera = STEPS.find((s) => s.id === activeStep)!.camera;
  const scale = camera.scale * zoom;
  const zoomed = scale > 1.05;

  // Inclinación sutil siguiendo el puntero
  const tiltX = useSpring(0, spring);
  const tiltY = useSpring(0, spring);
  // Desplazamiento por arrastre (sólo con zoom)
  const panX = useMotionValue(0);
  const panY = useMotionValue(0);

  useEffect(() => {
    animate(panX, 0, { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
    animate(panY, camera.y, { duration: 0.6, ease: [0.22, 1, 0.36, 1] });
  }, [activeStep, zoom, camera.y, panX, panY]);

  // Zoom con rueda del ratón (listener nativo para poder hacer preventDefault)
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const { zoom: z, setZoom: set } = useWatchStore.getState();
      set(z * (e.deltaY > 0 ? 0.92 : 1.08));
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return;
    const r = e.currentTarget.getBoundingClientRect();
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 10);
    tiltX.set(-((e.clientY - r.top) / r.height - 0.5) * 8);
  };
  const onPointerLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  const stepLabel = STEPS.find((s) => s.id === activeStep)!;

  return (
    <div
      ref={stageRef}
      className="stage-bg relative h-full w-full overflow-hidden select-none"
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
      onDoubleClick={() => setZoom(zoom > 1 ? 1 : 1.6)}
    >
      {/* Rótulo del paso */}
      <div className="pointer-events-none absolute left-5 top-4 z-10 sm:left-7 sm:top-6">
        <p className="eyebrow">Vista {view === 'front' ? 'frontal' : 'trasera'}</p>
        <motion.p key={activeStep} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-display text-2xl text-ink/80 sm:text-3xl">
          {stepLabel.short} · {stepLabel.label}
        </motion.p>
      </div>

      {/* Sombra de apoyo */}
      <motion.div
        className="pointer-events-none absolute left-1/2 top-[86%] h-8 w-[38%] -translate-x-1/2 rounded-[50%] bg-black/15 blur-2xl"
        animate={{ opacity: scale > 1.2 ? 0 : 1, scaleX: Math.min(scale, 1.2) }}
      />

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        style={{ x: panX, y: panY, cursor: zoomed ? 'grab' : 'default' }}
        drag={zoomed}
        dragMomentum={false}
        dragElastic={0.15}
        dragConstraints={stageRef}
        whileDrag={{ cursor: 'grabbing' }}
      >
        <motion.div
          className="relative aspect-[2/3] h-[94%] max-w-[94%]"
          style={{ perspective: 1400 }}
          animate={{ scale }}
          transition={{ type: 'spring', stiffness: 90, damping: 20 }}
        >
          <motion.div className="relative h-full w-full" style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: 'preserve-3d' }}>
            <motion.div
              className="relative h-full w-full"
              style={{ transformStyle: 'preserve-3d' }}
              animate={{ rotateY: view === 'back' ? 180 : 0 }}
              transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
            >
              <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}>
                <WatchFront config={config} time={time} className="h-full w-full overflow-visible" />
              </div>
              <div className="absolute inset-0" style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}>
                <WatchBack config={config} className="h-full w-full overflow-visible" />
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Controles */}
      <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 sm:bottom-6">
        <div className="flex items-center rounded-full border border-line bg-surface/80 p-1 backdrop-blur">
          {(['front', 'back'] as const).map((side) => (
            <button
              key={side}
              onClick={() => view !== side && toggleView()}
              className="relative h-8 rounded-full px-3.5 text-[12px] font-medium tracking-wide"
            >
              {view === side && <motion.span layoutId="view-pill" className="absolute inset-0 rounded-full bg-ink" transition={{ type: 'spring', stiffness: 400, damping: 32 }} />}
              <span className={`relative ${view === side ? 'text-surface' : 'text-muted'}`}>{side === 'front' ? 'Frontal' : 'Trasera'}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 rounded-full border border-line bg-surface/80 p-1 backdrop-blur">
          <button className="grid size-8 place-items-center rounded-full hover:bg-black/5" onClick={() => setZoom(zoom / 1.25)} aria-label="Alejar">
            <Icon name="minus" size={16} />
          </button>
          <button className="grid size-8 place-items-center rounded-full hover:bg-black/5" onClick={() => setZoom(1)} aria-label="Restablecer encuadre">
            <Icon name="focus" size={15} />
          </button>
          <button className="grid size-8 place-items-center rounded-full hover:bg-black/5" onClick={() => setZoom(zoom * 1.25)} aria-label="Acercar">
            <Icon name="plus" size={16} />
          </button>
        </div>
      </div>

      <button
        onClick={toggleLiveTime}
        className="absolute right-5 top-5 z-10 hidden items-center gap-2 rounded-full border border-line bg-surface/80 px-3 py-1.5 text-[11px] tracking-wide text-muted backdrop-blur sm:flex"
      >
        <span className={`size-1.5 rounded-full ${liveTime ? 'bg-emerald-500' : 'bg-faint'}`} />
        {liveTime ? 'Hora real' : 'Pose 10:10'}
      </button>
    </div>
  );
}
