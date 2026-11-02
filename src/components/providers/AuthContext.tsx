"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, UserRole } from "@/types";
import { apiRequest } from "@/lib/api";
import { GOOGLE_OAUTH_CONFIG } from "@/lib/auth-config";

interface RawUserResponse {
  _id?: string;
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  photoURL?: string;
  avatar?: string;
  phone?: string;
  createdAt?: string;
  isDemo?: boolean;
}

interface RawAuthResponse extends RawUserResponse {
  token?: string;
  message?: string;
  user?: RawUserResponse;
}

export const PREDEFINED_DEMO_ACCOUNTS: Record<string, { user: User; password: string }> = {
  "host@studiospace.com": {
    user: {
      id: "demo-host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
      role: "host",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (555) 019-2834",
      isDemo: true,
    },
    password: "HostPassword123!",
  },
  "guest@studiospace.com": {
    user: {
      id: "demo-guest-1",
      name: "Imrita Aksa",
      email: "guest@studiospace.com",
      role: "guest",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
      phone: "+1 (555) 018-9271",
      isDemo: true,
    },
    password: "GuestPassword123!",
  },
};

interface StoredDemoAccount {
  user: User;
  password: string;
}

function getStoredDemoAccounts(): Record<string, StoredDemoAccount> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem("studiospace_demo_accounts");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredDemoAccount(user: User, password: string) {
  if (typeof window === "undefined") return;
  try {
    const accounts = getStoredDemoAccounts();
    accounts[user.email.toLowerCase()] = { user, password };
    localStorage.setItem("studiospace_demo_accounts", JSON.stringify(accounts));
  } catch {
    // Ignore localStorage write errors
  }
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole, avatar?: string) => Promise<void>;
  loginDemo: (role: "host" | "guest") => Promise<void>;
  googleLogin: (credential?: string) => Promise<void>;
  initiateGoogleLogin: () => void;
  isGoogleAuthEnabled: boolean;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isHost: boolean;
  isDemoMode: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const normalizeUser = (raw?: RawUserResponse | null): User => {
    const email = (raw?.email || "").toLowerCase().trim();
    let avatar = raw?.photoURL || raw?.avatar || "";

    // Canonical Avatar Mapping: Guarantee Guest Demo is Female and Host Demo is Male
    if (email === "guest@studiospace.com" || raw?.name?.toLowerCase().includes("imrita")) {
      avatar = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80";
    } else if (email === "host@studiospace.com" || raw?.name?.toLowerCase().includes("imdatul")) {
      avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80";
    }

    let resolvedName = raw?.name || "";
    if (email === "guest@studiospace.com" || resolvedName.toLowerCase().includes("imrita")) {
      resolvedName = "Imrita Aksa";
    } else if (email === "host@studiospace.com" || resolvedName.toLowerCase().includes("imdatul")) {
      resolvedName = "Imdatul Hoque";
    } else if (!resolvedName) {
      resolvedName = "StudioSpace User";
    }

    // Strip any residual demo / examiner labels from display name
    const cleanName = resolvedName
      .replace(/\s*\(Host Demo\)/gi, "")
      .replace(/\s*\(Guest Demo\)/gi, "")
      .replace(/\s*\(Host\)/gi, "")
      .replace(/\s*\(Guest\)/gi, "")
      .replace(/\s*\(Examiner\s*\/?\s*Guest\)/gi, "")
      .replace(/\s*Host Demo/gi, "")
      .replace(/\s*Guest Demo/gi, "")
      .trim();

    return {
      id: raw?._id || raw?.id || "user-id",
      name: cleanName,
      email: raw?.email || "",
      role: raw?.role === "host" || raw?.role === "admin" ? raw.role : "guest",
      avatar,
      phone: raw?.phone || "",
      createdAt: raw?.createdAt,
      isDemo: Boolean(raw?.isDemo) || email.includes("studiospace.com"),
    };
  };

  const authenticateDemoSession = (demoUser: User) => {
    const demoToken = "demo-token-" + Date.now();
    localStorage.setItem("studiospace_token", demoToken);
    localStorage.setItem("studiospace_user", JSON.stringify(demoUser));
    localStorage.setItem("studiospace_auth_mode", "demo");
    setUser(demoUser);
  };

  const fetchSession = useCallback(async () => {
    if (typeof window === "undefined") {
      setLoading(false);
      return;
    }

    // 1. Check if returning from Google OAuth redirect with token in query params
    const urlParams = new URLSearchParams(window.location.search);
    const urlToken = urlParams.get("auth_token") || urlParams.get("token");
    if (urlToken) {
      localStorage.setItem("studiospace_token", urlToken);
      localStorage.setItem("studiospace_auth_mode", "production");
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    const token = localStorage.getItem("studiospace_token");
    const authMode = localStorage.getItem("studiospace_auth_mode");

    // 2. Demo Mode persistence: Skip /auth/me call to stay independent of MongoDB
    if (token?.startsWith("demo-token-") || authMode === "demo") {
      const cached = localStorage.getItem("studiospace_user");
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          const u = normalizeUser(parsed);
          setUser({ ...u, isDemo: true });
          localStorage.setItem("studiospace_user", JSON.stringify({ ...u, isDemo: true }));
        } catch {
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
      return;
    }

    // 3. Production Mode: Query /auth/me with credentials: "include"
    if (token) {
      try {
        const data = await apiRequest<RawAuthResponse>("/auth/me");
        const rawUser = data?.user || (data?.email ? data : null);
        if (rawUser) {
          const u = normalizeUser(rawUser);
          setUser(u);
          localStorage.setItem("studiospace_user", JSON.stringify(u));
        } else {
          setUser(null);
          localStorage.removeItem("studiospace_token");
          localStorage.removeItem("studiospace_user");
        }
      } catch {
        // Fallback: If network or DB is temporarily down, restore from cached session
        const cached = localStorage.getItem("studiospace_user");
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            const u = normalizeUser(parsed);
            setUser(u);
            localStorage.setItem("studiospace_user", JSON.stringify(u));
          } catch {
            setUser(null);
          }
        } else {
          setUser(null);
        }
      }
    } else {
      setUser(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const loginDemo = async (role: "host" | "guest") => {
    const account = role === "host" ? PREDEFINED_DEMO_ACCOUNTS["host@studiospace.com"] : PREDEFINED_DEMO_ACCOUNTS["guest@studiospace.com"];
    authenticateDemoSession(account.user);
  };

  const login = async (email: string, password: string) => {
    const cleanEmail = email.toLowerCase().trim();

    // Try production API first
    try {
      const data = await apiRequest<RawAuthResponse>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email: cleanEmail, password }),
      });

      if (data?.token) {
        localStorage.setItem("studiospace_token", data.token);
        localStorage.setItem("studiospace_auth_mode", "production");
      }

      const rawUser = data?.user || (data?.email ? data : null);
      if (rawUser) {
        const u = normalizeUser(rawUser);
        setUser(u);
        localStorage.setItem("studiospace_user", JSON.stringify(u));
      } else {
        await fetchSession();
      }
      return;
    } catch (err: unknown) {
      const errorMsg = (err instanceof Error ? err.message : String(err || "")).toLowerCase();

      // If database is unavailable or unreachable, seamlessly activate Demo Mode
      const isDatabaseIssue =
        errorMsg.includes("database service unavailable") ||
        errorMsg.includes("service unavailable") ||
        errorMsg.includes("failed to fetch") ||
        errorMsg.includes("connection refused") ||
        errorMsg.includes("network error");

      // Check Predefined Demo Accounts
      const predefined = PREDEFINED_DEMO_ACCOUNTS[cleanEmail];
      if (predefined) {
        if (predefined.password === password || isDatabaseIssue) {
          authenticateDemoSession(predefined.user);
          return;
        }
        throw new Error("Invalid password. Please check your credentials.");
      }

      // Check Locally Stored Demo Accounts
      const stored = getStoredDemoAccounts()[cleanEmail];
      if (stored) {
        if (stored.password === password || isDatabaseIssue) {
          authenticateDemoSession(stored.user);
          return;
        }
        throw new Error("Invalid password. Please check your credentials.");
      }

      // If database is unavailable and not matching demo accounts, allow on-the-fly demo login
      if (isDatabaseIssue) {
        const onTheFlyUser: User = {
          id: "demo-user-" + Date.now(),
          name: cleanEmail.split("@")[0].replace(/[._-]/g, " "),
          email: cleanEmail,
          role: cleanEmail.includes("host") ? "host" : "guest",
          avatar: cleanEmail.includes("host")
            ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80"
            : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
          phone: "+1 (555) 019-2834",
          isDemo: true,
        };
        saveStoredDemoAccount(onTheFlyUser, password);
        authenticateDemoSession(onTheFlyUser);
        return;
      }

      throw err;
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "guest",
    avatar?: string
  ) => {
    const cleanEmail = email.toLowerCase().trim();

    // Try production API first
    try {
      const data = await apiRequest<RawAuthResponse>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          name: name.trim(),
          email: cleanEmail,
          password,
          role,
          avatar: avatar || "",
          photoURL: avatar || "",
        }),
      });

      if (data?.token) {
        localStorage.setItem("studiospace_token", data.token);
        localStorage.setItem("studiospace_auth_mode", "production");
      }

      const rawUser = data?.user || (data?.email ? data : null);
      if (rawUser) {
        const u = normalizeUser(rawUser);
        setUser(u);
        localStorage.setItem("studiospace_user", JSON.stringify(u));
      } else {
        await login(cleanEmail, password);
      }
      return;
    } catch (err: unknown) {
      const errorMsg = (err instanceof Error ? err.message : String(err || "")).toLowerCase();

      // If database is unavailable or unreachable, seamlessly activate Demo Mode
      const isDatabaseIssue =
        errorMsg.includes("database service unavailable") ||
        errorMsg.includes("service unavailable") ||
        errorMsg.includes("failed to fetch") ||
        errorMsg.includes("connection refused") ||
        errorMsg.includes("network error") ||
        errorMsg.includes("503") ||
        errorMsg.includes("500") ||
        errorMsg.includes("502") ||
        errorMsg.includes("504") ||
        errorMsg.includes("request failed with status 503") ||
        errorMsg.includes("failed to register");

      if (isDatabaseIssue) {
        const demoUser: User = {
          id: "demo-user-" + Date.now(),
          name: name.trim() || "Creative Producer",
          email: cleanEmail,
          role: role || "guest",
          avatar:
            avatar ||
            (role === "host"
              ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
              : "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"),
          phone: "",
          isDemo: true,
        };
        saveStoredDemoAccount(demoUser, password);
        authenticateDemoSession(demoUser);
        return;
      }

      throw err;
    }
  };

  /**
   * Initiates Google OAuth 2.0 Authorization Code flow.
   * Redirects user to backend `/auth/google` which forwards to Google Accounts.
   * Can be re-enabled at any time via GOOGLE_OAUTH_CONFIG or NEXT_PUBLIC_ENABLE_GOOGLE_AUTH=true.
   */
  const initiateGoogleLogin = () => {
    if (!GOOGLE_OAUTH_CONFIG.ENABLED) {
      console.warn("[Auth] Google Sign-In is temporarily disabled in configuration.");
      return;
    }
    const returnTo = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUrl = `${GOOGLE_OAUTH_CONFIG.AUTH_ENDPOINT}${returnTo ? `?returnTo=${encodeURIComponent(returnTo)}` : ""}`;
    window.location.href = redirectUrl;
  };

  /**
   * Completes direct Google Authentication with verified credential ID token.
   * Verifies against Google and updates active session.
   */
  const googleLogin = async (credential?: string) => {
    if (!GOOGLE_OAUTH_CONFIG.ENABLED) {
      throw new Error(
        "Google Sign-In is temporarily disabled. Please use standard Email/Password authentication."
      );
    }

    if (!credential) {
      initiateGoogleLogin();
      return;
    }

    const data = await apiRequest<RawAuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential }),
    });

    if (data?.token) {
      localStorage.setItem("studiospace_token", data.token);
      localStorage.setItem("studiospace_auth_mode", "production");
    }

    const rawUser = data?.user || (data?.email ? data : null);
    if (rawUser) {
      const u = normalizeUser(rawUser);
      setUser(u);
      localStorage.setItem("studiospace_user", JSON.stringify(u));
    } else {
      await fetchSession();
    }
  };

  const logout = async () => {
    const authMode = localStorage.getItem("studiospace_auth_mode");
    if (authMode !== "demo") {
      try {
        await apiRequest("/auth/logout", { method: "POST" });
      } catch {
        // Graceful
      }
    }
    localStorage.removeItem("studiospace_token");
    localStorage.removeItem("studiospace_user");
    localStorage.removeItem("studiospace_auth_mode");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        loginDemo,
        googleLogin,
        initiateGoogleLogin,
        isGoogleAuthEnabled: GOOGLE_OAUTH_CONFIG.ENABLED,
        logout,
        isAuthenticated: !!user,
        isHost: user?.role === "host" || user?.role === "admin",
        isDemoMode: Boolean(user?.isDemo),
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
