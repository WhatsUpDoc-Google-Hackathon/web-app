import { create } from "zustand";

// Zustand store for avatar ready state
interface AvatarState {
  avatarReady: boolean;
  setAvatarReady: (ready: boolean) => void;
}

export const useAvatarStore = create<AvatarState>((set) => ({
  avatarReady: false,
  setAvatarReady: (ready) => set({ avatarReady: ready }),
}));
