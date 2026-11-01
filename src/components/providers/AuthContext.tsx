"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole } from "@/types";
import { apiRequest } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole) => Promise<void>;
  googleLogin: (email: string, name: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isHost: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    const token = localStorage.getItem("studiospace_token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const data = await apiRequest<{ user: User }>("/auth/me");
      if (data?.user) {
        setUser(data.user);
      } else {
        localStorage.removeItem("studiospace_token");
        setUser(null);
      }
    } catch {
      console.warn("Session check fallback to cached profile or guest");
      const cached = localStorage.getItem("studiospace_user");
      if (cached) {
        try {
          setUser(JSON.parse(cached));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSession();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiRequest<{ token: string; user: User }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (data.token) {
      localStorage.setItem("studiospace_token", data.token);
      localStorage.setItem("studiospace_user", JSON.stringify(data.user));
      setUser(data.user);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole = "guest") => {
    const data = await apiRequest<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role }),
    });

    if (data.token) {
      localStorage.setItem("studiospace_token", data.token);
      localStorage.setItem("studiospace_user", JSON.stringify(data.user));
      setUser(data.user);
    }
  };

  const googleLogin = async (email: string, name: string) => {
    const data = await apiRequest<{ token: string; user: User }>("/auth/google", {
      method: "POST",
      body: JSON.stringify({
        email,
        name,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      }),
    });

    if (data.token) {
      localStorage.setItem("studiospace_token", data.token);
      localStorage.setItem("studiospace_user", JSON.stringify(data.user));
      setUser(data.user);
    }
  };

  const logout = () => {
    localStorage.removeItem("studiospace_token");
    localStorage.removeItem("studiospace_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        googleLogin,
        logout,
        isAuthenticated: !!user,
        isHost: user?.role === "host" || user?.role === "admin",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
