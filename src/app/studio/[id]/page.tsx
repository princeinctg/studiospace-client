"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StudioGallery } from "@/components/studios/StudioGallery";
import { AmenitiesList } from "@/components/studios/AmenitiesList";
import { BookingModal } from "@/components/booking/BookingModal";
import { Studio } from "@/types";
import { apiRequest, normalizeStudio } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import { useBookmarks } from "@/components/providers/BookmarkContext";
import {
  Star,
  MapPin,
  Users,
  Maximize2,
  ShieldCheck,
  Calendar,
  Share2,
  Heart,
  Sparkles,
  Info,
  Check,
} from "lucide-react";

const fallbackStudiosMap: Record<string, Studio> = {
  "the-industrial-daylight-loft": {
    _id: "demo-1",
    title: "The Industrial Daylight Loft",
    slug: "the-industrial-daylight-loft",
    description: "Expansive 2,400 sq.ft loft flooded with north-facing natural daylight through 14-foot factory arched windows. Features original exposed brick walls, matte concrete floors, full blackout curtains, Profoto D2 lighting packs, and an infinity cyclorama wall.",
    category: "photography",
    amenities: ["Natural Daylight", "Infinity Cyc Wall", "Profoto Lighting", "Blackout Curtains", "Hair & Makeup Station", "High-Speed WiFi", "Client Lounge"],
    pricePerHour: 350,
    defaultBookingDuration: 8,
    location: { address: "420 DUMBO Waterfront Ave", city: "Brooklyn", country: "United States", postalCode: "11201" },
    images: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1590486803833-1c5dc8ddd4c8?auto=format&fit=crop&w=1200&q=85",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Commercial director and studio curator based in Brooklyn, NY. Passionate about providing film and photography creators with top-tier gear.",
      phone: "+1 (555) 328-9921",
    },
    rating: 4.96,
    reviewCount: 48,
    capacity: 25,
    squareFeet: 2400,
    isAvailable: true,
    featured: true,
    tags: ["Daylight", "Fashion", "Editorial", "Cyc Wall"],
    rules: [
      "No smoking or open flames inside the studio",
      "Overtime billed at 1.5x regular hourly rate after 15 minute grace period",
      "Clean up and return all lighting equipment to original positions",
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "aura-sound-dolby-atmos-suite": {
    _id: "demo-2",
    title: "Aura Sound & Dolby Atmos Suite",
    slug: "aura-sound-dolby-atmos-suite",
    description: "State-of-the-art acoustically isolated recording facility with SSL Duality delta console and Genelec 7.1.4 Dolby Atmos monitoring.",
    category: "recording",
    amenities: ["Dolby Atmos", "SSL Console", "Vocal Booth", "Acoustic Treatment", "Neumann Mics"],
    pricePerHour: 275,
    defaultBookingDuration: 10,
    location: { address: "880 Sunset Blvd", city: "Los Angeles", country: "United States", postalCode: "90069" },
    images: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Audio engineer and spatial audio producer in Los Angeles.",
      phone: "+1 (555) 328-9921",
    },
    rating: 4.98,
    reviewCount: 36,
    capacity: 8,
    squareFeet: 1200,
    isAvailable: true,
    featured: true,
    tags: ["Recording", "Audio", "Dolby Atmos"],
    rules: ["No open beverage containers near consoles"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "apex-virtual-film-led-soundstage": {
    _id: "demo-3",
    title: "Apex Virtual Film & LED Soundstage",
    slug: "apex-virtual-film-led-soundstage",
    description: "Next-gen 5,000 sq.ft cinematic production soundstage with 180-degree curved LED volume wall and STC-65 acoustic treatment.",
    category: "film",
    amenities: ["LED Wall", "Soundproofed STC-65", "Lighting Grid", "Green Room", "Drive-in Loading"],
    pricePerHour: 650,
    defaultBookingDuration: 12,
    location: { address: "1420 Film Center Dr", city: "Atlanta", country: "United States", postalCode: "30318" },
    images: [
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=85",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Cinematographer and virtual production stage manager.",
      phone: "+1 (555) 328-9921",
    },
    rating: 4.92,
    reviewCount: 22,
    capacity: 50,
    squareFeet: 5000,
    isAvailable: true,
    featured: true,
    tags: ["Film Stage", "Cinema", "Virtual Production"],
    rules: ["Safety marshal required on stage floor"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "velvet-frequency-podcast-studio": {
    _id: "demo-4",
    title: "Velvet Frequency Broadcast Podcast Studio",
    slug: "velvet-frequency-podcast-studio",
    description: "Boutique 4-camera 4K podcast lounge designed for visual creators. Shure SM7B dynamic mics and Blackmagic switchers.",
    category: "podcast",
    amenities: ["4K Multi-Cam", "Shure SM7B", "Soundproofed", "Acoustic Walnut Walls"],
    pricePerHour: 200,
    defaultBookingDuration: 8,
    location: { address: "310 West Loop South", city: "Chicago", country: "United States", postalCode: "60607" },
    images: [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=1200&q=85",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Broadcast producer and media creator in Chicago.",
      phone: "+1 (555) 328-9921",
    },
    rating: 4.95,
    reviewCount: 64,
    capacity: 6,
    squareFeet: 600,
    isAvailable: true,
    featured: true,
    tags: ["Podcast", "Talk Show", "Livestream"],
    rules: ["Sanitize microphones after session"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "manhattan-creative-photography-studio": {
    _id: "manhattan-creative-photography-studio",
    id: "manhattan-creative-photography-studio",
    title: "The Manhattan Creative Photography Studio",
    slug: "manhattan-creative-photography-studio",
    description: "A premium daylight photography studio featuring professional lighting, versatile backdrops and a spacious creative shooting environment.",
    category: "photography",
    amenities: ["Professional Lighting", "Versatile Backdrops", "Spacious Shooting Environment", "Natural Daylight", "VIP Styling Suite", "Client Lounge"],
    pricePerHour: 400,
    defaultBookingDuration: 8,
    location: { address: "Manhattan", city: "Manhattan", country: "United States", postalCode: "10001" },
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Editorial fashion photographer and studio director in Manhattan.",
      phone: "+1 (555) 328-9921",
    },
    rating: 5.0,
    reviewCount: 28,
    capacity: 20,
    squareFeet: 2000,
    isAvailable: true,
    featured: true,
    tags: ["Photography", "Daylight", "Manhattan", "Creative"],
    rules: ["Certificate of insurance required for production teams"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "6ae983c20981efdd6935dded": {
    _id: "manhattan-creative-photography-studio",
    id: "manhattan-creative-photography-studio",
    title: "The Manhattan Creative Photography Studio",
    slug: "manhattan-creative-photography-studio",
    description: "A premium daylight photography studio featuring professional lighting, versatile backdrops and a spacious creative shooting environment.",
    category: "photography",
    amenities: ["Professional Lighting", "Versatile Backdrops", "Spacious Shooting Environment", "Natural Daylight", "VIP Styling Suite", "Client Lounge"],
    pricePerHour: 400,
    defaultBookingDuration: 8,
    location: { address: "Manhattan", city: "Manhattan", country: "United States", postalCode: "10001" },
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Editorial fashion photographer and studio director in Manhattan.",
      phone: "+1 (555) 328-9921",
    },
    rating: 5.0,
    reviewCount: 28,
    capacity: 20,
    squareFeet: 2000,
    isAvailable: true,
    featured: true,
    tags: ["Photography", "Daylight", "Manhattan", "Creative"],
    rules: ["Certificate of insurance required for production teams"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "demo-5": {
    _id: "manhattan-creative-photography-studio",
    id: "manhattan-creative-photography-studio",
    title: "The Manhattan Creative Photography Studio",
    slug: "manhattan-creative-photography-studio",
    description: "A premium daylight photography studio featuring professional lighting, versatile backdrops and a spacious creative shooting environment.",
    category: "photography",
    amenities: ["Professional Lighting", "Versatile Backdrops", "Spacious Shooting Environment", "Natural Daylight", "VIP Styling Suite", "Client Lounge"],
    pricePerHour: 400,
    defaultBookingDuration: 8,
    location: { address: "Manhattan", city: "Manhattan", country: "United States", postalCode: "10001" },
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Editorial fashion photographer and studio director in Manhattan.",
      phone: "+1 (555) 328-9921",
    },
    rating: 5.0,
    reviewCount: 28,
    capacity: 20,
    squareFeet: 2000,
    isAvailable: true,
    featured: true,
    tags: ["Photography", "Daylight", "Manhattan", "Creative"],
    rules: ["Certificate of insurance required for production teams"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "obsidian-mastering-recording-house": {
    _id: "demo-6",
    id: "demo-6",
    title: "Obsidian Mastering & Recording House",
    slug: "obsidian-mastering-recording-house",
    description: "Northward-designed custom-floated mastering and tracking suite equipped with ATC SCM110ASL monitoring and Shadow Hills mastering compressor.",
    category: "recording",
    amenities: ["ATC SCM110 Monitoring", "Analog Mastering Rack", "Shadow Hills Compressor", "Custom Acoustic Float", "Private Lounge"],
    pricePerHour: 380,
    defaultBookingDuration: 8,
    location: { address: "2200 NW 2nd Ave", city: "Miami", country: "United States", postalCode: "33127" },
    images: [
      "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1520523839898-5071282543e2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Grammy-nominated mastering engineer based in Miami.",
      phone: "+1 (555) 328-9921",
    },
    rating: 4.9,
    reviewCount: 38,
    capacity: 15,
    squareFeet: 1800,
    isAvailable: true,
    featured: true,
    tags: ["Recording", "Mastering", "Dolby Atmos"],
    rules: ["Sound pressure levels monitored by lead engineer"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "demo-6": {
    _id: "demo-6",
    id: "demo-6",
    title: "Obsidian Mastering & Recording House",
    slug: "obsidian-mastering-recording-house",
    description: "Northward-designed custom-floated mastering and tracking suite equipped with ATC SCM110ASL monitoring and Shadow Hills mastering compressor.",
    category: "recording",
    amenities: ["ATC SCM110 Monitoring", "Analog Mastering Rack", "Shadow Hills Compressor", "Custom Acoustic Float", "Private Lounge"],
    pricePerHour: 380,
    defaultBookingDuration: 8,
    location: { address: "2200 NW 2nd Ave", city: "Miami", country: "United States", postalCode: "33127" },
    images: [
      "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1520523839898-5071282543e2?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=85",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Grammy-nominated mastering engineer based in Miami.",
      phone: "+1 (555) 328-9921",
    },
    rating: 4.9,
    reviewCount: 38,
    capacity: 15,
    squareFeet: 1800,
    isAvailable: true,
    featured: true,
    tags: ["Recording", "Mastering", "Dolby Atmos"],
    rules: ["Sound pressure levels monitored by lead engineer"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "infinity-virtual-production-arena": {
    _id: "demo-7",
    id: "demo-7",
    title: "Infinity Virtual Production Arena",
    slug: "infinity-virtual-production-arena",
    description: "Monumental 6,500 sq.ft stage with 270-degree LED volume wall driven by Unreal Engine 5 nDisplay and drive-in semi loading access.",
    category: "film",
    amenities: ["270-deg LED Volume", "Unreal Engine 5 nDisplay", "OptiTrack Mocap", "Drive-in Loading Bay", "Dual Control Suites"],
    pricePerHour: 850,
    defaultBookingDuration: 12,
    location: { address: "3700 S Las Vegas Blvd", city: "Las Vegas", country: "United States", postalCode: "89109" },
    images: [
      "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=85",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Virtual production supervisor and Unreal Engine specialist.",
      phone: "+1 (555) 328-9921",
    },
    rating: 5.0,
    reviewCount: 57,
    capacity: 60,
    squareFeet: 6500,
    isAvailable: true,
    featured: true,
    tags: ["Film Production", "Virtual Stage", "Cinema"],
    rules: ["Stage safety officer mandatory during live volume operations"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "demo-7": {
    _id: "demo-7",
    id: "demo-7",
    title: "Infinity Virtual Production Arena",
    slug: "infinity-virtual-production-arena",
    description: "Monumental 6,500 sq.ft stage with 270-degree LED volume wall driven by Unreal Engine 5 nDisplay and drive-in semi loading access.",
    category: "film",
    amenities: ["270-deg LED Volume", "Unreal Engine 5 nDisplay", "OptiTrack Mocap", "Drive-in Loading Bay", "Dual Control Suites"],
    pricePerHour: 850,
    defaultBookingDuration: 12,
    location: { address: "3700 S Las Vegas Blvd", city: "Las Vegas", country: "United States", postalCode: "89109" },
    images: [
      "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=85",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Virtual production supervisor and Unreal Engine specialist.",
      phone: "+1 (555) 328-9921",
    },
    rating: 5.0,
    reviewCount: 57,
    capacity: 60,
    squareFeet: 6500,
    isAvailable: true,
    featured: true,
    tags: ["Film Production", "Virtual Stage", "Cinema"],
    rules: ["Stage safety officer mandatory during live volume operations"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "the-executive-podcast-broadcast-lounge": {
    _id: "demo-8",
    id: "demo-8",
    title: "The Executive Podcast & Broadcast Lounge",
    slug: "the-executive-podcast-broadcast-lounge",
    description: "Panoramic skyline-view broadcast lounge featuring 5x Sony FX6 cinema cameras, sound-damped walnut slat architecture, and 10Gbps fiber uplink.",
    category: "podcast",
    amenities: ["5x Sony FX6 Cameras", "10Gbps Fiber Uplink", "Sound-Damped Lounge", "Shure SM7B Microphones"],
    pricePerHour: 250,
    defaultBookingDuration: 8,
    location: { address: "450 Mission St", city: "San Francisco", country: "United States", postalCode: "94105" },
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1606920669741-c8ba74262a94?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1589186161289-9eb8898086df?auto=format&fit=crop&w=1200&q=85",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Executive broadcast director in San Francisco.",
      phone: "+1 (555) 328-9921",
    },
    rating: 4.9,
    reviewCount: 45,
    capacity: 10,
    squareFeet: 1100,
    isAvailable: true,
    featured: true,
    tags: ["Podcast", "Broadcast", "Live Streaming"],
    rules: ["Broadcast switchers operated by authorized crew or resident engineer"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  "demo-8": {
    _id: "demo-8",
    id: "demo-8",
    title: "The Executive Podcast & Broadcast Lounge",
    slug: "the-executive-podcast-broadcast-lounge",
    description: "Panoramic skyline-view broadcast lounge featuring 5x Sony FX6 cinema cameras, sound-damped walnut slat architecture, and 10Gbps fiber uplink.",
    category: "podcast",
    amenities: ["5x Sony FX6 Cameras", "10Gbps Fiber Uplink", "Sound-Damped Lounge", "Shure SM7B Microphones"],
    pricePerHour: 250,
    defaultBookingDuration: 8,
    location: { address: "450 Mission St", city: "San Francisco", country: "United States", postalCode: "94105" },
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1606920669741-c8ba74262a94?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1589186161289-9eb8898086df?auto=format&fit=crop&w=1200&q=85",
    ],
    host: {
      _id: "host-1",
      name: "Imdatul Hoque",
      email: "host@studiospace.com",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      bio: "Executive broadcast director in San Francisco.",
      phone: "+1 (555) 328-9921",
    },
    rating: 4.9,
    reviewCount: 45,
    capacity: 10,
    squareFeet: 1100,
    isAvailable: true,
    featured: true,
    tags: ["Podcast", "Broadcast", "Live Streaming"],
    rules: ["Broadcast switchers operated by authorized crew or resident engineer"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
};

export default function StudioDetailPage() {
  const params = useParams();
  const idOrSlug = String(params.id);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    async function fetchStudio() {
      try {
        const data = await apiRequest<Record<string, unknown>>(`/studios/${idOrSlug}`);
        const rawStudio = (data?.studio as Record<string, unknown>) || data;
        if (rawStudio && (rawStudio._id || rawStudio.title)) {
          setStudio(normalizeStudio(rawStudio));
          setLoading(false);
          return;
        }
      } catch {
        // Fallback to local / demo checks
      }

      // Check localStorage for newly created studios
      try {
        const local = JSON.parse(localStorage.getItem("studiospace_demo_studios") || "[]");
        const found = local.find(
          (s: { _id?: string; id?: string; slug?: string }) =>
            s._id === idOrSlug || s.id === idOrSlug || s.slug === idOrSlug
        );
        if (found) {
          setStudio(normalizeStudio(found));
          setLoading(false);
          return;
        }
      } catch {
        // Ignore localStorage error
      }

      const DEMO_TO_OBJECT_ID: Record<string, string> = {
        "demo-1": "6ae996e6749893a06af61de3",
        "demo-2": "6ae99720749893a06af61dfa",
        "demo-3": "6ae99721749893a06af61dfc",
        "demo-4": "6ae99721749893a06af61dfe",
        "demo-5": "6ae983c20981efdd6935dded",
        "manhattan-creative-photography-studio": "6ae983c20981efdd6935dded",
        "demo-6": "6ae99721749893a06af61e00",
        "demo-7": "6ae99722749893a06af61e02",
        "demo-8": "6ae99722749893a06af61e04",
        "the-industrial-daylight-loft": "6ae996e6749893a06af61de3",
        "aura-sound-dolby-atmos-suite": "6ae99720749893a06af61dfa",
        "apex-virtual-film-led-soundstage": "6ae99721749893a06af61dfc",
        "velvet-frequency-podcast-studio": "6ae99721749893a06af61dfe",
        "obsidian-mastering-recording-house": "6ae99721749893a06af61e00",
        "infinity-virtual-production-arena": "6ae99722749893a06af61e02",
        "the-executive-podcast-broadcast-lounge": "6ae99722749893a06af61e04",
      };

      const fallback =
        fallbackStudiosMap[idOrSlug] ||
        fallbackStudiosMap[DEMO_TO_OBJECT_ID[idOrSlug]] ||
        fallbackStudiosMap["the-industrial-daylight-loft"];

      if (fallback) {
        const resolvedObjectId =
          DEMO_TO_OBJECT_ID[idOrSlug] ||
          DEMO_TO_OBJECT_ID[fallback._id] ||
          fallback._id;
        setStudio(normalizeStudio({ ...fallback, _id: resolvedObjectId, id: resolvedObjectId }));
      }
      setLoading(false);
    }

    fetchStudio();
  }, [idOrSlug]);

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex-1 container mx-auto px-6 py-24 text-center">
          <div className="h-96 rounded-3xl bg-card border border-border animate-pulse mb-8" />
          <div className="h-8 w-64 bg-card rounded-xl animate-pulse mx-auto" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!studio) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex-1 container mx-auto px-6 py-32 text-center space-y-4">
          <h1 className="font-display text-3xl font-bold">Studio Not Found</h1>
          <p className="text-muted-foreground text-sm">The requested studio space is no longer listed or available.</p>
          <Link href="/explore" className="px-5 py-2.5 rounded-xl bg-orange-brand text-white text-xs font-semibold shadow-glow">
            Back to Directory
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-6">
          {/* Breadcrumbs & Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link href="/explore" className="hover:text-foreground">Studios</Link>
              <span>/</span>
              <span className="text-foreground capitalize">{studio.category}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-medium transition-colors"
              >
                {isCopied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
                <span>{isCopied ? "Link Copied!" : "Share"}</span>
              </button>
              <button
                onClick={() => studio && toggleBookmark(studio)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border bg-card hover:bg-secondary text-xs font-medium transition-colors"
                aria-label={studio && isBookmarked(studio._id || studio.id || studio.slug) ? "Remove bookmark" : "Save studio"}
              >
                <Heart
                  className={`h-3.5 w-3.5 transition-colors ${
                    studio && isBookmarked(studio._id || studio.id || studio.slug)
                      ? "fill-orange-brand text-orange-brand"
                      : "text-orange-brand"
                  }`}
                />
                <span>{studio && isBookmarked(studio._id || studio.id || studio.slug) ? "Saved" : "Save"}</span>
              </button>
            </div>
          </div>

          {/* Title Header */}
          <div className="mb-6 space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-forest/20 text-emerald-400 border border-forest/40 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-gold" />
                {studio.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-gold font-bold">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                <span>{studio.rating || 4.9}</span>
                <span className="text-muted-foreground font-normal">({studio.reviewCount || 30} verified reviews)</span>
              </div>
            </div>

            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              {studio.title}
            </h1>

            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-orange-brand shrink-0" />
              <span>{studio.location?.address}, {studio.location?.city}, {studio.location?.country}</span>
            </div>
          </div>

          {/* Photo Gallery Lightbox Component */}
          <div className="mb-12">
            <StudioGallery images={studio.images || []} title={studio.title} />
          </div>

          {/* Content Columns: Details vs Sticky Booking Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Col: Description, Amenities, Specs, Host, Rules */}
            <div className="lg:col-span-2 space-y-10">
              {/* Quick Specs Bar */}
              <div className="grid grid-cols-3 gap-4 p-5 rounded-2xl border border-border bg-card/60 backdrop-blur-sm">
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-orange-brand" />
                    <span>Capacity</span>
                  </div>
                  <div className="text-base font-bold text-foreground">Up to {studio.capacity || 20}</div>
                </div>

                <div className="space-y-1 border-x border-border px-4">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Maximize2 className="h-3.5 w-3.5 text-orange-brand" />
                    <span>Space Size</span>
                  </div>
                  <div className="text-base font-bold text-foreground">{studio.squareFeet || 1800} sq.ft</div>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>Protection</span>
                  </div>
                  <div className="text-base font-bold text-emerald-400">$1M Guarantee</div>
                </div>
              </div>

              {/* About Space */}
              <div className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-foreground">About This Studio</h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed whitespace-pre-line">
                  {studio.description}
                </p>
              </div>

              {/* Amenities */}
              <div className="space-y-4">
                <h2 className="font-display text-2xl font-bold text-foreground">Studio Amenities & Gear</h2>
                <AmenitiesList amenities={studio.amenities || []} />
              </div>

              {/* Host Profile */}
              {studio.host && (
                <div className="p-6 rounded-2xl border border-border bg-card space-y-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-muted overflow-hidden relative border border-border shrink-0">
                      {studio.host.avatar ? (
                        <Image
                          src={studio.host.avatar}
                          alt={studio.host.name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      ) : (
                        <div className="h-full w-full bg-orange-brand/20 text-orange-brand flex items-center justify-center font-bold">
                          {studio.host.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-bold text-foreground">Hosted by {studio.host.name}</h3>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                          Verified Host
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">Response time: within 1 hour</p>
                    </div>
                  </div>
                  {studio.host.bio && (
                    <p className="text-xs text-muted-foreground leading-relaxed border-t border-border pt-3">
                      {studio.host.bio}
                    </p>
                  )}
                </div>
              )}

              {/* House Rules */}
              <div className="space-y-3">
                <h2 className="font-display text-2xl font-bold text-foreground">House Rules & Guidelines</h2>
                <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                  {(studio.rules || [
                    "No smoking inside the premises",
                    "Return all studio equipment to designated storage racks",
                    "Load-in permitted 15 minutes prior to booking window",
                  ]).map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-brand mt-2 shrink-0" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Col: Sticky Booking Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 rounded-3xl border border-border bg-card p-6 shadow-cinematic space-y-6">
                <div className="flex items-baseline justify-between border-b border-border pb-4">
                  <div>
                    <span className="font-display text-3xl font-extrabold font-mono text-orange-brand">
                      {formatCurrency(studio.pricePerHour)}
                    </span>
                    <span className="text-xs text-muted-foreground"> / hour</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-gold font-bold">
                    <Star className="h-3.5 w-3.5 fill-gold text-gold" />
                    <span>{studio.rating || 4.9}</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Default Duration</span>
                    <span className="text-foreground font-semibold">{studio.defaultBookingDuration || 8} Hours</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cleaning Fee</span>
                    <span className="text-emerald-500 font-semibold">Included</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Cancellation Policy</span>
                    <span className="text-foreground font-semibold">Free up to 48h prior</span>
                  </div>
                </div>

                <button
                  onClick={() => setBookingModalOpen(true)}
                  className="w-full py-3.5 px-6 rounded-2xl bg-orange-brand hover:bg-orange-hover text-white font-bold text-sm shadow-glow transition-all hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  <span>Book Workspace Now</span>
                </button>

                <div className="p-3 rounded-xl bg-forest/15 border border-forest/30 text-[11px] text-emerald-300 flex items-start gap-2">
                  <Info className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Your booking is protected by automated double-booking collision prevention.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Booking Modal */}
      {studio && (
        <BookingModal
          studio={studio}
          isOpen={bookingModalOpen}
          onClose={() => setBookingModalOpen(false)}
        />
      )}
    </div>
  );
}
