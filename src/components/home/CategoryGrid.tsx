"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Camera, Music, Film, Radio, Activity, Palette, ArrowUpRight } from "lucide-react";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  count: string;
  description: string;
  icon: React.ElementType;
  image: string;
}

const categories: CategoryItem[] = [
  {
    id: "photo",
    name: "Photo Studios",
    slug: "photography",
    count: "140+ Spaces",
    description: "North-facing lofts, arched factory windows, and infinity cycloramas.",
    icon: Camera,
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "film",
    name: "Sound Stages",
    slug: "film",
    count: "60+ Stages",
    description: "Unreal Engine LED walls, lighting grids, and soundproofed film stages.",
    icon: Film,
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "podcast",
    name: "Podcast Rooms",
    slug: "podcast",
    count: "95+ Studios",
    description: "Multi-camera broadcast lounges with Shure SM7B microphones.",
    icon: Radio,
    image: "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "record",
    name: "Music Suites",
    slug: "recording",
    count: "85+ Suites",
    description: "Acoustically isolated mixing rooms, vintage microphones & live vocal rooms.",
    icon: Music,
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "art",
    name: "Art Workshops",
    slug: "art",
    count: "50+ Studios",
    description: "Raw concrete workshops with skylights, slop sinks, and pottery wheels.",
    icon: Palette,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "dance",
    name: "Dance & Movement",
    slug: "dance",
    count: "45+ Studios",
    description: "Sprung Harlequin flooring, full wall mirrors, and sound systems.",
    icon: Activity,
    image: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-24 bg-card/40 border-y border-border/50 relative">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-gold">
            Categories
          </span>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
            Explore by Creative Discipline
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            From natural light daylight photography lofts to Dolby Atmos spatial recording rooms, discover the perfect studio engineered for your vision.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <Link
                  href={`/studios?category=${cat.slug}`}
                  className="group relative h-72 rounded-2xl overflow-hidden border border-border flex flex-col justify-end p-6 bg-charcoal shadow-sm hover:shadow-cinematic hover:border-orange-brand/50 transition-all block"
                >
                  {/* Background Photo */}
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover opacity-50 group-hover:opacity-70 group-hover:scale-105 transition-all duration-700 ease-out"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  {/* Dark Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                  {/* Content */}
                  <div className="relative z-10 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="h-10 w-10 rounded-xl bg-orange-brand/20 backdrop-blur-md border border-orange-brand/40 text-orange-brand flex items-center justify-center group-hover:bg-orange-brand group-hover:text-white transition-all group-hover:scale-110">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-mono font-medium text-neutral-300 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md">
                        {cat.count}
                      </span>
                    </div>

                    <h3 className="font-display text-xl font-bold text-white group-hover:text-orange-brand transition-colors flex items-center justify-between">
                      <span>{cat.name}</span>
                      <ArrowUpRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </h3>

                    <p className="text-xs text-neutral-300 line-clamp-2">
                      {cat.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
