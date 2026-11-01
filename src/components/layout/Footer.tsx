"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Heart, Camera, Radio, Music, Film } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-charcoal text-ivory pt-16 pb-12 overflow-hidden relative">
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-orange-brand/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-10 left-10 w-80 h-80 bg-forest/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black border border-white/20 shadow-md">
                <span className="font-display text-xl font-bold text-orange-brand">S</span>
                <span className="font-display text-xl font-bold text-white -ml-1">S</span>
              </div>
              <span className="font-display text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                StudioSpace
                <Sparkles className="h-4 w-4 text-gold" />
              </span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed max-w-sm">
              The premier marketplace connecting directors, photographers, audio engineers, and creators with world-class production spaces worldwide.
            </p>
            <div className="flex items-center gap-2 text-xs text-neutral-400 pt-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              <span>Verified Studio Hosts • Double-Booking Protected</span>
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-gold">
              Explore Spaces
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/explore?category=photography" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Camera className="h-3.5 w-3.5 text-orange-brand" />
                  <span>Daylight Photo Lofts</span>
                </Link>
              </li>
              <li>
                <Link href="/explore?category=recording" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Music className="h-3.5 w-3.5 text-orange-brand" />
                  <span>Dolby Audio Suites</span>
                </Link>
              </li>
              <li>
                <Link href="/explore?category=film" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Film className="h-3.5 w-3.5 text-orange-brand" />
                  <span>LED Soundstages</span>
                </Link>
              </li>
              <li>
                <Link href="/explore?category=podcast" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Radio className="h-3.5 w-3.5 text-orange-brand" />
                  <span>4K Podcast Rooms</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Hosting */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-gold">
              Host Community
            </h4>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>
                <Link href="/studio/add" className="hover:text-white transition-colors">
                  List Your Studio
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Host Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/my-listings" className="hover:text-white transition-colors">
                  Manage Listings
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">
                  Examiner Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs uppercase tracking-widest font-semibold text-gold">
              Cinematic Drops
            </h4>
            <p className="text-xs text-neutral-400">
              Curated architectural spaces & creative studio spotlights every week.
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter email..."
                  className="w-full px-3.5 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-orange-brand"
                />
                <button
                  type="submit"
                  className="absolute right-1 top-1 bottom-1 px-3 rounded-lg bg-orange-brand text-white flex items-center justify-center hover:bg-orange-hover transition-colors"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-neutral-500 gap-4">
          <div>
            © {new Date().getFullYear()} StudioSpace Platform Inc. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-neutral-300 transition-colors">Privacy Policy</Link>
            <Link href="/" className="hover:text-neutral-300 transition-colors">Terms of Service</Link>
            <span className="flex items-center gap-1 text-neutral-400">
              Built with <Heart className="h-3 w-3 text-orange-brand fill-orange-brand" /> for creators
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
