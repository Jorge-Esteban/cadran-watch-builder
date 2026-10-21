import { create } from 'zustand';

type Modal = null | 'quote' | 'save' | 'saved';

interface UiState {
  modal: Modal;
  toast: { id: number; message: string } | null;
  liveTime: boolean;
  open: (modal: Exclude<Modal, null>) => void;
  close: () => void;
  notify: (message: string) => void;
  toggleLiveTime: () => void;
}

/** Estado efímero de interfaz (no se persiste). */
export const useUiStore = create<UiState>((set) => ({
  modal: null,
  toast: null,
  liveTime: true,
  open: (modal) => set({ modal }),
  close: () => set({ modal: null }),
  notify: (message) => set({ toast: { id: Date.now(), message } }),
  toggleLiveTime: () => set((s) => ({ liveTime: !s.liveTime })),
}));
