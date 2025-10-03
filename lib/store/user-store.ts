"use client";

import { create } from "zustand";

interface Session {
  user: {
    id: string;
    email: string;
    name?: string;
  } | null;
  expires?: string;
}

interface UserState {
  session: Session | null;
  setSession: (session: Session | null) => void;
}

export const useUserStore = create<UserState>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
}));
