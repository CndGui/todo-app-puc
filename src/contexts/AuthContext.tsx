"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { User, UserRole } from "@/lib/types";
import * as storage from "@/lib/storage";

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, password: string, role: UserRole) => boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const sessionId = storage.getSession();
    if (sessionId) {
      const u = storage.getUserById(sessionId);
      if (u) setUser(u);
    }
  }, []);

  function login(email: string, password: string): boolean {
    const u = storage.getUsers().find((u) => u.email === email && u.password === password);
    if (!u) return false;
    storage.setSession(u.id);
    setUser(u);
    return true;
  }

  function register(name: string, email: string, password: string, role: UserRole): boolean {
    const users = storage.getUsers();
    if (users.find((u) => u.email === email)) return false;
    const newUser: User = { id: crypto.randomUUID(), name, email, password, role };
    storage.saveUsers([...users, newUser]);
    storage.setSession(newUser.id);
    setUser(newUser);
    return true;
  }

  function logout() {
    storage.clearSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
