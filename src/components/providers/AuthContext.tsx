"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User, UserRole } from "@/types";
import { apiRequest } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole, avatar?: string) => Promise<void>;
  googleLogin: (email?: string, name?: string) => Promise<void>;
  initiateGoogleLogin: () => void;
  logout: () => void;
  isAuthenticated: boolean;
  isHost: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSession = async () => {
    // 1. Check if redirected from Google OAuth with auth_token in URL
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const urlToken = urlParams.get("auth_token");
      if (urlToken) {
        localStorage.setItem("studiospace_token", urlToken);
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }

    // 2. Query /auth/me with credentials: "include" (supports HTTPOnly cookie & Bearer token)
    try {
      const data = await apiRequest<{ user: User }>("/auth/me");
      if (data?.user) {
        setUser(data.user);
        localStorage.setItem("studiospace_user", JSON.stringify(data.user));
      } else {
        localStorage.removeItem("studiospace_token");
        localStorage.removeItem("studiospace_user");
        setUser(null);
      }
    } catch {
      // Offline fallback: check cached user if token exists
      const token = typeof window !== "undefined" ? localStorage.getItem("studiospace_token") : null;
      if (token) {
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

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "guest",
    avatar?: string
  ) => {
    const data = await apiRequest<{ token: string; user: User }>("/auth/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password, role, avatar }),
    });

    if (data.token) {
      localStorage.setItem("studiospace_token", data.token);
      localStorage.setItem("studiospace_user", JSON.stringify(data.user));
      setUser(data.user);
    }
  };

  const initiateGoogleLogin = () => {
    const rawBaseUrl =
      process.env.NEXT_PUBLIC_API_URL ||
      (typeof window !== "undefined" &&
      (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
        ? "http://localhost:5000/api"
        : "https://studiospace-server.onrender.com/api");
    const cleanUrl = rawBaseUrl.replace(/\/+$/, "");
    window.location.href = `${cleanUrl}/auth/google`;
  };

  const googleLogin = async (email?: string, name?: string) => {
    if (!email || !name) {
      initiateGoogleLogin();
      return;
    }

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

  const logout = async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch {
      // Graceful
    }
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
        initiateGoogleLogin,
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
