"use client";

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { ApiError, api } from "./api";
import type { User } from "./types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  refresh: () => Promise<void>;
  login: (email: string, password: string) => Promise<User>;
  register: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const me = await api.get<User>("/auth/me/");
      setUser(me);
    } catch (error) {
      if (!(error instanceof ApiError && (error.status === 401 || error.status === 403))) {
        console.error("Failed to fetch current user", error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const me = await api.post<User>("/auth/login/", { email, password });
    setUser(me);
    return me;
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    const me = await api.post<User>("/auth/register/", { email, password });
    setUser(me);
    return me;
  }, []);

  const logout = useCallback(async () => {
    await api.post("/auth/logout/");
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, refresh, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
