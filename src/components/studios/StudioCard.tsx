"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Star, MapPin, Users, Maximize2, Heart, Sparkles } from "lucide-react";
import { Studio } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { useBookmarks } from "@/components/providers/BookmarkContext";

interface StudioCardProps {
  studio: Studio;
  priority?: boolean;
}

export function StudioCard({ studio, priority = false }: StudioCardProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const images = studio.images && studio.images.length > 0
    ? studio.images
    : ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80"];

  const studioId = studio._id || studio.id || studio.slug;
  const bookmarked = isBookmarked(studioId);

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group relative rounded-2xl border border-border bg-card text-card-foreground shadow-sm hover:shadow-cinematic hover:border-orange-brand/40 overflow-hidden flex flex-col transition-all"
    >
      {/* Top Image Showcase */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={images[activeImageIndex]}
          alt={studio.title}
          fill
          priority={priority}
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
          {/* Category Tag */}
          <span className="pointer-events-auto px-2.5 py-1 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-forest/80 backdrop-blur-md text-emerald-300 border border-forest/60 shadow-sm flex items-center gap-1">
            <Sparkles className="h-3 w-3 text-gold" />
            {studio.category}
          </span>

          {/* Favorite Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleBookmark(studio);
            }}
            className="pointer-events-auto p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md text-white transition-all hover:scale-110"
            aria-label={bookmarked ? "Remove bookmark" : "Bookmark studio"}
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                bookmarked ? "fill-orange-brand text-orange-brand" : "text-white"
              }`}
            />
          </button>
        </div>

        {/* Image dot indicators if multiple images */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-0 right-0 flex justify-center gap-1.5 z-10">
            {images.slice(0, 4).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveImageIndex(i);
                }}
                className={`h-1.5 rounded-full transition-all ${
                  activeImageIndex === i ? "w-4 bg-orange-brand" : "w-1.5 bg-white/60"
                }`}
                aria-label={`Show image ${i + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Studio Info Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          {/* Location & Rating */}
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1 truncate max-w-[180px]">
              <MapPin className="h-3.5 w-3.5 text-orange-brand shrink-0" />
              <span className="truncate">{studio.location?.city || "New York"}, {studio.location?.country || "USA"}</span>
            </div>

            <div className="flex items-center gap-1 text-gold font-bold shrink-0">
              <Star className="h-3.5 w-3.5 fill-gold text-gold" />
              <span>{studio.rating ? studio.rating.toFixed(1) : "4.9"}</span>
              <span className="text-muted-foreground font-normal">({studio.reviewCount || 12})</span>
            </div>
          </div>

          {/* Title */}
          <Link href={`/studio/${studioId}`} className="block group-hover:text-orange-brand transition-colors">
            <h3 className="font-display text-lg font-bold tracking-tight text-foreground line-clamp-1">
              {studio.title}
            </h3>
          </Link>

          {/* Specs: Capacity & Area */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-1">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              Up to {studio.capacity || 15} guests
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Maximize2 className="h-3 w-3" />
              {studio.squareFeet || 1200} sq.ft
            </span>
          </div>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-4 mt-3 border-t border-border flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold font-mono text-orange-brand">
                {formatCurrency(studio.pricePerHour || 100)}
              </span>
              <span className="text-xs text-muted-foreground"> / hour</span>
            </div>
            {studio.defaultBookingDuration ? (
              <span className="block text-[11px] text-muted-foreground font-medium">
                {studio.defaultBookingDuration}h default booking
              </span>
            ) : null}
          </div>

          <Link
            href={`/studio/${studioId}`}
            className="px-3.5 py-1.5 rounded-xl bg-secondary hover:bg-orange-brand hover:text-white text-xs font-semibold text-foreground transition-all"
          >
            Book Space
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
