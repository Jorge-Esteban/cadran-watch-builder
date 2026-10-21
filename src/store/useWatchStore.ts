import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { STEPS, DEFAULT_CONFIG } from '../data/steps';
import { computeQuote } from '../lib/pricing';
import { configFromLocation, mergeConfig } from '../lib/share';
import type { SavedDesign, StepId, ViewSide, WatchConfig } from '../types/watch';

// Estado centralizado del configurador:
//  · config       → la pieza seleccionada en cada categoría (fuente única de verdad del render y del precio)
//  · activeStep   → pestaña/paso actual; también decide la cara visible y el encuadre de cámara
//  · view / zoom  → estado de la previsualización
//  · savedDesigns → diseños guardados (persistidos en localStorage)

interface WatchState {
  config: WatchConfig;
  activeStep: StepId;
  view: ViewSide;
  /** Zoom manual del usuario, multiplicado por el encuadre del paso. */
  zoom: number;
  /** Última sección modificada: el preview la usa para animar sólo esa capa. */
  lastChanged: StepId | null;
  savedDesigns: SavedDesign[];

  update: <K extends StepId>(section: K, patch: Partial<WatchConfig[K]>) => void;
  setStep: (step: StepId) => void;
  nextStep: () => void;
  prevStep: () => void;
  setView: (view: ViewSide) => void;
  toggleView: () => void;
  setZoom: (zoom: number) => void;
  loadConfig: (config: WatchConfig) => void;
  reset: () => void;
  saveDesign: (name: string) => SavedDesign;
  deleteDesign: (id: string) => void;
}

const ZOOM_MIN = 0.7;
const ZOOM_MAX = 2.2;
const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));
const stepIndex = (id: StepId) => STEPS.findIndex((s) => s.id === id);

export const useWatchStore = create<WatchState>()(
  persist(
    (set, get) => ({
      config: structuredClone(DEFAULT_CONFIG),
      activeStep: 'case',
      view: 'front',
      zoom: 1,
      lastChanged: null,
      savedDesigns: [],

      update: (section, patch) =>
        set((s) => ({
          config: { ...s.config, [section]: { ...s.config[section], ...patch } },
          lastChanged: section,
        })),

      setStep: (step) => set({ activeStep: step, view: STEPS[stepIndex(step)].view, zoom: 1 }),
      nextStep: () => {
        const i = stepIndex(get().activeStep);
        if (i < STEPS.length - 1) get().setStep(STEPS[i + 1].id);
      },
      prevStep: () => {
        const i = stepIndex(get().activeStep);
        if (i > 0) get().setStep(STEPS[i - 1].id);
      },

      setView: (view) => set({ view }),
      toggleView: () => set((s) => ({ view: s.view === 'front' ? 'back' : 'front' })),
      setZoom: (zoom) => set({ zoom: clamp(zoom, ZOOM_MIN, ZOOM_MAX) }),

      loadConfig: (config) => set({ config: mergeConfig(config), lastChanged: null }),
      reset: () => set({ config: structuredClone(DEFAULT_CONFIG), lastChanged: null, activeStep: 'case', view: 'front', zoom: 1 }),

      saveDesign: (name) => {
        const config = get().config;
        const design: SavedDesign = {
          id: crypto.randomUUID(),
          name: name.trim() || `Diseño ${get().savedDesigns.length + 1}`,
          createdAt: Date.now(),
          config: structuredClone(config),
          total: computeQuote(config).total,
        };
        set((s) => ({ savedDesigns: [design, ...s.savedDesigns] }));
        return design;
      },
      deleteDesign: (id) => set((s) => ({ savedDesigns: s.savedDesigns.filter((d) => d.id !== id) })),
    }),
    {
      name: 'cadran-atelier',
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ config: s.config, savedDesigns: s.savedDesigns }),
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<WatchState>;
        // Un enlace compartido (#d=...) tiene prioridad sobre la última sesión guardada.
        const shared = typeof window !== 'undefined' ? configFromLocation() : null;
        return {
          ...current,
          savedDesigns: p.savedDesigns ?? [],
          config: shared ?? mergeConfig(p.config),
        };
      },
    },
  ),
);

/** Selector derivado del presupuesto. */
export const useQuote = () => {
  const config = useWatchStore((s) => s.config);
  return computeQuote(config);
};
