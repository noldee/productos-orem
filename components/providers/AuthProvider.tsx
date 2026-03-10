"use client";

import { createContext, useContext, useEffect, useState } from "react";
import {
  login as loginFn,
  logout as logoutFn,
  getToken,
  getStoredUser,
} from "@/lib/auth";
import { api } from "@/lib/api";

interface User {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<any>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    return getStoredUser();
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = getToken();
    if (token && !user) {
      setLoading(true);
      api
        .get("/users/me")
        .then(({ data }) => {
          setUser(data);
          localStorage.setItem("user", JSON.stringify(data));
        })
        .catch(() => {
          logoutFn();
          setUser(null);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginFn(email, password);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    logoutFn();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAdmin: user?.role === "ADMIN",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
