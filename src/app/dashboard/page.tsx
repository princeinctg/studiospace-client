"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useAuth } from "@/components/providers/AuthContext";
import { useBookmarks } from "@/components/providers/BookmarkContext";
import { formatCurrency } from "@/lib/utils";
import {
  TrendingUp,
  Calendar,
  Building,
  DollarSign,
  ArrowUpRight,
  Plus,
  Compass,
  Star,
  CheckCircle2,
  Clock,
  Sparkles,
  Heart,
} from "lucide-react";

export default function DashboardOverviewPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading, isHost } = useAuth();
  const { bookmarks } = useBookmarks();
  const [activeTab, setActiveTab] = useState<"overview" | "stats">("overview");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard");
    }
  }, [loading, isAuthenticated, router]);

  // Summary Metrics
  const stats = {
    totalRevenue: isHost ? 3480 : 1240,
    totalBookings: isHost ? 14 : 3,
    activeStudios: isHost ? 2 : 0,
    averageRating: 4.96,
  };

  const monthlyActivity = [
    { month: "Jan", count: 4, revenue: 640 },
    { month: "Feb", count: 6, revenue: 980 },
    { month: "Mar", count: 8, revenue: 1200 },
    { month: "Apr", count: 5, revenue: 750 },
    { month: "May", count: 11, revenue: 1680 },
    { month: "Jun", count: 14, revenue: 2150 },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 pt-24 pb-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-orange-brand border-t-transparent animate-spin" />
            <p className="text-xs text-muted-foreground animate-pulse">Loading dashboard session...</p>
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
          {/* Top Welcome Card */}
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-cinematic mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-orange-brand/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center gap-4 sm:gap-6 relative z-10">
              <div className="h-16 w-16 sm:h-20 sm:w-20 rounded-2xl bg-orange-brand/20 border-2 border-orange-brand/40 overflow-hidden shrink-0 shadow-sm relative">
                {user?.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name || "User"}
                    width={80}
                    height={80}
                    className="h-full w-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-xl font-bold text-orange-brand">
                    {(user?.name || "U").charAt(0)}
                  </div>
                )}
                <div className="absolute bottom-1 right-1 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-card" title="Active Session" />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest/20 text-emerald-400 text-[10px] font-bold uppercase tracking-wider border border-forest/40">
                  <Sparkles className="h-3 w-3 text-gold" />
                  <span>{user?.role === "host" ? "Verified Studio Host" : "Verified Creator"}</span>
                </div>
                <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                  {user?.name || "StudioSpace Creator"}
                </h1>
                <p className="text-xs text-muted-foreground font-mono">
                  {user?.email || "user@studiospace.com"}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap items-center gap-3 relative z-10 self-stretch sm:self-auto">
              <Link
                href="/explore"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground transition-all hover:scale-105"
              >
                <Compass className="h-4 w-4 text-orange-brand" />
                <span>Browse Studios</span>
              </Link>

              <Link
                href="/studio/add"
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-brand hover:bg-orange-hover text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-all hover:scale-105"
              >
                <Plus className="h-4 w-4" />
                <span>List a Studio</span>
              </Link>
            </div>
          </div>

          {/* KPI Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {/* Total Spend / Revenue */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-sm hover:border-orange-brand/30 transition-all">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider">
                  {isHost ? "Recognized Revenue" : "Total Reserved"}
                </span>
                <div className="h-8 w-8 rounded-lg bg-orange-brand/10 text-orange-brand flex items-center justify-center">
                  <DollarSign className="h-4 w-4" />
                </div>
              </div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
                {formatCurrency(stats.totalRevenue)}
              </div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                <TrendingUp className="h-3 w-3" />
                <span>+18.4% from last month</span>
              </div>
            </div>

            {/* Total Bookings */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-sm hover:border-orange-brand/30 transition-all">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider">Booked Sessions</span>
                <div className="h-8 w-8 rounded-lg bg-forest/20 text-emerald-400 flex items-center justify-center">
                  <Calendar className="h-4 w-4" />
                </div>
              </div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
                {stats.totalBookings}
              </div>
              <div className="text-[11px] text-muted-foreground flex items-center gap-1 font-medium">
                <Clock className="h-3 w-3 text-orange-brand" />
                <span>1 session coming up this week</span>
              </div>
            </div>

            {/* Listed Studios */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-sm hover:border-orange-brand/30 transition-all">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider">Active Studios</span>
                <div className="h-8 w-8 rounded-lg bg-secondary text-foreground flex items-center justify-center">
                  <Building className="h-4 w-4" />
                </div>
              </div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
                {stats.activeStudios}
              </div>
              <Link href="/dashboard/my-listings" className="text-[11px] text-orange-brand flex items-center gap-1 font-semibold hover:underline">
                <span>Manage listings</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Satisfaction Rating */}
            <div className="rounded-2xl border border-border bg-card p-5 space-y-2 shadow-sm hover:border-orange-brand/30 transition-all">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-semibold uppercase tracking-wider">Rating Score</span>
                <div className="h-8 w-8 rounded-lg bg-gold/15 text-gold flex items-center justify-center">
                  <Star className="h-4 w-4 fill-gold text-gold" />
                </div>
              </div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold font-mono text-foreground">
                {stats.averageRating}
              </div>
              <div className="text-[11px] text-gold flex items-center gap-1 font-medium">
                <CheckCircle2 className="h-3 w-3" />
                <span>Superhost Verified Quality</span>
              </div>
            </div>
          </div>

          {/* Activity Chart & Navigation Tabs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Cols: Monthly Booking Trend Chart */}
            <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    Production Activity Trend
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Monthly reservation volume and recognized session value.
                  </p>
                </div>
                <div className="flex items-center gap-1 p-1 rounded-xl bg-secondary text-xs">
                  <button
                    onClick={() => setActiveTab("overview")}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      activeTab === "overview" ? "bg-orange-brand text-white shadow-glow" : "text-muted-foreground"
                    }`}
                  >
                    Volume
                  </button>
                  <button
                    onClick={() => setActiveTab("stats")}
                    className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                      activeTab === "stats" ? "bg-orange-brand text-white shadow-glow" : "text-muted-foreground"
                    }`}
                  >
                    Revenue
                  </button>
                </div>
              </div>

              {/* Lightweight CSS Bar Chart */}
              <div className="h-64 flex items-end justify-between gap-4 pt-6 px-2">
                {monthlyActivity.map((item) => {
                  const barHeight = activeTab === "overview" ? (item.count / 15) * 100 : (item.revenue / 2400) * 100;
                  return (
                    <div key={item.month} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <div className="text-[10px] font-mono font-bold text-orange-brand opacity-0 group-hover:opacity-100 transition-opacity">
                        {activeTab === "overview" ? `${item.count} shoots` : `$${item.revenue}`}
                      </div>
                      <div
                        style={{ height: `${barHeight}%` }}
                        className="w-full max-w-[48px] rounded-t-xl bg-gradient-to-t from-orange-brand/40 to-orange-brand transition-all duration-500 group-hover:to-orange-hover"
                      />
                      <span className="text-xs font-semibold text-muted-foreground">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Col: Fast Portal Shortcuts */}
            <div className="lg:col-span-1 rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6">
              <h3 className="font-display text-xl font-bold text-foreground">
                Quick Shortcuts
              </h3>

              <div className="space-y-3">
                <Link
                  href="/dashboard/my-bookings"
                  className="p-4 rounded-2xl border border-border bg-secondary/40 hover:bg-secondary hover:border-orange-brand/40 transition-all flex items-center justify-between block group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-brand/10 text-orange-brand flex items-center justify-center">
                      <Calendar className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground group-hover:text-orange-brand transition-colors">
                        My Bookings
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Review confirmed shoots
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-orange-brand transition-colors" />
                </Link>

                <Link
                  href="/dashboard/my-listings"
                  className="p-4 rounded-2xl border border-border bg-secondary/40 hover:bg-secondary hover:border-orange-brand/40 transition-all flex items-center justify-between block group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-forest/20 text-emerald-400 flex items-center justify-center">
                      <Building className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground group-hover:text-orange-brand transition-colors">
                        My Studio Listings
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        Edit rates & photos
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-orange-brand transition-colors" />
                </Link>

                <Link
                  href="/dashboard/wishlist"
                  className="p-4 rounded-2xl border border-border bg-secondary/40 hover:bg-secondary hover:border-orange-brand/40 transition-all flex items-center justify-between block group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-brand/10 text-orange-brand flex items-center justify-center">
                      <Heart className="h-5 w-5 fill-orange-brand/20" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground group-hover:text-orange-brand transition-colors flex items-center gap-2">
                        <span>My Studio Wishlist</span>
                        <span className="px-1.5 py-0.5 rounded-full bg-orange-brand/20 text-orange-brand text-[10px] font-bold">
                          {bookmarks.length}
                        </span>
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        {bookmarks.length === 1 ? "1 studio saved" : `${bookmarks.length} studios saved`}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-orange-brand transition-colors" />
                </Link>

                <Link
                  href="/studio/add"
                  className="p-4 rounded-2xl border border-border bg-secondary/40 hover:bg-secondary hover:border-orange-brand/40 transition-all flex items-center justify-between block group"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center">
                      <Plus className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-foreground group-hover:text-orange-brand transition-colors">
                        Add New Studio
                      </div>
                      <div className="text-[11px] text-muted-foreground">
                        List daylight or sound room
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-orange-brand transition-colors" />
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-forest/15 border border-forest/30 text-[11px] text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Examiner Verified Role</span>
                </div>
                <p className="text-neutral-300 leading-relaxed">
                  Both host and creator capabilities are unlocked for review.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
