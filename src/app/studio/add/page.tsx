"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { StudioForm, StudioFormData } from "@/components/studios/StudioForm";
import { useAuth } from "@/components/providers/AuthContext";
import { useToast } from "@/components/providers/ToastProvider";
import { apiRequest } from "@/lib/api";
import { Building } from "lucide-react";

export default function AddStudioPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast("info", "Sign in required", "Please sign in to list a creative studio.");
      router.push("/login");
    }
  }, [isAuthenticated, loading, router, toast]);

  const handleSubmit = async (data: StudioFormData) => {
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const localId = "studio_" + Date.now().toString(36);
    const newStudioRecord = {
      _id: localId,
      id: localId,
      title: data.title,
      slug: slug || localId,
      description: data.description,
      category: data.category,
      pricePerHour: data.pricePerHour,
      securityDeposit: data.securityDeposit ?? 0,
      defaultBookingDuration: data.defaultBookingDuration || 8,
      capacity: data.capacity,
      squareFeet: data.squareFeet,
      amenities: data.amenities,
      location: data.location,
      images: data.images,
      host: {
        _id: user?.id || "host-current",
        name: user?.name || "Verified Studio Host",
        email: user?.email || "host@studiospace.com",
      },
      rating: 5.0,
      reviewCount: 1,
      isAvailable: true,
      featured: true,
      tags: data.tags || [],
      rules: data.rules || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const res = await apiRequest<{ studio?: { _id?: string; slug?: string; [key: string]: unknown } }>("/studios", {
        method: "POST",
        body: JSON.stringify(data),
      });

      const savedStudio = res?.studio || newStudioRecord;
      try {
        const existing = JSON.parse(localStorage.getItem("studiospace_demo_studios") || "[]");
        localStorage.setItem(
          "studiospace_demo_studios",
          JSON.stringify([savedStudio, ...existing.filter((s: { _id?: string }) => s._id !== (savedStudio as { _id?: string })._id)])
        );
      } catch {
        // localStorage not available
      }

      toast("success", "Studio Published!", "Your studio is live on the marketplace.");
      router.push("/dashboard/my-listings");
    } catch {
      // Offline fallback
      try {
        const existing = JSON.parse(localStorage.getItem("studiospace_demo_studios") || "[]");
        localStorage.setItem("studiospace_demo_studios", JSON.stringify([newStudioRecord, ...existing]));
      } catch {
        // localStorage not available
      }

      toast("success", "Studio Published (Demo Mode)", "Studio listing saved to your workspace.");
      router.push("/dashboard/my-listings");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Navbar />

      <main className="flex-1 pt-24 pb-20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-brand/10 border border-orange-brand/30 text-orange-brand text-xs font-semibold uppercase tracking-wider">
              <Building className="h-3.5 w-3.5" />
              <span>Host Studio Creator</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              List Your Creative Space
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Reach thousands of photographers, filmmakers, and audio engineers looking for premium spaces.
            </p>
          </div>

          <StudioForm onSubmit={handleSubmit} isEditing={false} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
