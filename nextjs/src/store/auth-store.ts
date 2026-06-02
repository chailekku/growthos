"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, UserRole } from "@/types";
import { DEMO_USERS } from "@/lib/mock-data";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  demoLogin: (role: UserRole) => void;
  logout: () => void;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      isAuthenticated: false,

      demoLogin: (role: UserRole) => {
        const userKey = role === "super_admin" || role === "system_admin" ? "super_admin" : role;
        const user = DEMO_USERS[userKey];
        if (user) {
          set({ user: { ...user, role }, isAuthenticated: true, isLoading: false });
        }
      },

      logout: () => set({ user: null, isAuthenticated: false }),

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "growthos-auth",
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
