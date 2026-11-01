"use client";

import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Compass, Sparkles, Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-charcoal text-ivory relative overflow-hidden">
      <Navbar />

      {/* Ambient background blur */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-brand/10 rounded-full blur-[160px] pointer-events-none" />

      <main className="flex-1 flex items-center justify-center p-6 relative z-10 pt-24 pb-16">
        <div className="max-w-lg w-full text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-brand/20 border border-orange-brand/40 text-orange-brand text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>404 • Coordinate Lost</span>
          </div>

          <h1 className="font-display text-7xl sm:text-8xl font-black text-white tracking-tight">
            404
          </h1>

          <div className="space-y-2">
            <h2 className="font-display text-2xl font-bold text-white">
              Studio Space Not Found
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-sm mx-auto leading-relaxed">
              The soundstage, daylight loft, or route you are searching for has relocated or is no longer part of our active directory.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-brand hover:bg-orange-hover text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-all hover:scale-105"
            >
              <Home className="h-4 w-4" />
              <span>Back to Homepage</span>
            </Link>

            <Link
              href="/explore"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs font-semibold transition-colors"
            >
              <Compass className="h-4 w-4 text-orange-brand" />
              <span>Browse Active Studios</span>
            </Link>
          </div>

          <div className="pt-6 border-t border-white/10 text-[11px] text-neutral-500 flex items-center justify-center gap-2">
            <ArrowLeft className="h-3 w-3" />
            <span>Need assistance? Contact our 24/7 Creator Concierge</span>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
