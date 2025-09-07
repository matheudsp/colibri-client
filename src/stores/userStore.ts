"use client";
import type { UserData } from "@/services/domains/authService";
import { create } from "zustand";

interface UserState {
  user: UserData | null;
  loading: boolean;
  setUser: (user: UserData | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));
