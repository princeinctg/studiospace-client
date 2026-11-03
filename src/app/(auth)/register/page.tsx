"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, ShieldCheck, Building, Sparkles } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { useToast } from "@/components/providers/ToastProvider";
import { BrandLogo } from "@/components/ui/BrandLogo";
import { GoogleLogo } from "@/components/ui/GoogleLogo";
import { UserRole } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser, initiateGoogleLogin, isGoogleAuthEnabled } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("guest");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  React.useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlError = params.get("error");
      if (urlError) {
        setErrorMsg(urlError);
        toast("error", "Google Authentication Notice", urlError);
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, [toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      toast("error", "Validation Error", "Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await registerUser(name, email, password, role);
      toast("success", "Account Created!", `Welcome to StudioSpace as a ${role}.`);
      router.push("/dashboard");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to register account.";
      setErrorMsg(msg);
      toast("error", "Registration Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    if (!isGoogleAuthEnabled) {
      toast(
        "info",
        "Temporarily Disabled",
        "Google Sign-Up is temporarily disabled for maintenance. Please use Email and Password to create your account."
      );
      return;
    }
    const redirectTarget =
      typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("redirect") || "/dashboard"
        : "/dashboard";
    try {
      setLoading(true);
      setErrorMsg("");
      await initiateGoogleLogin(role, redirectTarget, "register");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google registration failed";
      setErrorMsg(msg);
      toast("error", "Sign Up Failed", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-charcoal text-ivory relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-brand/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-forest/20 rounded-full blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl border border-white/10 bg-black/50 backdrop-blur-2xl p-8 sm:p-10 shadow-cinematic relative z-10"
      >
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-6">
          <BrandLogo variant="auth" href="/" priority />
          <div className="space-y-1">
            <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Create Your Account
            </h1>
            <p className="text-xs text-neutral-400">
              Join the global directory of creative studio hosts and productions.
            </p>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 mb-4 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role selector buttons */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">I want to:</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("guest")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  role === "guest"
                    ? "border-orange-brand bg-orange-brand text-white shadow-glow"
                    : "border-white/10 bg-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                <Sparkles className="h-3.5 w-3.5" />
                <span>Book Studios</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("host")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                  role === "host"
                    ? "border-orange-brand bg-orange-brand text-white shadow-glow"
                    : "border-white/10 bg-white/5 text-neutral-400 hover:text-white"
                }`}
              >
                <Building className="h-3.5 w-3.5" />
                <span>List / Host</span>
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tanvir Ahmed"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-brand"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="creator@domain.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-brand"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 h-4 w-4 text-neutral-500" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-brand"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-orange-brand hover:bg-orange-hover text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
          >
            <span>{loading ? "Creating Account..." : "Create Account"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        {/* Google OAuth Quick Registration */}
        <div className="my-6 space-y-3">
          <div className="relative flex items-center justify-center">
            <div className="border-t border-white/10 w-full" />
            <span className="bg-charcoal px-3 text-[10px] uppercase tracking-wider text-neutral-500 absolute">
              Or
            </span>
          </div>

          <button
            type="button"
            onClick={handleGoogleAuth}
            className="w-full py-3 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white hover:border-orange-brand/50 text-xs font-semibold flex items-center justify-center gap-2.5 shadow-sm transition-all cursor-pointer hover:scale-[1.01]"
            title="Continue with Google"
          >
            <GoogleLogo className="h-4 w-4 shrink-0" />
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="text-center text-xs text-neutral-400 border-t border-white/10 pt-4 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-orange-brand font-semibold hover:underline">
            Sign in
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1 text-[11px] text-neutral-500">
          <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span>No credit card required for browsing</span>
        </div>
      </motion.div>
    </div>
  );
}
