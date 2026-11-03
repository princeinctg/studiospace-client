"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StudioCard } from "@/components/studios/StudioCard";
import { StudioFilters } from "@/components/studios/StudioFilters";
import { Studio } from "@/types";
import { apiRequest, normalizeStudio } from "@/lib/api";
import { Search, Sparkles, AlertCircle } from "lucide-react";

const fallbackExploreStudios: Studio[] = [
  {
    _id: "exp-1",
    title: "The Industrial Daylight Loft",
    slug: "the-industrial-daylight-loft",
    description: "Expansive 2,400 sq.ft loft flooded with north-facing natural daylight through 14-foot factory arched windows. Features original exposed brick walls and an infinity cyclorama wall.",
    category: "photography",
    amenities: ["Natural Daylight", "Infinity Cyc Wall", "Profoto Lighting"],
    pricePerHour: 350,
    defaultBookingDuration: 8,
    location: { address: "420 DUMBO Waterfront Ave", city: "Brooklyn", country: "United States" },
    images: [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80",
    ],
    host: { _id: "h1", name: "Imdatul Hoque", email: "host@studiospace.com" },
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
    _id: "exp-2",
    title: "Aura Sound & Dolby Atmos Suite",
    slug: "aura-sound-dolby-atmos-suite",
    description: "State-of-the-art acoustically isolated recording facility with SSL console and Genelec 7.1.4 Dolby Atmos monitoring.",
    category: "recording",
    amenities: ["Dolby Atmos", "SSL Console", "Vocal Booth"],
    pricePerHour: 275,
    defaultBookingDuration: 10,
    location: { address: "880 Sunset Blvd", city: "Los Angeles", country: "United States" },
    images: [
      "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    ],
    host: { _id: "h1", name: "Imdatul Hoque", email: "host@studiospace.com" },
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
    _id: "exp-3",
    title: "Apex Virtual Film & LED Soundstage",
    slug: "apex-virtual-film-led-soundstage",
    description: "Next-gen 5,000 sq.ft cinematic production soundstage with 180-degree curved LED volume wall.",
    category: "film",
    amenities: ["LED Wall", "Soundproofed STC-65"],
    pricePerHour: 650,
    defaultBookingDuration: 12,
    location: { address: "1420 Film Center Dr", city: "Atlanta", country: "United States" },
    images: [
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=800&q=80",
    ],
    host: { _id: "h1", name: "Imdatul Hoque", email: "host@studiospace.com" },
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
    _id: "exp-4",
    title: "Velvet Frequency Broadcast Podcast Studio",
    slug: "velvet-frequency-podcast-studio",
    description: "Boutique 4-camera 4K podcast lounge designed for visual dialogue. Shure SM7B dynamic mics.",
    category: "podcast",
    amenities: ["4K Multi-Cam", "Shure SM7B", "Soundproofed"],
    pricePerHour: 200,
    defaultBookingDuration: 8,
    location: { address: "310 West Loop South", city: "Chicago", country: "United States" },
    images: [
      "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=800&q=80",
    ],
    host: { _id: "h1", name: "Imdatul Hoque", email: "host@studiospace.com" },
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
    location: { address: "Manhattan", city: "Manhattan", country: "United States" },
    images: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    ],
    host: { _id: "h1", name: "Imdatul Hoque", email: "host@studiospace.com" },
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
    _id: "exp-new-2",
    title: "Obsidian Mastering & Recording House",
    slug: "obsidian-mastering-recording-house",
    description: "Northward-designed custom-floated mastering and tracking suite equipped with ATC SCM110ASL monitoring and Shadow Hills mastering compressor.",
    category: "recording",
    amenities: ["ATC SCM110 Monitoring", "Analog Mastering Rack", "Shadow Hills Compressor", "Custom Acoustic Float"],
    pricePerHour: 380,
    defaultBookingDuration: 8,
    location: { address: "2200 NW 2nd Ave", city: "Miami", country: "United States" },
    images: [
      "https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1520523839898-5071282543e2?auto=format&fit=crop&w=800&q=80",
    ],
    host: { _id: "h1", name: "Imdatul Hoque", email: "host@studiospace.com" },
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
    _id: "exp-new-3",
    title: "Infinity Virtual Production Arena",
    slug: "infinity-virtual-production-arena",
    description: "Monumental 6,500 sq.ft stage with 270-degree LED volume wall driven by Unreal Engine 5 nDisplay and drive-in semi loading access.",
    category: "film",
    amenities: ["270-deg LED Volume", "Unreal Engine 5 nDisplay", "OptiTrack Mocap", "Drive-in Loading Bay"],
    pricePerHour: 850,
    defaultBookingDuration: 12,
    location: { address: "3700 S Las Vegas Blvd", city: "Las Vegas", country: "United States" },
    images: [
      "https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=800&q=80",
    ],
    host: { _id: "h1", name: "Imdatul Hoque", email: "host@studiospace.com" },
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
    _id: "exp-new-4",
    title: "The Executive Podcast & Broadcast Lounge",
    slug: "the-executive-podcast-broadcast-lounge",
    description: "Panoramic skyline-view broadcast lounge featuring 5x Sony FX6 cinema cameras, sound-damped walnut slat architecture, and 10Gbps fiber uplink.",
    category: "podcast",
    amenities: ["5x Sony FX6 Cameras", "10Gbps Fiber Uplink", "Sound-Damped Lounge", "Shure SM7B Microphones"],
    pricePerHour: 250,
    defaultBookingDuration: 8,
    location: { address: "450 Mission St", city: "San Francisco", country: "United States" },
    images: [
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1606920669741-c8ba74262a94?auto=format&fit=crop&w=800&q=80",
    ],
    host: { _id: "h1", name: "Imdatul Hoque", email: "host@studiospace.com" },
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
  {
    _id: "exp-5",
    title: "Prism Movement & Dance Hall",
    slug: "prism-movement-dance-hall",
    description: "Sunlit 3,000 sq.ft professional movement and rehearsal hall featuring sprung Harlequin maple dance flooring.",
    category: "dance",
    amenities: ["Sprung Floor", "Wall Mirrors", "Sound System"],
    pricePerHour: 85,
    location: { address: "185 S 2nd St", city: "San Francisco", country: "United States" },
    images: [
      "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1518834107812-67b0b7c58434?auto=format&fit=crop&w=800&q=80",
    ],
    host: { _id: "h1", name: "Imdatul Hoque", email: "host@studiospace.com" },
    rating: 4.89,
    reviewCount: 29,
    capacity: 35,
    squareFeet: 3000,
    isAvailable: true,
    featured: false,
    tags: ["Dance", "Choreography"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: "exp-6",
    title: "Atelier Raw Concrete & Ceramic Arts",
    slug: "atelier-raw-concrete-art-studio",
    description: "Bright artistic workshop with northern skylights, industrial washbasins, ceramic pottery wheels, and easels.",
    category: "art",
    amenities: ["Skylights", "Pottery Wheels", "Slop Sinks"],
    pricePerHour: 75,
    location: { address: "2100 Wynwood Arts Blvd", city: "Miami", country: "United States" },
    images: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80",
    ],
    host: { _id: "h1", name: "Imdatul Hoque", email: "host@studiospace.com" },
    rating: 4.87,
    reviewCount: 19,
    capacity: 20,
    squareFeet: 1500,
    isAvailable: true,
    featured: false,
    tags: ["Art", "Workshop"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function ExploreContent() {
  const searchParams = useSearchParams();

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "all",
    city: searchParams.get("city") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "500",
    sort: searchParams.get("sort") || "newest",
  });

  const [searchKeyword, setSearchKeyword] = useState(searchParams.get("search") || "");
  const [studios, setStudios] = useState<Studio[]>(fallbackExploreStudios);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchStudios() {
      setLoading(true);
      try {
        const queryParams = new URLSearchParams();
        if (searchKeyword.trim()) queryParams.set("search", searchKeyword.trim());
        if (filters.category && filters.category !== "all") queryParams.set("category", filters.category);
        if (filters.city) queryParams.set("city", filters.city);
        if (filters.minPrice) queryParams.set("minPrice", filters.minPrice);
        if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice);
        if (filters.sort) queryParams.set("sort", filters.sort);

        let list: Studio[] = [];
        const data = await apiRequest<Record<string, unknown> | unknown[]>(`/studios?${queryParams.toString()}`);
        const rawList = Array.isArray(data) ? data : (data as { studios?: unknown[] })?.studios;
        if (Array.isArray(rawList)) {
          list = rawList.map(normalizeStudio);
        }

        try {
          const local = JSON.parse(localStorage.getItem("studiospace_demo_studios") || "[]");
          if (Array.isArray(local) && local.length > 0) {
            let localStudios: Studio[] = local.map(normalizeStudio);
            if (filters.category && filters.category !== "all") {
              localStudios = localStudios.filter((s) => s.category === filters.category);
            }
            if (filters.city) {
              localStudios = localStudios.filter((s) => s.location?.city?.toLowerCase() === filters.city.toLowerCase());
            }
            if (searchKeyword.trim()) {
              const q = searchKeyword.toLowerCase();
              localStudios = localStudios.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
            }
            const existingIds = new Set(list.map((s) => s._id));
            const toAdd = localStudios.filter((s) => !existingIds.has(s._id));
            list = [...toAdd, ...list];
          }
        } catch {
          // Ignore localStorage error
        }

        // Filter out any legacy uutr entry
        list = list.filter((s) => s.title !== "uutr" && s.slug !== "uutr-pp7b");

        // Guarantee all default studios are available when browsing directory
        if (!searchKeyword.trim() && filters.category === "all" && !filters.city) {
          const existingSlugsAndIds = new Set([
            ...list.map((s) => s.slug),
            ...list.map((s) => s._id),
            ...list.map((s) => s.id),
          ]);
          const missingDefaults = fallbackExploreStudios.filter(
            (f) => !existingSlugsAndIds.has(f.slug) && !existingSlugsAndIds.has(f._id)
          );
          list = [...list, ...missingDefaults];
        }

        setStudios(list);
      } catch {
        // Filter fallback dataset locally if backend server is not yet attached
        let filtered = [...fallbackExploreStudios];
        if (filters.category !== "all") {
          filtered = filtered.filter((s) => s.category === filters.category);
        }
        if (filters.city) {
          filtered = filtered.filter((s) => s.location?.city?.toLowerCase() === filters.city.toLowerCase());
        }
        if (filters.maxPrice) {
          filtered = filtered.filter((s) => s.pricePerHour <= Number(filters.maxPrice));
        }
        if (searchKeyword.trim()) {
          const q = searchKeyword.toLowerCase();
          filtered = filtered.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
        }

        try {
          const local = JSON.parse(localStorage.getItem("studiospace_demo_studios") || "[]");
          if (Array.isArray(local) && local.length > 0) {
            let localStudios: Studio[] = local.map(normalizeStudio);
            if (filters.category && filters.category !== "all") {
              localStudios = localStudios.filter((s) => s.category === filters.category);
            }
            if (filters.city) {
              localStudios = localStudios.filter((s) => s.location?.city?.toLowerCase() === filters.city.toLowerCase());
            }
            if (searchKeyword.trim()) {
              const q = searchKeyword.toLowerCase();
              localStudios = localStudios.filter((s) => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
            }
            const existingIds = new Set(filtered.map((s) => s._id));
            const toAdd = localStudios.filter((s) => !existingIds.has(s._id));
            filtered = [...toAdd, ...filtered];
          }
        } catch {
          // Ignore localStorage error
        }

        setStudios(filtered);
      } finally {
        setLoading(false);
      }
    }

    fetchStudios();
  }, [filters, searchKeyword]);

  const handleFilterChange = (updated: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...updated }));
  };

  const handleReset = () => {
    setFilters({
      category: "all",
      city: "",
      minPrice: "",
      maxPrice: "500",
      sort: "newest",
    });
    setSearchKeyword("");
  };

  return (
    <div className="container mx-auto px-6 py-12">
      {/* Top Title & Search bar */}
      <div className="mb-10 space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-brand/10 border border-orange-brand/30 text-orange-brand text-xs font-semibold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Marketplace Directory</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
          Explore Production Studios
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl leading-relaxed">
          Book verified photo daylight lofts, soundproofed recording studios, and virtual production stages across the creative capitals.
        </p>

        {/* Search input */}
        <div className="max-w-xl pt-2">
          <div className="relative flex items-center">
            <Search className="absolute left-4 h-4 w-4 text-orange-brand" />
            <input
              type="text"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search by keywords, lighting, address..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-orange-brand shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* Main Layout: Filters Sidebar + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <StudioFilters
              filters={filters}
              onChange={handleFilterChange}
              onReset={handleReset}
              totalResults={studios.length}
            />
          </div>
        </div>

        {/* Results Grid */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 rounded-2xl bg-card border border-border animate-pulse" />
              ))}
            </div>
          ) : studios.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border p-12 text-center space-y-4 bg-card/40">
              <AlertCircle className="h-10 w-10 text-muted-foreground mx-auto" />
              <h3 className="font-display text-xl font-bold text-foreground">
                No Studios Match Your Search
              </h3>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Try widening your price range, clearing specific filters, or searching for broader terms like &quot;photo&quot;, &quot;recording&quot;, or &quot;Brooklyn&quot;.
              </p>
              <button
                onClick={handleReset}
                className="px-4 py-2 rounded-xl bg-orange-brand text-white text-xs font-semibold shadow-glow"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {studios.map((studio, idx) => (
                <StudioCard key={studio._id || idx} studio={studio} priority={idx < 3} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExplorePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />
      <main className="flex-1 pt-20">
        <Suspense fallback={<div className="container mx-auto px-6 py-24 text-center">Loading studio catalog...</div>}>
          <ExploreContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
