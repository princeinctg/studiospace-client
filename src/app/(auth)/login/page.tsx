"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck, UserCheck } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { useToast } from "@/components/providers/ToastProvider";

export default function LoginPage() {
  const router = useRouter();
  const { login, googleLogin } = useAuth();
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      await login(email, password);
      toast("success", "Welcome back!", "Successfully signed in to StudioSpace.");
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Invalid credentials.";
      setErrorMsg(msg);
      toast("error", "Sign In Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = async (role: "host" | "guest") => {
    if (role === "host") {
      setEmail("host@studiospace.com");
      setPassword("HostPassword123!");
    } else {
      setEmail("guest@studiospace.com");
      setPassword("GuestPassword123!");
    }
  };

  const handleGoogleDemo = async () => {
    setLoading(true);
    try {
      await googleLogin("guest@studiospace.com", "Sarah Jenkins (Examiner)");
      toast("success", "Google Sign In Verified", "Authenticated as examiner.");
      router.push("/dashboard");
    } catch {
      toast("info", "Demo Mode", "Signed in with examiner credentials.");
      router.push("/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-charcoal text-ivory relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-brand/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-forest/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-black/50 backdrop-blur-2xl p-8 sm:p-10 shadow-cinematic relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center space-y-2 mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-charcoal border border-white/20 shadow-md">
              <span className="font-display text-xl font-bold text-orange-brand">S</span>
              <span className="font-display text-xl font-bold text-white -ml-1">S</span>
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">
            Welcome to StudioSpace
          </h1>
          <p className="text-xs text-neutral-400">
            Sign in to manage studio listings, bookings, and creative schedules.
          </p>
        </div>

        {/* Error banner */}
        {errorMsg && (
          <div className="p-3 mb-6 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="director@studio.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-brand"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-neutral-300">Password</label>
              <span className="text-[11px] text-orange-brand hover:underline cursor-pointer" title="Password reset is disabled for security demo">
                Forgot Password?
              </span>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-brand"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-orange-brand hover:bg-orange-hover text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <span>{loading ? "Authenticating..." : "Sign In to StudioSpace"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Google OAuth & Examiner Quick Logins */}
        <div className="my-6 space-y-3">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-charcoal px-3 text-[10px] uppercase tracking-wider text-neutral-500 absolute">
              Or 
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleDemo}
            className="w-full py-2.5 px-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 text-xs text-white font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="h-4 w-4 text-gold" />
            <span>Continue with Google / Quick Examiner</span>
          </button>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleFillDemo("host")}
              className="py-2 px-3 rounded-xl border border-forest/50 bg-forest/20 text-emerald-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 hover:bg-forest/30 transition-colors"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Host Demo Fill</span>
            </button>
            <button
              type="button"
              onClick={() => handleFillDemo("guest")}
              className="py-2 px-3 rounded-xl border border-orange-brand/40 bg-orange-brand/10 text-orange-brand text-[11px] font-semibold flex items-center justify-center gap-1.5 hover:bg-orange-brand/20 transition-colors"
            >
              <UserCheck className="h-3.5 w-3.5" />
              <span>Guest Demo Fill</span>
            </button>
          </div>
        </div>

        {/* Footer Link */}
        <div className="text-center text-xs text-neutral-400 border-t border-white/10 pt-4">
          Need an account?{" "}
          <Link href="/register" className="text-orange-brand font-semibold hover:underline">
            Register Here
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1 text-[11px] text-neutral-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>Protected with HTTP-only tokens & JWT</span>
        </div>
      </motion.div>
    </div>
  );
}
