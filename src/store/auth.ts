"use client";

import { create } from "zustand";
import type { User } from "@/lib/types";
import { apiFetch } from "@/lib/api";

interface AuthState {
  user: User | null;
  loading: boolean;
  initialized: boolean;
  fetchUser: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  initialized: false,
  fetchUser: async () => {
    try {
      const data = await apiFetch<{ user: User | null }>("/auth/me");
      set({ user: data.user, initialized: true });
    } catch {
      set({ user: null, initialized: true });
    }
  },
  login: async (email, password) => {
    set({ loading: true });
    try {
      const data = await apiFetch<{ user: User }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      set({ user: data.user, loading: false });
      return data.user;
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },
  register: async (name, email, password) => {
    set({ loading: true });
    try {
      const data = await apiFetch<{ user: User }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      set({ user: data.user, loading: false });
      return data.user;
    } catch (e) {
      set({ loading: false });
      throw e;
    }
  },
  logout: async () => {
    await apiFetch("/auth/logout", { method: "POST" });
    set({ user: null });
  },
  setUser: (user) => set({ user }),
}));
