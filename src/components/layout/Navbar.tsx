"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  Menu,
  X,
  Sun,
  Moon,
  Plus,
  LogOut,
  LayoutDashboard,
  Calendar,
  Building,
  Heart,
} from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import { useAuth } from "@/components/providers/AuthContext";
import { BrandLogo } from "@/components/ui/BrandLogo";

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const { resolvedTheme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setUserDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    router.push("/login");
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Explore Studios", href: "/explore" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "About Us", href: "/#about" },
  ];

  const mobileNavLinks = [
    { label: "Home", href: "/" },
    { label: "Explore Studios", href: "/explore" },
    { label: "How It Works", href: "/#how-it-works" },
    { label: "About Us", href: "/#about" },
    ...(isAuthenticated
      ? [
          { label: "Dashboard", href: "/dashboard" },
          { label: "Add New Studio", href: "/studio/add" },
          { label: "My Studio Listings", href: "/dashboard/my-listings" },
          { label: "My Bookings", href: "/dashboard/my-bookings" },
          { label: "Wishlist", href: "/dashboard/wishlist" },
        ]
      : [
          { label: "Sign In", href: "/login" },
          { label: "Register", href: "/register" },
        ]),
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-background/85 backdrop-blur-xl border-b border-border/80 shadow-cinematic py-3"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto flex items-center justify-between">
          {/* Brand Logo */}
          <BrandLogo variant="navbar" href="/" priority />

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-secondary/60 backdrop-blur-md border border-border/60">
            {navLinks.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : link.href.startsWith("/#")
                  ? false
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    isActive
                      ? "text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 rounded-full bg-orange-brand shadow-glow"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10">{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary/60 transition-colors"
              title="Toggle Light / Dark Mode"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <Sun className="h-4 w-4 text-gold hover:rotate-45 transition-transform" />
              ) : (
                <Moon className="h-4 w-4 text-orange-brand hover:-rotate-12 transition-transform" />
              )}
            </button>

            {/* List Studio CTA */}
            <Link
              href="/studio/add"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-border bg-secondary/40 hover:bg-secondary text-xs font-medium text-foreground transition-all hover:scale-[1.02]"
            >
              <Plus className="h-3.5 w-3.5 text-orange-brand" />
              <span>List a Studio</span>
            </Link>

            {/* Auth Dropdown or Sign In */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full border border-border bg-card/70 hover:border-orange-brand/50 transition-all"
                >
                  <span className="text-xs font-medium text-foreground hidden lg:inline max-w-[120px] truncate">
                    {user.name.split(" ")[0]}
                  </span>
                  <div className="h-7 w-7 rounded-full bg-orange-brand/20 border border-orange-brand/40 text-orange-brand flex items-center justify-center text-xs font-bold overflow-hidden">
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.name}
                        width={28}
                        height={28}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    ) : (
                      user.name.charAt(0)
                    )}
                  </div>
                </button>

                <AnimatePresence>
                  {userDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl border bg-card/95 backdrop-blur-xl p-2 shadow-cinematic z-50 text-card-foreground"
                    >
                      <div className="flex items-center gap-2.5 px-3 py-2.5 border-b border-border/60 mb-1">
                        <div className="h-9 w-9 rounded-full bg-orange-brand/20 border border-orange-brand/40 overflow-hidden shrink-0">
                          {user.avatar ? (
                            <Image
                              src={user.avatar}
                              alt={user.name}
                              width={36}
                              height={36}
                              className="h-full w-full object-cover"
                              unoptimized
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center text-xs font-bold text-orange-brand">
                              {user.name.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold truncate text-foreground">{user.name}</div>
                          <div className="text-[11px] text-muted-foreground truncate">{user.email}</div>
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-forest/20 text-emerald-400 border border-forest/40">
                            {user.role}
                          </span>
                        </div>
                      </div>

                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-secondary/70 transition-colors"
                      >
                        <LayoutDashboard className="h-4 w-4 text-orange-brand" />
                        <span>Dashboard</span>
                      </Link>

                      <Link
                        href="/studio/add"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-secondary/70 transition-colors"
                      >
                        <Plus className="h-4 w-4 text-orange-brand" />
                        <span>Add New Studio</span>
                      </Link>

                      <Link
                        href="/dashboard/my-listings"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-secondary/70 transition-colors"
                      >
                        <Building className="h-4 w-4 text-gold" />
                        <span>My Studio Listings</span>
                      </Link>

                      <Link
                        href="/dashboard/my-bookings"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-secondary/70 transition-colors"
                      >
                        <Calendar className="h-4 w-4 text-emerald-400" />
                        <span>My Bookings</span>
                      </Link>

                      <Link
                        href="/dashboard/wishlist"
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium hover:bg-secondary/70 transition-colors"
                      >
                        <Heart className="h-4 w-4 text-orange-brand" />
                        <span>Wishlist</span>
                      </Link>

                      <div className="border-t border-border/60 my-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/register"
                  className="hidden sm:inline-flex items-center px-3.5 py-1.5 rounded-xl border border-border/80 hover:bg-secondary text-xs font-semibold text-foreground transition-all hover:scale-[1.02]"
                >
                  Register
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-orange-brand hover:bg-orange-hover text-white shadow-glow transition-all hover:scale-[1.02]"
                >
                  Sign In
                </Link>
              </div>
            )}

            {/* Mobile Menu Trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-border md:hidden text-muted-foreground hover:text-foreground"
              aria-label="Toggle mobile navigation"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-x-0 top-[72px] z-30 md:hidden bg-card/95 backdrop-blur-2xl border-b border-border shadow-cinematic px-6 py-6"
          >
            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between pb-3 border-b border-border/60 mb-1">
                <BrandLogo variant="compact" href="/" />
                <span className="text-[10px] font-semibold uppercase tracking-wider text-gold">
                  Creative Marketplace
                </span>
              </div>
              {mobileNavLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-base font-semibold py-2 px-3 rounded-xl transition-colors ${
                    pathname === link.href
                      ? "bg-orange-brand/10 text-orange-brand"
                      : "text-foreground hover:bg-secondary/60"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/studio/add"
                className="flex items-center justify-center gap-2 py-3 rounded-xl border border-border bg-secondary font-medium text-sm text-foreground mt-2"
              >
                <Plus className="h-4 w-4 text-orange-brand" />
                <span>List a Studio</span>
              </Link>

              {/* Mobile Auth Section */}
              {isAuthenticated && user ? (
                <div className="pt-3 border-t border-border/60 mt-2 flex flex-col gap-2">
                  <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-secondary/50">
                    <div className="h-8 w-8 rounded-full bg-orange-brand/20 border border-orange-brand/40 text-orange-brand flex items-center justify-center text-xs font-bold overflow-hidden">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.name}
                          width={32}
                          height={32}
                          className="h-full w-full object-cover"
                          unoptimized
                        />
                      ) : (
                        user.name.charAt(0)
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate text-foreground">{user.name}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{user.email}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-forest/20 text-emerald-400 border border-forest/40">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    href="/dashboard/my-listings"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium hover:bg-secondary/60 text-foreground transition-colors"
                  >
                    <Building className="h-4 w-4 text-gold" />
                    <span>My Studios</span>
                  </Link>

                  <Link
                    href="/dashboard/my-bookings"
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium hover:bg-secondary/60 text-foreground transition-colors"
                  >
                    <Calendar className="h-4 w-4 text-emerald-400" />
                    <span>My Bookings</span>
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-3 border-t border-border/60 mt-2 flex flex-col gap-2">
                  <Link
                    href="/login"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-orange-brand hover:bg-orange-hover text-white text-sm font-semibold shadow-glow transition-all"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-foreground text-sm font-semibold transition-all"
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
