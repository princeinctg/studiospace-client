"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export function ConfirmModal({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isDestructive = false,
}: ConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md rounded-3xl border border-border bg-card p-6 shadow-cinematic text-card-foreground space-y-5"
        >
          <button
            onClick={onCancel}
            className="absolute top-4 right-4 p-1.5 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-start gap-3.5">
            <div
              className={`h-11 w-11 rounded-2xl flex items-center justify-center shrink-0 ${
                isDestructive
                  ? "bg-red-500/10 border border-red-500/30 text-red-500"
                  : "bg-orange-brand/10 border border-orange-brand/30 text-orange-brand"
              }`}
            >
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-display text-lg font-bold text-foreground">
                {title}
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {message}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-border">
            <button
              onClick={onCancel}
              className="px-4 py-2 rounded-xl border border-border text-xs font-semibold text-foreground hover:bg-secondary transition-colors"
            >
              {cancelLabel}
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all ${
                isDestructive
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20"
                  : "bg-orange-brand hover:bg-orange-hover text-white shadow-glow"
              }`}
            >
              {confirmLabel}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
