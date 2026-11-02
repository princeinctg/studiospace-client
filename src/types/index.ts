export type UserRole = "guest" | "host" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  bio?: string;
  createdAt?: string;
}

export type StudioCategory =
  | "photography"
  | "film"
  | "recording"
  | "podcast"
  | "dance"
  | "art";

export interface StudioLocation {
  address: string;
  city: string;
  country: string;
  postalCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Studio {
  _id: string;
  id?: string;
  title: string;
  slug: string;
  description: string;
  category: StudioCategory;
  amenities: string[];
  pricePerHour: number;
  location: StudioLocation;
  images: string[];
  host: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    bio?: string;
    phone?: string;
  };
  rating: number;
  reviewCount: number;
  capacity: number;
  squareFeet: number;
  isAvailable: boolean;
  featured: boolean;
  defaultBookingDuration?: number;
  tags: string[];
  rules?: string[];
  createdAt: string;
  updatedAt: string;
}

export type BookingStatus = "pending" | "confirmed" | "cancelled" | "completed";
export type PaymentStatus = "unpaid" | "paid" | "refunded";

export interface Booking {
  _id: string;
  guest: User | string;
  studio: Studio;
  date: string;
  startTime: string;
  endTime: string;
  durationHours: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  guestCount: number;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}
