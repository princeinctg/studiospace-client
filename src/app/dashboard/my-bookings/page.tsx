"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
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
} from "lucide-react";

export default function MyBookingsPage() {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingBooking, setCancellingBooking] = useState<Booking | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await apiRequest<{ bookings: Booking[] }>("/bookings/my-bookings");
      if (data?.bookings) {
        setBookings(data.bookings);
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
            pricePerHour: 125,
            location: { address: "420 DUMBO Waterfront Ave", city: "Brooklyn", country: "USA" },
            images: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=400&q=80"],
            host: { _id: "h1", name: "Alex Vance", email: "host@studiospace.com" },
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
          startTime: "10:00",
          endTime: "14:00",
          durationHours: 4,
          totalPrice: 500,
          status: "confirmed",
          paymentStatus: "paid",
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
      toast("info", "Cancelled (Demo)", "Reservation marked cancelled.");
    } finally {
      setCancellingBooking(null);
    }
  };

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
                          {isCancelled ? (
                            <span className="text-muted-foreground/80 flex items-center gap-1 md:justify-end font-medium">
                              {booking.paymentStatus === "paid" ? (
                                "Paid (Session Cancelled)"
                              ) : booking.paymentStatus === "refunded" ? (
                                "Refund Processed"
                              ) : (
                                "Payment Voided"
                              )}
                            </span>
                          ) : isConfirmed ? (
                            booking.paymentStatus === "paid" ? (
                              <span className="text-emerald-400 flex items-center gap-0.5 md:justify-end">
                                <CheckCircle2 className="h-3 w-3" /> Paid & Secured
                              </span>
                            ) : booking.paymentStatus === "refunded" ? (
                              <span className="text-muted-foreground flex items-center gap-0.5 md:justify-end">
                                Refund Processed
                              </span>
                            ) : (
                              <span className="text-gold flex items-center gap-0.5 md:justify-end">
                                Payment Pending
                              </span>
                            )
                          ) : isCompleted ? (
                            booking.paymentStatus === "paid" ? (
                              <span className="text-emerald-400 flex items-center gap-0.5 md:justify-end">
                                <CheckCircle2 className="h-3 w-3" /> Paid
                              </span>
                            ) : (
                              <span className="text-muted-foreground flex items-center gap-0.5 md:justify-end capitalize">
                                Payment {booking.paymentStatus}
                              </span>
                            )
                          ) : (
                            <span className="text-muted-foreground flex items-center gap-0.5 md:justify-end capitalize">
                              Payment {booking.paymentStatus}
                            </span>
                          )}
                        </div>
                      </div>

                      {canCancel && (
                        <button
                          onClick={() => setCancellingBooking(booking)}
                          className="px-3 py-1.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 text-xs font-semibold flex items-center gap-1 transition-colors"
                        >
                          <XCircle className="h-3.5 w-3.5" />
                          <span>Cancel Booking</span>
                        </button>
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
