"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Clock,
  Users,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Plus,
  Minus,
  Hourglass,
} from "lucide-react";
import { Studio, Booking } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { apiRequest } from "@/lib/api";
import { useAuth } from "@/components/providers/AuthContext";
import { useToast } from "@/components/providers/ToastProvider";

interface BookingModalProps {
  studio: Studio;
  isOpen: boolean;
  onClose: () => void;
}

function calculateEndTime(start: string, duration: number): string {
  const [h, m] = start.split(":").map(Number);
  const totalMins = (h || 0) * 60 + (m || 0) + Math.round(duration * 60);
  const clampedHours = Math.min(23, Math.floor(totalMins / 60) % 24);
  const clampedMins = totalMins % 60;
  return `${String(clampedHours).padStart(2, "0")}:${String(clampedMins).padStart(2, "0")}`;
}

function calculateDuration(start: string, end: string): number {
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  const startTotal = (startH || 0) * 60 + (startM || 0);
  let endTotal = (endH || 0) * 60 + (endM || 0);
  if (endTotal <= startTotal) {
    endTotal += 24 * 60; // Overnight or next day wrap
  }
  const diff = (endTotal - startTotal) / 60;
  return Math.min(24, Math.max(1, Math.round(diff * 10) / 10));
}

export function BookingModal({ studio, isOpen, onClose }: BookingModalProps) {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const defaultDuration = studio.defaultBookingDuration || 8;

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDateStr = tomorrow.toISOString().split("T")[0];

  const [date, setDate] = useState(defaultDateStr);
  const [startTime, setStartTime] = useState("09:00");
  const [durationHours, setDurationHours] = useState(defaultDuration);
  const [endTime, setEndTime] = useState(() => calculateEndTime("09:00", defaultDuration));
  const [guestCount, setGuestCount] = useState(4);
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [conflictError, setConflictError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Sync duration with studio default when modal opens or studio changes
  useEffect(() => {
    if (isOpen) {
      const initialDuration = studio.defaultBookingDuration || 8;
      setDurationHours(initialDuration);
      setStartTime("09:00");
      setEndTime(calculateEndTime("09:00", initialDuration));
      setConflictError("");
      setConfirmedBooking(null);
    }
  }, [isOpen, studio]);

  // Handle duration change (from presets or steppers)
  const handleDurationChange = (newDuration: number) => {
    const clamped = Math.min(24, Math.max(1, newDuration));
    setDurationHours(clamped);
    setEndTime(calculateEndTime(startTime, clamped));
  };

  // Handle start time change
  const handleStartTimeChange = (newStart: string) => {
    setStartTime(newStart);
    setEndTime(calculateEndTime(newStart, durationHours));
  };

  // Handle end time change manually
  const handleEndTimeChange = (newEnd: string) => {
    setEndTime(newEnd);
    const newDur = calculateDuration(startTime, newEnd);
    setDurationHours(newDur);
  };

  // Dynamic price calculation
  const hourlyRate = studio.pricePerHour || 100;
  const totalPrice = Math.round(durationHours * hourlyRate);

  // Duration preset options based on default duration
  const durationPresets = Array.from(
    new Set([
      defaultDuration,
      defaultDuration + 2,
      defaultDuration + 4,
      Math.min(24, defaultDuration + 6),
      16,
      24,
    ])
  )
    .filter((d) => d <= 24)
    .sort((a, b) => a - b);

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError("");
    setLoading(true);

    try {
      const res = await apiRequest<{ message: string; booking: Booking }>("/bookings", {
        method: "POST",
        body: JSON.stringify({
          studioId: studio._id || studio.id,
          date,
          startTime,
          endTime,
          guestCount: Number(guestCount),
          notes,
        }),
      });

      if (res.booking) {
        // Enforce pending and unpaid status presentation
        const pendingBooking: Booking = {
          ...res.booking,
          status: res.booking.status || "pending",
          paymentStatus: res.booking.paymentStatus || "unpaid",
          durationHours,
          totalPrice,
        };
        setConfirmedBooking(pendingBooking);
        toast(
          "success",
          "Reservation Request Submitted!",
          "Your booking is pending host confirmation."
        );
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      const isConflict =
        errorMsg.toLowerCase().includes("conflict") ||
        errorMsg.includes("409") ||
        errorMsg.toLowerCase().includes("already reserved") ||
        errorMsg.toLowerCase().includes("double-booking");

      if (isConflict) {
        setConflictError(
          "Schedule Conflict: This studio is already reserved during the requested time slot. Please choose another window."
        );
        toast(
          "error",
          "Slot Unavailable",
          "This studio is already reserved for that time window. Please select an alternate date or time."
        );
      } else {
        toast("error", "Booking Failed", errorMsg || "Failed to process booking request. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setConfirmedBooking(null);
    setConflictError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-cinematic text-card-foreground my-8 max-h-[90vh] overflow-y-auto"
        >
          {/* Close button */}
          <button
            onClick={handleReset}
            className="absolute top-5 right-5 p-2 rounded-full bg-secondary hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Close modal"
          >
            <X className="h-4 w-4" />
          </button>

          {confirmedBooking ? (
            /* Success confirmation screen - Pending Host Approval */
            <div className="text-center py-4 space-y-4">
              <div className="h-16 w-16 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                <Hourglass className="h-8 w-8 animate-pulse" />
              </div>

              <div className="space-y-1">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Status: Pending Host Approval</span>
                </div>
                <h3 className="font-display text-2xl font-bold text-foreground pt-1">
                  Reservation Request Submitted
                </h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Your booking request for <span className="text-foreground font-semibold">{studio.title}</span> has been received. The host will review your request. No payment has been charged.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-secondary/60 border border-border text-left space-y-2.5 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Reserved Date</span>
                  <span className="font-semibold text-foreground">{date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time Window</span>
                  <span className="font-semibold text-foreground">{startTime} – {endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Selected Duration</span>
                  <span className="font-semibold text-foreground">{durationHours} hours</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Hourly Rate</span>
                  <span className="font-semibold text-foreground">{formatCurrency(hourlyRate)}/hr</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Payment Status</span>
                  <span className="font-semibold text-amber-400 uppercase tracking-wider text-[11px]">Unpaid (Pending Confirmation)</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2 text-sm">
                  <span className="font-bold text-foreground">Estimated Total</span>
                  <span className="font-bold text-orange-brand font-mono">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Link
                  href="/dashboard/my-bookings"
                  onClick={handleReset}
                  className="flex-1 py-3 px-4 rounded-xl bg-orange-brand hover:bg-orange-hover text-white text-xs font-semibold shadow-glow flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>View in My Bookings</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={handleReset}
                  className="px-4 py-3 rounded-xl border border-border text-xs font-medium hover:bg-secondary transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleBookingSubmit} className="space-y-5">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-gold flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Studio Reservation
                </span>
                <h3 className="font-display text-2xl font-bold tracking-tight text-foreground mt-1">
                  Book Studio Time
                </h3>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{studio.title}</span>
                  <span>•</span>
                  <span className="font-bold text-orange-brand font-mono">{formatCurrency(hourlyRate)}/hour</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-medium">Default: {defaultDuration}h booking</span>
                </div>
              </div>

              {/* Guest / Auth Banner */}
              {!isAuthenticated && (
                <div className="p-2.5 rounded-xl bg-orange-brand/10 border border-orange-brand/30 text-orange-brand text-xs flex items-center justify-between">
                  <span>Booking as Guest.</span>
                  <Link href="/login" className="font-semibold underline">Sign in for rewards</Link>
                </div>
              )}

              {/* Conflict banner */}
              {conflictError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{conflictError}</span>
                </div>
              )}

              {/* Date Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-orange-brand" />
                  <span>Production Date</span>
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:border-orange-brand"
                />
              </div>

              {/* Duration Selector: Presets & Stepper */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-orange-brand" />
                    <span>Booking Duration</span>
                  </label>
                  <span className="text-xs font-mono font-bold text-orange-brand">
                    {durationHours} {durationHours === 1 ? "Hour" : "Hours"}
                  </span>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {durationPresets.map((preset) => {
                    const isSelected = durationHours === preset;
                    const isDefault = preset === defaultDuration;
                    return (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => handleDurationChange(preset)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-orange-brand text-white shadow-glow"
                            : "bg-secondary hover:bg-secondary/80 text-foreground border border-border"
                        }`}
                      >
                        {preset}h {isDefault ? "(Default)" : ""}
                      </button>
                    );
                  })}
                </div>

                {/* Duration Stepper Controls */}
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/50 border border-border">
                  <span className="text-xs text-muted-foreground">
                    Adjust hours (Default: {defaultDuration}h)
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleDurationChange(durationHours - 1)}
                      disabled={durationHours <= 1}
                      className="p-1.5 rounded-lg bg-secondary hover:bg-border text-foreground transition-all disabled:opacity-40"
                      aria-label="Decrease 1 hour"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-12 text-center font-mono font-bold text-sm text-foreground">
                      {durationHours}h
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDurationChange(durationHours + 1)}
                      disabled={durationHours >= 24}
                      className="p-1.5 rounded-lg bg-secondary hover:bg-border text-foreground transition-all disabled:opacity-40"
                      aria-label="Increase 1 hour"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {durationHours < defaultDuration && (
                  <p className="text-[11px] text-amber-400">
                    Note: Studio recommends a default reservation of at least {defaultDuration} hours.
                  </p>
                )}
              </div>

              {/* Start & End Times */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-orange-brand" />
                    <span>Start Time</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={startTime}
                    onChange={(e) => handleStartTimeChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:border-orange-brand"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-orange-brand" />
                    <span>End Time</span>
                  </label>
                  <input
                    type="time"
                    required
                    value={endTime}
                    onChange={(e) => handleEndTimeChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:border-orange-brand"
                  />
                </div>
              </div>

              {/* Crew / Guest Count */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <Users className="h-3.5 w-3.5 text-orange-brand" />
                  <span>Expected Crew Size</span>
                </label>
                <input
                  type="number"
                  min="1"
                  max={studio.capacity || 50}
                  value={guestCount}
                  onChange={(e) => setGuestCount(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:border-orange-brand"
                />
              </div>

              {/* Special Production Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Production Notes (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Lighting requirements, freight elevator needed, quiet audio session..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-secondary border border-border text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-brand"
                />
              </div>

              {/* Price Calculation Card */}
              <div className="p-4 rounded-2xl bg-secondary/70 border border-border space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Hourly Rate</span>
                  <span className="font-semibold text-foreground font-mono">{formatCurrency(hourlyRate)} / hr</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Selected Duration</span>
                  <span className="font-semibold text-foreground">{durationHours} {durationHours === 1 ? "hour" : "hours"}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Calculation</span>
                  <span className="font-mono text-foreground">{formatCurrency(hourlyRate)} × {durationHours}h</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-400">
                  <span>Cleaning & Equipment Prep</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-xs text-amber-400">
                  <span>Initial Booking Status</span>
                  <span className="font-semibold">Pending Approval (Unpaid)</span>
                </div>
                <div className="flex justify-between text-base font-bold text-foreground border-t border-border pt-2">
                  <span>Estimated Total</span>
                  <span className="font-mono text-orange-brand text-lg">{formatCurrency(totalPrice)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-2xl bg-orange-brand hover:bg-orange-hover text-white font-bold text-sm shadow-glow transition-all hover:scale-[1.02] disabled:opacity-50"
              >
                {loading ? "Verifying Availability..." : `Request Booking • ${formatCurrency(totalPrice)} (Pending)`}
              </button>

              <div className="text-center flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Protected by double-booking collision prevention • Never automatically charged</span>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
