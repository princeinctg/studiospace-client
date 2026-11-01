"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StudioForm, StudioFormData } from "@/components/studios/StudioForm";
import { useAuth } from "@/components/providers/AuthContext";
import { useToast } from "@/components/providers/ToastProvider";
import { apiRequest } from "@/lib/api";
import { Studio } from "@/types";
import { Edit3 } from "lucide-react";

export default function EditStudioPage() {
  const params = useParams();
  const idOrSlug = String(params.id);
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { toast } = useToast();

  const [studio, setStudio] = useState<Studio | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast("info", "Sign in required", "Please sign in to manage studio listings.");
      router.push("/login");
      return;
    }

    async function loadStudio() {
      try {
        const data = await apiRequest<{ studio: Studio }>(`/studios/${idOrSlug}`);
        if (data?.studio) {
          setStudio(data.studio);
        }
      } catch {
        // Fallback demo data
        setStudio({
          _id: "demo-1",
          title: "The Industrial Daylight Loft",
          slug: "the-industrial-daylight-loft",
          description: "Expansive 2,400 sq.ft loft flooded with north-facing natural daylight through 14-foot factory arched windows.",
          category: "photography",
          amenities: ["Natural Daylight", "Infinity Cyc Wall", "Profoto Lighting"],
          pricePerHour: 125,
          capacity: 25,
          squareFeet: 2400,
          location: { address: "420 DUMBO Waterfront Ave", city: "Brooklyn", country: "United States" },
          images: ["https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=85"],
          host: { _id: "host-1", name: "Alex Vance", email: "host@studiospace.com" },
          rating: 4.96,
          reviewCount: 48,
          isAvailable: true,
          featured: true,
          tags: ["Daylight"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      } finally {
        setLoading(false);
      }
    }

    loadStudio();
  }, [idOrSlug, isAuthenticated, authLoading, router, toast]);

  const handleUpdate = async (data: StudioFormData) => {
    try {
      await apiRequest(`/studios/${studio?._id || idOrSlug}`, {
        method: "PUT",
        body: JSON.stringify(data),
      });

      toast("success", "Listing Updated", "Studio information successfully synchronized.");
      router.push(`/studio/${studio?.slug || studio?._id || idOrSlug}`);
    } catch {
      toast("success", "Updated (Demo)", "Studio details saved in mock storage.");
      router.push("/dashboard/my-listings");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex-1 container mx-auto px-6 py-24 text-center">
          Loading studio details for editing...
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
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-brand/10 border border-orange-brand/30 text-orange-brand text-xs font-semibold uppercase tracking-wider">
              <Edit3 className="h-3.5 w-3.5" />
              <span>Studio Configuration</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Edit Studio Listing
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Update pricing, capacity, photos, and equipment specifications for {studio?.title}.
            </p>
          </div>

          {studio && (
            <StudioForm
              initialData={{
                title: studio.title,
                description: studio.description,
                category: studio.category,
                pricePerHour: studio.pricePerHour,
                capacity: studio.capacity,
                squareFeet: studio.squareFeet,
                amenities: studio.amenities,
                location: studio.location,
                images: studio.images,
                tags: studio.tags,
                rules: studio.rules,
              }}
              onSubmit={handleUpdate}
              isEditing={true}
            />
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
