"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { User, UserRole } from "@/types";
import { apiRequest } from "@/lib/api";
import { GOOGLE_OAUTH_CONFIG } from "@/lib/auth-config";
import {
  isFirebaseConfigured,
  signInWithFirebaseGoogle,
  signOutFirebase,
} from "@/lib/firebase";

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

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role?: UserRole, avatar?: string) => Promise<void>;
  loginDemo: (role: "host" | "guest") => Promise<void>;
  googleLogin: (credential?: string) => Promise<void>;
  initiateGoogleLogin: (role?: UserRole, redirect?: string, from?: "login" | "register") => Promise<void> | void;
  loginWithFirebaseGoogle: (role?: UserRole) => Promise<boolean>;
  isFirebaseEnabled: boolean;
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

  const setClientCookie = (token: string) => {
    if (typeof document !== "undefined") {
      document.cookie = `studiospace_token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`;
    }
  };

  const clearClientCookie = () => {
    if (typeof document !== "undefined") {
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      document.cookie = "studiospace_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
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
      setClientCookie(urlToken);
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    let token = localStorage.getItem("studiospace_token");
    if (!token && typeof document !== "undefined") {
      const match = document.cookie.match(/(?:^|;\s*)(?:studiospace_token|token)=([^;]*)/);
      if (match && match[1]) {
        token = decodeURIComponent(match[1]);
        localStorage.setItem("studiospace_token", token);
      }
    }

    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    // Purge any synthetic or invalid legacy tokens
    if (token.startsWith("demo-token-")) {
      localStorage.removeItem("studiospace_token");
      localStorage.removeItem("studiospace_user");
      clearClientCookie();
      setUser(null);
      setLoading(false);
      return;
    }

    // Real Authentication: Query /auth/me with Bearer token & cookies
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
        clearClientCookie();
      }
    } catch {
      setUser(null);
      localStorage.removeItem("studiospace_token");
      localStorage.removeItem("studiospace_user");
      clearClientCookie();
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const login = async (email: string, password: string) => {
    const cleanEmail = email.toLowerCase().trim();

    const data = await apiRequest<RawAuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: cleanEmail, password }),
    });

    if (data?.token) {
      localStorage.setItem("studiospace_token", data.token);
      localStorage.setItem("studiospace_auth_mode", "production");
      setClientCookie(data.token);
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

  const loginDemo = async (role: "host" | "guest") => {
    const email = role === "host" ? "host@studiospace.com" : "guest@studiospace.com";
    const password = role === "host" ? "HostPassword123!" : "GuestPassword123!";
    await login(email, password);
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole = "guest",
    avatar?: string
  ) => {
    const cleanEmail = email.toLowerCase().trim();

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
      setClientCookie(data.token);
    }

    const rawUser = data?.user || (data?.email ? data : null);
    if (rawUser) {
      const u = normalizeUser(rawUser);
      setUser(u);
      localStorage.setItem("studiospace_user", JSON.stringify(u));
    } else {
      await login(cleanEmail, password);
    }
  };

  /**
   * Traditional Google OAuth 2.0 Authorization Code redirect flow.
   * Redirects user to backend `/auth/google` which forwards to Google Accounts.
   * Preserves destination redirect, user role, and originating auth page.
   */
  const initiateTraditionalOAuth = (
    role?: UserRole,
    redirect?: string,
    from: "login" | "register" = "login"
  ) => {
    if (!GOOGLE_OAUTH_CONFIG.ENABLED) {
      console.warn("[Auth] Google Sign-In is temporarily disabled in configuration.");
      return;
    }
    const returnTo = typeof window !== "undefined" ? window.location.origin : "";
    const statePayload = JSON.stringify({
      returnTo,
      role: role || "guest",
      redirect: redirect || "/dashboard",
      from,
    });
    const redirectUrl = `${GOOGLE_OAUTH_CONFIG.AUTH_ENDPOINT}?state=${encodeURIComponent(
      statePayload
    )}&returnTo=${encodeURIComponent(returnTo)}&role=${encodeURIComponent(role || "guest")}`;
    window.location.href = redirectUrl;
  };

  /**
   * Primary Authentication: Firebase Google Sign-In with popup.
   * Retrieves Google profile and verified ID token, then calls backend /api/auth/google
   * to create or update the user in MongoDB Atlas and issue JWT session.
   */
  const loginWithFirebaseGoogle = async (
    role: UserRole = "guest"
  ): Promise<boolean> => {
    const cred = await signInWithFirebaseGoogle();
    const fbUser = cred.user;
    const idToken = await fbUser.getIdToken();

    const data = await apiRequest<RawAuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify({
        email: fbUser.email,
        name: fbUser.displayName || "Google User",
        avatar: fbUser.photoURL || "",
        googleId: fbUser.uid,
        credential: idToken,
        role,
      }),
    });

    if (data?.token) {
      localStorage.setItem("studiospace_token", data.token);
      localStorage.setItem("studiospace_auth_mode", "production");
      setClientCookie(data.token);
    }

    const rawUser = data?.user || (data?.email ? data : null);
    if (rawUser) {
      const u = normalizeUser(rawUser);
      setUser(u);
      localStorage.setItem("studiospace_user", JSON.stringify(u));
    } else {
      await fetchSession();
    }

    return true;
  };

  /**
   * Unified Google Authentication:
   * 1. Primary: Firebase Google Authentication popup.
   * 2. Automatic Fallback: If Firebase fails due to a genuine provider, credential,
   *    or configuration error, automatically attempts Traditional Google OAuth.
   * 3. Respects user cancellation (popup closed) without triggering unexpected redirect.
   */
  const initiateGoogleLogin = async (
    role?: UserRole,
    redirect?: string,
    from: "login" | "register" = "login"
  ): Promise<void> => {
    const targetRole = role || "guest";
    const targetRedirect = redirect || "/dashboard";

    if (isFirebaseConfigured()) {
      try {
        console.log("[Auth] Attempting primary authentication: Firebase Google Sign-In...");
        await loginWithFirebaseGoogle(targetRole);
        if (typeof window !== "undefined") {
          const cleanTarget = targetRedirect.startsWith("/") ? targetRedirect : `/${targetRedirect}`;
          window.location.href = cleanTarget;
        }
        return;
      } catch (err: unknown) {
        const fbErr = err as { code?: string; message?: string };
        // User deliberately closed popup window -> respect choice, do not redirect
        if (
          fbErr?.code === "auth/popup-closed-by-user" ||
          fbErr?.code === "auth/cancelled-popup-request" ||
          fbErr?.message?.includes("closed-by-user")
        ) {
          console.log("[Auth] User closed Google popup window.");
          return;
        }

        // Genuine provider or configuration error -> automatically attempt Traditional Google OAuth fallback
        console.warn(
          "[Auth] Firebase Google Auth error, automatically falling back to Traditional Google OAuth:",
          fbErr?.code || fbErr?.message || err
        );
        initiateTraditionalOAuth(targetRole, targetRedirect, from);
        return;
      }
    }

    // Firebase not yet configured in environment -> automatically attempt Traditional Google OAuth fallback
    console.log("[Auth] Firebase not configured in environment, attempting Traditional Google OAuth fallback...");
    initiateTraditionalOAuth(targetRole, targetRedirect, from);
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
      await initiateGoogleLogin();
      return;
    }

    const data = await apiRequest<RawAuthResponse>("/auth/google", {
      method: "POST",
      body: JSON.stringify({ credential }),
    });

    if (data?.token) {
      localStorage.setItem("studiospace_token", data.token);
      localStorage.setItem("studiospace_auth_mode", "production");
      setClientCookie(data.token);
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
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch {
      // Graceful
    }
    await signOutFirebase().catch(() => {});
    localStorage.removeItem("studiospace_token");
    localStorage.removeItem("studiospace_user");
    localStorage.removeItem("studiospace_auth_mode");
    clearClientCookie();
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
        loginWithFirebaseGoogle,
        isFirebaseEnabled: isFirebaseConfigured(),
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
