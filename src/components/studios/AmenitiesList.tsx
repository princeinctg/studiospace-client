"use client";

import React from "react";
import {
  Sun,
  ShieldAlert,
  Wifi,
  Sparkles,
  Coffee,
  Car,
  Volume2,
  Tv,
  Check,
} from "lucide-react";

interface AmenitiesListProps {
  amenities: string[];
}

export function AmenitiesList({ amenities }: AmenitiesListProps) {
  const getIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes("daylight") || lower.includes("window")) return Sun;
    if (lower.includes("sound") || lower.includes("atmos") || lower.includes("stc")) return Volume2;
    if (lower.includes("led") || lower.includes("tv") || lower.includes("switcher")) return Tv;
    if (lower.includes("wifi") || lower.includes("internet")) return Wifi;
    if (lower.includes("park")) return Car;
    if (lower.includes("coffee") || lower.includes("kitchen")) return Coffee;
    if (lower.includes("security") || lower.includes("lock")) return ShieldAlert;
    return Sparkles;
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {amenities.map((amenity, idx) => {
        const Icon = getIcon(amenity);
        return (
          <div
            key={idx}
            className="flex items-center gap-2.5 p-3 rounded-xl border border-border bg-card/60 backdrop-blur-sm hover:border-orange-brand/40 transition-colors"
          >
            <div className="h-8 w-8 rounded-lg bg-orange-brand/10 border border-orange-brand/20 text-orange-brand flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-medium text-foreground block truncate">
                {amenity}
              </span>
              <span className="text-[10px] text-emerald-500 font-semibold flex items-center gap-0.5">
                <Check className="h-2.5 w-2.5" />
                Verified
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
