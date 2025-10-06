import { create } from "zustand";

interface UIState {
  triggerSearch: boolean;
  openSearch: () => void;
  resetSearchTrigger: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  triggerSearch: false,
  openSearch: () => set({ triggerSearch: true }),
  resetSearchTrigger: () => set({ triggerSearch: false }),
}));
