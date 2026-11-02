"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Heart, Camera, Radio, Music, Film, Activity } from "lucide-react";
import { BrandLogo } from "@/components/ui/BrandLogo";

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
            <BrandLogo variant="footer" href="/" />
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
              <li>
                <Link href="/explore?category=dance" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-orange-brand" />
                  <span>Dance & Movement</span>
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
                  Sign In
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
          <div className="flex items-center gap-4">
            <span>© {new Date().getFullYear()} StudioSpace Platform Inc. All rights reserved.</span>
            <div className="flex items-center gap-3 text-neutral-400">
              {/* Modern X Logo (formerly Twitter) */}
              <a
                href="https://x.com/mdiftiarafprin1"
                target="_blank"
                rel="noreferrer"
                aria-label="X (formerly Twitter)"
                className="hover:text-white transition-colors"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              <a
                href="https://github.com/princeinctg"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                className="hover:text-white transition-colors"
              >
                <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                </svg>
              </a>
            </div>
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
