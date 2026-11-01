"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Plus, X, Sparkles } from "lucide-react";
import { StudioCategory } from "@/types";

export interface StudioFormData {
  title: string;
  description: string;
  category: StudioCategory;
  pricePerHour: number;
  capacity: number;
  squareFeet: number;
  amenities: string[];
  location: {
    address: string;
    city: string;
    country: string;
    postalCode?: string;
  };
  images: string[];
  tags: string[];
  rules: string[];
}

interface StudioFormProps {
  initialData?: Partial<StudioFormData>;
  onSubmit: (data: StudioFormData) => Promise<void>;
  isEditing?: boolean;
}

const ALL_AMENITIES = [
  "Natural Daylight",
  "Infinity Cyc Wall",
  "Profoto Lighting",
  "Blackout Curtains",
  "Dolby Atmos 7.1.4",
  "SSL Console",
  "Neumann Mics",
  "Vocal Isolation Booth",
  "LED Volume Wall",
  "Soundproofed STC-65",
  "Motorized Lighting Grid",
  "4K Multi-Cam Switcher",
  "Shure SM7B Microphones",
  "Sprung Harlequin Floor",
  "Wall-to-Wall Mirrors",
  "High-Speed Fiber WiFi",
  "Hair & Makeup Station",
  "Client Hospitality Lounge",
  "Drive-in Elephant Door",
  "Private Parking Included",
];

export function StudioForm({ initialData, onSubmit, isEditing = false }: StudioFormProps) {
  const [formData, setFormData] = useState<StudioFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "photography",
    pricePerHour: initialData?.pricePerHour || 120,
    capacity: initialData?.capacity || 15,
    squareFeet: initialData?.squareFeet || 1500,
    amenities: initialData?.amenities || ["Natural Daylight", "High-Speed Fiber WiFi"],
    location: {
      address: initialData?.location?.address || "",
      city: initialData?.location?.city || "Brooklyn",
      country: initialData?.location?.country || "United States",
      postalCode: initialData?.location?.postalCode || "",
    },
    images: initialData?.images && initialData.images.length > 0
      ? initialData.images
      : ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85"],
    tags: initialData?.tags || ["Daylight", "Creative"],
    rules: initialData?.rules || [
      "No smoking inside the studio",
      "Overtime billed at 1.5x regular hourly rate",
    ],
  });

  const [imageUrlInput, setImageUrlInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const toggleAmenity = (item: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(item)
        ? prev.amenities.filter((a) => a !== item)
        : [...prev.amenities, item],
    }));
  };

  const handleAddImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrlInput.trim()],
      }));
      setImageUrlInput("");
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (formData.images.length === 0) {
      setErrorMsg("Please provide at least one photo of your studio space.");
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : "Failed to save studio listing.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-3xl mx-auto">
      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
          {errorMsg}
        </div>
      )}

      {/* Basic Info Card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5">
        <h3 className="font-display text-xl font-bold text-foreground">
          Studio Overview & Discipline
        </h3>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Studio Title
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. The Daylight Factory Loft & Infinity Cyc"
            className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:border-orange-brand"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Primary Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as StudioCategory })}
              className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-xs text-foreground focus:outline-none focus:border-orange-brand"
            >
              <option value="photography">Daylight Photography</option>
              <option value="recording">Recording & Dolby Audio</option>
              <option value="film">Film & Virtual LED Stage</option>
              <option value="podcast">Podcast Studio</option>
              <option value="dance">Dance & Rehearsal</option>
              <option value="art">Art & Craft Workshop</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Hourly Rate ($ USD)
            </label>
            <input
              type="number"
              required
              min={20}
              value={formData.pricePerHour}
              onChange={(e) => setFormData({ ...formData, pricePerHour: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:border-orange-brand"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Detailed Description
          </label>
          <textarea
            required
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the architectural lighting, power distro, acoustics, ceiling heights..."
            className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-xs text-foreground focus:outline-none focus:border-orange-brand"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Max Guests / Crew
            </label>
            <input
              type="number"
              min={1}
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:border-orange-brand"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Floor Area (Square Feet)
            </label>
            <input
              type="number"
              min={50}
              value={formData.squareFeet}
              onChange={(e) => setFormData({ ...formData, squareFeet: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:border-orange-brand"
            />
          </div>
        </div>
      </div>

      {/* Location Card */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
        <h3 className="font-display text-xl font-bold text-foreground">
          Studio Location
        </h3>

        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Street Address
          </label>
          <input
            type="text"
            required
            value={formData.location.address}
            onChange={(e) =>
              setFormData({
                ...formData,
                location: { ...formData.location, address: e.target.value },
              })
            }
            placeholder="e.g. 420 DUMBO Waterfront Ave, Floor 4"
            className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:border-orange-brand"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              City
            </label>
            <input
              type="text"
              required
              value={formData.location.city}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: { ...formData.location, city: e.target.value },
                })
              }
              placeholder="e.g. Brooklyn"
              className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:border-orange-brand"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Country
            </label>
            <input
              type="text"
              required
              value={formData.location.country}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  location: { ...formData.location, country: e.target.value },
                })
              }
              placeholder="e.g. United States"
              className="w-full px-4 py-2.5 rounded-xl bg-secondary border border-border text-sm text-foreground focus:outline-none focus:border-orange-brand"
            />
          </div>
        </div>
      </div>

      {/* Amenities Selector */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-foreground">
            Available Amenities & Equipment
          </h3>
          <span className="text-xs font-mono text-orange-brand">
            {formData.amenities.length} Selected
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {ALL_AMENITIES.map((amenity) => {
            const isSelected = formData.amenities.includes(amenity);
            return (
              <button
                key={amenity}
                type="button"
                onClick={() => toggleAmenity(amenity)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  isSelected
                    ? "bg-orange-brand text-white shadow-glow"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                }`}
              >
                {amenity}
              </button>
            );
          })}
        </div>
      </div>

      {/* Images Section */}
      <div className="rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-4">
        <h3 className="font-display text-xl font-bold text-foreground">
          Studio Photographs
        </h3>
        <p className="text-xs text-muted-foreground">
          Provide direct image URLs from Unsplash, Cloudinary, or host servers.
        </p>

        <div className="flex gap-2">
          <input
            type="url"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            placeholder="Paste image URL (https://images.unsplash.com/...)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-secondary border border-border text-xs text-foreground focus:outline-none focus:border-orange-brand"
          />
          <button
            type="button"
            onClick={handleAddImage}
            className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-orange-brand hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>Add Photo</span>
          </button>
        </div>

        {/* Thumbnails grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {formData.images.map((url, idx) => (
            <div key={idx} className="relative aspect-video rounded-xl overflow-hidden border border-border group bg-muted">
              <Image
                src={url}
                alt={`Studio preview ${idx + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, 25vw"
                unoptimized
              />
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="absolute top-1 right-1 p-1 rounded-full bg-black/60 text-white hover:bg-red-500 transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-2xl bg-orange-brand hover:bg-orange-hover text-white text-sm font-bold uppercase tracking-wider shadow-glow transition-all hover:scale-[1.01] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {submitting ? (
            <span>Publishing Studio...</span>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-gold" />
              <span>{isEditing ? "Save Studio Updates" : "Publish Studio to Marketplace"}</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
