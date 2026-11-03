"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { Studio } from "@/types";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastProvider";
import { apiRequest } from "@/lib/api";

interface BookmarkContextType {
  bookmarks: string[];
  isBookmarked: (idOrSlug: string, altIdOrSlug?: string) => boolean;
  toggleBookmark: (studioOrId: Studio | string) => Promise<boolean>;
  fetchWishlistStudios: () => Promise<Studio[]>;
  loading: boolean;
}

const BookmarkContext = createContext<BookmarkContextType | undefined>(undefined);

export function BookmarkProvider({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // User-specific persistent key
  const storageKey = user?.id
    ? `studiospace_bookmarks_${user.id}`
    : user?.email
    ? `studiospace_bookmarks_${user.email}`
    : "studiospace_bookmarks_guest";

  // Load bookmarks on user change / mount
  useEffect(() => {
    let localBookmarked: string[] = [];
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        localBookmarked = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to read bookmarks from localStorage:", e);
    }

    setBookmarks(localBookmarked);
    setLoading(false);

    // If authenticated, sync with server
    if (isAuthenticated) {
      apiRequest<{ studioIds: string[] }>("/bookmarks")
        .then((res) => {
          if (res?.studioIds && Array.isArray(res.studioIds)) {
            // Merge local and remote
            const combined = Array.from(new Set([...localBookmarked, ...res.studioIds]));
            setBookmarks(combined);
            localStorage.setItem(storageKey, JSON.stringify(combined));
          }
        })
        .catch(() => {
          // Graceful fallback to user-specific localStorage
        });
    }
  }, [user?.id, user?.email, isAuthenticated, storageKey]);

  const isBookmarked = useCallback(
    (idOrSlug: string, altIdOrSlug?: string): boolean => {
      if (!idOrSlug && !altIdOrSlug) return false;
      return (
        (idOrSlug ? bookmarks.includes(idOrSlug) : false) ||
        (altIdOrSlug ? bookmarks.includes(altIdOrSlug) : false)
      );
    },
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    async (studioOrId: Studio | string): Promise<boolean> => {
      if (!isAuthenticated) {
        toast("info", "Sign in required", "Please sign in to save creative studios to your Wishlist.");
        return false;
      }

      const studioId =
        typeof studioOrId === "string"
          ? studioOrId
          : studioOrId._id || studioOrId.id || studioOrId.slug;

      const altId = typeof studioOrId === "object" ? studioOrId.slug : undefined;

      const studioTitle =
        typeof studioOrId === "string" ? "Studio" : studioOrId.title || "Studio";

      const currentlyBookmarked =
        bookmarks.includes(studioId) || (altId ? bookmarks.includes(altId) : false);

      const nextBookmarks = currentlyBookmarked
        ? bookmarks.filter((id) => id !== studioId && id !== altId)
        : [...bookmarks.filter((id) => id !== studioId && id !== altId), studioId];

      // Optimistic update & user-specific localStorage persistence
      setBookmarks(nextBookmarks);
      try {
        localStorage.setItem(storageKey, JSON.stringify(nextBookmarks));
      } catch (err) {
        console.warn("Error saving wishlist to localStorage:", err);
      }

      // Show toast
      if (!currentlyBookmarked) {
        toast("success", "Added to Wishlist", `Saved "${studioTitle}" to your Wishlist.`);
      } else {
        toast("info", "Removed from Wishlist", `Removed "${studioTitle}" from your Wishlist.`);
      }

      // Sync with server (MongoDB / backend)
      try {
        if (!currentlyBookmarked) {
          await apiRequest(`/wishlist/${studioId}`, { method: "POST" });
        } else {
          await apiRequest(`/wishlist/${studioId}`, { method: "DELETE" });
        }
      } catch {
        // Fallback to /bookmarks endpoint
        try {
          if (!currentlyBookmarked) {
            await apiRequest(`/bookmarks/${studioId}`, { method: "POST" });
          } else {
            await apiRequest(`/bookmarks/${studioId}`, { method: "DELETE" });
          }
        } catch {
          // Local persistent state remains intact
        }
      }

      return !currentlyBookmarked;
    },
    [bookmarks, storageKey, isAuthenticated, toast]
  );

  const fetchWishlistStudios = useCallback(async (): Promise<Studio[]> => {
    if (!isAuthenticated) return [];

    try {
      // 1. Fetch from /wishlist or /bookmarks endpoint
      let res: { bookmarks?: Studio[]; studioIds?: string[] } | null = null;
      try {
        res = await apiRequest<{ bookmarks?: Studio[]; studioIds?: string[] }>("/wishlist");
      } catch {
        res = await apiRequest<{ bookmarks?: Studio[]; studioIds?: string[] }>("/bookmarks");
      }

      if (res?.bookmarks && Array.isArray(res.bookmarks) && res.bookmarks.length > 0) {
        return res.bookmarks;
      }

      // 2. If IDs only, resolve from /studios
      const targetIds = res?.studioIds || bookmarks;
      if (targetIds.length > 0) {
        const studiosRes = await apiRequest<{ studios?: Studio[] }>("/studios?limit=50");
        const allStudios = studiosRes?.studios || [];
        const matched = allStudios.filter(
          (s) =>
            targetIds.includes(s._id) ||
            targetIds.includes(s.id || "") ||
            targetIds.includes(s.slug || "")
        );
        return matched;
      }
      return [];
    } catch {
      return [];
    }
  }, [isAuthenticated, bookmarks]);

  return (
    <BookmarkContext.Provider
      value={{
        bookmarks,
        isBookmarked,
        toggleBookmark,
        fetchWishlistStudios,
        loading,
      }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export function useBookmarks() {
  const context = useContext(BookmarkContext);
  if (!context) {
    throw new Error("useBookmarks must be used within a BookmarkProvider");
  }
  return context;
}
