"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Pagination, Navigation } from "swiper/modules";
import { Search, MapPin, Sparkles, ArrowRight, ShieldCheck } from "lucide-react";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/pagination";
import "swiper/css/navigation";

interface SlideItem {
  id: string;
  image: string;
  tagline: string;
  headline: string;
  subheadline: string;
  location: string;
  category: string;
  price: string;
}

const slides: SlideItem[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=2000&q=90",
    tagline: "Apple-Grade Daylight Precision",
    headline: "Spaces Crafted for Visionary Storytellers",
    subheadline: "Book architectural photo lofts, cycloramas, and sunlit creative studios with instant double-booking protection.",
    location: "DUMBO Waterfront, Brooklyn",
    category: "Photography",
    price: "$125/hr",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=2000&q=90",
    tagline: "Lusion-Inspired Spatial Immersion",
    headline: "Dolby Atmos Acoustic Recording Suites",
    subheadline: "Pristine vintage microphones, SSL consoles, and vocal chambers engineered for multi-platinum recordists.",
    location: "Sunset Strip, Los Angeles",
    category: "Recording",
    price: "$160/hr",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=2000&q=90",
    tagline: "Virtual Production & LED Volumes",
    headline: "Hollywood Soundstages Powered by Unreal",
    subheadline: "Massive 5,000 sq.ft STC-65 soundproofed film stages with drive-in elephant doors and motorized lighting grids.",
    location: "Film Center, Atlanta",
    category: "Cinema & Film",
    price: "$320/hr",
  },
];

export function HeroSlider() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("search", searchQuery.trim());
    if (selectedCategory !== "all") params.set("category", selectedCategory);
    router.push(`/explore?${params.toString()}`);
  };

  return (
    <section className="relative w-full h-[92vh] min-h-[640px] max-h-[960px] overflow-hidden select-none bg-black">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination, Navigation]}
        effect="fade"
        speed={1400}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          renderBullet: (_index, className) => {
            return `<span class="${className} custom-bullet"></span>`;
          },
        }}
        navigation
        loop
        className="w-full h-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative w-full h-full">
            {/* Background Image with subtle continuous zoom effect */}
            <div className="absolute inset-0 overflow-hidden">
              <Image
                src={slide.image}
                alt={slide.headline}
                fill
                priority
                className="object-cover scale-105 transition-transform duration-[7000ms] ease-out will-change-transform"
                sizes="100vw"
              />
              {/* Cinematic Vignette & Gradients */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/50 to-charcoal/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-charcoal/80 via-charcoal/40 to-transparent" />
            </div>

            {/* Slide Content Overlay */}
            <div className="container mx-auto h-full flex flex-col justify-center relative z-20 px-6 pt-16">
              <div className="max-w-2xl space-y-4">
                {/* Tagline Badge */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest/40 border border-forest/60 backdrop-blur-md text-emerald-300 text-xs font-semibold tracking-wider uppercase"
                >
                  <Sparkles className="h-3.5 w-3.5 text-gold" />
                  <span>{slide.tagline}</span>
                </motion.div>

                {/* Headline */}
                <motion.h1
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]"
                >
                  {slide.headline}
                </motion.h1>

                {/* Subheadline */}
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="text-sm sm:text-base text-neutral-300 leading-relaxed font-light max-w-xl"
                >
                  {slide.subheadline}
                </motion.p>

                {/* Meta details pill */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="flex items-center gap-4 text-xs text-neutral-400 pt-1"
                >
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-orange-brand" />
                    {slide.location}
                  </span>
                  <span>•</span>
                  <span className="text-gold font-semibold">{slide.category}</span>
                  <span>•</span>
                  <span className="text-white font-mono font-bold">{slide.price}</span>
                </motion.div>

                {/* CTAs */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="flex flex-wrap items-center gap-3 pt-4"
                >
                  <Link
                    href="/explore"
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-brand hover:bg-orange-hover text-white text-sm font-semibold shadow-glow transition-all hover:scale-105"
                  >
                    <span>Explore Studios</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    href="/studio/add"
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-medium backdrop-blur-md border border-white/20 transition-all"
                  >
                    <span>List Your Studio</span>
                  </Link>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Floating Interactive Search Bar */}
      <div className="absolute bottom-6 left-0 right-0 z-30 px-4 pointer-events-auto">
        <div className="container mx-auto max-w-4xl">
          <form
            onSubmit={handleSearch}
            className="p-2 sm:p-2.5 rounded-2xl bg-card/95 backdrop-blur-xl border border-border shadow-cinematic flex flex-col sm:flex-row items-center gap-2.5"
          >
            {/* Search Input */}
            <div className="flex-1 flex items-center gap-2.5 px-3 py-1.5 w-full">
              <Search className="h-4 w-4 text-orange-brand shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by studio name, lighting, Brooklyn, LA..."
                className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
            </div>

            {/* Category Select */}
            <div className="sm:border-l border-border px-3 py-1 w-full sm:w-auto">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-muted-foreground focus:outline-none cursor-pointer"
              >
                <option value="all">All Studio Spaces</option>
                <option value="photography">Daylight Photography</option>
                <option value="recording">Recording & Audio</option>
                <option value="film">Film & LED Volume</option>
                <option value="podcast">Podcast Suites</option>
                <option value="dance">Dance & Movement</option>
              </select>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-orange-brand hover:bg-orange-hover text-white text-xs font-bold uppercase tracking-wider shadow-glow transition-all hover:scale-105 shrink-0 flex items-center justify-center gap-1.5"
            >
              <span>Search</span>
            </button>
          </form>

          <div className="flex items-center justify-center gap-4 text-[11px] text-neutral-400 mt-2">
            <span className="flex items-center gap-1">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              Instant Booking Confirmation
            </span>
            <span>•</span>
            <span>Transparent Hourly Rates</span>
            <span>•</span>
            <span>Zero Booking Fees</span>
          </div>
        </div>
      </div>
    </section>
  );
}
