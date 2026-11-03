"use client";

import React, { useState, useEffect } from "react";
import { Booking } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { apiRequest } from "@/lib/api";
import { useToast } from "@/components/providers/ToastProvider";
import {
  Calendar,
  Clock,
  Users,
  FileText,
  X,
  AlertTriangle,
  CheckCircle2,
} from "lucide-react";

interface EditBookingModalProps {
  isOpen: boolean;
  booking: Booking | null;
  onClose: () => void;
  onSuccess: (updatedBooking: Booking) => void;
}

export function EditBookingModal({
  isOpen,
  booking,
  onClose,
  onSuccess,
}: EditBookingModalProps) {
  const { toast } = useToast();

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");
  const [guestCount, setGuestCount] = useState(1);
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (booking) {
      const rawDate = booking.date ? new Date(booking.date) : new Date();
      const formattedDate = !isNaN(rawDate.getTime())
        ? rawDate.toISOString().split("T")[0]
        : "";
      setDate(formattedDate);
      setStartTime(booking.startTime || "09:00");
      setEndTime(booking.endTime || "17:00");
      setGuestCount(booking.guestCount || 1);
      setNotes(booking.notes || "");
      setErrorMsg("");
    }
  }, [booking]);

  if (!isOpen || !booking) return null;

  const studio = booking.studio;
  const pricePerHour = studio?.pricePerHour || 100;

  // Calculate duration and total price dynamically
  const [startH, startM] = startTime.split(":").map(Number);
  const [endH, endM] = endTime.split(":").map(Number);
  const startMins = (isNaN(startH) ? 9 : startH) * 60 + (isNaN(startM) ? 0 : startM);
  const endMins = (isNaN(endH) ? 17 : endH) * 60 + (isNaN(endM) ? 0 : endM);
  const isValidTime = endMins > startMins;
  const durationHours = isValidTime
    ? Math.round(((endMins - startMins) / 60) * 10) / 10
    : 0;
  const estimatedTotal = Math.round(durationHours * pricePerHour);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValidTime) {
      setErrorMsg("End time must be later than start time.");
      return;
    }

    setSubmitting(true);
    setErrorMsg("");

    try {
      const res = await apiRequest<{ booking?: Booking; message?: string }>(
        `/bookings/${booking._id}`,
        {
          method: "PUT",
          body: JSON.stringify({
            date,
            startTime,
            endTime,
            guestCount: Number(guestCount),
            notes: notes.trim(),
          }),
        }
      );

      const updated = res?.booking || {
        ...booking,
        date: new Date(date).toISOString(),
        startTime,
        endTime,
        durationHours,
        totalPrice: estimatedTotal,
        guestCount: Number(guestCount),
        notes: notes.trim(),
        updatedAt: new Date().toISOString(),
      };

      toast("success", "Reservation Updated", "Your studio booking details have been saved.");
      onSuccess(updated);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to update booking.";
      if (msg.includes("conflict") || msg.includes("Double-booking") || msg.includes("409")) {
        setErrorMsg("Time Slot Unavailable: Another confirmed session overlaps with these hours.");
        toast("error", "Scheduling Conflict", "This time slot is already booked. Please choose another time.");
      } else {
        setErrorMsg(msg);
        toast("error", "Update Failed", msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-cinematic text-foreground">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          aria-label="Close dialog"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1 mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-brand/10 text-orange-brand text-xs font-semibold uppercase tracking-wider border border-orange-brand/30">
            <Clock className="h-3 w-3" />
            <span>Modify Reservation</span>
          </div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-foreground">
            {studio?.title || "Studio Session"}
          </h2>
          <p className="text-xs text-muted-foreground">
            Update your reserved date, hours, or production requirements.
          </p>
        </div>

        {/* Error Banner */}
        {errorMsg && (
          <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Date Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-orange-brand" />
              <span>Production Date</span>
            </label>
            <input
              type="date"
              required
              value={date}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/60 border border-border text-xs text-foreground focus:outline-none focus:border-orange-brand"
            />
          </div>

          {/* Time Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-orange-brand" />
                <span>Start Time</span>
              </label>
              <input
                type="time"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/60 border border-border text-xs text-foreground focus:outline-none focus:border-orange-brand font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-orange-brand" />
                <span>End Time</span>
              </label>
              <input
                type="time"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/60 border border-border text-xs text-foreground focus:outline-none focus:border-orange-brand font-mono"
              />
            </div>
          </div>

          {/* Guest Count */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5 text-orange-brand" />
              <span>Production Crew & Guest Count</span>
            </label>
            <input
              type="number"
              min={1}
              max={100}
              required
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/60 border border-border text-xs text-foreground focus:outline-none focus:border-orange-brand"
            />
          </div>

          {/* Production Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5 text-orange-brand" />
              <span>Session Notes & Equipment Requests</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Lighting pack requests, load-in requirements, crew headcount..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-secondary/60 border border-border text-xs text-foreground placeholder-muted-foreground focus:outline-none focus:border-orange-brand resize-none"
            />
          </div>

          {/* Pricing Summary */}
          <div className="p-4 rounded-2xl bg-secondary/40 border border-border flex items-center justify-between text-xs">
            <div>
              <span className="text-muted-foreground">Session Duration:</span>{" "}
              <span className="font-bold text-foreground font-mono">{durationHours} hrs</span>
              <div className="text-[11px] text-muted-foreground">
                ${pricePerHour}/hr base rate
              </div>
            </div>
            <div className="text-right">
              <div className="text-[11px] text-muted-foreground">Updated Total</div>
              <div className="text-lg font-bold font-mono text-orange-brand">
                {formatCurrency(estimatedTotal)}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="px-4 py-2.5 rounded-xl border border-border hover:bg-secondary text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !isValidTime}
              className="px-5 py-2.5 rounded-xl bg-orange-brand hover:bg-orange-hover text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <div className="h-3.5 w-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
