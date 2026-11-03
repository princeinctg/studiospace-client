"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/components/providers/AuthContext";
import { useBookmarks } from "@/components/providers/BookmarkContext";
import { Studio } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  Heart,
  MapPin,
  Sparkles,
  ArrowRight,
  Compass,
  Trash2,
  ExternalLink,
  Star,
} from "lucide-react";

export default function WishlistPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { bookmarks, toggleBookmark, fetchWishlistStudios } = useBookmarks();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard/wishlist");
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    let isMounted = true;
    async function loadWishlist() {
      if (!isAuthenticated) return;
      setLoading(true);
      try {
        const list = await fetchWishlistStudios();
        if (isMounted) {
          setStudios(list);
        }
      } catch {
        if (isMounted) {
          setStudios([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadWishlist();
    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, fetchWishlistStudios, bookmarks.length]);

  const handleRemove = async (studio: Studio) => {
    const studioId = studio._id || studio.id || studio.slug;
    await toggleBookmark(studio);
    setStudios((prev) => prev.filter((s) => (s._id || s.id || s.slug) !== studioId));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 pt-24 pb-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-orange-brand border-t-transparent animate-spin" />
            <p className="text-xs text-muted-foreground animate-pulse">Loading saved wishlist...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6">
            <div className="space-y-2 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-brand/10 border border-orange-brand/30 text-orange-brand text-xs font-semibold uppercase tracking-wider">
                <Heart className="h-3.5 w-3.5 fill-orange-brand" />
                <span>Saved Studios</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
                My Studio Wishlist
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Curate daylight photography lofts, soundproofed recording suites, and virtual stages for your upcoming productions.
              </p>
            </div>

            <Link
              href="/explore"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary hover:border-orange-brand/50 text-xs font-semibold text-foreground transition-all hover:scale-105 self-start md:self-auto shadow-sm"
            >
              <Compass className="h-4 w-4 text-orange-brand" />
              <span>Explore More Studios</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Wishlist Grid or Empty State */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : studios.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 sm:p-16 text-center space-y-4 bg-card/40 max-w-xl mx-auto my-8">
              <div className="h-16 w-16 rounded-2xl bg-orange-brand/10 text-orange-brand border border-orange-brand/30 flex items-center justify-center mx-auto shadow-sm">
                <Heart className="h-8 w-8 text-orange-brand" />
              </div>
              <div className="space-y-1">
                <h3 className="font-display text-2xl font-bold text-foreground">
                  Your Wishlist is Empty
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                  You haven&apos;t saved any creative spaces yet. Click the heart icon on any studio card across the directory to save it to your wishlist.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/explore"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-brand hover:bg-orange-hover text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-all hover:scale-105"
                >
                  <Compass className="h-4 w-4" />
                  <span>Explore Studios</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {studios.map((studio, idx) => {
                  const studioId = studio._id || studio.id || studio.slug;
                  const images = studio.images && studio.images.length > 0
                    ? studio.images
                    : ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80"];

                  return (
                    <motion.div
                      key={studioId}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                      className="group relative rounded-2xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-cinematic hover:border-orange-brand/40 overflow-hidden flex flex-col transition-all"
                    >
                      {/* Top Image Showcase */}
                      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                        <Image
                          src={images[0]}
                          alt={studio.title}
                          fill
                          priority={idx < 4}
                          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />

                        {/* Badges Overlay */}
                        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
                          <span className="pointer-events-auto px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-forest/80 backdrop-blur-md text-emerald-300 border border-forest/60 shadow-sm flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-gold" />
                            {studio.category}
                          </span>

                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemove(studio);
                            }}
                            className="pointer-events-auto p-2 rounded-full bg-black/60 hover:bg-red-500/80 backdrop-blur-md text-orange-brand hover:text-white transition-all hover:scale-110 shadow-sm"
                            title="Remove from Wishlist"
                            aria-label="Remove from Wishlist"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      {/* Studio Info Section */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-1.5">
                          {/* Location & Rating */}
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <div className="flex items-center gap-1 truncate max-w-[180px]">
                              <MapPin className="h-3.5 w-3.5 text-orange-brand shrink-0" />
                              <span className="truncate">
                                {studio.location?.city || "New York"}, {studio.location?.country || "USA"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 font-semibold text-foreground">
                              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                              <span>{studio.rating || 4.9}</span>
                            </div>
                          </div>

                          {/* Studio Title */}
                          <Link
                            href={`/studio/${studio.slug || studio._id}`}
                            className="block font-display text-base font-bold text-foreground hover:text-orange-brand transition-colors line-clamp-1"
                          >
                            {studio.title}
                          </Link>

                          {/* Hourly Rate */}
                          <div className="pt-1 text-sm font-bold font-mono text-orange-brand">
                            {formatCurrency(studio.pricePerHour)}
                            <span className="text-xs font-normal text-muted-foreground font-sans">
                              {" "}
                              / hour
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons: View Details & Remove */}
                        <div className="flex items-center gap-2 pt-2 border-t border-border">
                          <Link
                            href={`/studio/${studio.slug || studio._id}`}
                            className="flex-1 py-2 px-3 rounded-xl bg-secondary hover:bg-secondary/80 border border-border hover:border-orange-brand/40 text-xs font-semibold text-foreground transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>View Details</span>
                            <ExternalLink className="h-3 w-3 text-orange-brand" />
                          </Link>

                          <button
                            type="button"
                            onClick={() => handleRemove(studio)}
                            className="py-2 px-3 rounded-xl border border-red-500/20 hover:bg-red-500/10 text-xs font-semibold text-red-400 transition-colors flex items-center gap-1"
                            title="Remove from Wishlist"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Remove</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
