"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight, ShieldCheck, Building, Sparkles } from "lucide-react";
import { useAuth } from "@/components/providers/AuthContext";
import { useToast } from "@/components/providers/ToastProvider";
import { UserRole } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("guest");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
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
        <div className="text-center space-y-2 mb-6">
          <Link href="/" className="inline-flex items-center gap-2 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-charcoal border border-white/20 shadow-md">
              <span className="font-display text-xl font-bold text-orange-brand">S</span>
              <span className="font-display text-xl font-bold text-white -ml-1">S</span>
            </div>
          </Link>
          <h1 className="font-display text-3xl font-bold tracking-tight text-white">
            Create Your Account
          </h1>
          <p className="text-xs text-neutral-400">
            Join the global directory of creative studio hosts and productions.
          </p>
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
            <span>{loading ? "Creating Account..." : "Complete Registration"}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="text-center text-xs text-neutral-400 border-t border-white/10 pt-4 mt-6">
          Already registered?{" "}
          <Link href="/login" className="text-orange-brand font-semibold hover:underline">
            Sign In Here
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
