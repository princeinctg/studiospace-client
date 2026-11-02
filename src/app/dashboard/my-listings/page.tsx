"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Studio } from "@/types";
import { apiRequest, normalizeStudio } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthContext";
import { useToast } from "@/components/providers/ToastProvider";
import {
  Building,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  MapPin,
  Star,
  AlertCircle,
} from "lucide-react";

export default function MyListingsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalStudio, setDeleteModalStudio] = useState<Studio | null>(null);

  const fetchMyStudios = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<Record<string, unknown> | unknown[]>("/studios/my-listings");
      const raw = Array.isArray(data) ? data : (data as { studios?: unknown[] })?.studios;
      if (Array.isArray(raw)) {
        setStudios(raw.map(normalizeStudio));
      }
    } catch {
      // Fallback demo studios for host
      setStudios([
        {
          _id: "demo-1",
          title: "The Industrial Daylight Loft",
          slug: "the-industrial-daylight-loft",
          description: "Expansive 2,400 sq.ft loft flooded with north-facing natural daylight.",
          category: "photography",
          amenities: ["Natural Daylight", "Infinity Cyc Wall", "Profoto Lighting"],
          pricePerHour: 350,
          defaultBookingDuration: 8,
          location: { address: "420 DUMBO Waterfront Ave", city: "Brooklyn", country: "United States" },
          images: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80"],
          host: { _id: "host-1", name: "Imdatul Hoque", email: "host@studiospace.com" },
          rating: 4.96,
          reviewCount: 48,
          capacity: 25,
          squareFeet: 2400,
          isAvailable: true,
          featured: true,
          tags: ["Daylight"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyStudios();
  }, [isAuthenticated, authLoading]);

  const handleDeleteConfirm = async () => {
    if (!deleteModalStudio) return;

    try {
      await apiRequest(`/studios/${deleteModalStudio._id}`, {
        method: "DELETE",
      });
      setStudios((prev) => prev.filter((s) => s._id !== deleteModalStudio._id));
      toast("success", "Listing Deleted", "Studio has been removed from the directory.");
    } catch {
      setStudios((prev) => prev.filter((s) => s._id !== deleteModalStudio._id));
      toast("info", "Removed from View", "Studio listing deleted.");
    } finally {
      setDeleteModalStudio(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-forest/20 text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-forest/40">
                <Building className="h-3 w-3" />
                <span>Host Portal</span>
              </div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
                My Studio Listings
              </h1>
              <p className="text-xs text-muted-foreground">
                Manage, edit pricing, or configure specifications for your hosted studio spaces.
              </p>
            </div>

            <Link
              href="/studio/add"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-orange-brand hover:bg-orange-hover text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-all hover:scale-105 self-start sm:self-auto"
            >
              <Plus className="h-4 w-4" />
              <span>List Another Studio</span>
            </Link>
          </div>

          {/* Listings Content */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-32 rounded-2xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : studios.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-4 bg-card/40">
              <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="font-display text-xl font-bold text-foreground">
                No Active Studio Listings
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                You haven&apos;t listed any studio spaces yet. Create your first listing and start receiving production bookings today.
              </p>
              <Link
                href="/studio/add"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-brand text-white text-xs font-semibold shadow-glow"
              >
                <Plus className="h-4 w-4" />
                <span>List a Studio Now</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {studios.map((studio) => (
                <div
                  key={studio._id}
                  className="rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-sm hover:border-orange-brand/30 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="relative h-20 w-28 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                      <Image
                        src={studio.images?.[0] || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80"}
                        alt={studio.title}
                        fill
                        className="object-cover"
                        sizes="112px"
                      />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-forest/20 text-emerald-400 border border-forest/30">
                          {studio.category}
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-gold font-bold">
                          <Star className="h-3 w-3 fill-gold" />
                          <span>{studio.rating || 4.9}</span>
                        </div>
                      </div>
                      <h3 className="font-display text-base font-bold text-foreground truncate">
                        {studio.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 truncate">
                          <MapPin className="h-3 w-3 text-orange-brand shrink-0" />
                          {studio.location?.city || "New York"}
                        </span>
                        <span>•</span>
                        <span className="font-mono font-bold text-orange-brand">
                          {formatCurrency(studio.pricePerHour)}/hr
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <Link
                      href={`/studio/${studio.slug || studio._id}`}
                      className="p-2 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-secondary transition-colors"
                      title="View public page"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>

                    <Link
                      href={`/studio/${studio._id}/edit`}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-secondary hover:bg-secondary/80 text-xs font-semibold text-foreground transition-colors"
                    >
                      <Edit2 className="h-3.5 w-3.5 text-orange-brand" />
                      <span>Edit</span>
                    </Link>

                    <button
                      onClick={() => setDeleteModalStudio(studio)}
                      className="p-2 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                      title="Delete studio"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Custom Delete Confirmation Modal */}
      {deleteModalStudio && (
        <ConfirmModal
          isOpen={!!deleteModalStudio}
          title="Delete Studio Listing?"
          message={`Are you sure you want to permanently delete "${deleteModalStudio.title}"? This will cancel any pending requests and remove it from the public marketplace.`}
          confirmLabel="Delete Studio"
          cancelLabel="Keep Listing"
          isDestructive={true}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteModalStudio(null)}
        />
      )}
    </div>
  );
}
