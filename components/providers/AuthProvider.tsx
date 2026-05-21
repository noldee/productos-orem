"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

type User = {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN";
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Al cargar la app, preguntamos al backend quién es el usuario actual.
  // El backend lee la cookie httpOnly automáticamente.
  // Así no necesitamos guardar NADA en localStorage.
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const { data } = await api.get("/users/me");
        setUser(data);
      } catch {
        // No hay sesión activa → usuario no logueado
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (email: string, password: string): Promise<User> => {
    // El backend guarda el JWT en una cookie httpOnly.
    // El frontend solo recibe los datos del usuario (no el token).
    const { data } = await api.post("/auth/login", { email, password });
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    // Pedimos al backend que borre la cookie httpOnly
    await api.post("/auth/logout");
    setUser(null);
  };

  const isAdmin = user?.role === "ADMIN";

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return ctx;
};
