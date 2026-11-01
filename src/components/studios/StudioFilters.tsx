"use client";

import React from "react";
import { Filter, RotateCcw, DollarSign } from "lucide-react";

interface FilterState {
  category: string;
  city: string;
  minPrice: string;
  maxPrice: string;
  sort: string;
}

interface StudioFiltersProps {
  filters: FilterState;
  onChange: (updated: Partial<FilterState>) => void;
  onReset: () => void;
  totalResults: number;
}

export function StudioFilters({
  filters,
  onChange,
  onReset,
  totalResults,
}: StudioFiltersProps) {
  const categories = [
    { id: "all", label: "All Spaces" },
    { id: "photography", label: "Photography" },
    { id: "recording", label: "Audio & Recording" },
    { id: "film", label: "Film & Soundstage" },
    { id: "podcast", label: "Podcast" },
    { id: "dance", label: "Dance & Movement" },
    { id: "art", label: "Art Workshop" },
  ];

  const cities = ["All Cities", "Brooklyn", "Los Angeles", "Atlanta", "Chicago", "San Francisco", "Miami"];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-6 shadow-sm">
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2 font-display text-base font-bold text-foreground">
          <Filter className="h-4 w-4 text-orange-brand" />
          <span>Filters</span>
          <span className="text-xs font-mono font-medium text-muted-foreground ml-1">
            ({totalResults} available)
          </span>
        </div>

        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-orange-brand transition-colors"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Category Filter */}
      <div className="space-y-2.5">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Discipline
        </label>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => {
            const isSelected = filters.category === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => onChange({ category: cat.id })}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-orange-brand text-white shadow-glow"
                    : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* City Location */}
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Metro Area
        </label>
        <select
          value={filters.city}
          onChange={(e) => onChange({ city: e.target.value === "All Cities" ? "" : e.target.value })}
          className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-xs text-foreground focus:outline-none focus:border-orange-brand cursor-pointer"
        >
          {cities.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* Hourly Price Range */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-muted-foreground">
          <span>Max Hourly Rate</span>
          <span className="text-orange-brand font-mono font-bold">
            ${filters.maxPrice || "500"}/hr
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
          <input
            type="range"
            min="50"
            max="600"
            step="25"
            value={filters.maxPrice || "500"}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            className="w-full accent-orange-brand cursor-pointer"
          />
        </div>
      </div>

      {/* Sort By */}
      <div className="space-y-2 pt-2 border-t border-border">
        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Sort By
        </label>
        <select
          value={filters.sort}
          onChange={(e) => onChange({ sort: e.target.value })}
          className="w-full px-3 py-2 rounded-xl bg-secondary border border-border text-xs text-foreground focus:outline-none focus:border-orange-brand cursor-pointer"
        >
          <option value="newest">Featured & Newest</option>
          <option value="rating">Highest Rated</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>
    </div>
  );
}
