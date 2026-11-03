"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight, Compass } from "lucide-react";
import { Studio } from "@/types";
import { StudioCard } from "@/components/studios/StudioCard";
import { apiRequest, normalizeStudio } from "@/lib/api";

const fallbackFeatured: Studio[] = [
  {
    _id: "6ae996e6749893a06af61de3",
    id: "6ae996e6749893a06af61de3",
    title: "The Industrial Daylight Loft",
    slug: "the-industrial-daylight-loft",
    description: "Expansive 2,400 sq.ft loft flooded with north-facing natural daylight through 14-foot factory arched windows. Features original exposed brick walls and an infinity cyclorama wall.",
    category: "photography",
    amenities: ["Natural Daylight", "Infinity Cyc Wall", "Profoto Lighting"],
    pricePerHour: 350,
    defaultBookingDuration: 8,
    location: {
      address: "420 DUMBO Waterfront Ave",
      city: "Brooklyn",
      country: "United States",
    },
    images: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
    },
    rating: 4.96,
    reviewCount: 48,
    capacity: 25,
    squareFeet: 2400,
    isAvailable: true,
    featured: true,
    tags: ["Daylight", "Fashion"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "6ae99720749893a06af61dfa",
    id: "6ae99720749893a06af61dfa",
    title: "Aura Sound & Dolby Atmos Suite",
    slug: "aura-sound-dolby-atmos-suite",
    description: "State-of-the-art acoustically isolated recording facility with SSL Duality delta console and Genelec 7.1.4 Dolby Atmos monitoring.",
    category: "recording",
    amenities: ["Dolby Atmos", "SSL Console", "Vocal Booth"],
    pricePerHour: 275,
    defaultBookingDuration: 10,
    location: {
      address: "880 Sunset Blvd",
      city: "Los Angeles",
      country: "United States",
    },
    images: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
    },
    rating: 4.98,
    reviewCount: 36,
    capacity: 8,
    squareFeet: 1200,
    isAvailable: true,
    featured: true,
    tags: ["Recording", "Audio"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "6ae99721749893a06af61dfc",
    id: "6ae99721749893a06af61dfc",
    title: "Apex Virtual Film & LED Soundstage",
    slug: "apex-virtual-film-led-soundstage",
    description: "Next-gen 5,000 sq.ft cinematic production soundstage with 180-degree curved LED volume wall and STC-65 acoustic treatment.",
    category: "film",
    amenities: ["LED Wall", "Soundproofed STC-65", "Lighting Grid"],
    pricePerHour: 650,
    defaultBookingDuration: 12,
    location: {
      address: "1420 Film Center Dr",
      city: "Atlanta",
      country: "United States",
    },
    images: [
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
    },
    rating: 4.92,
    reviewCount: 22,
    capacity: 50,
    squareFeet: 5000,
    isAvailable: true,
    featured: true,
    tags: ["Film Stage", "Cinema"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "6ae99721749893a06af61dfe",
    id: "6ae99721749893a06af61dfe",
    title: "Velvet Frequency Broadcast Podcast Studio",
    slug: "velvet-frequency-podcast-studio",
    description: "Boutique 4-camera 4K podcast lounge designed for visual creators. Shure SM7B dynamic mics and Blackmagic switchers.",
    category: "podcast",
    amenities: ["4K Multi-Cam", "Shure SM7B", "Soundproofed"],
    pricePerHour: 200,
    defaultBookingDuration: 8,
    location: {
      address: "310 West Loop South",
      city: "Chicago",
      country: "United States",
    },
    images: [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=800&q=80",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
    },
    rating: 4.95,
    reviewCount: 64,
    capacity: 6,
    squareFeet: 600,
    isAvailable: true,
    featured: true,
    tags: ["Podcast", "Talk Show"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "manhattan-creative-photography-studio",
    title: "The Manhattan Creative Photography Studio",
    slug: "manhattan-creative-photography-studio",
    description: "A premium daylight photography studio featuring professional lighting, versatile backdrops and a spacious creative shooting environment.",
    category: "photography",
    amenities: ["Professional Lighting", "Versatile Backdrops", "Spacious Shooting Environment", "Natural Daylight", "VIP Styling Suite"],
    pricePerHour: 400,
    defaultBookingDuration: 8,
    location: {
      address: "Manhattan",
      city: "Manhattan",
      country: "United States",
    },
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
    },
    rating: 5.0,
    reviewCount: 28,
    capacity: 20,
    squareFeet: 2000,
    isAvailable: true,
    featured: true,
    tags: ["Photography", "Daylight", "Manhattan", "Creative"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "6ae99721749893a06af61e00",
    id: "6ae99721749893a06af61e00",
    title: "Obsidian Mastering & Recording House",
    slug: "obsidian-mastering-recording-house",
    description: "Northward-designed custom-floated mastering and tracking suite equipped with ATC SCM110ASL monitoring and Shadow Hills mastering compressor.",
    category: "recording",
    amenities: ["ATC SCM110 Monitoring", "Analog Mastering Rack", "Shadow Hills Compressor", "Custom Acoustic Float"],
    pricePerHour: 380,
    defaultBookingDuration: 8,
    location: {
      address: "2200 NW 2nd Ave",
      city: "Miami",
      country: "United States",
    },
    images: [
      "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520523839898-5071282543e2?auto=format&fit=crop&w=800&q=80",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
    },
    rating: 4.9,
    reviewCount: 38,
    capacity: 15,
    squareFeet: 1800,
    isAvailable: true,
    featured: true,
    tags: ["Recording", "Mastering", "Dolby Atmos"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "6ae99722749893a06af61e02",
    id: "6ae99722749893a06af61e02",
    title: "Infinity Virtual Production Arena",
    slug: "infinity-virtual-production-arena",
    description: "Monumental 6,500 sq.ft stage with 270-degree LED volume wall driven by Unreal Engine 5 nDisplay and drive-in semi loading access.",
    category: "film",
    amenities: ["270-deg LED Volume", "Unreal Engine 5 nDisplay", "OptiTrack Mocap", "Drive-in Loading Bay"],
    pricePerHour: 850,
    defaultBookingDuration: 12,
    location: {
      address: "3700 S Las Vegas Blvd",
      city: "Las Vegas",
      country: "United States",
    },
    images: [
      "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
    },
    rating: 5.0,
    reviewCount: 57,
    capacity: 60,
    squareFeet: 6500,
    isAvailable: true,
    featured: true,
    tags: ["Film Production", "Virtual Stage", "Cinema"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "6ae99722749893a06af61e04",
    id: "6ae99722749893a06af61e04",
    title: "The Executive Podcast & Broadcast Lounge",
    slug: "the-executive-podcast-broadcast-lounge",
    description: "Panoramic skyline-view broadcast lounge featuring 5x Sony FX6 cinema cameras, sound-damped walnut slat architecture, and 10Gbps fiber uplink.",
    category: "podcast",
    amenities: ["5x Sony FX6 Cameras", "10Gbps Fiber Uplink", "Sound-Damped Lounge", "Shure SM7B Microphones"],
    pricePerHour: 250,
    defaultBookingDuration: 8,
    location: {
      address: "450 Mission St",
      city: "San Francisco",
      country: "United States",
    },
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606920669741-c8ba74262a94?auto=format&fit=crop&w=800&q=80",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
    },
    rating: 4.9,
    reviewCount: 45,
    capacity: 10,
    squareFeet: 1100,
    isAvailable: true,
    featured: true,
    tags: ["Podcast", "Broadcast", "Live Streaming"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function FeaturedStudios() {
  const [studios, setStudios] = useState<Studio[]>(fallbackFeatured);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFeatured() {
      try {
        let list: Studio[] = [];
        try {
          const data = await apiRequest<Record<string, unknown> | unknown[]>("/studios/featured?limit=50");
          const raw = Array.isArray(data) ? data : (data as { studios?: unknown[] })?.studios;
          if (Array.isArray(raw) && raw.length > 0) {
            list = raw.map(normalizeStudio);
          }
        } catch {
          // If /studios/featured fails on legacy backend, fetch from /studios
          const data = await apiRequest<Record<string, unknown> | unknown[]>("/studios?limit=50");
          const raw = Array.isArray(data) ? data : (data as { studios?: unknown[] })?.studios;
          if (Array.isArray(raw) && raw.length > 0) {
            const normalized = raw.map(normalizeStudio);
            const featuredOnly = normalized.filter((s: Studio) => s.featured);
            list = featuredOnly.length > 0 ? featuredOnly : normalized;
          }
        }

        // Merge any user-created studios saved in client storage
        try {
          const local = JSON.parse(localStorage.getItem("studiospace_demo_studios") || "[]");
          if (Array.isArray(local) && local.length > 0) {
            const cleaned = local.filter(
              (s: Record<string, unknown>) =>
                s?.title !== "uutr" &&
                s?.slug !== "uutr-pp7b" &&
                s?._id !== "6ae983c20981efdd6935dded"
            );
            localStorage.setItem("studiospace_demo_studios", JSON.stringify(cleaned));
            const localStudios = cleaned.map(normalizeStudio);
            const existingKeys = new Set([
              ...list.map((s) => s._id),
              ...list.map((s) => s.id),
              ...list.map((s) => s.slug),
            ]);
            const toAdd = localStudios.filter(
              (s: Studio) =>
                !existingKeys.has(s._id) && !existingKeys.has(s.id) && !existingKeys.has(s.slug)
            );
            list = [...toAdd, ...list];
          }
        } catch {
          // Ignore localStorage error
        }

        // Clean out any legacy uutr entry that might be cached in response
        list = list.filter(
          (s) => s.title !== "uutr" && s.slug !== "uutr-pp7b"
        );

        // Guarantee all 8 original default studio cards always remain available
        const existingSlugsAndIds = new Set([
          ...list.map((s) => s.slug),
          ...list.map((s) => s._id),
          ...list.map((s) => s.id),
        ]);
        const existingTitles = new Set(list.map((s) => s.title?.toLowerCase().trim()));
        const missingDefaults = fallbackFeatured.filter(
          (f) =>
            !existingSlugsAndIds.has(f.slug) &&
            !existingSlugsAndIds.has(f._id) &&
            !existingTitles.has(f.title?.toLowerCase().trim())
        );
        list = [...list, ...missingDefaults];

        setStudios(list);
      } catch {
        setStudios(fallbackFeatured);
      } finally {
        setLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-brand/10 border border-orange-brand/30 text-orange-brand text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Curated Spaces</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Featured Creative Studios
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Handpicked daylight spaces, soundproofed recording suites, virtual production LED arenas, and broadcast podcast studios rated 4.9+ by top creative teams.
            </p>
          </div>

          <Link
            href="/explore"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-border bg-card hover:bg-secondary hover:border-orange-brand/50 text-xs font-semibold text-foreground transition-all hover:scale-105 self-start md:self-auto shadow-sm"
          >
            <Compass className="h-4 w-4 text-orange-brand" />
            <span>View All Studios</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Studio Cards Grid with Staggered Entrance */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="h-80 rounded-2xl bg-card border border-border animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studios.map((studio, idx) => (
              <motion.div
                key={studio._id || studio.id || idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
              >
                <StudioCard studio={studio} priority={idx < 4} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
