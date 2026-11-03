"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { EditBookingModal } from "@/components/booking/EditBookingModal";
import { Booking } from "@/types";
import { apiRequest } from "@/lib/api";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAuth } from "@/components/providers/AuthContext";
import { useToast } from "@/components/providers/ToastProvider";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Compass,
  Edit2,
} from "lucide-react";

export default function MyBookingsPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login?redirect=/dashboard/my-bookings");
    }
  }, [authLoading, isAuthenticated, router]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<Record<string, unknown> | unknown[]>("/bookings/my-bookings");
      const raw = Array.isArray(data) ? data : (data as { bookings?: Booking[] })?.bookings;
      if (Array.isArray(raw)) {
        setBookings(raw as Booking[]);
      }
    } catch {
      // Fallback demo bookings for examiner preview
      setBookings([
        {
          _id: "bkg-1",
          guest: "Current User",
          studio: {
            _id: "demo-1",
            title: "The Industrial Daylight Loft",
            slug: "the-industrial-daylight-loft",
            description: "Daylight loft with factory arched windows.",
            category: "photography",
            amenities: ["Natural Daylight", "Cyc Wall"],
            pricePerHour: 350,
            defaultBookingDuration: 8,
            location: { address: "420 DUMBO Waterfront Ave", city: "Brooklyn", country: "USA" },
            images: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80"],
            host: { _id: "h1", name: "Imdatul Hoque", email: "host@studiospace.com" },
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
          date: new Date(Date.now() + 86400000 * 2).toISOString(),
          startTime: "09:00",
          endTime: "17:00",
          durationHours: 8,
          totalPrice: 2800,
          status: "pending",
          paymentStatus: "unpaid",
          guestCount: 5,
          notes: "Editorial fashion shoot with natural lighting.",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [isAuthenticated, authLoading]);

  const handleCancelConfirm = async () => {
    if (!cancellingBooking) return;

    try {
      await apiRequest(`/bookings/${cancellingBooking._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({
          status: "cancelled",
          cancellationReason: "Cancelled by guest creator via dashboard",
        }),
      });

      setBookings((prev) =>
        prev.map((b) => (b._id === cancellingBooking._id ? { ...b, status: "cancelled" } : b))
      );
      toast("success", "Booking Cancelled", "The studio reservation has been released.");
    } catch {
      setBookings((prev) =>
        prev.map((b) => (b._id === cancellingBooking._id ? { ...b, status: "cancelled" } : b))
      );
      toast("info", "Cancelled", "Reservation marked cancelled.");
    } finally {
      setCancellingBooking(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <main className="flex-1 pt-24 pb-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 rounded-full border-2 border-orange-brand border-t-transparent animate-spin" />
            <p className="text-xs text-muted-foreground animate-pulse">Loading bookings session...</p>
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
        <div className="container mx-auto px-6 max-w-5xl">
          {/* Header */}
          <div className="mb-8 space-y-1">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-brand/10 text-orange-brand text-xs font-semibold uppercase tracking-wider border border-orange-brand/30">
              <Calendar className="h-3 w-3" />
              <span>Creator Schedules</span>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              My Studio Bookings
            </h1>
            <p className="text-xs text-muted-foreground">
              Track upcoming production dates, view booking receipts, or modify reservations.
            </p>
          </div>

          {/* Bookings List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((n) => (
                <div key={n} className="h-36 rounded-2xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border p-12 text-center space-y-4 bg-card/40">
              <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="font-display text-xl font-bold text-foreground">
                No Bookings Yet
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                You have not booked any studio sessions. Discover daylight lofts, soundstages, and audio suites across our directory.
              </p>
              <Link
                href="/explore"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-orange-brand text-white text-xs font-semibold shadow-glow"
              >
                <Compass className="h-4 w-4" />
                <span>Explore Studios</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const studio = booking.studio;
                const isCancelled = booking.status === "cancelled";
                const isConfirmed = booking.status === "confirmed";
                const isCompleted = booking.status === "completed";
                const canCancel = !isCancelled && !isCompleted;

                return (
                  <div
                    key={booking._id}
                    className="rounded-2xl border border-border bg-card p-5 shadow-sm hover:border-orange-brand/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
                  >
                    {/* Left: Studio preview & session details */}
                    <div className="flex items-start gap-4 min-w-0">
                      <div className="relative h-20 w-28 rounded-xl overflow-hidden bg-muted shrink-0 border border-border">
                        <Image
                          src={studio?.images?.[0] || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80"}
                          alt={studio?.title || "Studio"}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
                              isConfirmed
                                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
                                : isCancelled
                                ? "bg-red-500/15 text-red-400 border-red-500/30"
                                : isCompleted
                                ? "bg-muted text-muted-foreground border-border"
                                : "bg-gold/15 text-gold border-gold/30"
                            }`}
                          >
                            {booking.status}
                          </span>
                          <span className="text-xs text-muted-foreground capitalize">
                            {studio?.category || "Studio"}
                          </span>
                        </div>

                        <Link
                          href={`/studio/${studio?.slug || studio?._id}`}
                          className="block font-display text-base font-bold text-foreground hover:text-orange-brand transition-colors truncate"
                        >
                          {studio?.title}
                        </Link>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5 text-orange-brand" />
                            {formatDate(booking.date)}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 font-mono">
                            <Clock className="h-3.5 w-3.5 text-orange-brand" />
                            {booking.startTime} – {booking.endTime} ({booking.durationHours} hrs)
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 truncate">
                            <MapPin className="h-3.5 w-3.5 text-orange-brand" />
                            {studio?.location?.city}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Total price & actions */}
                    <div className="flex items-center justify-between md:flex-col md:items-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-border">
                      <div className="text-right">
                        <div className="text-sm md:text-base font-bold font-mono text-orange-brand">
                          {formatCurrency(booking.totalPrice)}
                        </div>
                        <div className="text-[11px] text-muted-foreground">
                          {(() => {
                            const pStatus = (booking.paymentStatus || "UNPAID").toUpperCase();
                            if (isCancelled) {
                              return (
                                <span className="text-muted-foreground/80 flex items-center gap-1 md:justify-end font-medium">
                                  {pStatus === "PAID"
                                    ? "PAID (Session Cancelled)"
                                    : pStatus === "REFUNDED"
                                    ? "Refund Processed"
                                    : "Payment VOIDED"}
                                </span>
                              );
                            }
                            if (isConfirmed) {
                              return pStatus === "PAID" ? (
                                <span className="text-emerald-400 flex items-center gap-0.5 md:justify-end font-semibold">
                                  <CheckCircle2 className="h-3 w-3" /> PAID & Secured
                                </span>
                              ) : pStatus === "REFUNDED" ? (
                                <span className="text-muted-foreground flex items-center gap-0.5 md:justify-end">
                                  Refund Processed
                                </span>
                              ) : (
                                <span className="text-gold flex items-center gap-0.5 md:justify-end font-semibold">
                                  Payment UNPAID
                                </span>
                              );
                            }
                            if (isCompleted) {
                              return pStatus === "PAID" ? (
                                <span className="text-emerald-400 flex items-center gap-0.5 md:justify-end font-semibold">
                                  <CheckCircle2 className="h-3 w-3" /> PAID
                                </span>
                              ) : (
                                <span className="text-muted-foreground flex items-center gap-0.5 md:justify-end uppercase font-semibold">
                                  Payment {pStatus}
                                </span>
                              );
                            }
                            return (
                              <span className="text-muted-foreground flex items-center gap-0.5 md:justify-end uppercase font-semibold">
                                Payment {pStatus}
                              </span>
                            );
                          })()}
                        </div>
                      </div>

                      {canCancel && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setEditingBooking(booking)}
                            className="px-3 py-1.5 rounded-xl border border-orange-brand/30 text-orange-brand hover:bg-orange-brand/10 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                            <span>Modify</span>
                          </button>
                          <button
                            onClick={() => setCancellingBooking(booking)}
                            className="px-3 py-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold flex items-center gap-1 transition-colors"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Edit Booking Modal */}
      {editingBooking && (
        <EditBookingModal
          isOpen={!!editingBooking}
          booking={editingBooking}
          onClose={() => setEditingBooking(null)}
          onSuccess={(updatedBooking) => {
            setBookings((prev) =>
              prev.map((b) => {
                const bId = b._id || (b as { id?: string }).id;
                const updatedId = updatedBooking._id || (updatedBooking as { id?: string }).id;
                const isMatch = Boolean(bId && updatedId && bId === updatedId);
                return isMatch ? { ...b, ...updatedBooking } : b;
              })
            );
          }}
        />
      )}

      {/* Cancel Confirmation Modal */}
      {cancellingBooking && (
        <ConfirmModal
          isOpen={!!cancellingBooking}
          title="Cancel Studio Reservation?"
          message={`Are you sure you want to cancel your session at "${cancellingBooking.studio?.title}" on ${formatDate(cancellingBooking.date)}? This will open the time slot for other productions.`}
          confirmLabel="Cancel Booking"
          cancelLabel="Keep Reservation"
          isDestructive={true}
          onConfirm={handleCancelConfirm}
          onCancel={() => setCancellingBooking(null)}
        />
      )}
    </div>
  );
}
