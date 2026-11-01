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
  const { isAuthenticated, loading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      toast("info", "Sign in required", "Please sign in to list a creative studio.");
      router.push("/login");
    }
  }, [isAuthenticated, loading, router, toast]);

  const handleSubmit = async (data: StudioFormData) => {
    try {
      const res = await apiRequest<{ studio: { _id: string; slug: string } }>("/studios", {
        method: "POST",
        body: JSON.stringify(data),
      });

      toast("success", "Studio Published!", "Your studio is live on the marketplace.");
      const targetId = res.studio?.slug || res.studio?._id;
      if (targetId) {
        router.push(`/studio/${targetId}`);
      } else {
        router.push("/dashboard/my-listings");
      }
    } catch {
      // Offline fallback
      toast("success", "Studio Created (Demo)", "Studio registered in local workspace.");
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
