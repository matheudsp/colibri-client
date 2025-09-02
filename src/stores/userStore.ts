"use client";
import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email?: string;
  role: string;
  status: boolean;
}

interface UserState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));
