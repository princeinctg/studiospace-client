import { Studio, StudioCategory } from "@/types";

const rawBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" &&
  (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
    ? "http://localhost:5000/api"
    : "https://studiospace-server.onrender.com/api");

const API_BASE_URL = rawBaseUrl.replace(/\/+$/, "");

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("studiospace_token");
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${API_BASE_URL}${cleanEndpoint}`;

  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `Request failed with status ${res.status}`);
  }

  return data as T;
}

export function normalizeStudio(raw: unknown): Studio {
  if (!raw || typeof raw !== "object") return raw as Studio;
  const item = raw as Record<string, unknown>;

  // Determine images
  let images: string[] = [];
  if (Array.isArray(item.images) && item.images.length > 0) {
    images = item.images.filter((img): img is string => typeof img === "string" && img.trim().length > 0);
  }
  if (images.length === 0 && typeof item.imageURL === "string") {
    if (item.imageURL.startsWith("http") && !item.imageURL.includes("youtube.com")) {
      images = [item.imageURL];
    }
  }
  if (images.length === 0) {
    images = [
      "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85",
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1200&q=85",
    ];
  }

  // Determine category
  const rawCat = String(item.category || "photography").toLowerCase();
  let category: StudioCategory = "photography";
  if (rawCat.includes("photo")) category = "photography";
  else if (rawCat.includes("film") || rawCat.includes("video")) category = "film";
  else if (rawCat.includes("record") || rawCat.includes("sound") || rawCat.includes("music")) category = "recording";
  else if (rawCat.includes("podcast")) category = "podcast";
  else if (rawCat.includes("dance")) category = "dance";
  else if (rawCat.includes("art")) category = "art";

  // Determine location
  let location = {
    address: "StudioSpace Central",
    city: "New York",
    country: "United States",
    postalCode: "10001",
  };
  const rawLoc = item.location as Record<string, unknown> | string | undefined;
  if (rawLoc && typeof rawLoc === "object") {
    location = {
      address: String(rawLoc.address || "StudioSpace Central"),
      city: String(rawLoc.city || "New York"),
      country: String(rawLoc.country || "United States"),
      postalCode: String(rawLoc.postalCode || "10001"),
    };
  } else if (typeof rawLoc === "string" && rawLoc.trim().length > 0) {
    location = {
      address: rawLoc,
      city: rawLoc.length > 3 ? rawLoc : "New York",
      country: "United States",
      postalCode: "10001",
    };
  }

  // Determine host
  const rawHost = (item.host as Record<string, unknown>) || {};
  const host = {
    _id: String(rawHost._id || item.hostId || "host-1"),
    name: String(rawHost.name || item.ownerName || "Studio Host"),
    email: String(rawHost.email || item.ownerEmail || "host@studiospace.com"),
    avatar: String(
      rawHost.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"
    ),
    bio: String(rawHost.bio || "Verified StudioSpace Curator"),
    phone: String(rawHost.phone || "+1 (555) 019-2834"),
  };

  const rawPrice = Number(item.pricePerHour ?? item.price ?? item.hourlyRate);
  let pricePerHour = isNaN(rawPrice) || rawPrice <= 0 ? 100 : rawPrice;

  const id = String(item._id || item.id || "studio-id");
  const title = String(item.title || "Untitled Creative Studio");

  let defaultBookingDuration = 8;
  const lowerTitle = title.toLowerCase();
  if (lowerTitle.includes("daylight loft") || lowerTitle.includes("industrial")) {
    pricePerHour = 350;
    defaultBookingDuration = 8;
  } else if (lowerTitle.includes("aura sound") || lowerTitle.includes("dolby atmos")) {
    pricePerHour = 275;
    defaultBookingDuration = 10;
  } else if (lowerTitle.includes("apex virtual") || lowerTitle.includes("led soundstage")) {
    pricePerHour = 650;
    defaultBookingDuration = 12;
  } else if (lowerTitle.includes("velvet frequency") || lowerTitle.includes("podcast")) {
    pricePerHour = 200;
    defaultBookingDuration = 8;
  } else if (typeof item.defaultBookingDuration === "number" && item.defaultBookingDuration > 0) {
    defaultBookingDuration = item.defaultBookingDuration;
  }

  let slug = typeof item.slug === "string" ? item.slug : "";
  if (!slug) {
    slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
    if (!slug) slug = id;
  }

  const rawAmenities = item.amenities;
  const amenities =
    Array.isArray(rawAmenities) && rawAmenities.length > 0
      ? rawAmenities.filter((a): a is string => typeof a === "string" && a.trim().length > 0)
      : ["Natural Daylight", "High-Speed WiFi", "Client Lounge"];

  const rawTags = item.tags;
  const tags =
    Array.isArray(rawTags) && rawTags.length > 0
      ? rawTags.filter((t): t is string => typeof t === "string")
      : ["Daylight", "Editorial"];

  const rawRules = item.rules;
  const rules =
    Array.isArray(rawRules) && rawRules.length > 0
      ? rawRules.filter((r): r is string => typeof r === "string")
      : ["No smoking inside", "Clean up and return equipment after wrap"];

  return {
    _id: id,
    id,
    title,
    slug,
    description: String(
      item.description ||
        item.overview ||
        "Premium creative production space curated for professional photography, film, and creative shoots."
    ),
    category,
    amenities: amenities.length > 0 ? amenities : ["High-Speed WiFi", "Air Conditioning"],
    pricePerHour,
    location,
    images,
    host,
    rating: typeof item.rating === "number" ? item.rating : 4.96,
    reviewCount: typeof item.reviewCount === "number" ? item.reviewCount : 24,
    capacity: Number(item.capacity ?? item.maxCapacity ?? 20),
    squareFeet: Number(item.squareFeet ?? 1800),
    isAvailable: item.isAvailable !== false,
    featured: Boolean(item.featured ?? true),
    defaultBookingDuration,
    tags,
    rules,
    createdAt: String(item.createdAt || new Date().toISOString()),
    updatedAt: String(item.updatedAt || new Date().toISOString()),
  };
}
